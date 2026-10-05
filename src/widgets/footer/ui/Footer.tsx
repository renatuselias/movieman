export function Footer() {
   return (
      <div
         className={`flex flex-col transition-all duration-300 ease-in-out pb-12 sm:pb-0`}
      >
         <footer className="w-full flex items-center justify-center py-5 px-5 md:px-10">
            <h6 className="tracking-wide">
               MovieMan {new Date().getFullYear()}
            </h6>
         </footer>
      </div>
   );
}
