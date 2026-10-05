"use client";

import { useState, useEffect, ReactNode } from "react";

interface HeaderClientProps {
   children: ReactNode;
}

export function HeaderClient({ children }: HeaderClientProps) {
   const [isScrolled, setIsScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 27) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }
      };

      // Initialize state on mount
      handleScroll();

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <header
         className={`w-full hover:backdrop-blur-xs hover:bg-zinc-950 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
                ${
                   isScrolled
                      ? "bg-zinc-950/95 backdrop-blur-md"
                      : "bg-transparent"
                }`}
      >
         <div
            className={`flex justify-between items-center gap-2 sm:gap-4 md:gap-4 lg:gap-6 px-5 md:px-10 py-3 transition-all duration-500
                ${
                   isScrolled
                      ? "bg-black"
                      : "bg-linear-to-b from-black/80 via-black/40 to-transparent"
                }`}
         >
            {children}
         </div>
      </header>
   );
}
