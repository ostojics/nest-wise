import {Banknote, CreditCard, Package, PiggyBank, TrendingUp, Wallet} from 'lucide-react';

export const accountTypes = [
  {value: 'checking', label: 'Checking Account', icon: Wallet, description: 'Daily transactions and expenses'},
  {value: 'savings', label: 'Savings Account', icon: PiggyBank, description: 'Long-term savings and goals'},
  {value: 'credit_card', label: 'Credit Card', icon: CreditCard, description: 'Credit purchases and balances'},
  {value: 'investment', label: 'Investment Account', icon: TrendingUp, description: 'Stocks, bonds, and investments'},
  {value: 'cash', label: 'Cash', icon: Banknote, description: 'Physical cash and petty cash'},
  {value: 'other', label: 'Other', icon: Package, description: 'Custom account type'},
] as const;
