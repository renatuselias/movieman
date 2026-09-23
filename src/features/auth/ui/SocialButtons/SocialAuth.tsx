"use client";
import { useAuthActions } from "../../model/use-auth-actions";
import { SocialAuthButton } from "./SocialAuthButton";

export default function SocialAuth() {
   const { signInWithGithub, signInWithGoogle, loadingType } = useAuthActions();

   return (
      <>
         <SocialAuthButton
            provider="google"
            onClick={signInWithGoogle}
            isLoading={loadingType === "google"}
            disabled={!!loadingType}
         />
         <SocialAuthButton
            provider="github"
            onClick={signInWithGithub}
            isLoading={loadingType === "github"}
            disabled={!!loadingType}
         />
      </>
   );
}
