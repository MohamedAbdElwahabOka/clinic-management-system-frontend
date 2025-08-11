"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", date: "2025-08-11", read: false },
  { id: 2, message: "تم تأكيد الحجز الخاص بك", date: "2025-08-10", read: true },
  { id: 3, message: "تم إلغاء الموعد بناءً على طلبك", date: "2025-08-09", read: false },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> الإشعارات
          </CardTitle>
          <Button onClick={markAllAsRead}>تحديد الكل كمقروء</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد إشعارات</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex justify-between items-center p-3 rounded-lg border ${
                  n.read ? "bg-gray-100" : "bg-blue-50 border-blue-300"
                }`}
              >
                <div>
                  <p className="font-medium">{n.message}</p>
                  <small className="text-gray-500">{n.date}</small>
                </div>
                <div className="flex gap-2">
                  <Badge
                    onClick={() => toggleRead(n.id)}
                    className="cursor-pointer"
                    variant={n.read ? "secondary" : "default"}
                  >
                    {n.read ? "مقروء" : "غير مقروء"}
                  </Badge>
                  <Button variant="destructive" size="icon" onClick={() => deleteNotification(n.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
