"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  MessageCircle,
  Check,
  Trash2,
  Clock,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Info,
  MoreHorizontal,
  Search,
  User
} from "lucide-react";

// --- Types ---
type NotificationType = "system" | "message" | "alert" | "success";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string; // e.g., "Just now", "5m ago"
  isRead: boolean;
  sender?: {
    name: string;
    role: "Doctor" | "Nurse" | "System";
    image?: string;
  };
  actionRequired?: boolean; // لو محتاج رد فعل زي "تأكيد"
}

// --- Mock Data ---
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "message",
    title: "رسالة من د. نبيل",
    description: "من فضلك دخلي المريض التالي بسرعة عشان عندي عملية.",
    time: "الآن",
    isRead: false,
    sender: { name: "د. نبيل", role: "Doctor" },
    actionRequired: true
  },
  {
    id: 2,
    type: "system",
    title: "مريض جديد في الانتظار",
    description: "قام المريض 'أحمد محمد' بتسجيل الدخول عبر الكشك الذكي.",
    time: "منذ 5 د",
    isRead: false,
    sender: { name: "System", role: "System" }
  },
  {
    id: 3,
    type: "alert",
    title: "تنبيه مخزون",
    description: "كمية 'القفازات الطبية' في عيادة الأسنان قاربت على النفاد.",
    time: "منذ 20 د",
    isRead: true,
    sender: { name: "المخزن", role: "System" },
    actionRequired: true
  },
  {
    id: 4,
    type: "message",
    title: "رسالة من د. سارة",
    description: "أنا خلصت الكشف، هل فيه حالات تانية؟",
    time: "منذ 1 س",
    isRead: true,
    sender: { name: "د. سارة", role: "Doctor" }
  },
  {
    id: 5,
    type: "success",
    title: "تم دفع الفاتورة",
    description: "تم تحصيل مبلغ 500 جنيه من المريض 'خالد علي'.",
    time: "منذ 2 س",
    isRead: true,
    sender: { name: "الحسابات", role: "System" }
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "messages" | "system">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Logic ---
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      // Search Filter
      const matchesSearch = notif.title.includes(searchQuery) || notif.description.includes(searchQuery);

      // Tab Filter
      if (filter === "all") return matchesSearch;
      if (filter === "unread") return matchesSearch && !notif.isRead;
      if (filter === "messages") return matchesSearch && notif.type === "message";
      if (filter === "system") return matchesSearch && (notif.type === "system" || notif.type === "alert" || notif.type === "success");

      return matchesSearch;
    });
  }, [notifications, filter, searchQuery]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Helper to get Icon based on type ---
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "message": return <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "alert": return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "success": return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default: return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  // --- Helper for Background Color ---
  const getBgColor = (type: NotificationType, isRead: boolean) => {
    if (isRead) return "bg-white dark:bg-gray-800";
    switch (type) {
      case "message": return "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/50";
      case "alert": return "bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/50";
      default: return "bg-gray-50 border-gray-100 dark:bg-gray-900 dark:border-gray-800";
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 font-sans text-gray-900 dark:text-white">

      {/* 1. Header & Controls */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              مركز الإشعارات
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              لديك <span className="font-bold text-blue-600 dark:text-blue-400">{notifications.filter(n => !n.isRead).length}</span> إشعارات غير مقروءة
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 px-4 py-2 rounded-xl transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              تحديد الكل كمقروء
            </button>
          </div>
        </div>

        {/* 2. Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
          <div className="flex gap-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'unread', label: 'غير مقروء' },
              { id: 'messages', label: 'الرسائل' },
              { id: 'system', label: 'النظام' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="بحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search className="absolute top-2.5 right-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 3. Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`relative group p-4 rounded-xl border transition-all duration-200 hover:shadow-md dark:hover:shadow-none ${!notif.isRead ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-sm' : 'border-gray-200 dark:border-gray-700'
                  } ${getBgColor(notif.type, notif.isRead)}`}
              >
                <div className="flex items-start gap-4">

                  {/* Icon / Avatar */}
                  <div className="flex-shrink-0">
                    {notif.type === 'message' ? (
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
                        {/* Avatar Simulation */}
                        <img
                          src={`https://ui-avatars.com/api/?name=${notif.sender?.name}&background=0D8ABC&color=fff`}
                          alt={notif.sender?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${notif.type === 'alert' ? 'bg-amber-100 dark:bg-amber-900/20' :
                          notif.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                        {getIcon(notif.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </span>
                    </div>

                    <p className={`text-sm mt-1 line-clamp-2 ${!notif.isRead ? 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      {notif.description}
                    </p>

                    {/* Action Buttons (Contextual) */}
                    <div className="mt-3 flex gap-2">
                      {notif.type === 'message' && (
                        <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          رد سريع
                        </button>
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          تحديد كمقروء
                        </button>
                      )}

                      {/* زر الحذف بيظهر بس لما تقف على الكارد */}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-xs text-red-500 dark:text-red-400 px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 mr-auto"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">لا توجد إشعارات حالياً</p>
              <p className="text-sm">أنت مطلع على آخر المستجدات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}