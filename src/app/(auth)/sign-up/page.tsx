import Container from '@/components/layout/Container'
import React from 'react'
import { SignupForm } from './_forms/SignUpForm'
import Image from 'next/image'

export default function page() {
    return (
        <div>
            <div className="grid min-h-screen place-items-center w-full">
                <div className='max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input '>
                    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                        Welcome to Mystory
                    </h2>
                    <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                        Login to MyStory to Confess your untold stories and read others stories
                        too.
                    </p>
                    <SignupForm />
                </div>
            </div>
           
        </div>

    )
}
