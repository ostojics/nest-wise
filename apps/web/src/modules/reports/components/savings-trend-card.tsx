import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {SavingsTrendPointContract} from '@nest-wise/contracts';
import {IconPigMoney} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell, ResponsiveContainer} from 'recharts';
import {useGetSavingsTrend} from '../hooks/use-get-savings-trend';
import SavingsTrendCardError from './savings-trend-card.error';
import SavingsTrendCardSkeleton from './savings-trend-card.skeleton';

const chartConfig = {
  amount: {
    label: 'Štednja',
    color: 'hsl(142, 76%, 36%)',
  },
} satisfies ChartConfig;

const SavingsTrendCard = () => {
  const {formatBalance} = useFormatBalance();
  const {data, isLoading, isError, refetch} = useGetSavingsTrend();

  const chartData = useMemo(() => {
    return (
      data?.map((dataPoint) => ({
        ...dataPoint,
        displayAmount: dataPoint.hasData ? dataPoint.amount : 0,
        fill: dataPoint.hasData ? 'var(--color-amount)' : 'var(--color-no-data)',
      })) ?? []
    );
  }, [data]);

  if (isLoading) {
    return <SavingsTrendCardSkeleton />;
  }

  if (isError) {
    return <SavingsTrendCardError onRetry={refetch} />;
  }

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col @xl/main:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardDescription className="flex items-center gap-2">
          <IconPigMoney className="h-4 w-4" />
          Money Saved Trend
        </CardDescription>
        <CardTitle className="text-lg font-semibold">Poslednjih 12 meseci</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full overflow-x-auto pb-2">
          <ChartContainer
            config={{
              ...chartConfig,
              'no-data': {
                label: 'No Data',
                color: 'hsl(var(--muted))',
              },
            }}
            className="mx-auto aspect-[2/1] max-h-[18.75rem] w-full min-w-[48rem]"
          >
            <ResponsiveContainer>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 40,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
              >
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
                      formatter={(value, name, props) => {
                        const payload = props.payload as SavingsTrendPointContract & {displayAmount: number};
                        if (!payload.hasData) {
                          return (
                            <div className="flex w-full justify-between items-center gap-4">
                              <span>Štednja</span>
                              <div className="text-right">
                                <div className="text-muted-foreground">Nema podataka</div>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="flex w-full justify-between items-center gap-4">
                            <span>Štednja</span>
                            <div className="text-right">
                              <div className="font-mono font-medium tabular-nums">
                                {formatBalance(payload.amount ?? 0)}
                              </div>
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hasData ? 'var(--color-amount)' : 'hsl(var(--muted))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4" />
    </Card>
  );
};

export default SavingsTrendCard;
