const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

type TmdbParams = Record<string, string | number | boolean | undefined | null>;

export async function tmdbFetch(
   endpoint: string,
   params: TmdbParams = {},
   revalidate: number = 3600,
) {
   const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

   Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
         url.searchParams.append(key, String(value));
      }
   });

   const res = await fetch(url.toString(), {
      headers: {
         accept: "application/json",
         Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      next: {
         revalidate, // ISR
      },
   });

   if (!res.ok) {
      throw new Error(`TMDB error: ${res.status}`);
   }

   return res.json();
}
