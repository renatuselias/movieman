interface ExternalIds {
   instagram_id?: string | null;
   facebook_id?: string | null;
   twitter_id?: string | null;
   tiktok_id?: string | null;
   youtube_id?: string | null;
   imdb_id?: string | null;
   wikidata_id?: string | null;
}

export interface SocialLink {
   label: string;
   href: string;
}

export const getSocialLinks = (externalIds?: ExternalIds): SocialLink[] => {
   if (!externalIds) return [];

   return [
      {
         label: "Instagram",
         href: externalIds.instagram_id
            ? `https://instagram.com/${externalIds.instagram_id}`
            : null,
      },
      {
         label: "Facebook",
         href: externalIds.facebook_id
            ? `https://facebook.com/${externalIds.facebook_id}`
            : null,
      },
      {
         label: "X",
         href: externalIds.twitter_id
            ? `https://x.com/${externalIds.twitter_id}`
            : null,
      },
      {
         label: "TikTok",
         href: externalIds.tiktok_id
            ? `https://tiktok.com/@${externalIds.tiktok_id}`
            : null,
      },
      {
         label: "YouTube",
         href: externalIds.youtube_id
            ? `https://youtube.com/${externalIds.youtube_id}`
            : null,
      },
      {
         label: "IMDB",
         href: externalIds.imdb_id
            ? `https://www.imdb.com/name/${externalIds.imdb_id}`
            : null,
      },
   ].filter((social): social is SocialLink => Boolean(social.href));
};
