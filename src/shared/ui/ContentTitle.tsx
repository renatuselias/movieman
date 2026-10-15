export function ContentTitle({
   title,
   subtitle,
}: {
   title: string;
   subtitle: string;
}) {
   return (
      <div className="flex w-fit gap-4">
         <div className="flex flex-col text-sm">
            <span className="tracking-wider font-semibold uppercase text-[10px] text-zinc-600">
               {subtitle}
            </span>
            <h2 className="text-2xl font-semibold tracking-tighter">{title}</h2>
         </div>
      </div>
   );
}
