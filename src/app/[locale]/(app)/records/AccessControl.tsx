import React from "react";
import { Lock, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LockedOverlayProps {
  onRequestAccess: () => void;
  title?: string;
  description?: string;
}

export const LockedOverlay: React.FC<LockedOverlayProps> = ({
  onRequestAccess,
  title = "الوصول مقيد",
  description = "هذه البيانات من السجل الطبي الموحد وتتطلب موافقة المريض للعرض",
}) => {
  return (
    <div className="locked-overlay flex items-center justify-center px-4 py-6 sm:px-0">
      <div className="text-center p-4 sm:p-6 max-w-xs sm:max-w-sm w-full">
        <div className="mx-auto mb-3 sm:mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 bg-muted/50 py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg">
          <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>موافقة المريض مطلوبة</span>
        </div>

        <Button
          onClick={onRequestAccess}
          className="gap-1.5 sm:gap-2 text-sm sm:text-base py-2"
        >
          <KeyRound className="h-4 w-4" />
          طلب الوصول عبر OTP
        </Button>
      </div>
    </div>
  );
};

// شارة المصدر (محلي / خارجي)
export const SourceBadge: React.FC<{ isLocal: boolean; className?: string }> = ({
  isLocal,
  className = "",
}) => {
  if (isLocal) {
    return (
      <span
        className={`
          inline-flex items-center gap-1 
          px-1.5 py-0.5 sm:px-2 
          rounded-full text-[10px] sm:text-xs font-medium 
          badge-local border 
          ${className}
        `}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--medical-local))]" />
        سجلي
      </span>
    );
  }
  return (
    <span
      className={`
        inline-flex items-center gap-1 
        px-1.5 py-0.5 sm:px-2 
        rounded-full text-[10px] sm:text-xs font-medium 
        badge-global border 
        ${className}
      `}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--medical-global))]" />
      خارجي
    </span>
  );
};

// بطاقة بيانات مع تحكم بالوصول
interface AccessControlCardProps {
  isLocal: boolean;
  isGlobalUnlocked: boolean;
  onRequestAccess: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AccessControlCard: React.FC<AccessControlCardProps> = ({
  isLocal,
  isGlobalUnlocked,
  onRequestAccess,
  children,
  className = "",
}) => {
  const isLocked = !isLocal && !isGlobalUnlocked;

  return (
    <div
      className={`
        relative rounded-lg border bg-card 
        p-3 sm:p-4 
        transition-all 
        ${isLocal
          ? "access-card-local"
          : isGlobalUnlocked
          ? "access-card-global animate-unlock"
          : "access-card-locked"}
        ${className}
      `}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <LockedOverlay onRequestAccess={onRequestAccess} />
        </div>
      )}

      <div className={isLocked ? "blur-content pointer-events-none select-none" : ""}>
        {children}
      </div>
    </div>
  );
};
