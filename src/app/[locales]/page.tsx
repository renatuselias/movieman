import { MainPage } from "@/pages/main";
import { getTrendingMedia } from "@/entities/media";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
   params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "meta" });

   return {
      title: `MovieMan`,
      description: t("mainPageDescription"),
   };
}

export default async function Home({ params }: Props) {
   const { locale } = await params;

   const data = await getTrendingMedia({ locale: locale, mediaType: "all" });

   return <MainPage media={data} />;
}
