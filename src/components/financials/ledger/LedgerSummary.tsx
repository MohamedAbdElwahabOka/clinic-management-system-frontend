
"use client";

import type { LedgerEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale } from "lucide-react"; // DollarSign removed as it's not used
import { useTranslations, useLocale } from 'next-intl';

interface LedgerSummaryProps {
  entries: LedgerEntry[];
  currency?: string;
}



interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}



export function LedgerSummary({ entries, currency = "EGP" }: LedgerSummaryProps) {
  const t = useTranslations('Financial');
  const locale = useLocale();
  const translate = (key: string, fallback?: string, values?: Record<string, any>) => {
    const translation = values ? t(key, values) : t(key);
    return translation === key && fallback ? fallback : translation;
  };
  const summary: SummaryData = entries.reduce(
    (acc, entry) => {
      if (entry.type === 'income') {
        acc.totalIncome += entry.amount;
      } else if (entry.type === 'expense') {
        acc.totalExpenses += entry.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netBalance: 0 }
  );
  summary.netBalance = summary.totalIncome - summary.totalExpenses;

  const formatCurrency = (amount: number) => {
    const translatedCurrency = translate('currency', currency);
    return `${amount.toLocaleString(locale === 'ar' ? 'ar-EG' : undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${translatedCurrency}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{translate('totalIncome', "Total Income")}</CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</div>
          <p className="text-xs text-muted-foreground">{translate('totalIncomeDesc', "All recorded income.")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{translate('totalExpenses', "Total Expenses")}</CardTitle>
          <TrendingDown className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">{translate('totalExpensesDesc', "All recorded expenses.")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{translate('netBalance', "Net Balance")}</CardTitle>
          <Scale className={`h-5 w-5 ${summary.netBalance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(summary.netBalance)}
          </div>
          <p className="text-xs text-muted-foreground">{translate('netBalanceDesc', "Income minus expenses.")}</p>
        </CardContent>
      </Card>
    </div>
  );
}




