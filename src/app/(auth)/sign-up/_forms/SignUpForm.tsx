"use client";

import React, { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AuthInput } from '@/components/ui/auth-input';
import { useRegisterUserMutation } from '@/redux/user/userApi';
import { useRouter } from "next/navigation";
import { makeApiCall } from '@/utils/makeApiCall';
import GoogleSignInButton from '../../_components/googlesignin';
import Link from 'next/link';


const signupSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string().min(1, { message: "Confirm Password is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};


// import {
//   IconBrandGithub,
//   IconBrandGoogle,
//   IconBrandOnlyfans,
// } from "@tabler/icons-react";

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  type Errors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [signup, { isLoading: isSignupLoading }] = useRegisterUserMutation();



  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setBackendError(null);
    const validation = signupSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }


    try {

      makeApiCall(
        () =>
          signup({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }).unwrap(),
        {
          afterSuccess: (signupResponse: any) => {

            if (signupResponse.success) {
              localStorage.setItem('Token', signupResponse.token);
              router.push(`/verify-user?email=${signupResponse.email}`);
            }
          },
          afterError: (error: any) => {
            setBackendError(error.data.message || "Signup failed");
            console.log('Signup failed:', error);
          },
          toast: (message: any) => {
            console.log(message);
          },
        }
      );
    } catch (error) {
      console.error('Signup failed:', error);
    }



  };

  return (
    <div>


      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:space-x-2 mb-4 w-full md:w-96 ">
          <LabelInputContainer className="w-full">
            <Label
              htmlFor="username"
              className="!text-white !text-[12px] m-2 !block"
            >
              Username
            </Label>


            <AuthInput id="username" placeholder="Username" type="text" className="w-full"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="!text-white !text-[12px] m-2 !block">Email Address</Label>
          <AuthInput id="email" placeholder="abc@gmail.com" type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="password" className="!text-white !text-[12px] m-2 !block">password</Label>
          <AuthInput
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword" className="!text-white !text-[12px] m-2 !block">confirmPassword</Label>
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}

          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </LabelInputContainer>
        {backendError && <p className="text-red-500 text-sm">{backendError}</p>}
        <button
          className="bg-gradient-to-br relative w-full text-white rounded-md h-10 font-medium  !repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
      <div className="relative my-8 w-full ">
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full flex" />
          <span className="absolute left-1/2 transform -translate-x-1/2 -top-3  dark:bg-zinc-900 px-2 text-white dark:text-white !bg-[#03020A]">
            Or
          </span>
        </div>
      <div className="flex flex-col space-y-4">
      
      
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
            <GoogleSignInButton />
          </span>
          <BottomGradient />
     

      </div>

    <div className='flex justify-center text-gray-500 mt-5 text-sm'>
      <Link href={"/login"}>Already got an account? Sign in</Link>
    </div>

    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent  via-custom-purple to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent  via-custom-purple to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("w-full ", className)}>
      {children}
    </div>
  );
};