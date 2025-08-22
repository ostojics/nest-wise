import {accountTypes} from '@/common/constants/account-types';
import React from 'react';

interface SelectedAccountTypeProps {
  type?: string | null;
}

const SelectedAccountType: React.FC<SelectedAccountTypeProps> = ({type}) => {
  if (!type) return null;

  const selected = accountTypes.find((t) => t.value === type);
  if (!selected) return null;

  const Icon = selected.icon;

  return (
    <div className="p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium">{selected.label}</p>
          <p className="text-xs text-muted-foreground">{selected.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectedAccountType;
