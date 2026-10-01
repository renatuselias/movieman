const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

type TmdbParams = Record<string, string | number | boolean | undefined | null>;

export async function tmdbFetch<T = unknown>(
   endpoint: string,
   params: TmdbParams = {},
   revalidate: number = 3600,
): Promise<T | null> {
   const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

   Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
         url.searchParams.append(key, String(value));
      }
   });

   try {
      const res = await fetch(url, {
         headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_API_KEY}`,
         },
         next: {
            revalidate,
         },
      });

      if (!res.ok) {
         console.error(`TMDB Fetch Error [${res.status}]: ${endpoint}`);
         return null;
      }

      return (await res.json()) as T;
   } catch (error) {
      console.error(`TMDB Network Error: ${endpoint}`, error);
      return null;
   }
}
