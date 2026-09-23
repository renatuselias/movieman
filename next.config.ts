import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
   // stupid rules new version of next.js... allowedDevOrigins and other shit...
   allowedDevOrigins: ["192.168.0.*"],
   experimental: {
      globalNotFound: true,
   },

   images: {
      qualities: [75, 90],
      unoptimized: true, // Disables Vercel's image optimization service
      remotePatterns: [
         {
            protocol: "https",
            hostname: "image.tmdb.org",
         },
      ],
   },
};

const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");
export default withNextIntl(nextConfig);
