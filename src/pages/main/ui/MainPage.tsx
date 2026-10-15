import { BaseMedia } from "@/entities/media";
import { HeroCarousel } from "@/widgets/hero-carousel";
import { MediaGrid } from "@/widgets/media-grid";
import { getLocale, getTranslations } from "next-intl/server";
import {
   getCountryGenitiveName,
   getCountryName,
   getLanguageByCountry,
   getUserCountryCode,
} from "@/shared/lib/geo";
import { getUpcomingDates } from "@/shared/lib/format/get-upcoming-dates";

export async function MainPage({ media }: { media: BaseMedia[] }) {
   const t = await getTranslations("MainPage.sections");

   const { gte, lte } = getUpcomingDates(150);
   const locale = await getLocale();

   const countryCode = await getUserCountryCode();

   const originalLanguage = getLanguageByCountry(countryCode);

   const countryName = getCountryName(countryCode, locale);

   const countryGenitiveName = getCountryGenitiveName(countryCode, locale);

   return (
      <>
         <HeroCarousel media={media} />
         <div className="w-full px-4 sm:px-8 mt-60 space-y-20 sm:space-y-32 ">
            <MediaGrid
               title={t("inTheaters.title")}
               subtitle={t("inTheaters.subtitle")}
               mediaType="movie"
               params={{ endpoint: "/movie/now_playing" }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("comingSoon.title")}
               subtitle={t("comingSoon.subtitle")}
               mediaType="movie"
               params={{
                  sortBy: "popularity.desc",
                  releaseDateGte: gte,
                  releaseDateLte: lte,
               }}
               mediaCount={12}
            />

            <MediaGrid
               title={t("localLegends.title")}
               subtitle={t("localLegends.subtitle", {
                  countryGenitive: countryGenitiveName,
               })}
               mediaType="all"
               params={{
                  withOriginalLanguage: originalLanguage,
                  sortBy: "vote_average.desc",
                  voteCountGte: 20,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("popularInCountry.title", {
                  country: countryName,
               })}
               subtitle={t("popularInCountry.subtitle")}
               mediaType="all"
               params={{
                  withOriginalLanguage: originalLanguage,
                  sortBy: "popularity.desc",
                  voteCountGte: 50,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("onTheAir.title")}
               subtitle={t("onTheAir.subtitle")}
               mediaType="tv"
               params={{ endpoint: "/tv/on_the_air" }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("actionAdventure.title")}
               subtitle={t("actionAdventure.subtitle")}
               mediaType="tv"
               params={{
                  genreId: 10759,
                  sortBy: "popularity.desc",
                  withoutGenres: 16,
                  voteCountGte: 3000,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("HBO_hits.title")}
               subtitle={t("HBO_hits.subtitle")}
               mediaType="tv"
               params={{
                  providerId: 1899,
                  sortBy: "popularity.desc",
                  withoutGenres: 16,
                  voteCountGte: 2500,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("Apple.title")}
               subtitle={t("Apple.subtitle")}
               mediaType="tv"
               params={{
                  providerId: 350,
                  sortBy: "popularity.desc",
                  voteCountGte: 1500,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("Netflix.title")}
               subtitle={t("Netflix.subtitle")}
               mediaType="tv"
               params={{
                  providerId: 8,
                  sortBy: "popularity.desc",
                  voteCountGte: 3000,
                  withoutGenres: 16,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("mindGames.title")}
               subtitle={t("mindGames.subtitle")}
               mediaType="movie"
               params={{
                  genreId: 53,
                  sortBy: "vote_average.desc",
                  voteCountGte: 1500,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("HeartWrenchingStories.title")}
               subtitle={t("HeartWrenchingStories.subtitle")}
               mediaType="movie"
               params={{
                  genreId: 18,
                  sortBy: "vote_average.desc",
                  withoutGenres: "80, 16, 53, 878",
                  voteCountGte: 4000,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("EdgeOfYourSeatTV.title")}
               subtitle={t("EdgeOfYourSeatTV.subtitle")}
               mediaType="tv"
               params={{
                  genreId: 9648,
                  sortBy: "popularity.desc",
                  voteCountGte: 1000,
               }}
               mediaCount={6}
            />

            <MediaGrid
               title={t("TimeCapsule.title")}
               subtitle={t("TimeCapsule.subtitle")}
               mediaType="movie"
               params={{
                  releaseDateGte: "1980-01-01",
                  releaseDateLte: "1995-12-31",
                  withoutGenres: 16,
                  sortBy: "vote_average.desc",
                  voteCountGte: 800,
               }}
               mediaCount={12}
            />

            <MediaGrid
               title={t("BoxOffice.title")}
               subtitle={t("BoxOffice.subtitle")}
               mediaType="movie"
               params={{
                  sortBy: "revenue.desc",
                  withoutGenres: 16,
               }}
               mediaCount={12}
            />

            <MediaGrid
               title={t("TopRated.title")}
               subtitle={t("TopRated.subtitle")}
               mediaType="movie"
               params={{
                  sortBy: "vote_average.desc",
                  voteCountGte: 5000,
               }}
               mediaCount={12}
            />
         </div>
      </>
   );
}
