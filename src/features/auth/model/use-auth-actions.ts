"use client";

import { authClient } from "@/shared/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export type LoadingType =
   | "github"
   | "google"
   | "logout"
   | "signIn"
   | "signUp"
   | null;

export function useAuthActions() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const [loadingType, setLoadingType] = useState<LoadingType>(null);
   const [error, setError] = useState<string | null>(null);

   const t = useTranslations("auth.error");

   const getErrorMessage = (err: unknown): string => {
      if (err instanceof Error) return err.message;
      if (typeof err === "string") return err;
      return "An unexpected error occurred";
   };

   const signInWithEmail = async (
      data: { email: string; password: string },
      onSuccess?: () => void,
   ) => {
      setLoadingType("signIn");
      setError(null);

      try {
         const res = await authClient.signIn.email({
            email: data.email,
            password: data.password,
         });

         if (res.error) {
            setError(t(`${res.error.code}`) || t("failedSignIn"));
            return;
         }

         queryClient.clear();
         router.refresh();
         onSuccess?.();
      } catch (err: unknown) {
         setError(getErrorMessage(err));
      } finally {
         setLoadingType(null);
      }
   };

   const signUpWithEmail = async (
      data: { email: string; password: string; name: string },
      onSuccess?: () => void,
   ) => {
      setLoadingType("signUp");
      setError(null);

      try {
         const res = await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.name,
         });

         if (res.error) {
            setError(t(`${res.error.code}`) || t("failedSignIn"));
            return;
         }

         queryClient.clear();
         router.refresh();
         onSuccess?.();
      } catch (err: unknown) {
         setError(getErrorMessage(err));
      } finally {
         setLoadingType(null);
      }
   };

   const signInWithGithub = async () => {
      setLoadingType("github");
      setError(null);
      try {
         await authClient.signIn.social({
            provider: "github",
            callbackURL: window.location.href,
         });
      } catch (err: unknown) {
         console.error(err);
         setError(getErrorMessage(err));
      } finally {
         setLoadingType(null);
      }
   };

   const signInWithGoogle = async () => {
      setLoadingType("google");
      setError(null);
      try {
         await authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.href,
         });
      } catch (err: unknown) {
         console.error(err);
         setError(getErrorMessage(err));
      } finally {
         setLoadingType(null);
      }
   };

   const signOut = async () => {
      setLoadingType("logout");
      setError(null);
      try {
         await authClient.signOut({
            fetchOptions: {
               onSuccess: () => {
                  queryClient.clear();
                  router.refresh();
               },
            },
         });
      } catch (err: unknown) {
         setError(getErrorMessage(err));
      } finally {
         setLoadingType(null);
      }
   };

   return {
      signInWithEmail,
      signUpWithEmail,
      signInWithGithub,
      signInWithGoogle,
      signOut,
      loadingType,
      error,
      clearError: () => setError(null),
   };
}
