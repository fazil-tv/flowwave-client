"use client";

import React, { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { useLoginUserMutation } from '@/redux/user/userApi'; 
import { useRouter } from "next/navigation";
import { makeApiCall } from '@/utils/makeApiCall';
import GoogleSignInButton from '../../_components/googlesignin';


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
              router.push(`/dashboard`);
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
    <form className="my-8" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row md:space-x-2 mb-4 w-full md:w-96">
        <LabelInputContainer className="w-full">
          <Label htmlFor="email">Email Address</Label>
          <Input
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
        <Label htmlFor="password">Password</Label>
        <Input
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
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Log in &rarr;
        <BottomGradient />
      </button>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="flex flex-col space-y-4">
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="button"
        >
          {/* <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" /> */}
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">
          <GoogleSignInButton   />
          </span>
          <BottomGradient />
        </button>
      </div>
    </form>
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
