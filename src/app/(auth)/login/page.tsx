import Container from '@/components/layout/Container'
import React from 'react'
import { LoginForm } from './_forms/loginform'

export default function page() {
    return (
        <main className='bg-gradient-to-tr from-[#100730] from-0% via-black via-30% to-[#100730] to-100% h-screen'>
             <Container className="grid min-h-screen place-items-center ">
                <div className='text-white '>
                   <LoginForm/>
                </div>
                </Container>
        </main>
    )
}
