"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { formatDate } from "@/shared/lib/format/format-date";

export function DateComponent({ releaseDate }: { releaseDate: string | null }) {
   const currentLocale = useLocale();

   const [dateFormat, setDateFormat] = useState<"yearOnly" | "full">(
      "yearOnly",
   );
   if (!releaseDate) {
      return null;
   }
   const release = (format: "yearOnly" | "full") =>
      releaseDate ? formatDate(releaseDate, format, currentLocale) : null;

   return (
      <span
         onClick={() =>
            setDateFormat((prev) => (prev === "yearOnly" ? "full" : "yearOnly"))
         }
         className="cursor-pointer hover:text-zinc-300"
      >
         {release(dateFormat)}
      </span>
   );
}
