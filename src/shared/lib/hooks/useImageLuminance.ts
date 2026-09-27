import { useState, useEffect } from "react";
import { getImageLuminance } from "../getImageLuminance";

export function useImageLuminance(imageUrl?: string | null) {
   const [isDark, setIsDark] = useState(false);

   useEffect(() => {
      if (!imageUrl) return;

      let isMounted = true;
      getImageLuminance(imageUrl).then((luminance) => {
         if (isMounted) {
            setIsDark(luminance < 0.15);
         }
      });

      return () => {
         isMounted = false;
      };
   }, [imageUrl]);

   return isDark;
}
