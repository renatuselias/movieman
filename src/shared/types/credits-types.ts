// --- Movies (credits) ---

interface TMDBMovieBaseMember {
   id: number;
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   media_type: "movie";
   credit_id: string;
}

interface TMDBCastMember extends TMDBMovieBaseMember {
   cast_id: number;
   character: string;
   order: number;
}

interface TMDBCrewMember extends TMDBMovieBaseMember {
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

interface TMDBTVBaseMember {
   id: number;
   media_type: "tv";
   gender: number | null;
   known_for_department: string;
   name: string;
   original_name: string;
   popularity: number;
   profile_path: string | null;
   total_episode_count: number;
}

interface TMDBAggregateCastMember extends TMDBTVBaseMember {
   roles: TMDBAggregateRole[];
   order: number;
}

interface TMDBAggregateCrewMember extends TMDBTVBaseMember {
   jobs: TMDBAggregateJob[];
   department: string;
}

interface TMDBTVAggregateCredits {
   id: number;
   cast: TMDBAggregateCastMember[];
   crew: TMDBAggregateCrewMember[];
}

export type TMDBMediaCredits = TMDBMovieCredits | TMDBTVAggregateCredits;

export type TMDBMediaCast = TMDBCastMember | TMDBAggregateCastMember;
export type TMDBMediaCrew = TMDBCrewMember | TMDBAggregateCrewMember;
