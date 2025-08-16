import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';
import {IconChartPie} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import {Cell, Pie, PieChart} from 'recharts';
import {ChartDataEntry} from '../interfaces/chart-data-entry';
import CategoryAmountLegend from './category-amount-legend';
import DateFromPicker from './selects/date-from';
import DateToPicker from './selects/date-to';
import {generateRandomHsl} from '@/lib/utils';
import {SpendingCategoryData} from '../interfaces/spending-category-data';
import {useSearch} from '@tanstack/react-router';
import {useGetMe} from '@/modules/auth/hooks/useGetMe';
import {useGetTransactions} from '@/modules/transactions/hooks/useGetTransactions';
import SpendingByCategoryCardSkeleton from './spending-by-category-card.skeleton';
import SpendingByCategoryCardError from './spending-by-category-card.error';

const renderCustomizedLabel = (entry: ChartDataEntry) => {
  const percent = ((entry.value / entry.totalValue) * 100).toFixed(1);
  return `${percent}%`;
};

const SpendingByCategoryCard: React.FC = () => {
  const {formatBalance} = useFormatBalance();
  const search = useSearch({from: '/__pathlessLayout/dashboard'});
  const {data: me} = useGetMe();
  const {data, isLoading, isError, refetch} = useGetTransactions({
    search: {
      transactionDate_from: search.transactionDate_from,
      transactionDate_to: search.transactionDate_to,
      householdId: me?.householdId,
      page: 1,
      pageSize: 2000,
      type: 'expense',
    },
  });

  const spendingData = useMemo(() => {
    if (!data) return [];

    const totalsByCategory = data.data.reduce<Record<string, number>>((acc, {category, amount}) => {
      const key = category?.name ?? 'Other';
      acc[key] = (acc[key] ?? 0) + Number(amount);
      return acc;
    }, {});

    return Object.entries(totalsByCategory).map(
      ([category, amount]) =>
        ({
          category,
          amount,
          fill: generateRandomHsl(),
        }) satisfies SpendingCategoryData,
    );
  }, [data]);

  const totalSpending = useMemo(() => {
    return spendingData.reduce((total, item) => total + item.amount, 0);
  }, [spendingData]);

  const dataWithPercentages = useMemo(() => {
    return spendingData.map((item) => ({
      ...item,
      percentage: ((item.amount / totalSpending) * 100).toFixed(1),
      totalValue: totalSpending,
      value: item.amount,
    }));
  }, [spendingData, totalSpending]);

  if (isLoading) {
    return <SpendingByCategoryCardSkeleton />;
  }

  if (isError) {
    return <SpendingByCategoryCardError onRetry={refetch} />;
  }

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col">
      <CardHeader className="flex justify-between items-center">
        <CardDescription className="flex items-center gap-2 flex-2">
          <IconChartPie className="h-4 w-4" />
          Spending by category
        </CardDescription>
        <div className="flex items-center gap-2 w-full justify-end flex-1">
          <DateFromPicker />
          <DateToPicker />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[23.75rem] @[300px]/card:max-h-[34.375rem]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => {
                    const payload = props.payload as ChartDataEntry | undefined;
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
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<CategoryAmountLegend />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <div className="text-muted-foreground leading-none text-center">
          Total spending: {formatBalance(totalSpending)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpendingByCategoryCard;
