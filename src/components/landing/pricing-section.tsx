"use client";

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { PRICING_PLANS, PricingPlan } from '@/lib/dummy-data'; // استيراد الداتا

interface PricingSectionProps {
  globalDiscount?: number; // خصم إضافي يطبق على الكل
}

export function PricingSection({ globalDiscount = 0 }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Helper Function: تحاكي استخراج اللغة من عمود JSONB
  // لو اللغة مش موجودة بيرجع الانجليزي كـ Fallback
  const getLocalized = (jsonBField: any) => {
    return jsonBField[locale] || jsonBField['en'] || "";
  };

  return (
    <section id="pricing" className="py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isAr ? "خطط أسعار مرنة تناسب الجميع" : "Flexible Pricing Plans"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            {isAr 
              ? "اختر الباقة المناسبة لاحتياجات عيادتك. يمكنك التغيير في أي وقت." 
              : "Choose the plan that suits your clinic needs. You can switch anytime."}
          </p>

          {/* Global Discount Banner (Optional) */}
          {globalDiscount > 0 && (
            <div className="mb-6 inline-block bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold border border-red-200 animate-pulse">
               {isAr ? `🔥 عرض خاص: خصم إضافي ${globalDiscount}% على جميع الباقات لفترة محدودة!` : `🔥 Special Offer: Extra ${globalDiscount}% OFF on all plans!`}
            </div>
          )}

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium", !isYearly ? "text-primary" : "text-muted-foreground")}>
              {isAr ? "شهري" : "Monthly"}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 bg-muted rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div
                className={cn(
                  "w-5 h-5 bg-primary rounded-full shadow-md transform transition-transform duration-200",
                  isYearly ? (isAr ? "-translate-x-7" : "translate-x-7") : "translate-x-0"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", isYearly ? "text-primary" : "text-muted-foreground")}>
              {isAr ? "سنوي" : "Yearly"}
              <span className="text-xs text-green-500 mx-1 font-bold">
                 (2 Months OFF)
              </span>
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => {
            // --- Logic Area ---
            
            // 1. تحديد السعر الأساسي (شهري ولا سنوي)
            const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            
            // 2. حساب الخصم الكلي (خصم الباقة + الخصم العام)
            const totalDiscountPercent = plan.discountPercent + globalDiscount;
            
            // 3. السعر النهائي بعد الخصم
            const finalPrice = basePrice - (basePrice * (totalDiscountPercent / 100));
            
            const isFree = basePrice === 0;
            const hasDiscount = totalDiscountPercent > 0 && !isFree;

            // --- End Logic Area ---

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
                  plan.isPopular 
                    ? "border-primary shadow-xl scale-105 z-10 bg-card ring-1 ring-primary/20" 
                    : "border-border bg-card/40 hover:bg-card/80"
                )}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                    {getLocalized({ar: "الأكثر طلباً", en: "Most Popular", de: "Beliebt"})}
                  </div>
                )}
                
                {/* Discount Badge */}
                {hasDiscount && !plan.isPopular && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
                    {isAr ? `خصم ${totalDiscountPercent}%` : `${totalDiscountPercent}% OFF`}
                  </div>
                )}

                {/* Header Section */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{getLocalized(plan.name)}</h3>
                  <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">
                    {getLocalized(plan.description)}
                  </p>
                </div>

                {/* Pricing Section */}
                <div className="mb-6">
                    {/* السعر القديم المشطوب لو فيه خصم */}
                    {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through block">
                        {Math.round(basePrice)} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                    )}
                    
                    <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold">
                            {isFree 
                                ? (isAr ? "مجاناً" : "Free") 
                                : Math.round(finalPrice)
                            }
                        </span>
                        {!isFree && (
                            <span className="text-muted-foreground mb-1 text-sm font-medium">
                                /{isAr ? 'ج.م' : 'EGP'}
                            </span>
                        )}
                    </div>
                    {!isFree && (
                        <div className="text-xs text-muted-foreground mt-1">
                            {isYearly 
                                ? (isAr ? "تدفع سنوياً" : "Billed yearly") 
                                : (isAr ? "تدفع شهرياً" : "Billed monthly")
                            }
                        </div>
                    )}
                </div>

                {/* Features List */}
                <ul className="flex-grow space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.key} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                        {/* عرضنا هنا القيمة المخصصة لو موجودة، لو لأ نعرض اسم الميزة */}
                        {feature.value 
                            ? getLocalized(feature.value) // مثال: "5 مستخدمين"
                            : getLocalized(feature.text)  // مثال: "إدارة المواعيد"
                        }
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={cn(
                    "w-full font-bold", 
                    plan.isPopular ? "bg-primary hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                  variant={plan.isPopular ? "default" : "outline"}
                >
                  {getLocalized(plan.ctaText)}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}