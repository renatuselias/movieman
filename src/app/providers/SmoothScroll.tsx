"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
   useEffect(() => {
      const lenis = new Lenis({
         autoRaf: true,
         lerp: 0.15,
         wheelMultiplier: 0.9,
         anchors: {
            offset: -72,
            duration: 1.2,
            easing: (progress) => 1 - Math.pow(1 - progress, 3),
         },
         stopInertiaOnNavigate: true,
      });

      return () => lenis.destroy();
   }, []);

   return null;
}
