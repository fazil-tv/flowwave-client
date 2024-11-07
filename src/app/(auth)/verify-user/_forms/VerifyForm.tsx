"use client"
import React, { useEffect, useState } from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOtp() {
  const [otpValue, setOtpValue] = useState('');

  const handleOtpChange = (newValue: string) => {
    console.log(newValue);
    setOtpValue(newValue);
  };

  useEffect(() => {
    console.log(otpValue, "Updated otpValue");
  }, [otpValue]);

  return (
    <InputOTP maxLength={6} onChange={(value) => handleOtpChange(value)}>
      <InputOTPGroup>
        {Array(6).fill("").map((_, index) => (
          <InputOTPSlot
            index={index} 
            className="border-custom-purple"  
            key={index}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
