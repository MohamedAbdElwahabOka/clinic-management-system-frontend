"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Stethoscope,
  Users,
  Clock,
  Activity,
  MoreVertical,
  CalendarCheck,
  DoorOpen,
  DoorClosed,
  AlertCircle
} from "lucide-react";
import { useTranslations } from "next-intl";

// --- Types ---
interface Clinic {
  id: number;
  name: string;
  specialty: string;
  doctorName: string; // الدكتور الحالي
  nurseName: string;
  status: "Active" | "Break" | "Closed" | "Full";
  currentQueue: number; // عدد المنتظرين
  completedToday: number; // كم واحد كشف
  roomNumber: string;
  nextAvailableSlot: string;
}

// --- Mock Data ---
const clinicsData: Clinic[] = [
  { 
    id: 1, name: "عيادة الباطنة (أ)", specialty: "Internal Medicine", 
    doctorName: "د. محمد يحيى", nurseName: "سارة أحمد", 
    status: "Active", currentQueue: 4, completedToday: 12, 
    roomNumber: "101", nextAvailableSlot: "11:30 AM" 
  },
  { 
    id: 2, name: "عيادة الأسنان", specialty: "Dentistry", 
    doctorName: "د. نرهان علي", nurseName: "منى السيد", 
    status: "Active", currentQueue: 2, completedToday: 8, 
    roomNumber: "105", nextAvailableSlot: "12:00 PM" 
  },
  { 
    id: 3, name: "عيادة الأطفال", specialty: "Pediatrics", 
    doctorName: "د. كريم سامي", nurseName: "هدى محمود", 
    status: "Full", currentQueue: 15, completedToday: 20, 
    roomNumber: "203", nextAvailableSlot: "غداً" 
  },
  { 
    id: 4, name: "عيادة العيون", specialty: "Ophthalmology", 
    doctorName: "--", nurseName: "--", 
    status: "Closed", currentQueue: 0, completedToday: 0, 
    roomNumber: "205", nextAvailableSlot: "04:00 PM" 
  },
  { 
    id: 5, name: "عيادة العظام", specialty: "Orthopedics", 
    doctorName: "د. ياسر جلال", nurseName: "أحمد كمال", 
    status: "Break", currentQueue: 3, completedToday: 5, 
    roomNumber: "102", nextAvailableSlot: "01:00 PM" 
  },
];

// --- Sub-Components ---

// 1. Status Badge
const StatusBadge = ({ status }: { status: Clinic['status'] }) => {
    const styles = {
        Active: "bg-green-100 text-green-700 border-green-200 animate-pulse-slow",
        Break: "bg-amber-100 text-amber-700 border-amber-200",
        Closed: "bg-gray-100 text-gray-500 border-gray-200",
        Full: "bg-red-100 text-red-700 border-red-200"
    };
    
    const labels = {
        Active: "مفتوحة الآن",
        Break: "استراحة",
        Closed: "مغلقة",
        Full: "مكتملة العدد"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${styles[status]}`}>
            <span className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-600' : status === 'Full' ? 'bg-red-600' : 'bg-current'}`}></span>
            {labels[status]}
        </span>
    );
};

// 2. Clinic Card
const ClinicCard = ({ clinic }: { clinic: Clinic }) => {
    const isClosed = clinic.status === 'Closed';

    return (
        <div className={`relative bg-white rounded-2xl border transition-all duration-300 group ${isClosed ? 'border-gray-100 opacity-75' : 'border-gray-200 hover:shadow-lg hover:border-blue-200'}`}>
            
            {/* Header */}
            <div className="p-5 border-b border-gray-50">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isClosed ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                            <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{clinic.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <DoorOpen className="w-3 h-3" /> غرفة {clinic.roomNumber}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={clinic.status} />
                </div>
            </div>

            {/* Body Info */}
            <div className="p-5 space-y-4">
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden border border-gray-200">
                        {isClosed ? <UserIconPlaceholder /> : (
                            <img src={`https://ui-avatars.com/api/?name=${clinic.doctorName}&background=random`} alt="Doctor" className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">الطبيب المسؤول</p>
                        <p className={`font-medium ${isClosed ? 'text-gray-400' : 'text-gray-900'}`}>{clinic.doctorName}</p>
                    </div>
                </div>

                {/* Queue Stats (Grid) */}
                {!isClosed && (
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="text-center border-l border-gray-200 pl-2">
                            <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                                <Users className="w-3 h-3" />
                                الانتظار
                            </p>
                            <p className="text-lg font-bold text-blue-600">{clinic.currentQueue}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                                <CalendarCheck className="w-3 h-3" />
                                تم الكشف
                            </p>
                            <p className="text-lg font-bold text-green-600">{clinic.completedToday}</p>
                        </div>
                    </div>
                )}
                
                {isClosed && (
                     <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">يفتح في: {clinic.nextAvailableSlot}</span>
                     </div>
                )}
            </div>

            {/* Actions Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
                <button 
                    disabled={isClosed}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    حجز سريع
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Placeholder icon for closed clinics
const UserIconPlaceholder = () => (
    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


// --- Main Page ---
export default function ReceptionClinicsPage() {
    const t = useTranslations("Clinics"); // Assuming translation key
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");

    // Filter Logic
    const filteredClinics = useMemo(() => {
        return clinicsData.filter(clinic => {
            const matchesSearch = clinic.name.includes(searchQuery) || clinic.doctorName.includes(searchQuery);
            const matchesStatus = filterStatus === "All" ? true : 
                                  filterStatus === "Active" ? clinic.status === "Active" :
                                  filterStatus === "Closed" ? clinic.status === "Closed" : true;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, filterStatus]);

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-900">
            
            {/* 1. Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-blue-600" />
                        حالة العيادات
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">متابعة حية لحالة العيادات، الأطباء، وقوائم الانتظار</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Status Filter Tabs */}
                    <div className="bg-white p-1 rounded-xl border border-gray-200 flex">
                        {['All', 'Active', 'Closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filterStatus === status 
                                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {status === 'All' ? 'الكل' : status === 'Active' ? 'مفتوحة' : 'مغلقة'}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="بحث باسم العيادة أو الطبيب..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                        />
                        <Search className="absolute top-3 right-3 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* 2. Quick Stats Overview (Top Bar) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-xs font-medium mb-1">عيادات مفتوحة</p>
                        <p className="text-3xl font-bold">3</p>
                    </div>
                    <DoorOpen className="absolute -left-4 -bottom-4 w-24 h-24 text-white opacity-10" />
                 </div>
                 
                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-gray-500 text-xs font-medium">إجمالي الانتظار</p>
                             <p className="text-2xl font-bold text-gray-900">24</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-gray-500 text-xs font-medium">تم الكشف</p>
                             <p className="text-2xl font-bold text-gray-900">45</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                             <p className="text-gray-500 text-xs font-medium">ضغط عالي</p>
                             <p className="text-sm font-bold text-gray-900">الأطفال</p>
                        </div>
                    </div>
                 </div>
            </div>

            {/* 3. Clinics Grid */}
            {filteredClinics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredClinics.map(clinic => (
                        <ClinicCard key={clinic.id} clinic={clinic} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <DoorClosed className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium">لا توجد عيادات مطابقة للبحث</p>
                </div>
            )}
        </div>
    );
}