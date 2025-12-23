"use client";

import React from "react";
import { 
  AlertTriangle, Info, Pill, History, FileDown, Flag 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Helper function (You might want to move this to a shared utils file later)
const getLoc = (content: any, locale: string) => {
    if (!content) return "";
    if (typeof content === "string") return content;
    return content[locale] || content['en'] || "";
};

type Props = {
    patient: any; 
    locale: string;
};

export const ClinicalPriorityStrip = ({ patient, locale }: Props) => {
  const criticalAlerts = patient.alerts.filter((a: any) => a.type === 'critical');
  const chronicConditions = patient.alerts.filter((a: any) => a.type === 'warning');

  return (
    <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b dark:border-gray-800 shadow-sm px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse px-3 py-1 text-xs cursor-pointer">
          <AlertTriangle className="w-3 h-3" />
          {getLoc(criticalAlerts[0].msg, locale)}
        </Badge>
      )}

      {/* Chronic Conditions */}
      {chronicConditions.length > 0 && (
        <Badge variant="outline" className="flex items-center gap-1 border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200 px-3 py-1 text-xs cursor-pointer">
          <Info className="w-3 h-3" />
          {getLoc(chronicConditions[0].msg, locale)}
        </Badge>
      )}

      {/* Medications */}
      <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors">
        <Pill className="w-3 h-3" />
        <span className="font-semibold">{locale === 'ar' ? 'الأدوية الحالية:' : 'Meds:'}</span>
        <span className="truncate max-w-[200px]">
          {patient.currentMedications ? patient.currentMedications.join(", ") : 'None'}
        </span>
      </div>

      {/* Last Visit */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full ml-auto">
        <History className="w-3 h-3" />
        {locale === 'ar' ? 'آخر زيارة: منذ 3 أيام' : 'Last visit: 3 days ago'}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 border-l pl-2 border-gray-300">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <FileDown className="w-4 h-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export PDF</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Flag className="w-4 h-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flag for Follow-up</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};