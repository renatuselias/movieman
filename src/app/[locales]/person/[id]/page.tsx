import { PERSON_EXTRAS_QUERY_KEY } from "@/shared/config/query-keys";
import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PersonPage } from "@/pages/person";
import { getPersonDetail } from "@/entities/person/api/get-person-details";

interface PersonPageProps {
   params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
   params,
}: PersonPageProps): Promise<Metadata> {
   const { id } = await params;
   const locale = await getLocale();

   const person = await getPersonDetail(id, locale);

   if (!person) {
      return {
         title: "Person Not Found | MovieMan",
      };
   }

   return {
      title: `${person.name} | MovieMan`,
      description: person.biography || "No biography available.",
   };
}

export default async function Page({ params }: PersonPageProps) {
   const { id } = await params;
   const locale = await getLocale();
   const numericId = Number(id);

   if (isNaN(numericId)) {
      notFound();
   }

   const queryClient = new QueryClient();
   const queryKey = [PERSON_EXTRAS_QUERY_KEY, numericId] as const;

   await queryClient.query({
      queryKey,
      queryFn: () => getPersonDetail(id, locale),
   });

   const state = queryClient.getQueryState(queryKey);

   if (!state?.data) {
      notFound();
   }

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <PersonPage personId={numericId} />
      </HydrationBoundary>
   );
}
