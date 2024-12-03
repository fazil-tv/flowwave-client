import React from 'react'
import { Suspense } from 'react';
import { OtpVerifyForm } from './_forms/VerifyForm'

function page() {
    return (
       
            <div className="grid min-h-screen place-items-center w-full text-white">

                <div className='max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input '>
                    <h2 className="font-bold text-xl text-neutral-400 text-center">
                        Have a verification code instead?
                    </h2>
                
                    <Suspense>
                        <OtpVerifyForm />
                    </Suspense>
                    <p className="text-neutral-600 text-sm max-w-sm mt-5 dark:text-neutral-300 ">
                        Not seeing the email in your inbox? Try sending again.
                    </p>
                </div>
            </div>

    )
}
export default page