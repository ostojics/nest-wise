import React from 'react';
import {useFormatBalance} from '@/modules/formatting/hooks/useFormatBalance';

interface LegendItemPayload {
  amount?: number;
  fill?: string;
  category?: string;
}

interface LegendItem {
  color?: string;
  value?: string | number;
  payload?: LegendItemPayload;
}

interface CategoryAmountLegendProps {
  payload?: LegendItem[];
}

const CategoryAmountLegend: React.FC<CategoryAmountLegendProps> = ({payload}) => {
  const {formatBalance} = useFormatBalance();

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-8">
      <ul className="w-[100%] md:w-[60%] mx-auto space-y-1">
        {payload.map((entry, index) => {
          const color = entry.color ?? entry.payload?.fill;
          const label = String(entry.value ?? entry.payload?.category ?? '');
          const amount = typeof entry.payload?.amount === 'number' ? entry.payload.amount : undefined;

          return (
            <li key={`legend-item-${index}`} className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{backgroundColor: color}} />
                <span className="truncate">{label}</span>
              </div>
              <span className="text-foreground font-mono font-medium tabular-nums">{formatBalance(amount ?? 0)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryAmountLegend;
