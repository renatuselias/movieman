// src/shared/ui/formatted-runtime/formatted-runtime.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatRuntime } from "@/shared/lib/format/format-runtime";

interface FormattedRuntimeProps {
   runtime: number;
   className?: string;
}

export function FormattedRuntime({
   runtime,
   className,
}: FormattedRuntimeProps) {
   const t = useTranslations("media.headerInfo");
   const [isMinutesOnly, setIsMinutesOnly] = useState(false);

   if (!runtime || runtime <= 0) return null;

   const { hour, minute } = formatRuntime(runtime);

   const formattedString =
      hour > 0
         ? `${hour}${t("hour")} ${minute > 0 ? `${minute}${t("minute")}` : ""}`.trim()
         : `${minute}${t("minute")}`;

   const minutesOnlyString = `${runtime}${t("minute")}`;

   const handleClick = () => {
      setIsMinutesOnly((prev) => !prev);
   };

   return (
      <span
         onClick={handleClick}
         className={`${className} hover:text-zinc-300`}
         style={{ cursor: "pointer" }}
      >
         {isMinutesOnly ? minutesOnlyString : formattedString}
      </span>
   );
}
