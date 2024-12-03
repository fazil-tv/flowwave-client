"use client";

import React, { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";


import { useLoginUserMutation } from '@/redux/user/userApi';
import { useRouter } from "next/navigation";
import { makeApiCall } from '@/utils/makeApiCall';
import GoogleSignInButton from '../../_components/googlesignin';
import { AuthInput } from '@/components/ui/auth-input';
import Link from 'next/link';


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  type Errors = {
    email?: string;
    password?: string;
  };

  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [backendError, setBackendError] = useState<string | null>(null);
  const [login, { isLoading: isLoginLoading }] = useLoginUserMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackendError(null);
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    try {
      makeApiCall(
        () =>
          login({
            email: formData.email,
            password: formData.password,
          }).unwrap(),
        {
          afterSuccess: (loginResponse: any) => {
        
            if (loginResponse.success) {
              localStorage.setItem('Token', loginResponse.user.token);
              router.push(`/projects`);
            }
          },
          afterError: (error: any) => {
            setBackendError(error.data.message || "Login failed");
            console.log('Login failed:', error);
          },
          toast: (message: any) => {
            console.log(message);
          },
        }
      );
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:space-x-2 mb-4 w-full md:w-96">
          <LabelInputContainer className="w-full">
            <Label htmlFor="email" className="!text-white !text-[12px] m-2 !block">Email Address</Label>
            <AuthInput
              id="email"
              placeholder="abc@gmail.com"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="password" className="!text-white !text-[12px] m-2 !block">Password</Label>
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

        {backendError && <p className="text-red-500 text-sm">{backendError}</p>}

        <button
          className="relative w-full rounded-md h-10 font-medium  !repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white mb-3"
          type="submit"
        >
          Log in &rarr;
          <BottomGradient />
        </button>

        <div className="relative my-8 w-full ">
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full flex" />
          <span className="absolute left-1/2 transform -translate-x-1/2 -top-3  dark:bg-zinc-900 px-2 text-white dark:text-white !bg-[#03020A]">
            Or
          </span>
        </div>

      </form>

      <div className="flex flex-col space-y-4 mt-1">

        <GoogleSignInButton />
        <BottomGradient />

      </div>
      <div className='flex justify-between text-gray-600 mt-5 text-sm'>
        <div className='px-2 flex justify-end w-52 me-4'><div>Forgot Password?</div></div>|
        <div className='px2 flex justify-start w-52 ms-6'><Link href={'/sign-up'}>Sign Up</Link></div>

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
