import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {IconChartPie} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import {Cell, Pie, PieChart} from 'recharts';
import {generateRandomHsl} from '@/lib/utils';
import {useGetSpendingByAccount} from '../../reports/hooks/use-get-spending-by-account';
import CategoryAmountLegend from './category-amount-legend';
import SpendingByAccountCardSkeleton from './spending-by-account-card.skeleton';
import SpendingByAccountCardError from './spending-by-account-card.error';

interface AccountChartDataEntry {
  category: string;
  amount: number;
  fill: string;
  percentage: string;
  totalValue: number;
  value: number;
}

const renderCustomizedLabel = (entry: AccountChartDataEntry) => {
  const percent = ((entry.value / entry.totalValue) * 100).toFixed(1);
  return `${percent}%`;
};

const SpendingByAccountCard = () => {
  const {formatBalance} = useFormatBalance();
  const {data, isLoading, isError, refetch} = useGetSpendingByAccount();

  const spendingData = useMemo(() => {
    const items = data ?? [];
    return items.map((item) => ({
      category: item.name,
      amount: item.amount,
      fill: generateRandomHsl(),
    }));
  }, [data]);

  const totalSpending = useMemo(() => {
    return spendingData.reduce((total, item) => total + item.amount, 0);
  }, [spendingData]);

  const dataWithPercentages = useMemo(() => {
    return spendingData.map((item) => ({
      ...item,
      percentage: totalSpending === 0 ? '0' : ((item.amount / totalSpending) * 100).toFixed(1),
      totalValue: totalSpending,
      value: item.amount,
    }));
  }, [spendingData, totalSpending]);

  const isEmpty = (data ?? []).every((i) => i.amount === 0);

  if (isLoading) return <SpendingByAccountCardSkeleton />;
  if (isError) return <SpendingByAccountCardError onRetry={refetch} />;

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col">
      <CardHeader className="flex flex-col gap-4 justify-start @2xl/card:flex-row @2xl/card:items-center">
        <CardDescription className="flex items-center gap-2 flex-2">
          <IconChartPie className="h-4 w-4" />
          Troškovi po računu
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isEmpty ? (
          <div className="text-sm text-muted-foreground text-center py-16">Nema troškova u izabranom periodu.</div>
        ) : (
          <ChartContainer
            config={{}}
            className="mx-auto aspect-square max-h-[28rem] @2xs/card:max-h-[34.375rem] overflow-visible"
          >
            <PieChart margin={{top: 30, right: 20, bottom: 20, left: 20}}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, props) => {
                      const payload = props.payload as AccountChartDataEntry | undefined;
                      const percentage = payload?.percentage ?? '0';
                      return (
                        <div className="flex w-full justify-between items-center gap-4">
                          <span>{name}</span>
                          <div className="text-right">
                            <div className="font-mono font-medium tabular-nums">{formatBalance(value as number)}</div>
                            <div className="text-sm text-muted-foreground">{percentage}%</div>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={dataWithPercentages}
                dataKey="amount"
                nameKey="category"
                strokeWidth={2}
                className="outline-hidden"
                label={renderCustomizedLabel}
                labelLine={false}
                outerRadius="85%"
              >
                {dataWithPercentages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<CategoryAmountLegend />} />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="text-muted-foreground leading-none text-center">
          Ukupni troškovi: {formatBalance(totalSpending)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpendingByAccountCard;
