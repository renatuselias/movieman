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
