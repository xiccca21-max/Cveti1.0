import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CatalogNavbar } from "../components/CatalogNavbar";
import { Navbar } from "../components/Navbar";

export function SubPageLayout() {
  const location = useLocation();
  const isCatalog = location.pathname === "/catalog";
  const isBouquets = location.pathname === "/bouquets";
  const isContacts = location.pathname === "/contacts";
  const isReviews = location.pathname === "/reviews";
  const isWhiteBg = isCatalog || isBouquets || isContacts || isReviews;

  useEffect(() => {
    if (!isCatalog && !isBouquets && !isContacts && !isReviews) return;
    // Перебиваем восстановление скролла и любые "последующие" scrollIntoView.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [isCatalog, isBouquets, isContacts, isReviews, location.key]);

  return (
    <div
      className={
        isWhiteBg
          ? "relative min-h-screen w-full overflow-x-hidden bg-white"
          : "relative min-h-screen w-full overflow-x-hidden bg-background bg-gradient-to-b from-white/[0.07] via-transparent to-black/[0.06]"
      }
    >
      {!isWhiteBg ? (
        <div
          className="pointer-events-none fixed inset-0 opacity-40 mix-blend-soft-light"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.25), transparent)",
          }}
        />
      ) : null}
      <div className="relative z-10 flex min-h-screen flex-col">
        {isCatalog || isBouquets || isContacts || isReviews ? <CatalogNavbar /> : <Navbar />}
        <main
          className={
            isWhiteBg
              ? "mx-auto w-full max-w-[calc(100vw-24px)] flex-1 bg-white px-3 pb-0 pt-36 sm:max-w-[calc(100vw-40px)] sm:px-5 lg:max-w-[calc(100vw-120px)] lg:px-8 xl:max-w-[calc(100vw-220px)] 2xl:max-w-[calc(100vw-300px)]"
              : "mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-28 lg:px-10"
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
