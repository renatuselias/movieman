export async function getImageLuminance(url: string): Promise<number> {
   return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");
         if (!ctx) return resolve(0.5);

         canvas.width = img.width;
         canvas.height = img.height;
         ctx.drawImage(img, 0, 0);

         try {
            const imageData = ctx.getImageData(
               0,
               0,
               canvas.width,
               canvas.height,
            );
            const data = imageData.data;
            let colorSum = 0;
            let alphaPixels = 0;

            for (let i = 0; i < data.length; i += 4) {
               const r = data[i];
               const g = data[i + 1];
               const b = data[i + 2];
               const a = data[i + 3];

               if (a > 50) {
                  const avg = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                  colorSum += avg;
                  alphaPixels++;
               }
            }

            const finalLuminance =
               alphaPixels > 0 ? colorSum / alphaPixels / 255 : 0;
            resolve(finalLuminance);
         } catch (e) {
            console.error("CORS / Canvas error:", e);
            resolve(0.5);
         }
      };

      img.onerror = () => resolve(0.5);
   });
}
