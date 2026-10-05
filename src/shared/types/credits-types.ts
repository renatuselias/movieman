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
   media_type: "movie";
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
   media_type: "movie";
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
   media_type: "tv";
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
   media_type: "tv";
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

export type TMDBMediaCast = TMDBCastMember | TMDBAggregateCastMember;
export type TMDBMediaCrew = TMDBCrewMember | TMDBAggregateCrewMember;
