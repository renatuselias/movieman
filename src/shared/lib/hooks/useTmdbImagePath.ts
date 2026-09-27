"use client";

import { useEffect, useState } from "react";
import {
   TMDB_IMAGE_BASES,
   ImageType,
   ImageQuality,
} from "@/shared/config/tmdb-images";

interface NetworkInformation {
   effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
   saveData?: boolean;
}

export function useTmdbImagePath(type: ImageType = "poster"): string {
   // Keep the server and first client render identical to avoid hydration mismatches.
   const [quality, setQuality] = useState<ImageQuality>("high");

   useEffect(() => {
      let isMounted = true;

      const nav = navigator as Navigator & { connection?: NetworkInformation };
      const connection = nav.connection;
      if (
         connection?.saveData ||
         connection?.effectiveType === "2g" ||
         connection?.effectiveType === "slow-2g"
      ) {
         Promise.resolve().then(() => {
            if (isMounted) setQuality("low");
         });
         return () => {
            isMounted = false;
         };
      }

      const startTime = performance.now();

      fetch(`/api/ping?t=${Date.now()}`, { method: "HEAD", cache: "no-store" })
         .then((res) => {
            if (!res.ok) throw new Error("Ping failed");
            const duration = performance.now() - startTime;

            if (isMounted && duration > 1200) {
               setQuality("low");
            }
         })
         .catch(() => {
            if (isMounted) setQuality("low");
         });

      return () => {
         isMounted = false;
      };
   }, []);

   return TMDB_IMAGE_BASES[type][quality];
}
