'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  User, 
  Stethoscope, 
  Banknote 
} from 'lucide-react';
import { useTranslations } from 'next-intl';

// Mock Data (بيانات وهمية للتجربة)
const appointmentsData = [
  { id: 1, time: '09:00 AM', patient: 'أحمد محمد', doctor: 'د. نبيل', type: 'كشف جديد', status: 'completed', payment: 'paid', avatar: 'AM' },
  { id: 2, time: '09:30 AM', patient: 'سارة علي', doctor: 'د. منى', type: 'استشارة', status: 'in-progress', payment: 'paid', avatar: 'SA' },
  { id: 3, time: '10:00 AM', patient: 'محمود حسن', doctor: 'د. نبيل', type: 'متابعة', status: 'waiting', payment: 'unpaid', avatar: 'MH' },
  { id: 4, time: '10:30 AM', patient: 'كريم عادل', doctor: 'د. خالد', type: 'كشف جديد', status: 'scheduled', payment: 'unpaid', avatar: 'KA' },
  { id: 5, time: '11:00 AM', patient: 'نادية يوسف', doctor: 'د. نبيل', type: 'كشف جديد', status: 'cancelled', payment: 'unpaid', avatar: 'NY' },
];

export default function ReceptionAppointments() {
  const t = useTranslations('Appointments'); // تأكد إن عندك ملف ترجمة أو استخدم نصوص ثابتة مؤقتاً
  const [filterStatus, setFilterStatus] = useState('all');

  // دالة بسيطة لتحديد لون الحالة
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'waiting': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200'; // scheduled
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'تم الكشف';
      case 'in-progress': return 'بالداخل';
      case 'waiting': return 'في الانتظار';
      case 'cancelled': return 'ملغي';
      default: return 'مجدول';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* 1. Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مواعيد اليوم</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            الأحد، 7 ديسمبر 2025
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#0582EB] hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 font-medium">
          <Plus className="w-5 h-5" />
          <span>حجز جديد</span>
        </button>
      </div>

      {/* 2. Quick Stats Cards (نظرة سريعة) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المواعيد', value: '24', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'في الانتظار', value: '5', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'تم الكشف', value: '12', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'ملغي', value: '2', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="بحث باسم المريض أو رقم الهاتف..." 
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0582EB]/20 focus:border-[#0582EB] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0582EB] cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">كل الحالات</option>
            <option value="scheduled">مجدول</option>
            <option value="waiting">في الانتظار</option>
            <option value="completed">تم الكشف</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>فلترة متقدمة</span>
          </button>
        </div>
      </div>

      {/* 4. Appointments Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">التوقيت</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">المريض</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الدكتور</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">النوع</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">الدفع</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointmentsData.map((apt) => (
                <tr key={apt.id} className="group hover:bg-blue-50/30 transition-colors">
                  {/* Time */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {apt.time}
                    </div>
                  </td>

                  {/* Patient */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0582EB] flex items-center justify-center text-sm font-bold">
                        {apt.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{apt.patient}</p>
                        <p className="text-xs text-gray-500">010xxxxxxx</p>
                      </div>
                    </div>
                  </td>

                  {/* Doctor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Stethoscope className="w-4 h-4 text-gray-400" />
                      {apt.doctor}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      {apt.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${getStatusStyle(apt.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'in-progress' ? 'bg-blue-500 animate-pulse' : 'bg-current'}`}></span>
                      {getStatusText(apt.status)}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {apt.payment === 'paid' ? (
                       <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded border border-green-100 w-fit">
                         <CheckCircle2 className="w-3 h-3" />
                         مدفوع
                       </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded border border-orange-100 w-fit">
                        <Banknote className="w-3 h-3" />
                        مطلوب
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* زرار تسجيل الدخول السريع */}
                      {apt.status === 'scheduled' && (
                        <button className="text-xs bg-[#0582EB] text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors">
                          تسجيل حضور
                        </button>
                      )}
                       {apt.status === 'waiting' && (
                        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors">
                          بدء الكشف
                        </button>
                      )}
                      
                      <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
           <span className="text-xs text-gray-500">عرض 1-5 من أصل 24</span>
           <div className="flex gap-2">
             <button className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
               <ChevronRight className="w-4 h-4 text-gray-600" /> {/* انتبه للاتجاه في العربي */}
             </button>
             <button className="p-1 rounded bg-white border border-gray-300 hover:bg-gray-50">
               <ChevronLeft className="w-4 h-4 text-gray-600" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons for pagination (ممكن تستوردهم فوق عادي)
import { ChevronLeft, ChevronRight } from 'lucide-react';