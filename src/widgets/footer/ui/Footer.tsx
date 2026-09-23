"use client";

import { MobileMenu } from "@/widgets/mobile-menu";
import { useState } from "react";

export function Footer() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div
         className={`flex flex-col transition-all duration-300 ease-in-out ${
            isOpen ? "pb-12 md:pb-0" : "pb-0"
         }`}
      >
         <footer className="w-full flex items-center justify-center py-5 px-5 md:px-10">
            <h6 className="tracking-wide">
               MovieMan {new Date().getFullYear()}
            </h6>
         </footer>
         <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
         />
      </div>
   );
}
