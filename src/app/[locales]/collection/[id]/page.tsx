import { getCollection } from "@/entities/collection/api/get-collection";
import { CollectionPage } from "@/pages/collection";
import { COLLECTION_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface CollectionPageProps {
   params: Promise<{ id: string }>;
}

export async function generateMetadata({
   params,
}: CollectionPageProps): Promise<Metadata> {
   const { id } = await params;
   const locale = await getLocale();
   const collection = await getCollection(String(id), locale);
   const t = await getTranslations({ locale, namespace: "meta" });

   if (!collection) {
      return {
         title: `${t("collectionNotFound")} | MovieMan`,
      };
   }

   return {
      title: `${collection.name} | MovieMan`,
      description: collection.overview,
   };
}

export default async function Collection({ params }: CollectionPageProps) {
   const { id } = await params;
   const locale = await getLocale();
   const collectionId = Number(id);

   if (isNaN(collectionId)) {
      notFound();
   }

   const queryClient = new QueryClient();
   const queryKey = [COLLECTION_EXTRAS_QUERY_KEY, collectionId] as const;

   await queryClient.query({
      queryKey,
      queryFn: () => getCollection(String(collectionId), locale),
   });

   const state = queryClient.getQueryState(queryKey);

   if (!state?.data) {
      notFound();
   }

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <CollectionPage collectionId={collectionId} />
      </HydrationBoundary>
   );
}
