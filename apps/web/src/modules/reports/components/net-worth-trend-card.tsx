import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {cn} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {NetWorthTrendPointContract} from '@nest-wise/contracts';
import {IconTrendingUp} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell} from 'recharts';
import {useGetNetWorthTrendData} from '../../plan/hooks/use-get-net-worth-trend-data';
import NetWorthTrendCardError from './net-worth-trend-card.error';
import NetWorthTrendCardSkeleton from './net-worth-trend-card.skeleton';
import {englishToSerbianMonthMap} from '@/common/constants/month-map';

const chartConfig = {
  amount: {
    label: 'Neto vrednost',
    color: 'hsl(142, 76%, 36%)',
  },
} satisfies ChartConfig;

const NetWorthTrendCard = () => {
  const {formatBalance} = useFormatBalance();
  const {data, isLoading, isError, refetch} = useGetNetWorthTrendData();

  const chartData = useMemo(() => {
    return (
      data?.map((dataPoint) => ({
        ...dataPoint,
        displayAmount: dataPoint.hasData ? dataPoint.amount : 0, // Use 0 for chart rendering
        fill: dataPoint.hasData ? 'var(--color-amount)' : 'var(--color-no-data)',
        monthShort: englishToSerbianMonthMap[dataPoint.monthShort],
      })) ?? []
    );
  }, [data]);

  const growth = useMemo(() => {
    const dataWithValues = data?.filter((point) => point.hasData && point.amount !== null) ?? [];
    if (dataWithValues.length < 2) return null;

    const latest = dataWithValues[dataWithValues.length - 1];
    const previous = dataWithValues[dataWithValues.length - 2];

    if (!latest || !previous || !latest.amount || !previous.amount) return null;

    const change = latest.amount - previous.amount;
    const percentage = (change / previous.amount) * 100;

    return {
      amount: change,
      percentage: percentage,
      isPositive: change >= 0,
    };
  }, [data]);

  const customLabelFormatter = (value: number, _name?: string) => {
    if (value === 0) {
      return 'Nema podataka';
    }

    return value;
  };

  if (isLoading) {
    return <NetWorthTrendCardSkeleton />;
  }

  if (isError) {
    return <NetWorthTrendCardError onRetry={refetch} />;
  }

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col @xl/main:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardDescription className="flex items-center gap-2">
          <IconTrendingUp className="h-4 w-4" />
          Trend ukupnog kapitala
        </CardDescription>
        <CardTitle className="text-lg font-semibold">Poslednjih 12 meseci</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full overflow-x-auto pb-2">
          <ChartContainer
            config={{
              ...chartConfig,
              'no-data': {
                label: 'Nema podataka',
                color: 'hsl(var(--muted))',
              },
            }}
            className="mx-auto aspect-[2/1] max-h-[18.75rem] w-full min-w-[48rem]"
          >
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
                      const payload = props.payload as NetWorthTrendPointContract & {displayAmount: number};
                      if (!payload.hasData) {
                        return (
                          <div className="flex w-full justify-between items-center gap-4">
                            <span>Ukupan kapital</span>
                            <div className="text-right">
                              <div className="text-muted-foreground">Nema podataka</div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="flex w-full justify-between items-center gap-4">
                          <span>Ukupan kapital</span>
                          <div className="text-right">
                            <div className="font-mono font-medium tabular-nums">
                              {formatBalance(payload.amount ?? 0)}
                            </div>
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
                  formatter={customLabelFormatter}
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hasData ? 'var(--color-amount)' : 'hsl(var(--muted))'} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        {growth && (
          <div
            className={cn(
              'flex flex-col md:flex-row gap-2 leading-none text-sm font-medium items-center',
              growth.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            )}
          >
            <IconTrendingUp className={cn('h-4 w-4', growth.isPositive ? 'rotate-0' : 'rotate-180')} />
            {growth.isPositive ? 'Porast' : 'Pad'} za {formatBalance(Math.abs(growth.amount))} (
            {Math.abs(growth.percentage).toFixed(1)}%) u odnosu na prethodnu tačku
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NetWorthTrendCard;
