"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalSwitcher from "@/components/local-switcher";
import { Bell, Sun, Moon, Search, X, Check } from "lucide-react";

const initialNotifications = [
  { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", read: false },
  { id: 2, message: "تم تأكيد الحجز الخاص بك", read: true },
  { id: 3, message: "تم إلغاء الموعد بناءً على طلبك", read: false },
];

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const popupRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = useTranslations("Header");

  // عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div
      dir={dir}
      className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-md px-4 py-2 relative z-50"
    >
      <div className="flex items-center">
        <h1 className="ml-1 text-md font-semibold text-gray-800 dark:text-gray-200">
          {t("Dashboard")}
        </h1>
      </div>

      <div className="relative w-64 hidden md:block">
        <input
          type="text"
          placeholder={t("Search")}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md py-1.5 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir={dir}
        />
        <Search
          className={`absolute top-2 h-4 w-4 text-gray-400 dark:text-gray-500 ${
            dir === "rtl" ? "right-2" : "left-2"
          }`}
        />
      </div>

      <div
        className={`flex items-center space-x-3 ${
          dir === "rtl" ? "rtl:space-x-reverse" : ""
        }`}
      >
        <div className="p-2">
          <LocalSwitcher />
        </div>

        {/* أيقونة الجرس مع عداد إشعارات موحد */}
        <div className="relative">
          <div
            className="relative border border-blue-500 p-1.5 rounded-full cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 rounded-full text-white text-[12px] font-semibold select-none">
                {unreadCount}
              </span>
            )}
          </div>

          {/* بوب أب الإشعارات */}
          {showNotifications && (
            <div
              ref={popupRef}
              className={`absolute mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg text-gray-800 dark:text-gray-200 ${
                dir === "rtl" ? "left-0" : "right-0"
              }`}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">الإشعارات</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  aria-label="إغلاق"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-center text-gray-500">لا توجد إشعارات</p>
              ) : (
                <>
                  <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        تمييز الكل كمقروء
                      </button>
                    )}
                  </div>
                  <ul>
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`flex justify-between items-center px-4 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          n.read
                            ? "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                            : "bg-blue-50 dark:bg-blue-900 font-semibold"
                        }`}
                      >
                        <span>{n.message}</span>
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                            title="تمييز كمقروء"
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center rounded-full border border-blue-500 p-1.5"
          aria-label="تبديل الوضع الليلي"
        >
          {darkMode ? (
            <Moon className="h-5 w-5 text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </button>
      </div>
    </div>
  );
}
