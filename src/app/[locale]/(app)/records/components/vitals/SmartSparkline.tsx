"use client";

import React from "react";
import { AlertOctagon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SmartSparkline = ({ data, minNormal, maxNormal, unit }: { data: number[], minNormal: number, maxNormal: number, unit: string }) => {
    if (!data || data.length < 2) return null;
    
    const min = Math.min(...data, minNormal - 5);
    const max = Math.max(...data, maxNormal + 5);
    const range = max - min || 1;
    const width = 120;
    const height = 40;
    
    const lastValue = data[data.length - 1];
    const isAbnormal = lastValue < minNormal || lastValue > maxNormal;
    const color = isAbnormal ? "red" : "#10b981"; 

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(" ");

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex flex-col items-end cursor-help">
                        <div className="flex items-center gap-2 mb-1">
                            {isAbnormal && <AlertOctagon className="w-3 h-3 text-red-500 animate-pulse" />}
                            <span className={`font-bold text-sm ${isAbnormal ? 'text-red-600' : 'text-gray-700'}`}>
                                {lastValue} <span className="text-[10px] text-muted-foreground font-normal">{unit}</span>
                            </span>
                        </div>
                        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                            <rect 
                                x="0" 
                                y={height - ((maxNormal - min) / range) * height} 
                                width={width} 
                                height={((maxNormal - minNormal) / range) * height} 
                                fill={isAbnormal ? "#fee2e2" : "#ecfdf5"} 
                                opacity="0.5"
                            />
                            <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx={width} cy={height - ((lastValue - min) / range) * height} r="3" fill={color} />
                        </svg>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">Normal Range: {minNormal}-{maxNormal} {unit}</p>
                    <p className="text-xs font-bold">{isAbnormal ? '⚠️ Attention Needed' : '✅ Within Limits'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};