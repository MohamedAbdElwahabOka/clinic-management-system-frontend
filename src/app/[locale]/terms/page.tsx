'use client';

import React, { useState } from 'react';
import { arabicTerms, englishTerms, TermSection } from './content';

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 font-sans">
      
      {/* 1. Header & Title Section */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          الوثائق القانونية والشروط
        </h1>
        <p className="text-gray-600">
          Comprehensive Legal Documents & Terms of Service
        </p>
      </div>

      {/* 2. Language Tabs (Center aligned) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-center">
        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
          <button
            onClick={() => setActiveTab('ar')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'ar'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🇪🇬 النسخة العربية
          </button>
          <button
            onClick={() => setActiveTab('en')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'en'
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🇬🇧 English Version
          </button>
        </div>
      </div>

      {/* 3. The Content Paper (Centered Document) */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
        
        {/* Document Header inside the paper */}
        <div className={`p-8 border-b border-gray-100 ${activeTab === 'ar' ? 'bg-blue-50/50' : 'bg-gray-50'}`}>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            {activeTab === 'ar' 
              ? 'اتفاقية مستوى الخدمة وترخيص الاستخدام (SaaS)' 
              : 'SaaS Agreement & License Terms'}
          </h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            {activeTab === 'ar' 
              ? 'النسخة المعتمدة قانونياً في جمهورية مصر العربية' 
              : 'Certified Legal Standard Version'}
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div 
          dir={activeTab === 'ar' ? 'rtl' : 'ltr'} 
          className="p-8 md:p-12 space-y-12"
        >
          {activeTab === 'ar' ? (
            arabicTerms.map((section) => (
              <ArticleBlock key={section.id} section={section} />
            ))
          ) : (
            englishTerms.map((section) => (
              <ArticleBlock key={section.id} section={section} />
            ))
          )}
        </div>

        {/* Footer of the Document */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-600">
            {activeTab === 'ar' 
              ? 'آخر تحديث: ديسمبر 2025 | جميع الحقوق محفوظة' 
              : 'Last Updated: December 2025 | All Rights Reserved'}
          </p>
        </div>

      </div>
    </main>
  );
}

// Helper Component for rendering sections cleanly
function ArticleBlock({ section }: { section: TermSection }) {
  return (
    <section className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 bg-gray-50 w-fit px-3 py-1 rounded">
        {section.title}
      </h3>
      <div className="text-gray-700 leading-relaxed text-sm md:text-base">
        {section.content}
      </div>
    </section>
  );
}