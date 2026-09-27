"use client";

import { useState, useEffect } from "react";

export function useIsPortrait(mobileBreakpoint: number = 768): boolean {
   const [isPortrait, setIsPortrait] = useState<boolean>(false);

   useEffect(() => {
      const mediaQuery = window.matchMedia(
         `(orientation: portrait) and (max-width: ${mobileBreakpoint}px)`,
      );

      const onChange = () => setIsPortrait(mediaQuery.matches);

      onChange();

      mediaQuery.addEventListener("change", onChange);

      return () => mediaQuery.removeEventListener("change", onChange);
   }, [mobileBreakpoint]);

   return isPortrait;
}
