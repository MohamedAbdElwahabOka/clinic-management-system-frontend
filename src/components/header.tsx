"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalSwitcher from "@/components/local-switcher";
import { Bell, Sun, Moon, Search, X, Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation
// تأكد من مسار Link الصحيح حسب إعدادات مشروعك
import { Link } from '@/i18n/navigation'; 

const initialNotifications = [
  { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", read: false },
  { id: 2, message: "تم تأكيد الحجز الخاص بك", read: true },
  { id: 3, message: "تم إلغاء الموعد بناءً على طلبك", read: false },
];

// قائمة الصفحات القابلة للبحث (يمكنك زيادتها لاحقاً لتشمل أسماء مرضى من الـ API)
const searchableItems = [
  { title: "Dashboard", href: "/dashboard", category: "General" },
  { title: "Patients", href: "/patients", category: "Main" },
  { title: "Appointments", href: "/appointments", category: "Main" },
  { title: "Medical Records", href: "/records", category: "Main" },
  { title: "Financials", href: "/financials", category: "Main" },
  { title: "Clinics", href: "/clinics", category: "Main" },
  { title: "Settings", href: "/settings", category: "System" },
  { title: "Support", href: "/support", category: "System" },
];

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState(searchableItems);

  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = useTranslations("Header");
  const tSidebar = useTranslations("Sidebar"); // لترجمة نتائج البحث

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // Handle click outside for Notifications and Search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems([]);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      // هنا بنفلتر حسب الاسم
      const results = searchableItems.filter(item => 
        tSidebar(item.title).toLowerCase().includes(lowerQuery) || 
        item.title.toLowerCase().includes(lowerQuery)
      );
      setFilteredItems(results);
    }
  }, [searchQuery, tSidebar]);

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

  const handleSearchSelect = (href: string) => {
    router.push(href);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  return (
    <div
      dir={dir}
      className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3 relative z-40"
    >
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {t("Dashboard")}
        </h1>
      </div>

      {/* Search Bar Container */}
      <div className="relative w-full max-w-md mx-4 hidden md:block" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder={t("Search")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            dir={dir}
          />
          <Search
            className={`absolute top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500 ${
              dir === "rtl" ? "left-3" : "left-3"
            }`}
          />
          {searchQuery && (
            <button 
                onClick={() => setSearchQuery('')}
                className={`absolute top-2.5 text-gray-400 hover:text-gray-600 ${dir === "rtl" ? "left-10" : "right-3"}`}
            >
                <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchQuery && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
            {filteredItems.length > 0 ? (
              <ul>
                {filteredItems.map((item, index) => (
                  <li 
                    key={index}
                    onClick={() => handleSearchSelect(item.href)}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 flex items-center justify-between group"
                  >
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{tSidebar(item.title)}</span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-400 group-hover:text-blue-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                لا توجد نتائج لـ "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className={`flex items-center space-x-3 ${
          dir === "rtl" ? "rtl:space-x-reverse" : ""
        }`}
      >
        <div className="hidden sm:block">
            <LocalSwitcher />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 bg-red-500 rounded-full text-white text-[10px] font-bold ring-2 ring-white dark:ring-gray-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popup */}
          {showNotifications && (
            <div
              ref={popupRef}
              className={`absolute mt-3 w-80 max-h-[30rem] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 ${
                dir === "rtl" ? "left-0" : "right-0"
              }`}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">الإشعارات</h3>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        قراءة الكل
                      </button>
                    )}
                    <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                    <X className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center text-gray-500">
                    <Bell className="h-8 w-8 mb-2 opacity-20" />
                    <p>لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`relative flex justify-between items-start px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        !n.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex-1 ml-2 rtl:mr-2">
                        <p className={`text-sm ${!n.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                            {n.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">منذ 2 دقيقة</span>
                      </div>
                      {!n.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n.id);
                          }}
                          title="تمييز كمقروء"
                          className="mt-0.5 p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                        >
                          <span className="h-2 w-2 rounded-full bg-blue-500 block"></span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="تبديل الوضع الليلي"
        >
          {darkMode ? (
            <Moon className="h-6 w-6 text-gray-300" />
          ) : (
            <Sun className="h-6 w-6 text-yellow-500" />
          )}
        </button>
      </div>
    </div>
  );
}














// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useTranslations, useLocale } from "next-intl";
// import LocalSwitcher from "@/components/local-switcher";
// import { Bell, Sun, Moon, Search, X, Check } from "lucide-react";

// const initialNotifications = [
//   { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", read: false },
//   { id: 2, message: "تم تأكيد الحجز الخاص بك", read: true },
//   { id: 3, message: "تم إلغاء الموعد بناءً على طلبك", read: false },
// ];

// export default function Header() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState(initialNotifications);

//   const popupRef = useRef<HTMLDivElement>(null);
//   const locale = useLocale();
//   const dir = locale === "ar" ? "rtl" : "ltr";
//   const t = useTranslations("Header");

//   // عدد الإشعارات غير المقروءة
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   useEffect(() => {
//     if (localStorage.getItem("theme") === "dark") {
//       document.documentElement.classList.add("dark");
//       setDarkMode(true);
//     }
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node)
//       ) {
//         setShowNotifications(false);
//       }
//     }
//     if (showNotifications) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showNotifications]);

//   const toggleDarkMode = () => {
//     if (darkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }
//     setDarkMode(!darkMode);
//   };

//   const markAsRead = (id: number) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   return (
//     <div
//       dir={dir}
//       className="flex items-center justify-between bg-white dark:bg-gray-900 shadow-md px-4 py-2 relative z-50"
//     >
//       <div className="flex items-center">
//         <h1 className="ml-1 text-md font-semibold text-gray-800 dark:text-gray-200">
//           {t("Dashboard")}
//         </h1>
//       </div>

//       <div className="relative w-64 hidden md:block">
//         <input
//           type="text"
//           placeholder={t("Search")}
//           className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md py-1.5 px-3 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           dir={dir}
//         />
//         <Search
//           className={`absolute top-2 h-4 w-4 text-gray-400 dark:text-gray-500 ${
//             dir === "rtl" ? "right-2" : "left-2"
//           }`}
//         />
//       </div>

//       <div
//         className={`flex items-center space-x-3 ${
//           dir === "rtl" ? "rtl:space-x-reverse" : ""
//         }`}
//       >
//         <div className="p-2">
//           <LocalSwitcher />
//         </div>

//         {/* أيقونة الجرس مع عداد إشعارات موحد */}
//         <div className="relative">
//           <div
//             className="relative border border-blue-500 p-1.5 rounded-full cursor-pointer"
//             onClick={() => setShowNotifications(!showNotifications)}
//           >
//             <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 rounded-full text-white text-[12px] font-semibold select-none">
//                 {unreadCount}
//               </span>
//             )}
//           </div>

//           {/* بوب أب الإشعارات */}
//           {showNotifications && (
//             <div
//               ref={popupRef}
//               className={`absolute mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg text-gray-800 dark:text-gray-200 ${
//                 dir === "rtl" ? "left-0" : "right-0"
//               }`}
//             >
//               <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
//                 <h3 className="font-semibold">الإشعارات</h3>
//                 <button
//                   onClick={() => setShowNotifications(false)}
//                   className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
//                   aria-label="إغلاق"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>

//               {notifications.length === 0 ? (
//                 <p className="p-4 text-center text-gray-500">لا توجد إشعارات</p>
//               ) : (
//                 <>
//                   <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
//                     {unreadCount > 0 && (
//                       <button
//                         onClick={markAllAsRead}
//                         className="text-sm text-blue-600 hover:underline"
//                       >
//                         تمييز الكل كمقروء
//                       </button>
//                     )}
//                   </div>
//                   <ul>
//                     {notifications.map((n) => (
//                       <li
//                         key={n.id}
//                         className={`flex justify-between items-center px-4 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                           n.read
//                             ? "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
//                             : "bg-blue-50 dark:bg-blue-900 font-semibold"
//                         }`}
//                       >
//                         <span>{n.message}</span>
//                         {!n.read && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               markAsRead(n.id);
//                             }}
//                             title="تمييز كمقروء"
//                             className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
//                           >
//                             <Check className="h-4 w-4 text-green-600" />
//                           </button>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={toggleDarkMode}
//           className="flex items-center justify-center rounded-full border border-blue-500 p-1.5"
//           aria-label="تبديل الوضع الليلي"
//         >
//           {darkMode ? (
//             <Moon className="h-5 w-5 text-gray-300" />
//           ) : (
//             <Sun className="h-5 w-5 text-yellow-400" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
