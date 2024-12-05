'use client'
import React, { useState } from "react";
import Link from 'next/link'
import { Menu, X } from 'lucide-react'


import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'

import { useGlobalUser } from '@/hooks/useGlobalUser';
import { Avatar } from './Avatar'


const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const { user, isLoading } = useGlobalUser();

   

    if (isLoading) {
        return <div>Loading...</div>;
    }



    return (

        <nav
            className="py-2 border-b border-b-[hsla(0,0%,100%,0.2)] bg-gradient-radial from-[#6419ff] via-[#6419ff] to-transparent backdrop-blur-md"
            
        >
            
            <div className=" px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end h-16">

                    <div className=''>
                        <Avatar user={user.data || null} />
                    </div>
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                                    <span className="sr-only">Open main menu</span>
                                    {isOpen ? (
                                        <X className="h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Menu className="h-6 w-6" aria-hidden="true" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:max-w-none">
                                <div className="mt-6 flow-root">
                                    <div className="-my-6 divide-y divide-gray-500/10">
                                        <div className="space-y-2 py-6">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}