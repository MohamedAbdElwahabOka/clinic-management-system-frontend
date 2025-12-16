"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // استيراد useParams لجلب اللغة
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Patient, CURRENT_DOCTOR_ID, SourceInfo } from "./types"; // تأكد من مسار الاستيراد الصحيح
import { dummyPatients } from "./data"; // تأكد من مسار الاستيراد الصحيح

// ============================================
// Helper Functions
// ============================================

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const isLocalRecord = (source: SourceInfo): boolean => {
  return source.doctorId === CURRENT_DOCTOR_ID;
};

// ============================================
// Main Component
// ============================================

export default function MedicalRecordSystem() {
  const router = useRouter();
  const params = useParams(); // جلب متغيرات الرابط مثل اللغة
  const locale = params.locale || "ar"; // اللغة الافتراضية

  // حل مشكلة Hydration: التأكد من أن المكون تم تحميله في المتصفح
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const patients = useMemo(() => dummyPatients, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // دوال مساعدة لحساب عدد السجلات
  const getLocalRecordsCount = (records: any[] | undefined) => {
    return (records || []).filter((r) => isLocalRecord(r.source)).length;
  };

  const getGlobalRecordsCount = (records: any[] | undefined) => {
    return (records || []).filter((r) => !isLocalRecord(r.source)).length;
  };

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter((p) =>
      [p.name, p.contactPhone, p.contactEmail, p.id, p.address]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "name") {
          return sortConfig.direction === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortConfig.key === "age") {
          const ageA = calculateAge(a.dateOfBirth);
          const ageB = calculateAge(b.dateOfBirth);
          return sortConfig.direction === "asc" ? ageA - ageB : ageB - ageA;
        }
        return 0;
      });
    }

    return filtered;
  }, [patients, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // الدالة المعدلة للتوجيه للصفحة التفصيلية مع اللغة الصحيحة
  const handleRowClick = (patientId: string) => {
    // إزالة أي رموز قد تسبب مشاكل في الرابط (اختياري حسب تنسيق الـ ID لديك)
    // لكن الأهم هو إضافة اللغة في البداية
    router.push(`/${locale}/records/${patientId}`);
  };

  // منع عرض المحتوى قبل التحميل الكامل لحل مشكلة Hydration
  if (!mounted) {
    return null; 
  }

  return (
    <div
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen bg-background"
      dir="rtl"
    >
      {/* Header */}
      <div className="grid grid-cols-1 gap-4 w-full sm:px-4 md:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              نظام السجلات الطبية
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              إدارة ملفات المرضى والسجلات الطبية
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 md:w-96">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="بحث (اسم، هاتف، رقم ملف)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-10 sm:h-11"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto"
            >
              <Filter size={16} className="ml-2" />
              فلتر
            </Button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <Card>
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-semibold text-sm sm:text-base">قائمة المرضى</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            عرض {filteredPatients.length} من {patients.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-right cursor-pointer p-2 sm:p-3"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-1">
                    المريض
                    {sortConfig?.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer p-2 sm:p-3"
                  onClick={() => requestSort("age")}
                >
                  العمر / الجنس
                </TableHead>
                <TableHead className="text-right p-2 sm:p-3">رقم الهاتف</TableHead>
                <TableHead className="text-right p-2 sm:p-3">الحالة</TableHead>
                <TableHead className="text-right p-2 sm:p-3">السجلات</TableHead>
                <TableHead className="text-right p-2 sm:p-3">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((p) => {
                const localCount = getLocalRecordsCount(p.labTests);
                const globalCount = getGlobalRecordsCount(p.labTests);

                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(p.id)} // التوجيه عند الضغط على الصف
                  >
                    <TableCell className="p-2 sm:p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm sm:text-base">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            #{p.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <p className="font-medium text-sm sm:text-base">
                        {calculateAge(p.dateOfBirth)} سنة
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.gender === "Male" ? "ذكر" : "أنثى"}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground text-sm p-2 sm:p-3">
                      {p.contactPhone}
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <Badge
                        variant={
                          p.status?.code === "Critical"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {p.status?.code || "غير محدد"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs border px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                          {localCount} محلي
                        </span>
                        <span className="text-xs border px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                          {globalCount} خارجي
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // منع تكرار الحدث
                          handleRowClick(p.id);
                        }}
                        className="w-full sm:w-auto"
                      >
                        فتح الملف
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}