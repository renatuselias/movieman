const COUNTRY_TO_LANG_EXCEPTIONS: Record<string, string> = {
   US: "en",
   GB: "en",
   AU: "en",
   CA: "en",
   NZ: "en",
   IE: "en",
   BR: "pt",
   AT: "de",
   CH: "de",
   MX: "es",
   AR: "es",
   CL: "es",
   CO: "es",
   PE: "es",
   CN: "zh",
   TW: "zh",
   HK: "zh",
   JP: "ja",
   KR: "ko",
   UA: "uk",
};

export function getLanguageByCountry(countryCode: string): string {
   const code = countryCode.toUpperCase();
   return COUNTRY_TO_LANG_EXCEPTIONS[code] || code.toLowerCase();
}

export function getCountryName(countryCode: string, locale: string): string {
   const code = countryCode.toUpperCase();
   const lang = locale.split("-")[0].toLowerCase();
   const bcp47Locale = lang === "uk" || lang === "ua" ? "uk-UA" : lang;

   try {
      const regionNames = new Intl.DisplayNames([bcp47Locale], {
         type: "region",
      });
      return regionNames.of(code) || code;
   } catch {
      return code;
   }
}

export function getCountryGenitiveName(
   countryCode: string,
   locale: string,
): string {
   const baseName = getCountryName(countryCode, locale);
   const lang = locale.split("-")[0].toLowerCase();

   if (lang === "uk" || lang === "ua") {
      if (baseName.endsWith("ія")) return baseName.slice(0, -2) + "ії";
      if (baseName.endsWith("я")) return baseName.slice(0, -1) + "ї";
      if (baseName.endsWith("а")) return baseName.slice(0, -1) + "и";
   }

   if (lang === "ru") {
      if (baseName.endsWith("ия")) return baseName.slice(0, -2) + "ии";
      if (baseName.endsWith("я")) return baseName.slice(0, -1) + "и";
      if (baseName.endsWith("а")) return baseName.slice(0, -1) + "ы";
   }

   return baseName;
}

export async function getUserCountryCode(
   fallbackCountry = "UA",
): Promise<string> {
   const { headers } = await import("next/headers");
   const headersList = await headers();

   const cdnCountry =
      headersList.get("x-vercel-ip-country") ||
      headersList.get("cf-ipcountry") ||
      headersList.get("cloudfront-viewer-country") ||
      headersList.get("x-geo-country");

   if (cdnCountry && cdnCountry !== "XX") {
      return cdnCountry.toUpperCase();
   }

   const forwardedFor = headersList.get("x-forwarded-for");
   const realIp = headersList.get("x-real-ip");
   const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

   if (
      !clientIp ||
      clientIp === "127.0.0.1" ||
      clientIp === "::1" ||
      clientIp.startsWith("192.168.") ||
      clientIp.startsWith("10.")
   ) {
      return fallbackCountry;
   }

   try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`https://ipapi.co/${clientIp}/country/`, {
         signal: controller.signal,
         next: { revalidate: 86400 },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
         const country = (await res.text()).trim().toUpperCase();
         if (country && country.length === 2) return country;
      }
   } catch {}

   return fallbackCountry;
}
