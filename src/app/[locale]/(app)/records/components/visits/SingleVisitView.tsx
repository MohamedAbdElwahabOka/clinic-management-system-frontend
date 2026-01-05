"use client";
import { useTranslations } from 'next-intl';

import React, { useState } from "react";
import {
  CheckCircle2, FileText, Image as ImageIcon, X, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { resolveSpecialtyView } from "../specialties/index";
import { getLoc } from "../../utils"; // استيراد الدالة المساعدة

export const SingleVisitView = ({ visit, locale, isExternal }: { visit: any, locale: string, isExternal?: boolean }) => {
  const t = useTranslations('Records');
  const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);

  // تعريف الكومبوننت الخاص بالتخصص بناءً على الـ Registry
  const SpecialtyView = resolveSpecialtyView(visit.specialty);

  return (
    <>
      <div className="border rounded-lg mb-3 bg-white dark:bg-card dark:border-border">
        <div className="p-4 border-b bg-gray-50 dark:bg-muted/40 dark:border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {new Date(visit.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">{visit.type || t('consultation')}</Badge>
          </div>
          {visit.notes && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{getLoc(visit.notes, locale)}</p>}
        </div>

        <div className="p-4">
          {visit.records.map((rec: any) => (
            <div key={rec.id} className="mb-4 last:mb-0">
              <div className="flex gap-3 items-start p-2 hover:bg-gray-50 dark:hover:bg-muted/40 rounded transition-colors group mb-3">
                <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                <div className="flex-1">
                  <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100 flex justify-between">
                    {getLoc(rec.title, locale)}
                    <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">#{rec.id}</span>
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{getLoc(rec.description, locale)}</p>
                </div>
              </div>

              {/* Dynamic Specialty View */}
              {rec.dataPayload && (
                <div className="mt-3 ms-9">
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                        <FileText className="w-3 h-3" />
                        {t('examinationDetails')}
                      </div>
                      <SpecialtyView data={rec.dataPayload} locale={locale} />
                    </div>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {rec.attachments && rec.attachments.length > 0 && (
                <div className="mt-4 ms-9">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                    <ImageIcon className="w-3 h-3" />
                    {locale === 'ar' ? 'المرفقات' : 'Attachments'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {rec.attachments.map((att: any) => (
                      <div key={att.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-zoom-in shadow-sm hover:shadow-md transition-all" onClick={(e) => { e.stopPropagation(); setSelectedImage({ url: att.url, title: att.title }); }}>
                        <img src={att.url} alt={att.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs text-center p-1 font-medium">{att.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none text-white overflow-hidden flex flex-col items-center justify-center h-[80vh] sm:h-auto">
          {selectedImage && (
            <>
              <div className="absolute top-4 right-4 z-50">
                <Button variant="ghost" size="icon" className="rounded-full bg-black/50 hover:bg-white/20 text-white" onClick={() => setSelectedImage(null)}><X className="w-5 h-5" /></Button>
              </div>
              <div className="w-full h-full flex items-center justify-center p-2 sm:p-6">
                <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl" />
              </div>
              <div className="w-full bg-black/80 p-4 text-center backdrop-blur-sm absolute bottom-0"><p className="font-medium text-sm sm:text-base">{selectedImage.title}</p></div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};