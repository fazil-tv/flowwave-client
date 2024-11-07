import React from 'react'
import { InputOtp } from './_forms/VerifyForm'

function page() {
    return (
        <main className='bg-gradient-to-tr from-[#100730] from-0% via-black via-30% to-[#100730] to-100% h-fit'>
            <div className="grid min-h-screen place-items-center w-full text-white">
               <InputOtp/> 
            </div>
        </main>
    )
}

export default page