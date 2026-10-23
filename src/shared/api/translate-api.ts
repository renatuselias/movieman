export async function translateText(
   text: string,
   targetLang: string,
): Promise<string> {
   if (!text) return "";

   try {
      const shortLang = targetLang.split("-")[0];

      const res = await fetch(
         `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${shortLang}&dt=t&q=${encodeURIComponent(text)}`,
         { next: { revalidate: 86400 } },
      );

      if (!res.ok) return text;

      const data = await res.json();
      return data[0]?.map((item: [string]) => item[0]).join("") ?? text;
   } catch (error) {
      console.error("Translation error:", error);
      return text;
   }
}
