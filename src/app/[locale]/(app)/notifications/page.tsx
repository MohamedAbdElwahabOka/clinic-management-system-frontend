"use client";

import React, { useState, useCallback } from "react";
import { useLocale } from "next-intl"; // استيراد هوك اللغة
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Trash2, CheckCircle, Settings, ChevronUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Notification, LocalizedText } from "@/types/index";
import { dummyNotifications } from "@/lib/dummy-data";

// ============================================
// UI Dictionary - قاموس النصوص الثابتة
// ============================================
const UI_TEXT = {
  ar: {
    title: "الإشعارات",
    markAllRead: "تحديد الكل كمقروء",
    settings: "الإعدادات",
    settingsTitle: "إعدادات الإشعارات",
    all: "الكل",
    unread: "غير المقروء",
    noNotifications: "لا توجد إشعارات",
    clearRead: "حذف الإشعارات المقروءة",
    types: {
      appointment: "موعد",
      confirmation: "تأكيد",
      cancellation: "إلغاء",
      reminder: "تذكير"
    },
    config: {
      newAppt: "مواعيد جديدة",
      reminders: "تذكيرات",
      confirm: "تأكيدات",
      cancel: "إلغاءات"
    },
    actions: {
      readToggleOn: "وضع مقروء",
      readToggleOff: "وضع غير مقروء",
      delete: "حذف الإشعار"
    },
    toasts: {
      allRead: "تم تحديد جميع الإشعارات كمقروءة",
      deleted: "تم حذف الإشعار",
      cleared: "تم حذف جميع الإشعارات المقروءة"
    }
  },
  en: {
    title: "Notifications",
    markAllRead: "Mark all as read",
    settings: "Settings",
    settingsTitle: "Notification Settings",
    all: "All",
    unread: "Unread",
    noNotifications: "No notifications",
    clearRead: "Clear read notifications",
    types: {
      appointment: "Appointment",
      confirmation: "Confirmation",
      cancellation: "Cancellation",
      reminder: "Reminder"
    },
    config: {
      newAppt: "New Appointments",
      reminders: "Reminders",
      confirm: "Confirmations",
      cancel: "Cancellations"
    },
    actions: {
      readToggleOn: "Mark as read",
      readToggleOff: "Mark as unread",
      delete: "Delete notification"
    },
    toasts: {
      allRead: "All notifications marked as read",
      deleted: "Notification deleted",
      cleared: "Read notifications cleared"
    }
  }
};

export default function NotificationsPage() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  // @ts-ignore
  const t = UI_TEXT[locale] || UI_TEXT['en'];

  // دالة لجلب النص المترجم من الداتا (JSONB)
  const getLocalizedText = useCallback((textObj: LocalizedText) => {
    // @ts-ignore
    return textObj[locale] || textObj['en'] || textObj['ar'] || "";
  }, [locale]);

  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    appointments: true,
    reminders: true,
    confirmations: true,
    cancellations: true,
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success(t.toasts.allRead);
  };

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success(t.toasts.deleted);
  };

  const clearAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
    toast.success(t.toasts.cleared);
  };

  // دالة لتنسيق التاريخ حسب لغة الموقع الحالية
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dateLocale = locale === 'ar' ? 'ar-SA' : (locale === 'de' ? 'de-DE' : 'en-US');
    
    return date.toLocaleDateString(dateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-full">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl">{t.title}</CardTitle>
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
              {t.markAllRead}
            </Button>
            <Button 
              onClick={() => setShowSettings(!showSettings)} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              {t.settings}
            </Button>
          </div>
        </CardHeader>

        {showSettings && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{t.settingsTitle}</h3>
              <ChevronUp 
                className="h-4 w-4 cursor-pointer" 
                onClick={() => setShowSettings(false)} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Switch 
                  id="appointments" 
                  checked={notificationSettings.appointments}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, appointments: checked})}
                />
                <Label htmlFor="appointments">{t.config.newAppt}</Label>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Switch 
                  id="reminders" 
                  checked={notificationSettings.reminders}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, reminders: checked})}
                />
                <Label htmlFor="reminders">{t.config.reminders}</Label>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Switch 
                  id="confirmations" 
                  checked={notificationSettings.confirmations}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, confirmations: checked})}
                />
                <Label htmlFor="confirmations">{t.config.confirm}</Label>
              </div>
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Switch 
                  id="cancellations" 
                  checked={notificationSettings.cancellations}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, cancellations: checked})}
                />
                <Label htmlFor="cancellations">{t.config.cancel}</Label>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-b">
          <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as "all" | "unread")} dir={isRTL ? "rtl" : "ltr"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                {t.all}
                <Badge variant="outline" className={`py-0 px-1 h-5 text-xs ${isRTL ? 'mr-1' : 'ml-1'}`}>
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-1">
                {t.unread}
                <Badge variant="outline" className={`py-0 px-1 h-5 text-xs ${isRTL ? 'mr-1' : 'ml-1'}`}>
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
              <p className="text-gray-500">{t.noNotifications}</p>
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
                          {/* ترجمة نوع الإشعار */}
                          {t.types[n.type]}
                        </Badge>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      
                      {/* استدعاء الرسالة المترجمة من JSONB */}
                      <p className="font-medium mb-1">{getLocalizedText(n.message)}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        {/* تنسيق التاريخ حسب اللغة */}
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
                        title={n.read ? t.actions.readToggleOff : t.actions.readToggleOn}
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
                        title={t.actions.delete}
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
              {t.clearRead}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}