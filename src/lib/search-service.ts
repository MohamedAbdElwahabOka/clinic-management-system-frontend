import Fuse, { FuseResult } from 'fuse.js';
import { dummyPatients, dummyAppointments, dummyClinics } from './dummy-data';
import type { Patient, Appointment } from '@/types';

// Define the search item structure
export interface SearchItem {
    id: string;
    title: string;
    description?: string;
    category: 'Pages' | 'Patients' | 'Appointments' | 'Clinics' | 'Staff' | 'Settings';
    href: string;
    keywords?: string[];
    metadata?: Record<string, any>;
    priority?: number; // For custom ranking
}

// Cache for the search engine instance
let cachedFuse: Fuse<SearchItem> | null = null;
let cachedDataHash: string | null = null;

// Static navigation pages
const navigationPages: SearchItem[] = [
    {
        id: 'nav-dashboard',
        title: 'Dashboard',
        description: 'Overview and statistics',
        category: 'Pages',
        href: '/dashboard',
        keywords: ['home', 'main', 'overview', 'stats', 'الرئيسية', 'لوحة التحكم'],
        priority: 3,
    },
    {
        id: 'nav-patients',
        title: 'Patients',
        description: 'Patient list and records',
        category: 'Pages',
        href: '/patients',
        keywords: ['patient', 'medical records', 'المرضى', 'السجلات'],
        priority: 4,
    },
    {
        id: 'nav-appointments',
        title: 'Appointments',
        description: 'Appointment management',
        category: 'Pages',
        href: '/appointments',
        keywords: ['schedule', 'booking', 'المواعيد', 'الحجوزات'],
        priority: 4,
    },
    {
        id: 'nav-queue',
        title: 'Patient Queue',
        description: 'Current patient queue',
        category: 'Pages',
        href: '/queue',
        keywords: ['waiting', 'queue', 'الطابور', 'قائمة الانتظار'],
        priority: 2,
    },
    {
        id: 'nav-checkin',
        title: 'Check-in Kiosk',
        description: 'Patient check-in system',
        category: 'Pages',
        href: '/check-in',
        keywords: ['checkin', 'arrival', 'تسجيل الوصول'],
        priority: 2,
    },
    {
        id: 'nav-assistant',
        title: 'AI Assistant',
        description: 'AI-powered medical assistant',
        category: 'Pages',
        href: '/assistant',
        keywords: ['ai', 'chatbot', 'help', 'المساعد الذكي'],
        priority: 1,
    },
    {
        id: 'nav-financials',
        title: 'Financials',
        description: 'Financial reports and ledger',
        category: 'Pages',
        href: '/financials',
        keywords: ['money', 'revenue', 'expenses', 'المالية', 'الحسابات'],
        priority: 2,
    },
    {
        id: 'nav-settings',
        title: 'Settings',
        description: 'Application settings',
        category: 'Settings',
        href: '/settings',
        keywords: ['preferences', 'config', 'الإعدادات'],
        priority: 1,
    },
    {
        id: 'nav-notifications',
        title: 'Notifications',
        description: 'View all notifications',
        category: 'Pages',
        href: '/notifications',
        keywords: ['alerts', 'messages', 'الإشعارات'],
        priority: 2,
    },
    {
        id: 'nav-clinics',
        title: 'Clinics',
        description: 'Clinic management',
        category: 'Pages',
        href: '/clinics',
        keywords: ['clinic', 'centers', 'العيادات'],
        priority: 3,
    },
];

// ✅ Dependency Injection (Production Ready)
export function buildSearchData(params?: {
    patients?: Patient[];
    appointments?: Appointment[];
    clinics?: any[];
}): SearchItem[] {
    // Use provided data or fall back to dummy data
    const patients = params?.patients || dummyPatients;
    const appointments = params?.appointments || dummyAppointments;
    const clinics = params?.clinics || dummyClinics;

    const searchItems: SearchItem[] = [...navigationPages];

    // Add patients (highest priority 👑)
    patients.forEach((patient) => {
        searchItems.push({
            id: `patient-${patient.id}`,
            title: patient.name,
            description: `Patient ID: ${patient.id}`,
            category: 'Patients',
            href: `/patients/${patient.id}`,
            keywords: [
                patient.contactPhone,
                patient.contactEmail || '',
                patient.id,
                'patient',
                'مريض',
            ],
            metadata: {
                phone: patient.contactPhone,
                id: patient.id,
                lastVisit: patient.lastVisit,
            },
            priority: 10, // Highest priority
        });
    });

    // Add appointments
    appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.dateTime);
        const dateStr = appointmentDate.toLocaleDateString();
        const timeStr = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        searchItems.push({
            id: `appointment-${appointment.id}`,
            title: `${appointment.patientName} - ${appointment.doctorName}`,
            description: `${dateStr} at ${timeStr}`,
            category: 'Appointments',
            href: `/appointments?id=${appointment.id}`,
            keywords: [
                appointment.patientName,
                appointment.doctorName,
                appointment.reason || '',
                appointment.status,
                'appointment',
                'موعد',
            ],
            metadata: {
                date: dateStr,
                time: timeStr,
                status: appointment.status,
                doctor: appointment.doctorName,
            },
            priority: 7,
        });
    });

    // Add clinics
    clinics.forEach((clinic) => {
        searchItems.push({
            id: `clinic-${clinic.id}`,
            title: clinic.name.en || clinic.name.ar,
            description: clinic.type.en || clinic.type.ar,
            category: 'Clinics',
            href: `/clinics/${clinic.id}`,
            keywords: [
                clinic.name.ar,
                clinic.name.en,
                clinic.type.ar,
                clinic.type.en,
                clinic.phone,
                'clinic',
                'عيادة',
            ],
            metadata: {
                phone: clinic.phone,
                address: clinic.address.en || clinic.address.ar,
                rating: clinic.rating,
            },
            priority: 5,
        });

        // Add clinic staff
        clinic.staff?.forEach((staff: any) => {
            searchItems.push({
                id: `staff-${staff.id}`,
                title: staff.name.en || staff.name.ar,
                description: `${staff.role.en || staff.role.ar} at ${clinic.name.en}`,
                category: 'Staff',
                href: `/clinics/${clinic.id}?tab=payroll`,
                keywords: [
                    staff.name.ar,
                    staff.name.en,
                    staff.role.ar,
                    staff.role.en,
                    staff.roleType,
                    'doctor',
                    'nurse',
                    'staff',
                    'طبيب',
                    'ممرض',
                    'موظف',
                ],
                metadata: {
                    role: staff.role.en || staff.role.ar,
                    clinic: clinic.name.en || clinic.name.ar,
                    status: staff.status,
                },
                priority: 6,
            });
        });
    });

    return searchItems;
}

// Create Fuse.js instance for fuzzy search
function createSearchEngine(searchData: SearchItem[]) {
    return new Fuse(searchData, {
        keys: [
            { name: 'title', weight: 2 },
            { name: 'description', weight: 1.5 },
            { name: 'keywords', weight: 1 },
            { name: 'category', weight: 0.5 },
        ],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 2,
        ignoreLocation: true,
        includeScore: true,
    });
}

// Simple hash function for data change detection
function hashData(data: SearchItem[]): string {
    return `${data.length}-${data[0]?.id || ''}-${data[data.length - 1]?.id || ''}`;
}

// ✅ 1) Search Engine Cache (Performance x10 🔥)
export function getSearchEngine(params?: {
    patients?: Patient[];
    appointments?: Appointment[];
    clinics?: any[];
}): Fuse<SearchItem> {
    const searchData = buildSearchData(params);
    const currentHash = hashData(searchData);

    // Only rebuild if data has changed
    if (!cachedFuse || cachedDataHash !== currentHash) {
        cachedFuse = createSearchEngine(searchData);
        cachedDataHash = currentHash;
    }

    return cachedFuse;
}

// Invalidate cache (call this when data changes from API)

export function invalidateSearchCache() {
    cachedFuse = null;
    cachedDataHash = null;
}

// ✅ 3) Smart Ranking (Awesome Feature 👑)
function applySmartRanking(results: FuseResult<SearchItem>[]): SearchItem[] {
    // Sort by priority first, then by fuse score
    return results
        .sort((a, b) => {
            // Patients always come first 👑
            if (a.item.category === 'Patients' && b.item.category !== 'Patients') return -1;
            if (b.item.category === 'Patients' && a.item.category !== 'Patients') return 1;

            // Then by custom priority
            const priorityA = a.item.priority || 0;
            const priorityB = b.item.priority || 0;
            if (priorityA !== priorityB) return priorityB - priorityA;

            // Finally by fuse score
            return (a.score || 0) - (b.score || 0);
        })
        .map((result) => result.item);
}

// Main search function with smart ranking
export function performSearch(
    query: string,
    limit: number = 10,
    params?: {
        patients?: Patient[];
        appointments?: Appointment[];
        clinics?: any[];
    }
): SearchItem[] {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const fuse = getSearchEngine(params);
    const results = fuse.search(query);

    // Apply smart ranking and return top results
    const rankedResults = applySmartRanking(results);
    return rankedResults.slice(0, limit);
}

// Group results by category
export function groupResultsByCategory(results: SearchItem[]): Record<string, SearchItem[]> {
    return results.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, SearchItem[]>);
}

// ✅ 4) UX Enhancement - Highlight matched text
export function highlightMatch(text: string, query: string): string {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}
