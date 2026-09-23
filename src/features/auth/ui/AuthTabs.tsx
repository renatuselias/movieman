"use client";

import { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import { FieldInput } from "./FieldInput";
import SocialAuth from "./SocialButtons/SocialAuth";
import { useAuthActions } from "../model/use-auth-actions";
import styles from "./SocialButtons/SocialAuthButton.module.css";
import { useTranslations } from "next-intl";

interface AuthTabsProps {
   onSuccess?: () => void;
}

export function AuthTabs({ onSuccess }: AuthTabsProps) {
   const { signInWithEmail, signUpWithEmail, loadingType, error } =
      useAuthActions();

   const t = useTranslations("auth");

   const [loginValues, setLoginValues] = useState({ email: "", password: "" });

   const [registerValues, setRegisterValues] = useState({
      name: "",
      email: "",
      password: "",
   });

   const isLoginDisabled =
      !loginValues.email.trim() ||
      !loginValues.password.trim() ||
      loadingType === "signIn";

   const isRegisterDisabled =
      !registerValues.name.trim() ||
      !registerValues.email.trim() ||
      !registerValues.password.trim() ||
      loadingType === "signUp";

   const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      await signInWithEmail(loginValues, onSuccess);
   };

   const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      await signUpWithEmail(registerValues, onSuccess);
   };

   return (
      <Tabs
         defaultValue="logIn"
         className="w-full mt-5 px-1"
      >
         <TabsList className="bg-input/30!">
            <TabsTrigger
               className="cursor-pointer text-lg! active:bg-input/70!"
               value="logIn"
            >
               {t("logIn")}
            </TabsTrigger>
            <TabsTrigger
               className="cursor-pointer text-lg!"
               value="register"
            >
               {t("register")}
            </TabsTrigger>
         </TabsList>

         {error && (
            <div className="mt-3 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
               {error}
            </div>
         )}

         <TabsContent value="logIn">
            <Card className="ring-0! w-full! px-2 bg-black!">
               <CardHeader className="px-0!">
                  <CardTitle>{t("logIn")}</CardTitle>
                  <CardDescription>{t("loginDescription")}</CardDescription>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground px-0! w-full!">
                  <form onSubmit={handleSignIn}>
                     <FieldInput
                        values={loginValues}
                        onChange={(field, val) =>
                           setLoginValues((prev) => ({ ...prev, [field]: val }))
                        }
                     />
                     <div className="flex gap-4 w-full mt-5">
                        <Button
                           type="submit"
                           disabled={isLoginDisabled}
                           className="cursor-pointer px-4 py-5 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {loadingType === "signIn" ? (
                              <div className={styles.spinner} />
                           ) : (
                              t("logIn")
                           )}
                        </Button>
                        <SocialAuth />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </TabsContent>

         <TabsContent value="register">
            <Card className="ring-0! w-full! px-2 bg-black!">
               <CardHeader className="px-0!">
                  <CardTitle>{t("register")}</CardTitle>
                  <CardDescription>{t("registerDescription")}</CardDescription>
               </CardHeader>
               <CardContent className="text-sm text-muted-foreground px-0! w-full!">
                  <form onSubmit={handleSignUp}>
                     <FieldInput
                        isRegister={true}
                        values={registerValues}
                        onChange={(field, val) =>
                           setRegisterValues((prev) => ({
                              ...prev,
                              [field]: val,
                           }))
                        }
                     />
                     <div className="flex gap-4 w-full mt-5">
                        <Button
                           type="submit"
                           disabled={isRegisterDisabled}
                           className="cursor-pointer px-4 py-5 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {loadingType === "signUp" ? (
                              <div className={styles.spinner} />
                           ) : (
                              t("register")
                           )}
                        </Button>
                        <SocialAuth />
                     </div>
                  </form>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
   );
}
