"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Trash2, CheckCircle, Filter, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Notification {
  id: number;
  message: string;
  date: string;
  time: string;
  read: boolean;
  type: "appointment" | "confirmation" | "cancellation" | "reminder";
}

const initialNotifications: Notification[] = [
  { 
    id: 1, 
    message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", 
    date: "2025-08-11", 
    time: "09:30",
    read: false, 
    type: "appointment"
  },
  { 
    id: 2, 
    message: "تم تأكيد الحجز الخاص بك", 
    date: "2025-08-10", 
    time: "14:15",
    read: true, 
    type: "confirmation"
  },
  { 
    id: 3, 
    message: "تم إلغاء الموعد بناءً على طلبك", 
    date: "2025-08-09", 
    time: "16:45",
    read: false, 
    type: "cancellation"
  },
  { 
    id: 4, 
    message: "تذكير: موعدك بعد ساعتين مع د. محمد", 
    date: "2025-08-12", 
    time: "08:00",
    read: false, 
    type: "reminder"
  },
  { 
    id: 5, 
    message: "تم تحويل موعدك مع د. سارة إلى يوم الخميس", 
    date: "2025-08-08", 
    time: "11:20",
    read: true, 
    type: "appointment"
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    reminders: true,
    confirmations: true,
    cancellations: true,
  });

  // تصفية الإشعارات حسب الحالة
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("تم تحديد جميع الإشعارات كمقروءة");
  };

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("تم حذف الإشعار");
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
    toast.success("تم حذف جميع الإشعارات المقروءة");
  };

  // دالة لتنسيق التاريخ بالعربية
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-full">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl">الإشعارات</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={markAllAsRead} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4" />
              تحديد الكل كمقروء
            </Button>
            <Button 
              onClick={() => setShowSettings(!showSettings)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              الإعدادات
            </Button>
          </div>
        </CardHeader>

        {showSettings && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">إعدادات الإشعارات</h3>
              <ChevronUp 
                className="h-4 w-4 cursor-pointer" 
                onClick={() => setShowSettings(false)} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="appointments" 
                  checked={notificationSettings.appointments}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, appointments: checked})}
                />
                <Label htmlFor="appointments">مواعيد جديدة</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="reminders" 
                  checked={notificationSettings.reminders}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, reminders: checked})}
                />
                <Label htmlFor="reminders">تذكيرات</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="confirmations" 
                  checked={notificationSettings.confirmations}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, confirmations: checked})}
                />
                <Label htmlFor="confirmations">تأكيدات</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch 
                  id="cancellations" 
                  checked={notificationSettings.cancellations}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, cancellations: checked})}
                />
                <Label htmlFor="cancellations">إلغاءات</Label>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-b">
          <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as "all" | "unread")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                الكل
                <Badge variant="outline" className="mr-1 py-0 px-1 h-5 text-xs">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-1">
                غير المقروء
                <Badge variant="outline" className="mr-1 py-0 px-1 h-5 text-xs">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 transition-colors ${n.read ? "bg-white" : "bg-blue-50"}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={
                            n.type === "appointment" ? "bg-blue-100 text-blue-800" :
                            n.type === "confirmation" ? "bg-green-100 text-green-800" :
                            n.type === "cancellation" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {n.type === "appointment" ? "موعد" :
                           n.type === "confirmation" ? "تأكيد" :
                           n.type === "cancellation" ? "إلغاء" : "تذكير"}
                        </Badge>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="font-medium mb-1">{n.message}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{formatDate(n.date)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{n.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleRead(n.id)}
                        className="h-8 w-8"
                        title={n.read ? "وضع غير مقروء" : "وضع مقروء"}
                      >
                        {n.read ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteNotification(n.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {notifications.some(n => n.read) && (
          <CardFooter className="flex justify-center p-4 border-t">
            <Button 
              onClick={clearAllRead} 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              حذف الإشعارات المقروءة
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}