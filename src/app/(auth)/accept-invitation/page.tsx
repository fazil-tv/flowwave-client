'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAcceptInvitationMutation } from '@/redux/user/userApi';

export default function AcceptInvitation() {
  const [acceptInvitation, { isLoading, isError, isSuccess }] = useAcceptInvitationMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  const handleInvitationAcceptance = async (token: string) => {
    try {
      const response = await acceptInvitation(token).unwrap();

      if (response?.success) {
        // Successful invitation acceptance
        // toast.success('Invitation accepted successfully!');
        setIsProcessing(false);
      } else {
        // Handle case where success is false
        // toast.error(response?.message || 'Failed to accept invitation');
        setIsProcessing(false);
      }
    } catch (error: any) {
      // Handle API errors
      // toast.error(error?.data?.message || 'An error occurred while accepting the invitation');
      setIsProcessing(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleInvitationAcceptance(token);
    } else {
      // No token provided
      // toast.error('Invalid invitation link');
      router.push('/login');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Project Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600">Processing your invitation...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">
                If you are not redirected automatically,
                click the button below.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          {!isProcessing && (
            <Button
              onClick={() => router.push('/projects')}
              className="w-full"
            >
                accept and  go to Projects
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}