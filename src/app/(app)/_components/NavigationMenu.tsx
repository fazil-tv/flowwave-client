"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavigationItems() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();


  const isActive = (href: string) => pathname.startsWith(href);

  console.log(id, "Dynamic ID");
  console.log(pathname, "Current Pathname");

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={`/projects/${id}/project`} legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} ${
                isActive(`/projects/${id}/project`) ? "bg-custom-purple text-white" : ""
              }`}
            >
              Project
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`/projects/${id}/tasks`} legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} ${
                isActive(`/projects/${id}/tasks`) ? "bg-custom-purple text-white" : ""
              }`}
            >
              Tasks
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} ${
                isActive("/docs") ? "bg-custom-purple text-white" : ""
              }`}
            >
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
