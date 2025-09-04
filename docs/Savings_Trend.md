## Household Savings Trend API

### Overview

Returns household savings data for the last 12 calendar months, following the same pattern as the Net Worth Trend API. The household is inferred from the authenticated user.

- Base URL: `v1`
- Module: `savings`
- Content-Type: `application/json`

### Endpoint

- Method: `GET`
- Path: `/v1/savings/trend`
- Auth: `Bearer` token (JWT)

### Description

Returns an array of monthly savings points covering the last 12 months (including the current month), ordered chronologically from oldest to newest. Each point represents the recorded savings amount for that month for the user’s household. If no savings entry exists for a given month, `amount` is `null` and `hasData` is `false`.

### Request

- Query Parameters: none

### Response: 200 OK

Array of `SavingsTrendPoint` objects.

SavingsTrendPoint

- `month` (string): Full month name (e.g., "January").
- `monthShort` (string): Short month name (e.g., "Jan").
- `amount` (number | null): Saved amount for the month, or `null` if no data.
- `hasData` (boolean): Indicates whether the month has a recorded savings entry.

Example

```json
[
  {
    "month": "October",
    "monthShort": "Oct",
    "amount": 500.0,
    "hasData": true
  },
  {
    "month": "November",
    "monthShort": "Nov",
    "amount": null,
    "hasData": false
  },
  {
    "month": "December",
    "monthShort": "Dec",
    "amount": 750.0,
    "hasData": true
  }
]
```

### Errors

- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Authenticated but not permitted (if applicable per guard policies)
- 500 Internal Server Error: Unexpected error

### Notes

- Household is determined by the current authenticated user’s `householdId`; no household identifier is accepted via query.
- The 12-month window is computed relative to the current date and includes the current month.
- Ordering is ascending by month (oldest first).
- Months with no DB record in the range MUST still be included; set `amount` to `null` and `hasData` to `false` for those months (no zero-fill or imputation).

### UI Specification

#### Overview

- **Goal**: Display the savings trend for the last 12 months in a card with a bar chart.
- **Inspiration**: Mirror the UX and visual style of `NetWorthTrendCard` (`apps/web/src/modules/reports/components/net-worth-trend-card.tsx`).
- **Component name**: `SavingsTrendCard` (suggested location: `apps/web/src/modules/reports/components/savings-trend-card.tsx`).

#### Data and API

- **Endpoint**: `GET /v1/savings/trend` (Bearer auth)
- **Response**: `SavingsTrendPoint[]` where each item:
  - `month` (string) – full month name
  - `monthShort` (string) – short month label (e.g., "Jan")
  - `amount` (number | null)
  - `hasData` (boolean)
- **Hook**: Create `useGetSavingsTrendData` analogous to `useGetNetWorthTrendData` to fetch and cache the series.

#### Component structure

- **Card**: Use `Card`, `CardHeader`, `CardContent`, `CardFooter` from the existing UI kit.
- **Header**:
  - `CardDescription`: e.g., icon + label "Savings Trend"
  - `CardTitle`: "Last 12 Months"
- **Content**: `BarChart` inside `ChartContainer` (same primitives as net worth card) with these rules:
  - Map API response to `chartData` where:
    - `displayAmount = hasData ? amount : 0` (0 used only for chart rendering)
    - `fill = hasData ? var(--color-amount) : hsl(var(--muted))`
  - X-axis uses `monthShort`.
  - Tooltip:
    - If `!hasData`: show "No data available"
    - Else: show formatted amount and full `month`
  - Labels above bars:
    - If value is `0` (no data): label "No Data"
    - Else: show numeric value (optionally formatted)
- **Footer** (optional): A small trend summary vs. previous data point (like net worth) may be added later.

#### Visual and behavior details

- **Colors**:
  - Data bars: `var(--color-amount)` via chart config key `amount`.
  - No data bars: `hsl(var(--muted))`.
- **Responsive**:
  - Wrap chart inside `ChartContainer` with classes similar to net worth card, e.g., `aspect-[2/1] max-h-[18.75rem] w-full`.
  - Use container queries utility classes (`@container/card`) for consistent sizing in grids.
- **Accessibility**:
  - Enable `accessibilityLayer` on `BarChart`.
  - Provide clear tooltip content for screen readers; "No data available" when `!hasData`.

#### Loading and error states

- **Skeleton**: `SavingsTrendCardSkeleton` similar to `NetWorthTrendCardSkeleton`.
- **Error**: `SavingsTrendCardError` with retry button wired to the hook’s `refetch`.

#### Example (reference-only)

```tsx
// SavingsTrendCard (reference implementation sketch)
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell} from 'recharts';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {SavingsTrendPointContract} from '@maya-vault/contracts';

export function SavingsTrendCard() {
  const {formatBalance} = useFormatBalance();
  const {data, isLoading, isError, refetch} = useGetSavingsTrendData();

  const chartData = (data ?? []).map((p) => ({
    ...p,
    displayAmount: p.hasData ? p.amount : 0,
  }));

  if (isLoading) return <SavingsTrendCardSkeleton />;
  if (isError) return <SavingsTrendCardError onRetry={refetch} />;

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col @xl/main:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardDescription>Savings Trend</CardDescription>
        <CardTitle className="text-lg font-semibold">Last 12 Months</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            amount: {label: 'Savings', color: 'hsl(142, 76%, 36%)'},
            'no-data': {label: 'No Data', color: 'hsl(var(--muted))'},
          }}
          className="mx-auto aspect-[2/1] max-h-[300px] w-full"
        >
          <BarChart accessibilityLayer data={chartData} margin={{top: 40, right: 20, left: 20, bottom: 20}}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="monthShort"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, props) => {
                    const payload = props.payload as SavingsTrendPointContract & {displayAmount: number};
                    if (!payload.hasData) {
                      return (
                        <div className="flex w-full justify-between items-center gap-4">
                          <span>Savings</span>
                          <div className="text-right">
                            <div className="text-muted-foreground">No data available</div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="flex w-full justify-between items-center gap-4">
                        <span>Savings</span>
                        <div className="text-right">
                          <div className="font-mono font-medium tabular-nums">{formatBalance(payload.amount ?? 0)}</div>
                          <div className="text-sm text-muted-foreground">{payload.month}</div>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="displayAmount" radius={[4, 4, 0, 0]} className="outline-hidden">
              <LabelList
                position="top"
                offset={8}
                className="fill-foreground text-xs"
                fontSize={10}
                formatter={(v: number) => (v === 0 ? 'No Data' : v)}
              />
              {chartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.hasData ? 'var(--color-amount)' : 'hsl(var(--muted))'} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4" />
    </Card>
  );
}
```

#### Testing checklist

- **Auth**: JWT required; verify 401 behavior.
- **Empty months**: Months with `hasData=false` render muted bar with label "No Data" and tooltip shows "No data available".
- **Responsive**: Chart remains legible at narrow widths; labels not overlapping.
- **A11y**: Tooltip content meaningful, axis legible, color contrast meets WCAG.
