// --- Movies (credits) ---
interface TMDBCastMember {
   id: number;
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   cast_id: number;
   character: string;
   credit_id: string;
   order: number;
}

interface TMDBCrewMember {
   id: number;
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   credit_id: string;
   department: string;
   job: string;
}

interface TMDBMovieCredits {
   id: number;
   cast: TMDBCastMember[];
   crew: TMDBCrewMember[];
}

// --- TV Shows (aggregate_credits) ---
interface TMDBAggregateRole {
   credit_id: string;
   character: string;
   episode_count: number;
}

interface TMDBAggregateJob {
   credit_id: string;
   job: string;
   episode_count: number;
}

interface TMDBAggregateCastMember {
   id: number;
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   roles: TMDBAggregateRole[];
   total_episode_count: number;
   order: number;
}

interface TMDBAggregateCrewMember {
   id: number;
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   jobs: TMDBAggregateJob[];
   department: string;
   total_episode_count: number;
}

interface TMDBTVAggregateCredits {
   id: number;
   cast: TMDBAggregateCastMember[];
   crew: TMDBAggregateCrewMember[];
}

export type TMDBMediaCredits = TMDBMovieCredits | TMDBTVAggregateCredits;
