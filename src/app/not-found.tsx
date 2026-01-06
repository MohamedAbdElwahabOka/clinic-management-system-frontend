'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Calendar, Building2, Search, ArrowRight, Stethoscope, Pill, Activity, Dna, FileHeart, FileText, User } from 'lucide-react';
import './globals.css';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { performSearch, groupResultsByCategory, SearchItem } from '@/lib/search-service';

export default function RootNotFound() {
    const pathname = usePathname();
    const router = useRouter();

    // Detect locale from URL, default to 'ar'
    let locale = 'ar';
    if (pathname?.startsWith('/en')) {
        locale = 'en';
    } else if (pathname?.startsWith('/de')) {
        locale = 'de';
    }

    const isRtl = locale === 'ar';
    const dir = isRtl ? 'rtl' : 'ltr';

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    // Search Effect
    useEffect(() => {
        if (searchQuery.trim() === "" || searchQuery.trim().length < 2) {
            setFilteredItems([]);
        } else {
            const results = performSearch(searchQuery, 10);
            setFilteredItems(results);
        }
    }, [searchQuery]);

    // Handle Click Outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSelect = (href: string) => {
        router.push(href);
        setShowSearchResults(false);
        setSearchQuery("");
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Patients': return <User className="h-4 w-4" />;
            case 'Appointments': return <Calendar className="h-4 w-4" />;
            case 'Clinics': return <Building2 className="h-4 w-4" />;
            case 'Staff': return <Users className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const groupedResults = groupResultsByCategory(filteredItems);

    // Translations for all 3 languages
    const dictionary = {
        ar: {
            heading: "الصفحة غير موجودة",
            description: "عذرًا، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.",
            backHome: "العودة إلى لوحة التحكم",
            contactSupport: "اتصل بالدعم",
            searchPlaceholder: "ابحث عما تحتاج...",
            suggestedPages: "صفحات مقترحة",
            helpText: "إليك بعض الروابط المفيدة بدلاً من ذلك",
            dashboard: "لوحة التحكم",
            patients: "المرضى",
            appointments: "المواعيد",
            clinics: "العيادات",
            visitPage: "زيارة الصفحة"
        },
        en: {
            heading: "Page Not Found",
            description: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.",
            backHome: "Back to Dashboard",
            contactSupport: "Contact Support",
            searchPlaceholder: "Search for what you need...",
            suggestedPages: "Suggested Pages",
            helpText: "Here are some helpful links instead",
            dashboard: "Dashboard",
            patients: "Patients",
            appointments: "Appointments",
            clinics: "Clinics",
            visitPage: "Visit page"
        },
        de: {
            heading: "Seite nicht gefunden",
            description: "Entschuldigung, wir konnten die gesuchte Seite nicht finden. Sie wurde möglicherweise verschoben oder gelöscht.",
            backHome: "Zurück zum Dashboard",
            contactSupport: "Support kontaktieren",
            searchPlaceholder: "Suche nach...",
            suggestedPages: "Vorgeschlagene Seiten",
            helpText: "Hier sind einige hilfreiche Links",
            dashboard: "Dashboard",
            patients: "Patienten",
            appointments: "Termine",
            clinics: "Kliniken",
            visitPage: "Seite besuchen"
        }
    };

    const t = dictionary[locale as keyof typeof dictionary];

    const suggestedLinks = [
        {
            href: `/${locale}/dashboard`,
            icon: Home,
            label: t.dashboard,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
        },
        {
            href: `/${locale}/patients`,
            icon: Users,
            label: t.patients,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
        },
        {
            href: `/${locale}/appointments`,
            icon: Calendar,
            label: t.appointments,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
        },
        {
            href: `/${locale}/clinics`,
            icon: Building2,
            label: t.clinics,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20',
        },
    ];

    // Floating background icons configuration
    const floatingIcons = [
        { Icon: Stethoscope, delay: 0, x: -100, y: -50, color: 'text-blue-400' },
        { Icon: Pill, delay: 2, x: 120, y: -80, color: 'text-green-400' },
        { Icon: Dna, delay: 4, x: -80, y: 100, color: 'text-purple-400' },
        { Icon: Activity, delay: 1, x: 100, y: 60, color: 'text-red-400' },
        { Icon: FileHeart, delay: 3, x: 0, y: -120, color: 'text-pink-400' },
    ];

    return (
        <html lang={locale} dir={dir}>
            <head>
                <link rel="icon" type="image/x-icon" href="/logo/logo.svg" />
                <title>{`404 - ${t.heading}`}</title>
            </head>
            <body className="h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20">
                <div className="h-full w-full relative overflow-hidden bg-gradient-to-b from-background to-background/50 flex items-center justify-center p-4">

                    {/* Background Floating Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {floatingIcons.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`absolute left-1/2 top-1/2 ${item.color} opacity-20 dark:opacity-10`}
                                initial={{ x: item.x, y: item.y, scale: 0.8 }}
                                animate={{
                                    y: [item.y - 20, item.y + 20, item.y - 20],
                                    rotate: [0, 10, -10, 0],
                                    scale: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 5 + index,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: item.delay
                                }}
                            >
                                <item.Icon size={120} strokeWidth={1} />
                            </motion.div>
                        ))}
                        {/* Grid Pattern Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888812_1px,transparent_1px),linear-gradient(to_bottom,#88888812_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    </div>

                    <div className="max-w-7xl w-full relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                        {/* Left Side: Creative 404 Visuals */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative mb-8 text-center flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center gap-4 sm:gap-6">
                                    {/* Digit 4 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -50, rotate: -10 }}
                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                        whileHover={{ scale: 1.2, rotate: 5, color: '#3b82f6' }}
                                        className="relative group cursor-default"
                                    >
                                        <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500/80 to-blue-500/10 stroke-text select-none z-10 relative transition-colors duration-300">
                                            4
                                        </h1>
                                        <h1 className="absolute inset-0 text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-blue-500/20 blur-2xl select-none z-0">
                                            4
                                        </h1>
                                    </motion.div>

                                    {/* Digit 0 - Acting as a portal/pulse */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                                        whileHover={{ scale: 1.1, rotate: 180 }}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="relative flex items-center justify-center">
                                            <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-purple-500/80 to-purple-500/10 stroke-text select-none z-10">
                                                0
                                            </h1>
                                            {/* Inner decorative ring */}
                                            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full scale-75 animate-pulse"></div>

                                            <h1 className="absolute inset-0 text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-purple-500/20 blur-2xl select-none z-0">
                                                0
                                            </h1>
                                        </div>
                                    </motion.div>

                                    {/* Digit 4 */}
                                    <motion.div
                                        initial={{ opacity: 0, y: -50, rotate: 10 }}
                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
                                        whileHover={{ scale: 1.2, rotate: -5, color: '#ec4899' }}
                                        className="relative group cursor-default"
                                    >
                                        <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-pink-500/80 to-pink-500/10 stroke-text select-none z-10 transition-colors duration-300">
                                            4
                                        </h1>
                                        <h1 className="absolute inset-0 text-[8rem] sm:text-[10rem] lg:text-[12rem] font-black leading-none text-pink-500/20 blur-2xl select-none z-0">
                                            4
                                        </h1>
                                    </motion.div>
                                </div>

                                {/* ECG/Heartbeat Line Animation */}
                                <div className="relative w-64 h-24 -mt-6 sm:-mt-10 pointer-events-none opacity-80 mix-blend-multiply dark:mix-blend-screen">
                                    <svg viewBox="0 0 500 150" className="w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                        <motion.path
                                            d="M0,75 L50,75 L60,40 L80,110 L100,20 L120,130 L140,75 L500,75"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-primary"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Content & Actions */}
                        <div className="flex-1 max-w-lg w-full flex flex-col items-center lg:items-start text-center lg:text-start space-y-8">

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">
                                    {t.heading}
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    {t.description}
                                </p>
                            </motion.div>

                            {/* Search Bar Container */}
                            <motion.div
                                ref={searchRef}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="w-full relative z-50"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                                    <div className="relative flex items-center bg-card border border-border/50 rounded-xl px-4 py-3 shadow-sm">
                                        <Search className="w-5 h-5 text-muted-foreground mr-3" />
                                        <input
                                            type="text"
                                            placeholder={t.searchPlaceholder}
                                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setShowSearchResults(true)}
                                        />
                                    </div>
                                </div>

                                {/* Search Results Dropdown */}
                                <AnimatePresence>
                                    {showSearchResults && searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 max-h-96 overflow-y-auto overflow-x-hidden custom-scrollbar"
                                        >
                                            {filteredItems.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No results found
                                                </div>
                                            ) : (
                                                Object.entries(groupedResults).map(([category, items]) => (
                                                    <div key={category} className="border-b border-border/50 last:border-0">
                                                        <div className="px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase sticky top-0 backdrop-blur-sm z-10">
                                                            {category} ({items.length})
                                                        </div>
                                                        {items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => handleSearchSelect(item.href)}
                                                                className="p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b border-border/10 last:border-0 group"
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                                        {getCategoryIcon(item.category)}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="font-medium text-foreground text-sm truncate">
                                                                            {item.title}
                                                                        </div>
                                                                        {item.description && (
                                                                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                                                                {item.description}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Suggested Links Grid */}
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {suggestedLinks.map((link, i) => {
                                    const Icon = link.icon;
                                    return (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                        >
                                            <Link href={link.href} className="block h-full">
                                                <div className={`
                          h-full flex items-center gap-3 rounded-xl border border-border/50
                          bg-card/30 hover:bg-card/80 backdrop-blur-sm p-4
                          transition-all duration-300 hover:shadow-md hover:scale-[1.02] group
                        `}>
                                                    <div className={`
                            w-10 h-10 rounded-lg ${link.bgColor} flex items-center justify-center shrink-0
                          `}>
                                                        <Icon className={`w-5 h-5 ${link.color}`} />
                                                    </div>

                                                    <div className="text-left flex-1 min-w-0">
                                                        <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                                                            {link.label}
                                                        </h3>
                                                        <div className="flex items-center text-[10px] text-muted-foreground">
                                                            <span className="truncate">{t.visitPage}</span>
                                                            <ArrowRight className={`w-3 h-3 ml-1 opacity-0 transition-all duration-300 ${isRtl ? 'translate-x-2 group-hover:translate-x-0 group-hover:rotate-180' : '-translate-x-2 group-hover:translate-x-0'} group-hover:opacity-100 `} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Bottom Actions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4"
                            >
                                <Link href={`/${locale}/dashboard`}>
                                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold">
                                        <Home className="w-4 h-4 mr-2" />
                                        {t.backHome}
                                    </Button>
                                </Link>
                                <Link href={`/${locale}/support`}>
                                    <Button size="lg" variant="outline" className="rounded-full px-8 hover:bg-accent font-semibold">
                                        {t.contactSupport}
                                    </Button>
                                </Link>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
