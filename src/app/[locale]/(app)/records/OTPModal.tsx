import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  patientName?: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  patientName,
}) => {
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleVerify = () => {
    setError("");
    setIsVerifying(true);

    setTimeout(() => {
      if (otp.length === 4 && /^\d{4}$/.test(otp)) {
        onSuccess();
        setOtp("");
        onOpenChange(false);
      } else {
        setError("الرجاء إدخال رمز مكون من 4 أرقام");
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleClose = () => {
    setOtp("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          sm:max-w-md 
          w-[95%] 
          max-w-sm 
          sm:max-w-md 
          md:max-w-lg 
          p-4 sm:p-6 
        "
        dir="rtl"
      >
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          </div>

          <DialogTitle className="text-lg sm:text-xl text-center">
            طلب الوصول للسجل الموحد
          </DialogTitle>

          <DialogDescription className="text-center text-sm sm:text-base">
            <span className="block mt-2">
              للوصول إلى السجلات الطبية الخارجية للمريض
            </span>
            {patientName && (
              <span className="block mt-1 font-semibold text-foreground text-sm sm:text-base">
                {patientName}
              </span>
            )}
            <span className="block mt-2 text-xs sm:text-sm">
              يرجى إدخال رمز OTP المقدم من المريض
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 sm:gap-6 py-4 sm:py-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
            <Lock className="h-4 w-4 sm:h-4 sm:w-4" />
            <span>موافقة المريض مطلوبة للوصول</span>
          </div>

          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
          >
            <InputOTPGroup
              className="
                gap-2 sm:gap-3 
                flex justify-center
              "
              dir="ltr"
            >
              <InputOTPSlot
                index={0}
                className="h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl font-bold"
              />
              <InputOTPSlot
                index={1}
                className="h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl font-bold"
              />
              <InputOTPSlot
                index={2}
                className="h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl font-bold"
              />
              <InputOTPSlot
                index={3}
                className="h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl font-bold"
              />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-xs sm:text-sm text-destructive font-medium">{error}</p>
          )}

          <div className="text-[10px] sm:text-xs text-muted-foreground text-center leading-relaxed">
            <p>📱 الرمز يُرسل لهاتف المريض المسجل</p>
            <p className="mt-1">(للتجربة: أدخل أي 4 أرقام)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 py-2 text-sm sm:text-base"
            onClick={handleClose}
          >
            إلغاء
          </Button>

          <Button
            className="flex-1 gap-2 py-2 text-sm sm:text-base"
            onClick={handleVerify}
            disabled={otp.length !== 4 || isVerifying}
          >
            {isVerifying ? (
              <>
                <span className="animate-spin">⏳</span>
                جارٍ التحقق...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                تأكيد الوصول
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
