export { Info } from "./ui/Info";
export { Tagline } from "./ui/Tagline";
export { getMainCreators } from "./lib/getMainCreators";

export {
   useGetMediaDetails,
   useGetMediaFullInfo,
} from "./model/use-get-extras";

export { MediaHeader } from "./ui/MediaHeader";
export { GenresList } from "./ui/GenresList";

export { mapToBaseMedia } from "./lib/mappers/media.mapper";

export { getTrendingMedia } from "./api/get-trending-media";
export type * from "./model/types";
