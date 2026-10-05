export type ImageQuality = "low" | "high";

export type ImageType = "backdrop" | "poster" | "logo";

export const TMDB_IMAGE_BASES: Record<
   ImageType,
   Record<ImageQuality, string>
> = {
   backdrop: {
      low: "https://image.tmdb.org/t/p/w1280",
      high: "https://image.tmdb.org/t/p/original",
   },
   poster: {
      low: "https://image.tmdb.org/t/p/w342",
      high: "https://image.tmdb.org/t/p/w780",
   },
   logo: {
      low: "https://image.tmdb.org/t/p/w185",
      high: "https://image.tmdb.org/t/p/w500",
   },
};
