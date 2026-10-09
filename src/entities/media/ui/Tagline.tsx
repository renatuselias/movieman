export function Tagline({ tagline }: { tagline: string | null }) {
   return (
      tagline && (
         <div className="relative pl-2 border-l-2 border-red-700 my-1">
            <p className="font-sans italic text-base leading-relaxed text-zinc-300 drop-shadow-sm line-clamp-3 sm:line-clamp-4">
               {tagline.startsWith("«") ? tagline : `"${tagline}"`}
            </p>
         </div>
      )
   );
}
