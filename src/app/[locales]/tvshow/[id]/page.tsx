import { Metadata } from "next";
import { MediaPage } from "@/pages/media/ui/MediaPage";
import { notFound } from "next/navigation";
import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { MEDIA_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import { getMediaDetails } from "@/entities/media/api/get-media-details";
import { getLocale } from "next-intl/server";

interface MoviePageProps {
   params: Promise<{ id: string }>;
}

export async function generateMetadata({
   params,
}: MoviePageProps): Promise<Metadata> {
   const { id } = await params;
   const locale = await getLocale();
   const tvshow = await getMediaDetails(id, "tv", locale);

   if (!tvshow) {
      return {
         title: "TV Show Not Found | MovieMan",
      };
   }

   return {
      title: `${tvshow.title} | MovieMan`,
      description: tvshow.overview,
   };
}

export default async function MoviePage({ params }: MoviePageProps) {
   const { id } = await params;
   const locale = await getLocale();
   const numericId = Number(id);

   if (isNaN(numericId)) {
      notFound();
   }

   const queryClient = new QueryClient();
   const queryKey = [MEDIA_EXTRAS_QUERY_KEY, numericId, "tv", true] as const;

   await queryClient.query({
      queryKey,
      queryFn: () => getMediaDetails(id, "tv", locale),
   });

   const state = queryClient.getQueryState(queryKey);

   if (!state?.data) {
      notFound();
   }

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <MediaPage
            mediaId={numericId}
            mediaType="tv"
         />
      </HydrationBoundary>
   );
}
