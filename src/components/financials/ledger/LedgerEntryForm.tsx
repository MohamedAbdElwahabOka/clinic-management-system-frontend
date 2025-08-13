"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, PlusCircle, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale/ar-SA";
import { useToast } from "@/hooks/use-toast";
import type { LedgerEntry, LedgerCategory, LedgerEntryType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

interface LedgerEntryFormProps {
  categories: LedgerCategory[];
  onSubmitEntry: (data: LedgerEntry) => void;
  initialEntry?: LedgerEntry | null;
  onClearForm: () => void;
}

export function LedgerEntryForm({
  categories,
  onSubmitEntry,
  initialEntry,
  onClearForm,
}: LedgerEntryFormProps) {
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

  const getLedgerEntryFormSchema = () =>
    z.object({
      id: z.string().optional(),
      date: z.date({
        required_error: translate(
          "requiredField",
          "{{field}} is required.",
          { field: translate("dateRequired") }
        ),
      }),
      description: z.string().min(3, translate("errorDescriptionMinLedger")),
      categoryId: z.string({
        required_error: translate(
          "requiredField",
          "{{field}} is required.",
          { field: translate("categoryRequired") }
        ),
      }),
      amount: z.coerce.number().positive(translate("errorAmountPositive")),
      type: z.enum(["income", "expense"], {
        required_error: translate(
          "requiredField",
          "{{field}} is required.",
          { field: translate("entryType") }
        ),
      }),
      notes: z.string().optional(),
    });

  type LedgerEntryFormValues = z.infer<ReturnType<typeof getLedgerEntryFormSchema>>;

  const form = useForm<LedgerEntryFormValues>({
    resolver: zodResolver(getLedgerEntryFormSchema()),
    defaultValues: {
      date: new Date(),
      description: "",
      categoryId: undefined,
      amount: 0,
      type: "expense",
      notes: "",
      id: undefined,
    },
  });

  React.useEffect(() => {
    form.reset(undefined, { keepValues: false });
  }, [locale, form]);

  const currentType = form.watch("type");

  const filteredCategories = React.useMemo(() => {
    return categories.filter((cat) => cat.type === currentType);
  }, [categories, currentType]);

  React.useEffect(() => {
    if (initialEntry) {
      form.reset({
        id: initialEntry.id,
        date: parseISO(initialEntry.date),
        description: initialEntry.description,
        categoryId: initialEntry.categoryId,
        amount: initialEntry.amount,
        type: initialEntry.type,
        notes: initialEntry.notes || "",
      });
    } else {
      form.reset({
        date: new Date(),
        description: "",
        categoryId: undefined,
        amount: 0,
        type: "expense",
        notes: "",
        id: undefined,
      });
    }
  }, [initialEntry, form]);

  React.useEffect(() => {
    const selectedCategoryId = form.getValues("categoryId");
    if (selectedCategoryId) {
      const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
      if (selectedCategory && selectedCategory.type !== currentType) {
        form.setValue("categoryId", undefined);
      }
    }
  }, [currentType, form, categories]);

  function handleSubmit(data: LedgerEntryFormValues) {
    const selectedCategory = categories.find((cat) => cat.id === data.categoryId);
    if (!selectedCategory) {
      toast({
        title: translate("error"),
        description: translate("categoryNotFound", "Selected category not found."),
        variant: "destructive",
      });
      return;
    }

    const entryData: LedgerEntry = {
      id: data.id || `LDE${Date.now()}`,
      date: format(data.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      description: data.description,
      categoryId: data.categoryId,
      categoryName: selectedCategory.name,
      amount: data.amount,
      type: data.type as LedgerEntryType,
      notes: data.notes,
    };

    onSubmitEntry(entryData);

    toast({
      title: data.id ? translate("entryUpdatedToast") : translate("entryAddedToast"),
      description: translate(
        data.id ? "entryUpdatedDesc" : "entryAddedDesc",
        "",
        { description: entryData.description }
      ),
    });

    handleClearAndResetForm();
  }

  const handleClearAndResetForm = () => {
    onClearForm();
    form.reset({
      date: new Date(),
      description: "",
      categoryId: undefined,
      amount: 0,
      type: "expense",
      notes: "",
      id: undefined,
    });
  };

  const isEditing = !!form.watch("id");
  const formTitle = isEditing ? translate("editLedgerEntry") : translate("addNewLedgerEntry");
  const formDescription = isEditing
    ? translate("editLedgerEntryDesc")
    : translate("addNewLedgerEntryDesc");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              name="id"
              control={form.control}
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{translate("entryType")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      dir={locale === "ar" ? "rtl" : "ltr"}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("categoryId", undefined);
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4 rtl:space-x-reverse"
                    >
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">{translate("income")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 rtl:space-x-reverse space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">{translate("expense")}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translate("dateRequired")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP", { locale: locale === "ar" ? arSA : undefined })
                            : <span>{translate("pickDate")}</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" dir={locale === "ar" ? "rtl" : "ltr"}>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        locale={locale === "ar" ? arSA : undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate("descriptionRequired")}</FormLabel>
                  <FormControl>
                    <Input placeholder={translate("descriptionPlaceholderLedger")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate("categoryRequired")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={translate(
                              currentType === "income" ? "selectIncomeCategory" : "selectExpenseCategory"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.length === 0 && (
                          <SelectItem value="-" disabled>
                            {translate("noCategoriesForType", "", { type: translate(currentType) })}
                          </SelectItem>
                        )}
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate("amountEGPRequired")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder={translate("amountPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate("notesOptional")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={translate("notesPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
              <Button type="button" variant="outline" onClick={handleClearAndResetForm} disabled={form.formState.isSubmitting}>
                <Eraser className="mr-2 h-4 w-4" /> {translate("clearNew")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || filteredCategories.length === 0}>
                {isEditing ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {form.formState.isSubmitting
                  ? isEditing
                    ? translate("updating")
                    : translate("adding")
                  : isEditing
                  ? translate("updateEntry")
                  : translate("addEntry")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
