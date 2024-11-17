"use client"
import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useVerifyOtpMutation } from "@/redux/user/userApi";
import { makeApiCall } from "@/utils/makeApiCall";


const OtpSchema = z.object({
  otp: z.string()
    .min(6, { message: "OTP must be 6 digits" })
    .max(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" })
});

export function OtpVerifyForm() {

  const router = useRouter();

  const [otpValue, setOtpValue] = useState('');
  const [error, setError] = useState<string | null>(null);


 
  const [Verifyotp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();

  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const handleOtpChange = (newValue: string) => {
    setOtpValue(newValue);
    setError(null);
  };

  useEffect(() => {
    console.log(otpValue, "Updated otpValue");
  }, [otpValue]);

  const handleOtpVerify = async () => {

   

    const validationResult = OtpSchema.safeParse({ otp: otpValue });


    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    const verificationData = {
      otp: otpValue,
      email: userEmail,
    };




    try {
      makeApiCall(
        () => Verifyotp(verificationData).unwrap(),
        {
          afterSuccess: (verifyOtpResponse: any) => {
            setError(null);

            localStorage.setItem('Token', verifyOtpResponse.token);
            router.push('/projects');

          },
          afterError: (error: any) => {
            const errorMessage = error?.data?.message || "OTP Verification failed. Please try again.";
            setError(errorMessage);
          },
          toast: (message: any) => {
            console.log(message);
          },
        }
      );
    } catch (error) {

      setError("An unexpected error occurred");
      console.error('OTP Verification failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-neutral-300 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center pt-4">
        Enter the code generated from the link sent to
      </p>
      <p className="text-neutral-100  max-w-sm !mt-3 dark:text-neutral-200 text-center ">
        {userEmail}
      </p>
      <div className="flex justify-center py-7">
        <InputOTP
          maxLength={6}
          onChange={(value) => handleOtpChange(value)}
        >
          <InputOTPGroup className="flex items-center justify-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center">
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-12 border rounded-lg text-xl font-bold border-custom-purple"
                />
                {index !== 5 && (
                  <div className="w-3" />
                )}
              </div>
            ))}
          </InputOTPGroup>
        </InputOTP>

      </div>

      {error && (
        <div className="text-red-500 !mt-0 text-sm">
          {error}
        </div>
      )}

      <Button
        className="bg-custom-purple w-100 container "
        onClick={handleOtpVerify}
        disabled={isVerifyLoading || otpValue.length < 6}
      >
        {isVerifyLoading ? "Verifying..." : "Verify OTP"}
      </Button>


    </div>
  );
}