import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { CurrencyCode } from '../lib/currencyConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const currencies: { code: CurrencyCode; name: string }[] = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'EUR', name: 'Euro' },
    { code: 'AED', name: 'UAE Dirham' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2 font-black uppercase tracking-tighter hover:bg-primary/10 rounded-full h-10 px-4">
            <Globe className="h-4 w-4 text-primary" />
            <span>{currency}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
              currency === curr.code ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-primary/10'
            }`}
          >
            <span className="font-bold text-xs uppercase tracking-widest">{curr.name}</span>
            <span className="text-[10px] opacity-70 font-black">{curr.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
