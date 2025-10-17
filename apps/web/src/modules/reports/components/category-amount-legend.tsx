import React from 'react';
import {useFormatBalance} from '@/modules/formatting/hooks/use-format-balance';
import {ChartDataEntry} from '../interfaces/chart-data-entry';

interface CategoryAmountLegendProps {
  data?: ChartDataEntry[];
}

const CategoryAmountLegend: React.FC<CategoryAmountLegendProps> = ({data}) => {
  const {formatBalance} = useFormatBalance();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-[100%] pt-8 mb-8">
      <ul className="w-[100%] mx-auto space-y-1">
        {data.map((entry, index) => {
          const color = entry.fill;
          const label = entry.category;
          const amount = Number(entry.amount);

          return (
            <li
              key={`legend-item-${index}`}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{backgroundColor: color}} />
                <span className="truncate">{label}</span>
              </div>
              <span className="text-foreground font-mono font-medium tabular-nums">
                {formatBalance(amount)} ({entry.percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryAmountLegend;
