export function ContentTitle({
   title,
   subtitle,
}: {
   title: string;
   subtitle: string;
}) {
   return (
      <div className="flex w-fit">
         <div className="flex flex-col gap-2">
            <span className="text-xs tracking-wider font-light uppercase text-zinc-400">
               {subtitle}
            </span>
            <h2 className="text-zinc-100 text-3xl font-semibold uppercase tracking-tighter">
               {title}
            </h2>
         </div>
      </div>
   );
}
