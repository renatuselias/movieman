import { ReactNode } from "react";

export const TextDetailItem = ({
   title,
   children,
}: {
   title: string;
   children?: ReactNode;
}) => {
   if (!children) return null;

   return (
      <div className="flex flex-col gap-2 pb-5 border-b border-zinc-800">
         <h4 className="uppercase text-[10px] text-zinc-500 tracking-wider">
            {title}
         </h4>
         <div className="text-zinc-300 text-wrap">{children}</div>
      </div>
   );
};
