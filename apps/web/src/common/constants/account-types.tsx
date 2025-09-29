import {Banknote, CreditCard, Package, PiggyBank, TrendingUp, Wallet} from 'lucide-react';

export const accountTypes = [
  {value: 'checking', label: 'Tekući račun', icon: Wallet, description: 'Dnevne transakcije i troškovi'},
  {value: 'savings', label: 'Štedni račun', icon: PiggyBank, description: 'Dugoročna štednja i ciljevi'},
  {value: 'credit_card', label: 'Kreditna kartica', icon: CreditCard, description: 'Kupovine na kredit i dugovanja'},
  {value: 'investment', label: 'Investicioni račun', icon: TrendingUp, description: 'Akcije, obveznice i investicije'},
  {value: 'cash', label: 'Gotovina', icon: Banknote, description: 'Gotov novac i blagajnički fond'},
  {value: 'other', label: 'Drugo', icon: Package, description: 'Prilagođeni tip računa'},
] as const;
