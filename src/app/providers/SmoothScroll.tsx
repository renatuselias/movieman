"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const HISTORY_ENTRY_KEY = "__moviemanScrollEntry";
const SCROLL_STORAGE_KEY = "movieman:scroll:";

function createHistoryEntryId() {
   return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export default function SmoothScroll() {
   const pathname = usePathname();
   const lenisRef = useRef<Lenis | null>(null);
   const pathnameRef = useRef(pathname);
   const entryIdRef = useRef<string | null>(null);
   const entryPathRef = useRef("");
   const popstateRef = useRef(false);
   const suspendScrollSaveRef = useRef(false);
   const suspendTimeoutRef = useRef<number | null>(null);

   useEffect(() => {
      const lenis = new Lenis({
         autoRaf: true,
         lerp: 0.15,
         wheelMultiplier: 0.9,
         anchors: {
            offset: -72,
            duration: 2,
            easing: (progress) =>
               progress < 0.5
                  ? 4 * progress ** 3
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2,
         },
         stopInertiaOnNavigate: true,
      });
      lenisRef.current = lenis;

      const previousScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";

      const ensureEntryId = () => {
         const state = (window.history.state ?? {}) as Record<string, unknown>;
         const existingId = state[HISTORY_ENTRY_KEY];
         if (typeof existingId === "string") return existingId;

         const id = createHistoryEntryId();
         window.history.replaceState(
            { ...state, [HISTORY_ENTRY_KEY]: id },
            "",
            window.location.href,
         );
         return id;
      };
      entryIdRef.current = ensureEntryId();
      entryPathRef.current = window.location.pathname;

      const saveScrollPosition = () => {
         const entryId = entryIdRef.current;
         if (entryId && window.location.pathname === entryPathRef.current) {
            sessionStorage.setItem(
               `${SCROLL_STORAGE_KEY}${entryId}`,
               String(window.scrollY),
            );
         }
      };
      let saveFrame: number | null = null;
      const handleScroll = () => {
         if (
            suspendScrollSaveRef.current ||
            document.querySelector('[role="dialog"]')
         ) {
            return;
         }
         if (window.location.pathname !== entryPathRef.current) return;
         if (saveFrame !== null) return;
         saveFrame = window.requestAnimationFrame(() => {
            saveFrame = null;
            saveScrollPosition();
         });
      };
      const handleClick = (event: MouseEvent) => {
         if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
         ) {
            return;
         }

         const target = event.target;
         if (!(target instanceof Element)) return;
         const dialog = target.closest('[role="dialog"]');
         if (dialog) {
            const link = target.closest<HTMLAnchorElement>("a[href]");
            if (link) {
               const destination = new URL(link.href, window.location.href);
               if (
                  destination.origin === window.location.origin &&
                  destination.pathname !== window.location.pathname
               ) {
                  suspendScrollSaveRef.current = true;
                  if (suspendTimeoutRef.current !== null) {
                     window.clearTimeout(suspendTimeoutRef.current);
                  }
                  suspendTimeoutRef.current = window.setTimeout(() => {
                     suspendScrollSaveRef.current = false;
                     suspendTimeoutRef.current = null;
                  }, 2000);
               }
            }
            return;
         }

         if (saveFrame !== null) {
            window.cancelAnimationFrame(saveFrame);
            saveFrame = null;
         }
         saveScrollPosition();
      };
      const handlePopstate = () => {
         popstateRef.current = true;
      };
      const handlePageHide = () => saveScrollPosition();
      const handleTouchStart = (event: TouchEvent) => {
         const target = event.target;
         if (
            target instanceof Element &&
            !target.closest('[role="dialog"]') &&
            !suspendScrollSaveRef.current
         ) {
            saveScrollPosition();
         }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("click", handleClick, true);
      document.addEventListener("touchstart", handleTouchStart, {
         capture: true,
         passive: true,
      });
      window.addEventListener("popstate", handlePopstate);
      window.addEventListener("pagehide", handlePageHide);

      return () => {
         window.removeEventListener("scroll", handleScroll);
         document.removeEventListener("click", handleClick, true);
         document.removeEventListener("touchstart", handleTouchStart, true);
         window.removeEventListener("popstate", handlePopstate);
         window.removeEventListener("pagehide", handlePageHide);
         if (saveFrame !== null) window.cancelAnimationFrame(saveFrame);
         if (suspendTimeoutRef.current !== null) {
            window.clearTimeout(suspendTimeoutRef.current);
         }
         window.history.scrollRestoration = previousScrollRestoration;
         lenisRef.current = null;
         lenis.destroy();
      };
   }, []);

   useLayoutEffect(() => {
      if (pathnameRef.current === pathname) return;

      pathnameRef.current = pathname;
      const isHistoryNavigation = popstateRef.current;
      popstateRef.current = false;
      suspendScrollSaveRef.current = false;
      if (suspendTimeoutRef.current !== null) {
         window.clearTimeout(suspendTimeoutRef.current);
         suspendTimeoutRef.current = null;
      }

      const state = (window.history.state ?? {}) as Record<string, unknown>;
      const historyEntryId =
         typeof state[HISTORY_ENTRY_KEY] === "string"
            ? state[HISTORY_ENTRY_KEY]
            : null;
      const entryId = isHistoryNavigation
         ? (historyEntryId ?? createHistoryEntryId())
         : createHistoryEntryId();

      entryIdRef.current = entryId;
      entryPathRef.current = window.location.pathname;
      if (!isHistoryNavigation || !historyEntryId) {
         window.history.replaceState(
            { ...state, [HISTORY_ENTRY_KEY]: entryId },
            "",
            window.location.href,
         );
      }

      const savedPosition = isHistoryNavigation && entryId
         ? sessionStorage.getItem(`${SCROLL_STORAGE_KEY}${entryId}`)
         : null;
      const parsedPosition = savedPosition === null ? 0 : Number(savedPosition);
      const scrollPosition =
         Number.isFinite(parsedPosition) && parsedPosition >= 0
            ? parsedPosition
            : 0;

      let resizeObserver: ResizeObserver | null = null;
      let frame: number | null = null;
      const cancelPendingRestore = () => {
         resizeObserver?.disconnect();
         resizeObserver = null;
         window.removeEventListener("wheel", cancelPendingRestore);
         window.removeEventListener("touchmove", cancelPendingRestore);
         window.removeEventListener("keydown", cancelPendingRestore);
      };
      const restorePosition = () => {
         const lenis = lenisRef.current;
         lenis?.resize();
         const maxScroll =
            lenis?.limit ??
            document.documentElement.scrollHeight - window.innerHeight;
         if (scrollPosition > maxScroll + 1) return false;

         lenis?.scrollTo(scrollPosition, { immediate: true });
         cancelPendingRestore();
         return true;
      };
      const scheduleRestore = () => {
         frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(() => {
               frame = null;
               if (!restorePosition()) {
                  resizeObserver = new ResizeObserver(restorePosition);
                  resizeObserver.observe(document.body);
                  resizeObserver.observe(document.documentElement);
                  window.addEventListener("wheel", cancelPendingRestore, {
                     passive: true,
                  });
                  window.addEventListener("touchmove", cancelPendingRestore, {
                     passive: true,
                  });
                  window.addEventListener("keydown", cancelPendingRestore);
               }
            });
         });
      };
      scheduleRestore();

      return () => {
         cancelPendingRestore();
         if (frame !== null) window.cancelAnimationFrame(frame);
      };
   }, [pathname]);

   return null;
}
