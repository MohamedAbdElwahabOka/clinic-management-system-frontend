"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalSwitcher from "@/components/local-switcher";
import MobileNav from "@/components/layout/mobile-nav";
import { Bell, Sun, Moon, Search, ArrowLeft, User, Calendar, Building2, Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { performSearch, groupResultsByCategory, SearchItem } from "@/lib/search-service";

const initialNotifications = [
  { id: 1, message: "موعدك مع د. أحمد غدًا الساعة 10:00 صباحًا", read: false },
  { id: 2, message: "تم تأكيد الحجز الخاص بك", read: true },
];

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0); // For keyboard navigation

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
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "" || searchQuery.trim().length < 2) {
      setFilteredItems([]);
      setSelectedIndex(0);
    } else {
      const results = performSearch(searchQuery, 10);
      setFilteredItems(results);
      setSelectedIndex(0); // Reset selection when results change
    }
  }, [searchQuery]);

  // ✅ 4) Keyboard Navigation Handler (↑ ↓ Enter Esc)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchResults || filteredItems.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSearchSelect(filteredItems[selectedIndex].href);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSearchQuery("");
        break;
    }
  };

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

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Pages':
      case 'Settings':
        return <FileText className="h-4 w-4" />;
      case 'Patients':
        return <User className="h-4 w-4" />;
      case 'Appointments':
        return <Calendar className="h-4 w-4" />;
      case 'Clinics':
        return <Building2 className="h-4 w-4" />;
      case 'Staff':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const groupedResults = groupResultsByCategory(filteredItems);

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
          <div
            className="absolute inset-0 bg-white dark:bg-gray-900 z-[60] flex items-center px-2 w-full h-full"
            ref={searchRef}
          >
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              <ArrowLeft
                className={`h-6 w-6 ${dir === "rtl" ? "rotate-180" : ""}`}
              />
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
              onKeyDown={handleKeyDown}
            />
            {searchQuery && showSearchResults && (
              <div className="absolute top-[64px] left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 max-h-[calc(100vh-64px)] overflow-y-auto z-[60]">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {t("No results found")}
                  </div>
                ) : (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        {category} ({items.length})
                      </div>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSearchSelect(item.href)}
                          className="p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-blue-600 dark:text-blue-400 mt-1">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {item.title}
                              </div>
                              {item.description && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                  {item.description}
                                </div>
                              )}
                              {item.metadata && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {item.metadata.phone && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      📞 {item.metadata.phone}
                                    </span>
                                  )}
                                  {item.metadata.date && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      📅 {item.metadata.date}
                                    </span>
                                  )}
                                  {item.metadata.status && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                      {item.metadata.status}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
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
              <div
                className="hidden md:block w-full max-w-md relative"
                ref={searchRef}
              >
                <input
                  type="text"
                  className={`w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg py-2 px-4 focus:ring-2 focus:ring-[#0582EB] outline-none transition-all ${dir === "rtl" ? "pl-10 pr-4" : "pl-10 pr-4"
                    }`}
                  placeholder={t("Search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                />
                <Search
                  className={`absolute top-2.5 h-5 w-5 text-gray-400 ${dir === "rtl" ? "left-3" : "left-3"
                    }`}
                />

                {showSearchResults && searchQuery && (
                  <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No results found
                      </div>
                    ) : (
                      Object.entries(groupedResults).map(([category, items]) => (
                        <div key={category} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                            {category} ({items.length})
                          </div>
                          {items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleSearchSelect(item.href)}
                              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                              <div className="flex items-start gap-2">
                                <div className="text-blue-600 dark:text-blue-400 mt-0.5">
                                  {getCategoryIcon(item.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                    {item.title}
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                      {item.description}
                                    </div>
                                  )}
                                  {item.metadata && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {item.metadata.phone && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          📞 {item.metadata.phone}
                                        </span>
                                      )}
                                      {item.metadata.time && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          🕐 {item.metadata.time}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Right Section: Actions */}
            <div
              className={`flex items-center gap-1 sm:gap-2 flex-shrink-0 ${dir === "rtl" ? "flex-row-reverse" : ""
                }`}
            >
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
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-blue-400" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div
                    ref={popupRef}
                    className={`absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg z-50 p-0 ${dir === "rtl" ? "left-0" : "right-0"
                      }`}
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 font-semibold dark:text-white">
                      الإشعارات
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 text-sm dark:text-gray-200 last:border-0"
                        >
                          {n.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
              >
                {darkMode ? (
                  <Moon className="h-5 w-5 text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
