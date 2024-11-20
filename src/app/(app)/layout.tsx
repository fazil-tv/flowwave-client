"use client";

import { SidebarItems } from "./_components/SidebarItems";
// import { toast } from "@/components/ui/use-toast";
// import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Navbar from "./_components/Navbar";


type Props = {
    children: ReactNode;
};

export default function Layout({ children }: Props) {
    const router = useRouter();
    // const { isLoading, isAuth } = useAppSelector((state) => state.authReducer);

    // if (!isLoading && !isAuth) {
    //     router.push("/login");
    //     toast({ variant: "destructive", description: "You are not logged in" });
    // }
    return (
        <main className="min-h-screen bg-gradient-to-tr from-[#100730] from-0% via-black via-30% to-[#100730] to-100% w-screen"
        
        >
            <div 
                className={cn(
                    " flex flex-col md:flex-row  w-screen flex-2  overflow-hidden",
                    "h-screen ",
                    
                )}
            >
                <SidebarItems />
                <div className="flex-1 flex flex-col !min-w-7">
                    <Navbar />
                    <div className=" mt-6 px-52  sm:px-42 lg:px-52">
                        {children}
                    </div>
                </div>
            </div>
        </main>

    );
}