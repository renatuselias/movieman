import { FilmIcon, TvIcon, InfoIcon, LucideIcon } from "lucide-react";

export interface NavItem {
   href: string;
   translationKey: string;
   icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
   { href: "/movies", translationKey: "movies", icon: FilmIcon },
   { href: "/tvshows", translationKey: "tvshows", icon: TvIcon },
   { href: "/about", translationKey: "about", icon: InfoIcon },
];
