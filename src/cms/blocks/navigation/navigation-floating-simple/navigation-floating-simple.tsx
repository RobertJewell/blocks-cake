"use client";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { MenuIcon } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { HydratedBlockProps } from "../../block-registry.types";
import { navigationFloatingSimpleConfig } from "./navigation-floating-simple-config";

export interface NavigationProps
  extends HydratedBlockProps<typeof navigationFloatingSimpleConfig> {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function NavigationFloatingSimple({
  logo,
  menuItems,
  ctaHref,
  ctaText,
  containerRef,
}: NavigationProps) {
  const { scrollY } = useScroll({ container: containerRef });
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  menuItems?.[0];

  return (
    <div
      className={cn(
        "z-50 w-full px-2 transition-all sm:px-4",
        isScrolled ? "fixed top-1" : "absolute top-2",
      )}
    >
      <div
        className={cn(
          "z-20 w-full rounded-xl px-2 transition-all",
          isScrolled
            ? "bg-background/70 text-accent-foreground shadow backdrop-blur border border-border"
            : "text-white",
        )}
      >
        <NavigationMenu className="flex h-14 w-full items-center justify-between overflow-hidden px-2">
          {logo?.[0] && (
            <a href="/" className="shrink-0">
              <img
                src={logo?.[0].variants?.original.key}
                alt="Logo"
                className="mt-[-8px] h-14 rounded-b-full border-2 border-white bg-white"
              />
            </a>
          )}

          <NavigationMenuList className="hidden gap-2 text-sm font-semibold md:flex">
            {menuItems?.map((item, index) => (
              <NavigationMenuItem key={index} className="relative">
                {item.subMenuItems && item.subMenuItems.length > 0 ? (
                  <>
                    <NavigationMenuTrigger
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 transition-colors hover:opacity-80 focus:outline-none",
                        isScrolled ? "text-accent-foreground" : "text-white",
                      )}
                    >
                      {item.text}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute top-full left-0 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                      {item.subMenuItems.map((sub, subIdx) => (
                        <NavigationMenuLink
                          key={subIdx}
                          href={sub.href || "#"}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {sub.text}
                        </NavigationMenuLink>
                      ))}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    href={item.href || "#"}
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 transition-colors hover:opacity-80 focus:outline-none",
                      isScrolled ? "text-accent-foreground" : "text-white",
                    )}
                  >
                    {item.text}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>

          <div className="flex items-center gap-4">
            <MenuIcon className="mx-2 flex md:hidden" />

            {ctaHref && ctaText && (
              <Button
                asChild
                className={cn(
                  "hidden text-sm font-medium md:flex",
                  isScrolled ? "" : "bg-white text-black hover:bg-gray-200",
                )}
              >
                <a href={ctaHref}>{ctaText}</a>
              </Button>
            )}
          </div>
        </NavigationMenu>
      </div>
    </div>
  );
}
