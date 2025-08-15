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

const mockSpendingData = [
  {category: 'Groceries', amount: 1250.75, fill: generateRandomHsl()},
  {category: 'Transportation', amount: 850.3, fill: generateRandomHsl()},
  {category: 'Utilities', amount: 650.0, fill: generateRandomHsl()},
  {category: 'Entertainment', amount: 420.5, fill: generateRandomHsl()},
  {category: 'Dining Out', amount: 380.25, fill: generateRandomHsl()},
  {category: 'Healthcare', amount: 320.0, fill: generateRandomHsl()},
  {category: 'Shopping', amount: 275.8, fill: generateRandomHsl()},
];

const renderCustomizedLabel = (entry: ChartDataEntry) => {
  const percent = ((entry.value / entry.totalValue) * 100).toFixed(1);
  return `${percent}%`;
};

const SpendingByCategoryCard: React.FC = () => {
  const {formatBalance} = useFormatBalance();

  const totalSpending = useMemo(() => {
    return mockSpendingData.reduce((total, item) => total + item.amount, 0);
  }, []);

  const dataWithPercentages = useMemo(() => {
    return mockSpendingData.map((item) => ({
      ...item,
      percentage: ((item.amount / totalSpending) * 100).toFixed(1),
      totalValue: totalSpending,
      value: item.amount,
    }));
  }, [totalSpending]);

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
