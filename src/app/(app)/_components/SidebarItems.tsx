"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, } from "@/components/ui/sidebar";


import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconFolder

} from "@tabler/icons-react";


import Link from "next/link";
import { motion } from "framer-motion";

export function SidebarItems() {
  const links = [
    {
      label: "Dashboard",
      href: "/Dashboard",
      icon: (
        <IconBrandTabler className="text-custom-purple-light h-5 w-5 flex-shrink-0 " />
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <IconFolder className=" text-custom-purple-light h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "People",
      href: "/people/people",
      icon: (
        <IconUserBolt className="text-custom-purple-light h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-custom-purple-light h-5 w-5 flex-shrink-0" />
      ),
    },

  ];
  const [open, setOpen] = useState(false);
  return (

    <Sidebar open={open} setOpen={setOpen} >
      <SidebarBody className="gap-10  flex justify-between    absolute p-0 !bg-none ">
        <div className="flex !h-full p-5 gap-20 overflow-y-auto overflow-x-hidden
        bg-[rgba(103,61,245,0.1)] backdrop-blur-[50px] rounded-[16px]  border-[rgba(255,255,255,0.18)]  bg-blend-lighten
          shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)]   
                              ">
          
          <div className="mt-8 flex flex-col justify-evenly  w-screen ">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>



  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};



