"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, RefreshCw, XCircle } from "lucide-react";

interface Appointment {
  id: number;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "محجوز" | "ملغي";
  doctor: string;
}

const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const appointments: Appointment[] = [
  { id: 1, patientName: "محمد علي", date: today, time: "10:00", status: "محجوز", doctor: "د. أحمد" },
  { id: 2, patientName: "سارة محمود", date: today, time: "11:30", status: "ملغي", doctor: "د. منى" },
  { id: 3, patientName: "علي حسن", date: tomorrow, time: "09:00", status: "محجوز", doctor: "د. خالد" },
  { id: 4, patientName: "ليلى محمد", date: "2025-08-15", time: "14:00", status: "محجوز", doctor: "د. أحمد" },
];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<"اليوم" | "الغد" | "الكل">("الكل");

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === "اليوم") return appt.date === today;
    if (filter === "الغد") return appt.date === tomorrow;
    return true;
  });

  const handleReschedule = (id: number) => {
    alert(`إعادة جدولة الموعد رقم ${id}`);
  };

  const handleCancel = (id: number) => {
    alert(`تم إلغاء الموعد رقم ${id}`);
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            إدارة المواعيد
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === "اليوم" ? "default" : "outline"}
              onClick={() => setFilter("اليوم")}
            >
              مواعيد اليوم
            </Button>
            <Button
              variant={filter === "الغد" ? "default" : "outline"}
              onClick={() => setFilter("الغد")}
            >
              مواعيد الغد
            </Button>
            <Button
              variant={filter === "الكل" ? "default" : "outline"}
              onClick={() => setFilter("الكل")}
            >
              كل المواعيد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المريض</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الوقت</TableHead>
                <TableHead>الطبيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    لا توجد مواعيد
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{appt.patientName}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>
                      <Badge
                        variant={appt.status === "محجوز" ? "default" : "destructive"}
                      >
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center flex gap-2 justify-center">
                      {appt.status === "محجوز" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => handleReschedule(appt.id)}
                        >
                          <RefreshCw className="h-4 w-4" /> إعادة جدولة
                        </Button>
                      )}
                      {appt.status === "محجوز" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => handleCancel(appt.id)}
                        >
                          <XCircle className="h-4 w-4" /> إلغاء
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
