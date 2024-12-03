import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useGoogleSignInMutation } from '@/redux/user/userApi';
import { makeApiCall } from '@/utils/makeApiCall'; 
import Image from 'next/image';

const GoogleSignInButton = () => {
  const router = useRouter();
  const [googleRegister, { isLoading: isGoogleRegisterLoading }] = useGoogleSignInMutation();

  const handleGoogleSubmit = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        
        makeApiCall(
          () => googleRegister(codeResponse).unwrap(),
          {
            afterSuccess: (res:any) => {

              if (res.success) {
                localStorage.setItem('Token', res.googleUser.token); 
                router.push('/projects');
              }
            },
            afterError: (error:any) => {
              console.log('Google Sign-In failed:', error.data.message || "Login failed");
            },
            toast: (message:any) => {
              console.log(message);
            },
          }
        );
      } catch (error) {
        console.error('Error during Google Sign-In:', error);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  const handleClick = () => {
    handleGoogleSubmit();
  };

  return (
    <button onClick={handleClick} className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
    >
      <Image
        src="/images/Logo-google-icon-PNG.png"
        alt="Logo"
        width={28}
        height={28}
        priority
      />
      
      <span className='ms-6 '>Google</span>
    </button>
  );
};

export default GoogleSignInButton;
