
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation"; // Use next-intl's Link
import { ArrowLeft, Filter, CalendarRange } from "lucide-react";
import { dummyLedgerEntries, dummyLedgerCategories } from "@/lib/dummy-data";
// import type { LedgerEntry, LedgerCategory, LedgerEntryType, Locale } from "@/types";
import type { LedgerEntry, LedgerCategory, LedgerEntryType } from "@/types";

import { LedgerEntryForm } from "@/components/financials/ledger/LedgerEntryForm";
import { LedgerTable } from "@/components/financials/ledger/LedgerTable";
import { LedgerSummary } from "@/components/financials/ledger/LedgerSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { arSA } from 'date-fns/locale/ar-SA';
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations, useLocale } from 'next-intl';

// interface LedgerPageProps {
//   params: { locale: Locale };
// }
// export default function LedgerPage({ params }: LedgerPageProps) {
export default function LedgerPage() {
  const t = useTranslations('Financial');
  const locale = useLocale();
  const translate = (key: string, fallback?: string, values?: Record<string ,string | number>) => {
    const translation = values ? t(key, values) : t(key);
    return translation === key && fallback ? fallback : translation;
  };
  const [ledgerEntries, setLedgerEntries] = React.useState<LedgerEntry[]>(dummyLedgerEntries);
  const [categories] = React.useState<LedgerCategory[]>(dummyLedgerCategories);
  const [editingEntry, setEditingEntry] = React.useState<LedgerEntry | null>(null);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [filterType, setFilterType] = React.useState<LedgerEntryType | "all">("all");

  const filteredEntries = React.useMemo(() => {
    return ledgerEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      const dateMatch = dateRange?.from && dateRange?.to 
        ? isWithinInterval(entryDate, { start: dateRange.from, end: dateRange.to })
        : true; 
      const typeMatch = filterType === "all" ? true : entry.type === filterType;
      return dateMatch && typeMatch;
    });
  }, [ledgerEntries, dateRange, filterType]);


  const handleAddOrUpdateEntry = (entryData: LedgerEntry) => {
    setLedgerEntries(prevEntries => {
      const existingIndex = prevEntries.findIndex(e => e.id === entryData.id);
      if (existingIndex > -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = entryData;
        return updatedEntries;
      }
      return [entryData, ...prevEntries]; 
    });
    setEditingEntry(null); 
  };

  const handleEditEntry = (entry: LedgerEntry) => {
    setEditingEntry(entry);
    const formElement = document.getElementById("ledger-entry-form-card");
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteEntry = (entryId: string) => {
    setLedgerEntries(prevEntries => prevEntries.filter(e => e.id !== entryId));
    if (editingEntry?.id === entryId) {
      setEditingEntry(null);
    }
  };
  
  const handleClearForm = () => {
    setEditingEntry(null);
  }

  const handleClearFilters = () => {
    setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date())});
    setFilterType("all");
  }
  
  const formatDate = (date: Date, formatString: string) => {
    return format(date, formatString, { locale: locale === 'ar' ? arSA : undefined });
  };

  return (
    <div className="m-5">
      <PageHeader
        title={translate('ledgerTitle', 'Income & Expense Ledger')}
        description={translate('ledgerDescription', 'Manage the clinic\'s financial ledger.')}
      >
        <Button variant="outline" asChild>
          <Link href={`/financials`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translate('backToFinancials', 'Back to Financials')}
          </Link>
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <LedgerSummary entries={filteredEntries} />

        <Card id="ledger-entry-form-card">
          <LedgerEntryForm
            categories={categories}
            onSubmitEntry={handleAddOrUpdateEntry}
            initialEntry={editingEntry}
            onClearForm={handleClearForm}
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5 text-accent"/>{translate('filter', 'Filter')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="date-range-picker" className="text-sm font-medium">{translate('dateRange', 'Date Range')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range-picker"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {formatDate(dateRange.from, "LLL dd, y")} - {formatDate(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        formatDate(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{translate('pickDateRange', 'Pick a date range')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    locale={locale === 'ar' ? arSA : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
                <Label htmlFor="type-filter" className="text-sm font-medium">{translate('entryType', 'Entry Type')}</Label>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as LedgerEntryType | "all")}> 
                  <SelectTrigger id="type-filter" className="mt-1">
                    <SelectValue placeholder={translate('filterByType', "Filter by type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{translate('allTypes', "All Types")}</SelectItem>
                    <SelectItem value="income">{translate('income', "Income")}</SelectItem>
                    <SelectItem value="expense">{translate('expense', "Expense")}</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <Button onClick={handleClearFilters} variant="outline">{translate('clearFilters', 'Clear Filters')}</Button>
          </CardContent>
        </Card>

        <LedgerTable
          entries={filteredEntries}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
       <p className="text-xs text-muted-foreground mt-6 text-center">
            {translate('ledgerDataNote', 'This data is for demonstration purposes only.')}
       </p>
    </div>
  );
}

