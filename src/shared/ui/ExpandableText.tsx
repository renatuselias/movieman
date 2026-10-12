"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ExpandableTextProps {
   text: string;
   initialLines?: number;
}

export const ExpandableText = ({
   text,
   initialLines = 3,
}: ExpandableTextProps) => {
   const t = useTranslations("siteInterface");
   const [isExpanded, setIsExpanded] = useState(false);
   const [collapsedHeight, setCollapsedHeight] = useState<number | string>(
      "auto",
   );
   const [fullHeight, setFullHeight] = useState<number>(0);
   const [shouldShowButton, setShouldShowButton] = useState(false);

   const textRef = useRef<HTMLParagraphElement>(null);

   useEffect(() => {
      if (!textRef.current) return;

      const element = textRef.current;
      const computedStyle = window.getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 24;

      const totalHeight = element.scrollHeight;
      const targetCollapsedHeight = lineHeight * initialLines;

      setFullHeight(totalHeight);
      setCollapsedHeight(targetCollapsedHeight);

      if (totalHeight > targetCollapsedHeight + 4) {
         setShouldShowButton(true);
      } else {
         setShouldShowButton(false);
      }
   }, [text, initialLines]);

   return (
      <div className="mt-4">
         <motion.div
            initial={false}
            animate={{
               height:
                  isExpanded || !shouldShowButton
                     ? fullHeight
                     : collapsedHeight,
            }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
         >
            <p
               ref={textRef}
               className="text-base leading-relaxed"
            >
               {text}
            </p>
         </motion.div>

         {shouldShowButton && (
            <button
               onClick={() => setIsExpanded((prev) => !prev)}
               className="mt-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
            >
               {isExpanded ? t("readLess") : t("readMore")}
            </button>
         )}
      </div>
   );
};
