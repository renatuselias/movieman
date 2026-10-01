import { MainPage } from "@/pages/main";
import { getTrendingMedia } from "@/entities/media";

interface Props {
   params: Promise<{ locales: string }>;
}

export default async function Home({ params }: Props) {
   const { locales } = await params;

   const data = await getTrendingMedia({ locale: locales });

   return <MainPage media={data.results} />;
}
