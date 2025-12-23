"use client";

import { useState, useEffect } from "react";

export function useExternalAccess(locale: string) {
  // States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [otpStep, setOtpStep] = useState<'method' | 'verify'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email' | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Timer Effect (For Session Duration)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUnlocked && sessionExpiry) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = sessionExpiry - now;
        if (diff <= 0) {
            endSession();
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isUnlocked, sessionExpiry]);

  // Resend Timer Effect (For OTP Button)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Handlers
  const verifyOTP = () => {
    if (otpInput === "123456") {
      setIsUnlocked(true);
      setSessionExpiry(Date.now() + 60 * 60 * 1000); // 1 Hour
      setOtpStep('method');
      setOtpInput("");
    } else {
      alert(locale === 'ar' ? "رمز التحقق غير صحيح" : "Invalid Verification Code");
    }
  };

  const resendCode = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    alert(locale === 'ar' ? "تم إرسال الرمز مجدداً" : "Code resent successfully");
  };

  const endSession = () => {
    setIsUnlocked(false);
    setSessionExpiry(null);
    setTimeLeft("");
  };

  return {
    isUnlocked,
    otpStep,
    setOtpStep,
    selectedMethod,
    setSelectedMethod,
    otpInput,
    setOtpInput,
    timeLeft,
    resendTimer,
    verifyOTP,
    resendCode,
    endSession
  };
}