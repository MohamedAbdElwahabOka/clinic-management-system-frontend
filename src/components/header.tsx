"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalSwitcher from "@/components/local-switcher"; 
import MobileNav from "@/components/layout/mobile-nav"; 
import { Bell, Sun, Moon, Search, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const initialNotifications = [
  { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", read: false },
  { id: 2, message: "تم تأكيد الحجز الخاص بك", read: true },
];

const searchableItems = [
  { title: "Dashboard", href: "/dashboard", category: "General" },
  { title: "Patients", href: "/patients", category: "Main" },
  { title: "Appointments", href: "/appointments", category: "Main" },
];

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState(searchableItems);
  
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const t = useTranslations("Header");
  const tSidebar = useTranslations("Sidebar");

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems([]);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
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

  const handleSearchSelect = (href: string) => {
    router.push(href);
    setShowSearchResults(false);
    setSearchQuery("");
    setMobileSearchOpen(false);
  };

  return (
    <header
      dir={dir}
      className="sticky top-0 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-2 sm:px-4 py-3 z-40 h-[64px]"
    >
      <div className="flex items-center justify-between h-full">
        
        {/* =======================
            MOBILE SEARCH OVERLAY
            ======================= */}
        {mobileSearchOpen ? (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-[60] flex items-center px-2 w-full h-full" ref={searchRef}>
            <button 
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              <ArrowLeft className={`h-6 w-6 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
            <input
              autoFocus
              type="text"
              className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 px-4 mx-2 text-gray-900 dark:text-gray-100 outline-none"
              placeholder={t("Search")}
              value={searchQuery}
              onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
              }}
            />
             {searchQuery && showSearchResults && (
                <div className="absolute top-[64px] left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 max-h-[calc(100vh-64px)] overflow-y-auto z-[60]">
                   {filteredItems.map((item, i) => (
                      <div key={i} onClick={() => handleSearchSelect(item.href)} className="p-4 border-b dark:border-gray-700 flex justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                         <span className="dark:text-white">{tSidebar(item.title)}</span>
                      </div>
                   ))}
                </div>
             )}
          </div>
        ) : (
          <>
            {/* 1. Left Section: Mobile Menu + Logo */}
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <MobileNav />
              </div>
              {/* إظهار اللوجو/العنوان دائماً حتى في الموبايل طالما مفيش بحث في النص */}
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {t("Dashboard")}
              </h1>
            </div>

            {/* 2. Middle Section: Desktop Search Input Only (Hidden on Mobile) */}
            <div className="flex-1 flex justify-center px-4">
                {/* --- تم حذف زر البحث الذي كان هنا في المنتصف --- */}

                {/* Desktop Dropdown Input */}
                <div className="hidden md:block w-full max-w-md relative" ref={searchRef}>
                   <input
                      type="text"
                      className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-[#0582EB] outline-none transition-all"
                      placeholder={t("Search")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearchResults(true)}
                    />
                   <Search className={`absolute top-2.5 h-5 w-5 text-gray-400 ${dir === "rtl" ? "right-3" : "left-3"}`} />
                   
                   {showSearchResults && searchQuery && (
                      <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                        {filteredItems.map((item, i) => (
                           <div key={i} onClick={() => handleSearchSelect(item.href)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 dark:text-white last:border-0">
                              {tSidebar(item.title)}
                           </div>
                        ))}
                      </div>
                   )}
                </div>
            </div>

            {/* 3. Right Section: Actions */}
            <div className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              
              {/* === زر البحث للموبايل (تم نقله هنا) === */}
              <button 
                  onClick={() => setMobileSearchOpen(true)}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                  <Search className="h-5 w-5" />
              </button>

              <div className="flex-shrink-0">
                 <LocalSwitcher />
              </div>

              <div className="relative flex-shrink-0">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
                 {showNotifications && (
                    <div ref={popupRef} className={`absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg z-50 p-0 ${dir === "rtl" ? "left-0" : "right-0"}`}>
                       <div className="p-3 border-b border-gray-100 dark:border-gray-700 font-semibold dark:text-white">الإشعارات</div>
                       <ul className="max-h-64 overflow-y-auto">
                          {notifications.map((n) => (
                            <li key={n.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 text-sm dark:text-gray-200 last:border-0">
                              {n.message}
                            </li>
                          ))}
                       </ul>
                    </div>
                 )}
              </div>

              <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
                {darkMode ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-yellow-500" />}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}