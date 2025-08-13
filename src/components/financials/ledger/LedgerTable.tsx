"use client";

import * as React from "react";
import type { LedgerEntry } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, ArrowUpDown, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale/ar-SA";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLocale } from "next-intl";

interface LedgerTableProps {
  entries: LedgerEntry[];
  onEdit: (entry: LedgerEntry) => void;
  onDelete: (entryId: string) => void;
}

type SortKey = keyof LedgerEntry | null;
type SortOrder = "asc" | "dsc";

export function LedgerTable({ entries, onEdit, onDelete }: LedgerTableProps) {
  const { toast } = useToast();
  const t = useTranslations("Financial");
  const locale = useLocale();

  const translate = (
    key: string,
    fallback?: string,
    values?: Record<string, string | number>
  ) => {
    const translation = values ? t(key, values) : t(key);
    return translation === key && fallback ? fallback : translation;
  };

  const [sortKey, setSortKey] = React.useState<SortKey>("date");
  const [sortOrder, setSortOrder] = React.useState<SortOrder>("dsc");

  const sortedEntries = React.useMemo(() => {
    const sortableItems = [...entries];
    if (sortKey) {
      sortableItems.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        if (sortKey === "date") {
          const dateA = parseISO(valA as string).getTime();
          const dateB = parseISO(valB as string).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortOrder === "asc" ? -1 : 1;
        if (strA > strB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [entries, sortKey, sortOrder]);

  const requestSort = (key: SortKey) => {
    let direction: SortOrder = "asc";
    if (sortKey === key && sortOrder === "asc") {
      direction = "dsc";
    }
    setSortKey(key);
    setSortOrder(direction);
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? (
        <ArrowUpDown className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0 inline-block transform rotate-0" />
      ) : (
        <ArrowUpDown className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0 inline-block transform rotate-180" />
      );
    }
    return (
      <ArrowUpDown className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0 inline-block opacity-30 group-hover:opacity-100" />
    );
  };

  const handleDeleteConfirm = (entry: LedgerEntry) => {
    onDelete(entry.id);
    toast({
      title: translate("ledgerEntryDeletedToast", "Ledger Entry Deleted"),
      description: translate(
        "ledgerEntryDeletedDesc",
        'Entry "{{description}}" has been removed.',
        { description: entry.description }
      ),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translate("ledgerEntries", "Ledger Entries")}</CardTitle>
        <CardDescription>
          {translate(
            "ledgerEntriesDesc",
            "List of all recorded income and expense transactions."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedEntries.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="text-right ltr:text-left cursor-pointer group"
                    onClick={() => requestSort("date")}
                  >
                    {translate("dateRequired", "Date")} {getSortIndicator("date")}
                  </TableHead>
                  <TableHead
                    className="text-right ltr:text-left cursor-pointer group"
                    onClick={() => requestSort("description")}
                  >
                    {translate("descriptionRequired", "Description")}{" "}
                    {getSortIndicator("description")}
                  </TableHead>
                  <TableHead
                    className="text-right ltr:text-left cursor-pointer group"
                    onClick={() => requestSort("categoryName")}
                  >
                    {translate("categoryName", "Category")}{" "}
                    {getSortIndicator("categoryName")}
                  </TableHead>
                  <TableHead
                    className="text-right ltr:text-left cursor-pointer group"
                    onClick={() => requestSort("type")}
                  >
                    {translate("entryType", "Type")} {getSortIndicator("type")}
                  </TableHead>
                  <TableHead
                    className="text-right rtl:text-left cursor-pointer group"
                    onClick={() => requestSort("amount")}
                  >
                    {translate("amountEGPRequired", "Amount (EGP)")}{" "}
                    {getSortIndicator("amount")}
                  </TableHead>
                  <TableHead className="text-center w-[100px]">
                    {translate("actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(parseISO(entry.date), "MMM d, yyyy", {
                        locale: locale === "ar" ? arSA : undefined,
                      })}
                    </TableCell>
                    <TableCell
                      className="font-medium max-w-xs truncate"
                      title={entry.description}
                    >
                      {entry.description}
                    </TableCell>
                    <TableCell>{entry.categoryName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={entry.type === "income" ? "default" : "destructive"}
                        className={entry.type === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {translate(
                          entry.type,
                          entry.type.charAt(0).toUpperCase() + entry.type.slice(1)
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right rtl:text-left font-semibold ${
                        entry.type === "income" ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {entry.type === "expense" ? "-" : ""}
                      {entry.amount.toLocaleString(locale === "ar" ? "ar-EG" : undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right rtl:text-left flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(entry)}
                        className="mr-1 rtl:ml-1 rtl:mr-0"
                        title={`${translate("edit", "Edit")} ${entry.description}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title={`${translate("delete", "Delete")} ${entry.description}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {translate(
                                "confirmDeleteLedgerEntryTitle",
                                "Are you sure?"
                              )}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {translate(
                                "confirmDeleteLedgerEntryDesc",
                                'This action cannot be undone. This will permanently delete the entry: "{{description}}".',
                                { description: entry.description }
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{translate("cancel", "Cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteConfirm(entry)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {translate("delete", "Delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {translate("noLedgerEntries", "No ledger entries found.")}
            </p>
            <p className="text-sm text-muted-foreground">
              {translate(
                "noLedgerEntriesDesc",
                "Use the form to add new income or expense transactions."
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
