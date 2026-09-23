import {
   Field,
   FieldDescription,
   FieldGroup,
   FieldLabel,
   FieldSet,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useTranslations } from "next-intl";
interface FieldInputProps {
   isRegister?: boolean;
   values: { name?: string; email: string; password: string };
   onChange: (field: string, value: string) => void;
}

export function FieldInput({ isRegister, values, onChange }: FieldInputProps) {
   const t = useTranslations("auth");

   return (
      <FieldSet className="w-full!">
         <FieldGroup className="gap-3!">
            {isRegister && (
               <Field>
                  <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
                  <Input
                     id="name"
                     name="name"
                     type="text"
                     placeholder={t("namePlaceholder")}
                     value={values.name || ""}
                     onChange={(e) => onChange("name", e.target.value)}
                  />
               </Field>
            )}
            <Field>
               <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
               <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder={t("emailPlaceholder")}
                  value={values.email}
                  onChange={(e) => onChange("email", e.target.value)}
               />
            </Field>
            <Field>
               <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
               <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={values.password}
                  onChange={(e) => onChange("password", e.target.value)}
               />
               {isRegister && (
                  <FieldDescription className="text-xs">
                     {t("passwordTip")}
                  </FieldDescription>
               )}
            </Field>
         </FieldGroup>
      </FieldSet>
   );
}
