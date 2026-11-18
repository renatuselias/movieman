import { TMDBImage, TMDBMedia } from "./media-types";

export interface TMDBCollection {
   backdrop_path: string;
   id: number;
   images: { backdrops: TMDBImage[]; posters: TMDBImage[] };
   name: string;
   original_language: string;
   original_name: string;
   overview: string;
   parts: TMDBMedia[];
   poster_path: string;
}

export interface CollectionPerson {
   id: number;
   name: string;
   profile_path: string | null;
   character?: string;
   job?: string;
   appearanceCount: number;
}

export interface ExtendedCollection extends TMDBCollection {
   totalBudget: number;
   totalRevenue: number;
   cast: CollectionPerson[];
   creators: CollectionPerson[];
   averageRating: number;
}
