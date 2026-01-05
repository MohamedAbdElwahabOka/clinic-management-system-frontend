"use client";
import { useTranslations } from 'next-intl';

import React, { useState } from "react";
import {
  MapPin, Calendar, Repeat, ChevronUp, ChevronDown, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SingleVisitView } from "./SingleVisitView";
import { getLoc } from "../../utils";

export const DoctorVisitCard = ({ visits, locale, onRefill, isExternal }: { visits: any[], locale: string, onRefill?: () => void, isExternal?: boolean }) => {
  const t = useTranslations('Records');
  const [isExpanded, setIsExpanded] = useState(false);

  if (visits.length === 0) return null;

  const firstVisit = visits[0];
  const sortedVisits = [...visits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestVisit = sortedVisits[0];

  return (
    <Card className={`border rounded-lg shadow-sm ${isExternal ? 'opacity-90' : ''}`}>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex flex-col items-center min-w-[60px] text-center border-e pe-4">
              <span className="text-xs text-muted-foreground uppercase">{new Date(latestVisit.date).toLocaleString('default', { month: 'short' })}</span>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{new Date(latestVisit.date).getDate()}</span>
              <span className="text-xs text-muted-foreground">{new Date(latestVisit.date).getFullYear()}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-base text-primary flex items-center gap-2">
                {getLoc(firstVisit.doctorName, locale)}
                <Badge variant="secondary" className="text-[10px] font-normal">{getLoc(firstVisit.specialty, locale)}</Badge>
                <Badge variant="outline" className="text-[10px] font-normal">{visits.length} {t('visits')}</Badge>
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1"><MapPin className="w-3 h-3" /> {getLoc(firstVisit.clinicName, locale)}</div>
              <div className="text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t('lastVisit')} {new Date(latestVisit.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {!isExternal && onRefill && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-1 h-8" onClick={onRefill}>
                <Repeat className="w-3 h-3" /> {t('refill')}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {isExternal && <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 gap-1 absolute top-4 right-4"><Lock className="w-3 h-3" /> Read-Only</Badge>}
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4 border-t">
          <div className="space-y-4 mt-4">
            {sortedVisits.map((visit) => <SingleVisitView key={visit.id} visit={visit} locale={locale} isExternal={isExternal} />)}
          </div>
        </CardContent>
      )}
    </Card>
  );
};