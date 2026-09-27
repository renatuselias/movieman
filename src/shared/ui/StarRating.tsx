import { Star } from "lucide-react";

export function StarRating({ text }: { text: string }) {
   return (
      <div className="group flex w-fit items-center gap-1.5 px-1.5 py-0.5 rounded-sm bg-white/10 text-yellow-400">
         <Star className="w-3.5 h-3.5 text-yellow-400 fill-transparent transition-colors duration-500 group-hover:fill-yellow-400" />
         <span className="text-zinc-300 select-none text-sm font-bold">
            {text}
         </span>
      </div>
   );
}
