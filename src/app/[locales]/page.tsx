import { MainPage } from "@/pages/main";
import { getTrendingMedia } from "@/entities/media";

export default async function Home() {
   const data = await getTrendingMedia();

   return <MainPage media={data.results} />;
}
