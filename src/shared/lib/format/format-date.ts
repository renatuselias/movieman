import { MediaType } from "@/shared/types/media-types";

type DateFormatMode = "full" | "yearOnly";

export const formatDate = (
   date: string | null,
   mode: DateFormatMode = "yearOnly",
   currentLocale: string,
) => {
   if (!date) return null;

   const options: Intl.DateTimeFormatOptions =
      mode === "yearOnly"
         ? { year: "numeric" }
         : { day: "numeric", month: "long", year: "numeric" };

   return new Date(date).toLocaleDateString(currentLocale, options);
};

export const getReleaseLabel = (
   date: string | null,
   mediaType: MediaType,
): string | null => {
   if (!date) return null;

   const isFuture = new Date(date) > new Date();

   if (isFuture) return "premiere";

   return mediaType === "tv" ? "firstAired" : "releaseDate";
};
