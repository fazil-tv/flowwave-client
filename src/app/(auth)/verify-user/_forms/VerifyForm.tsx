"use client"
import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";


import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useVerifyOtpMutation } from "@/redux/user/userApi";
import { makeApiCall } from "@/utils/makeApiCall";


export function InputOtp() {
  const [otpValue, setOtpValue] = useState('');
  const [Verifyotp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();

  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  console.log(userEmail, "uesEmail");

  const handleOtpChange = (newValue: string) => {
    console.log(newValue);
    setOtpValue(newValue);
  };

  useEffect(() => {
    console.log(otpValue, "Updated otpValue");
  }, [otpValue]);


  const handleOtpVerify = async () => {
    const verificationData = {
        otp: otpValue,
        email: userEmail,
    };

    console.log('Verification Data:', verificationData);

    try {
        makeApiCall(
            () => Verifyotp(verificationData).unwrap(),
            {
                afterSuccess: (verifyOtpResponse: any) => {
                    console.log('Verifyotpresponse:', verifyOtpResponse);
                    localStorage.setItem('Token', verifyOtpResponse.token);
                    localStorage.setItem('refreshToken', verifyOtpResponse.refreshToken);
                    console.log('Tokens stored successfully');

                    if (verifyOtpResponse.success) {
                      console.log("hellow")
                   
                    } else {

                        console.log(verifyOtpResponse.data.message);
                        
                    }
                },
                afterError: (error: any) => {
                    console.error('OTP Verification failed:', error.message);
                },
                toast: (message: any) => {
                    console.log(message); 
                },
            }
        );
    } catch (error) {
        console.error('OTP Verification failed:', error);
    }
};

  

  return (<div>


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
    <Button onClick={handleOtpVerify}>Verify OTP</Button>
  </div>
  );
}
