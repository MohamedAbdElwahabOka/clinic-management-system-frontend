"use client";

import React, { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import {
  ArrowLeft, ArrowUpRight, Package, Users, DollarSign, Plus, Trash2,
  AlertTriangle, CheckCircle2, TrendingDown, TrendingUp,
  Archive, AlertOctagon, Wallet, MapPin, BadgePercent, ShieldAlert,
  Calendar, FileText, ChevronRight, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { dummyClinics, SPECIALTY_PRESETS } from "@/lib/dummy-data";
import { LocalizedText } from "@/types/index";

// ============================================
// UI Dictionary
// ============================================
const UI_TEXT = {
  ar: {
    back: "العودة للعيادات",
    manage: "إدارة",
    tabs: { inventory: "المخزون", payroll: "الرواتب والموظفين", settings: "الإعدادات" },
    inv: {
      title: "سجل المخزون",
      totalItems: "إجمالي الأصناف",
      lowStock: "نواقص",
      wasted: "إجمالي الهالك",
      addItem: "إضافة صنف",
      itemName: "اسم الصنف",
      qty: "الكمية",
      status: "الحالة",
      actions: "إجراءات",
      recordWaste: "تسجيل هالك",
      recordConsume: "تسجيل استهلاك",
      suggested: "مقترحات ذكية لعيادة",
      addPreset: "إضافة"
    },
    payroll: {
      title: "كشف الرواتب",
      totalSalaries: "إجمالي الرواتب الشهرية",
      pending: "مستحقات معلقة",
      payNow: "صرف الراتب",
      paid: "تم الدفع",
      overdue: "متأخر",
      nextDate: "تاريخ الاستحقاق",
      salary: "الراتب",
      employee: "الموظف",
      role: "الوظيفة",
      action: "الإجراء"
    }
  },
  en: {
    back: "Back to Clinics",
    manage: "Manage",
    tabs: { inventory: "Inventory", payroll: "Payroll & Staff", settings: "Settings" },
    inv: {
      title: "Inventory Log",
      totalItems: "Total Items",
      lowStock: "Low Stock",
      wasted: "Total Wasted",
      addItem: "Add Item",
      itemName: "Item Name",
      qty: "Qty",
      status: "Status",
      actions: "Actions",
      recordWaste: "Record Waste",
      recordConsume: "Record Usage",
      suggested: "Smart Suggestions for",
      addPreset: "Add"
    },
    payroll: {
      title: "Payroll Sheet",
      totalSalaries: "Total Monthly Salaries",
      pending: "Pending Payments",
      payNow: "Process Payment",
      paid: "Paid",
      overdue: "Overdue",
      nextDate: "Due Date",
      salary: "Salary",
      employee: "Employee",
      role: "Role",
      action: "Action"
    }
  }
};

export default function ClinicOperationsPage({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  // @ts-ignore
  const t = UI_TEXT[locale] || UI_TEXT['en'];

  const getLocalizedText = (textObj: LocalizedText | undefined) => {
    if (!textObj) return "";
    // @ts-ignore
    return textObj[locale] || textObj['en'] || textObj['ar'] || "";
  };

  // محاكاة جلب بيانات العيادة (في الواقع نستخدم الـ ID من الـ params)
  const clinicData = dummyClinics[0]; // نستخدم أول عيادة كمثال

  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState(clinicData.inventory);
  const [staffList, setStaffList] = useState(clinicData.staff);

  // --- Logic: تحديث المخزون (هالك / استهلاك) ---
  const handleUpdateStock = (id: string, type: 'waste' | 'consume', amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity - amount);
        // تحديث الحالة بناءً على الكمية الجديدة
        let newStatus = item.status;
        if (newQty === 0) newStatus = 'critical';
        else if (newQty < item.threshold) newStatus = 'low';
        else newStatus = 'good';

        return {
          ...item,
          quantity: newQty,
          status: newStatus as any,
          wastedCount: type === 'waste' ? item.wastedCount + amount : item.wastedCount,
          consumedCount: type === 'consume' ? item.consumedCount + amount : item.consumedCount
        };
      }
      return item;
    }));
  };

  // --- Logic: دفع الرواتب ---
  const handlePaySalary = (staffId: string) => {
    setStaffList(prev => prev.map(staff => {
      if (staff.id === staffId) {
        return {
          ...staff,
          payroll: { ...staff.payroll, status: 'paid' }
        };
      }
      return staff;
    }));
  };

  // --- Logic: اقتراحات ذكية ---
  // @ts-ignore
  const suggestedItems = SPECIALTY_PRESETS[clinicData.specialtyKey] || SPECIALTY_PRESETS['general'];

  return (
    <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0" dir={isRTL ? "rtl" : "ltr"}>

      {/* 1. Header & Navigation */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-0 gap-2">
          {isRTL ? <ArrowUpRight className="rotate-180" size={18} /> : <ArrowLeft size={18} />}
          {t.back}
        </Button>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t.manage}: {getLocalizedText(clinicData.name)}</h1>
              <Badge variant="secondary" className="text-base font-normal px-3 py-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {getLocalizedText(clinicData.type)}
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <MapPin size={16} /> {getLocalizedText(clinicData.address)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Settings size={16} /> {t.tabs.settings}</Button>
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-xl h-auto w-full md:w-auto flex overflow-x-auto">
          <TabsTrigger value="inventory" className="flex-1 md:flex-none px-6 py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-950/50 dark:data-[state=active]:text-blue-400 rounded-lg gap-2">
            <Package size={18} /> {t.tabs.inventory}
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex-1 md:flex-none px-6 py-3 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-950/50 dark:data-[state=active]:text-purple-400 rounded-lg gap-2">
            <Wallet size={18} /> {t.tabs.payroll}
          </TabsTrigger>
        </TabsList>

        {/* --- INVENTORY TAB --- */}
        <TabsContent value="inventory" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

          {/* Inventory KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.inv.totalItems}</p>
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">{inventory.length}</h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-full text-blue-600 dark:text-blue-400"><Package /></div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-amber-100 dark:border-amber-900 shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.inv.lowStock}</p>
                  <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{inventory.filter(i => i.status !== 'good').length}</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-full text-amber-600 dark:text-amber-400"><AlertTriangle /></div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-red-100 dark:border-red-900 shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.inv.wasted}</p>
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {inventory.reduce((acc, curr) => acc + curr.wastedCount, 0)}
                  </h3>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-full text-red-600 dark:text-red-400"><Trash2 /></div>
              </CardContent>
            </Card>
          </div>

          {/* Smart Suggestions (Based on Clinic Type) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-400 flex items-center gap-2 mb-2">
                  <Archive size={18} />
                  {t.inv.suggested} ({getLocalizedText(clinicData.type)})
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {suggestedItems.map((item: any, idx: number) => (
                    <button key={idx} className="flex items-center gap-1 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm transition-colors shadow-sm">
                      <Plus size={14} /> {getLocalizedText(item)}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="shrink-0 gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                <Plus size={16} /> {t.inv.addItem}
              </Button>
            </div>
          </div>

          {/* Detailed Inventory Table */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 text-start">{t.inv.itemName}</th>
                    <th className="p-4 text-center">{t.inv.qty}</th>
                    <th className="p-4 text-center">Tracking (Used / Wasted)</th>
                    <th className="p-4 text-center">{t.inv.status}</th>
                    <th className="p-4 text-center">{t.inv.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.status === 'critical' ? 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                            <Package size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">{getLocalizedText(item.itemName)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{getLocalizedText(item.category)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-lg font-bold">{item.quantity}</span>
                          <span className="text-xs text-gray-400">{getLocalizedText(item.unit)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-600 flex items-center gap-1"><TrendingUp size={12} /> {item.consumedCount} Used</span>
                            <span className="text-red-500 flex items-center gap-1"><Trash2 size={12} /> {item.wastedCount} Waste</span>
                          </div>
                          {/* Progress bar showing stock relative to threshold * 3 (arbitrary max) */}
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${item.status === 'critical' ? 'bg-red-500' : item.status === 'low' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min((item.quantity / (item.threshold * 3)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={item.status === 'good' ? 'outline' : 'destructive'} className={
                          item.status === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            item.status === 'low' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''
                        }>
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm" variant="outline"
                            className="h-8 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 gap-1"
                            title={t.inv.recordConsume}
                            onClick={() => handleUpdateStock(item.id, 'consume', 1)}
                          >
                            <TrendingDown size={14} /> -1
                          </Button>
                          <Button
                            size="sm" variant="outline"
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 gap-1"
                            title={t.inv.recordWaste}
                            onClick={() => handleUpdateStock(item.id, 'waste', 1)}
                          >
                            <AlertOctagon size={14} /> Waste
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* --- PAYROLL TAB --- */}
        <TabsContent value="payroll" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-gray-800 border-purple-100 dark:border-purple-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-400 uppercase flex items-center gap-2">
                  <Wallet size={16} /> {t.payroll.totalSalaries}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                  {staffList.reduce((acc, s) => acc + s.payroll.salary, 0).toLocaleString()} <span className="text-lg">EGP</span>
                </div>
                <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Estimated monthly cost</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-800 border-amber-100 dark:border-amber-900 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-400 uppercase flex items-center gap-2">
                  <AlertTriangle size={16} /> {t.payroll.pending}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {staffList.filter(s => s.payroll.status === 'pending' || s.payroll.status === 'overdue').length} Staff
                </div>
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-1">Actions required immediately</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 text-start">{t.payroll.employee}</th>
                    <th className="p-4 text-start">{t.payroll.role}</th>
                    <th className="p-4 text-start">{t.payroll.salary}</th>
                    <th className="p-4 text-start">{t.payroll.nextDate}</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">{t.payroll.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={staff.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-200 border border-gray-100 object-cover" />
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">{getLocalizedText(staff.name)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {staff.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-normal">
                          {getLocalizedText(staff.role)}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono font-medium text-gray-800 dark:text-gray-200">
                        {staff.payroll.salary.toLocaleString()} <span className="text-xs text-gray-400">{staff.payroll.currency}</span>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {staff.payroll.nextPaymentDate}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={staff.payroll.status === 'paid' ? 'outline' : 'default'} className={
                          staff.payroll.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            staff.payroll.status === 'overdue' ? 'bg-red-500 text-white' :
                              'bg-amber-100 text-amber-800 border-amber-200'
                        }>
                          {t.payroll[staff.payroll.status]}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          size="sm"
                          disabled={staff.payroll.status === 'paid'}
                          onClick={() => handlePaySalary(staff.id)}
                          className={`text-xs h-8 gap-2 ${staff.payroll.status === 'paid' ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                          {staff.payroll.status === 'paid' ? <CheckCircle2 size={14} /> : <DollarSign size={14} />}
                          {t.payroll.payNow}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </TabsContent>
      </Tabs>
    </div>
  );
}