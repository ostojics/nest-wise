import {Card, CardContent, CardDescription, CardFooter, CardHeader} from '@/components/ui/card';
import {ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {generateRandomHsl} from '@/lib/utils';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {IconChartPie} from '@tabler/icons-react';
import {useMemo} from 'react';
import {Cell, Pie, PieChart} from 'recharts';

import {useSearch} from '@tanstack/react-router';
import {ChartDataEntry} from '../interfaces/chart-data-entry';
import {SpendingCategoryData} from '../interfaces/spending-category-data';
import CategoryAmountLegend from './category-amount-legend';
import SpendingByCategoryCardEmpty from './spending-by-category-card.empty';
import SpendingByCategoryCardError from './spending-by-category-card.error';
import SpendingByCategoryCardSkeleton from './spending-by-category-card.skeleton';
import {useGetCategoriesSpending} from '@/modules/transactions/hooks/use-get-categories-spending';

const renderCustomizedLabel = (entry: ChartDataEntry) => {
  const percent = ((entry.value / entry.totalValue) * 100).toFixed(1);
  return `${percent}%`;
};

const SpendingByCategoryCard = () => {
  const {formatBalance} = useFormatBalance();
  const search = useSearch({from: '/__pathlessLayout/reports/spending'});
  const {data, isLoading, isError, refetch} = useGetCategoriesSpending({
    search: {
      from: search.from,
      to: search.to,
    },
  });

  const spendingData = useMemo(() => {
    if (!data) return [];

    return data.map(
      ({categoryName, amount}) =>
        ({
          category: categoryName,
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

  const isEmpty = data?.length === 0;

  if (isLoading) {
    return <SpendingByCategoryCardSkeleton />;
  }

  if (isError) {
    return <SpendingByCategoryCardError onRetry={refetch} />;
  }

  return (
    <Card className="@container/card group hover:shadow-md transition-all duration-200 flex flex-col">
      <CardHeader className="flex flex-col gap-4 justify-start @2xl/card:flex-row @2xl/card:items-center">
        <CardDescription className="flex items-center gap-2 flex-2">
          <IconChartPie className="h-4 w-4" />
          Troškovi po kategoriji
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isEmpty ? (
          <SpendingByCategoryCardEmpty />
        ) : (
          <ChartContainer config={{}} className="mx-auto aspect-square max-h-[23.75rem] @2xs/card:max-h-[34.375rem]">
            <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
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
                outerRadius="80%"
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

export default SpendingByCategoryCard;
