// components/GoogleSignInButton.tsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useGoogleSignInMutation } from '@/redux/user/userApi';
import { error } from 'console';


const GoogleSignInButton = () => {

  const router = useRouter();

  const [googleRegister, { isLoading: isgoogleRegister }] = useGoogleSignInMutation();

  const handleGoogleSubmit = useGoogleLogin({


    onSuccess: async (codeResponse:any) => {

      console.log(codeResponse, "coderesponce");

      try {
        const res = await googleRegister(codeResponse).unwrap();

        if (res.success) {

          router.push('/');
        }

      } catch (err) {
        console.log(err);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  const handleClick = () => {
    handleGoogleSubmit()
  };


  return (
    <button onClick={handleClick}>Sign in with Google</button>
  );
};

export default GoogleSignInButton;
