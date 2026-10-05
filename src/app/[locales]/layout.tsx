import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/widgets/header";
import QueryProvider from "../providers/QueryProvider";
import { Footer } from "@/widgets/footer";
import { MobileMenu } from "@/widgets/mobile-menu";

const inter = Inter({
   variable: "--font-inter",
   subsets: ["latin", "cyrillic"],
});

const montserrat = Montserrat({
   subsets: ["latin", "cyrillic"],
   display: "swap",
   weight: ["400", "500", "600", "700"],
   variable: "--font-montserrat",
});

export const metadata: Metadata = {
   title: "MovieMan",
   description: "Movie library app",
};

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const messages = await getMessages();

   return (
      <html
         lang="en"
         className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
         suppressHydrationWarning
      >
         <body className="font-sans min-h-full bg-background text-foreground">
            <NextIntlClientProvider messages={messages}>
               <QueryProvider>
                  <div className="flex flex-col min-h-svh relative">
                     <Header />
                     <main className="flex-1 flex flex-col">{children}</main>
                     <Footer />
                     <MobileMenu />
                  </div>
               </QueryProvider>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
