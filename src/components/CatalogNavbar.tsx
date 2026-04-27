import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Send, ShoppingCart, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { CITY, SHOPS, TG_URL, VK_URL } from "../config/site";

const catalogLinks = [
  { label: "Главная", to: "/" },
  { label: "Каталог", to: "/catalog" },
  { label: "Букеты", to: "/bouquets" },
  { label: "Опт", to: "/opt" },
  { label: "Контакты", to: "/contacts" },
] as const;

type CatalogNavbarProps = {
  transparent?: boolean;
};

export function CatalogNavbar({ transparent = false }: CatalogNavbarProps) {
  void transparent;
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const [drawerPos, setDrawerPos] = useState<{ top: number; right: number }>({ top: 0, right: 12 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const headerEl = headerRef.current;
      const burgerEl = burgerRef.current;
      if (!headerEl || !burgerEl) return;

      const headerRect = headerEl.getBoundingClientRect();
      const burgerRect = burgerEl.getBoundingClientRect();
      const right = Math.max(8, window.innerWidth - burgerRect.right);
      const top = Math.max(0, headerRect.bottom);
      setDrawerPos({ top, right });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-xl border-black/10 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.25)]"
            : "bg-white border-black/[0.04]"
        }`}
      >
        {/* Бегущая строка */}
        <div className="flex w-full overflow-hidden bg-[#333231] py-1.5 text-white/90">
          <div className="animate-marquee whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px]">
            <span className="mx-4">✦ ОПТОВЫЕ ЦЕНЫ ДЛЯ ВСЕХ</span>
            <span className="mx-4">✦ БЕСПЛАТНАЯ ДОСТАВКА ОТ 2000 ₽</span>
            <span className="mx-4">✦ СВЕЖИЙ СРЕЗ КАЖДЫЙ ДЕНЬ</span>
            <span className="mx-4">✦ ОПТОВЫЕ ЦЕНЫ ДЛЯ ВСЕХ</span>
            <span className="mx-4">✦ БЕСПЛАТНАЯ ДОСТАВКА ОТ 2000 ₽</span>
            <span className="mx-4">✦ СВЕЖИЙ СРЕЗ КАЖДЫЙ ДЕНЬ</span>
            <span className="mx-4">✦ ОПТОВЫЕ ЦЕНЫ ДЛЯ ВСЕХ</span>
            <span className="mx-4">✦ БЕСПЛАТНАЯ ДОСТАВКА ОТ 2000 ₽</span>
            <span className="mx-4">✦ СВЕЖИЙ СРЕЗ КАЖДЫЙ ДЕНЬ</span>
            <span className="mx-4">✦ ОПТОВЫЕ ЦЕНЫ ДЛЯ ВСЕХ</span>
            <span className="mx-4">✦ БЕСПЛАТНАЯ ДОСТАВКА ОТ 2000 ₽</span>
            <span className="mx-4">✦ СВЕЖИЙ СРЕЗ КАЖДЫЙ ДЕНЬ</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[calc(100vw-24px)] px-3 sm:max-w-[calc(100vw-40px)] sm:px-5 lg:max-w-[calc(100vw-120px)] lg:px-6 xl:max-w-[calc(100vw-220px)] 2xl:max-w-[calc(100vw-300px)]">
          <div className="relative flex min-h-[70px] items-center justify-between py-3 lg:min-h-[90px]">
            
            {/* Логотип слева */}
            <Link
              to="/"
              aria-label="ЦВЕТИ — на главную"
              className="font-heraclito inline-flex items-center gap-[2px] text-[28px] font-black leading-none text-[#2a2a2a] transition-all duration-500 hover:tracking-[0.1em] sm:text-[32px] lg:text-[40px]"
            >
              <span>ЦВЕТИ</span>
              <img
                src="/logo-flower-mark.png"
                alt=""
                aria-hidden="true"
                className="-ml-[2px] h-[2.15em] w-auto translate-y-[0.1em]"
                loading="eager"
                decoding="async"
              />
            </Link>

            {/* Блок справа: Адреса + Иконки */}
            <div className="flex items-center gap-4 sm:gap-8">
              {/* Режим работы и адреса (Hover-эффект) */}
              <div className="hidden flex-col sm:flex group transition-colors duration-300 text-[#333231]">
                <div className="flex flex-col relative py-2 cursor-default items-end">
                  <span className="font-heraclito text-[16px] italic font-bold tracking-widest lg:text-[19px] leading-none mb-1">
                    08:00 — 21:00
                  </span>
                  <div className="flex items-center gap-1 opacity-50 transition-opacity group-hover:opacity-100">
                    <span className="text-[9px] font-bold uppercase tracking-widest">Наши студии</span>
                    <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>

                  {/* Выпадающий список */}
                  <div className="absolute top-[100%] right-0 pt-2 opacity-0 pointer-events-none translate-y-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0">
                    <div className="flex flex-col gap-2.5 rounded-xl border p-4 backdrop-blur-md min-w-[200px] text-left transition-colors duration-300 bg-white border-[#333231]/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-[#333231]">
                      {SHOPS.map((shop) => (
                        <a
                          key={shop.address}
                          href={`https://yandex.ru/maps/?text=${encodeURIComponent(`${CITY} ${shop.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col rounded-lg px-2 py-1.5 transition hover:bg-black/5"
                        >
                          <span className="text-[8px] font-bold uppercase tracking-widest opacity-50 mb-0.5">
                            {CITY}
                          </span>
                          <span className="text-[11px] font-semibold tracking-wide">{shop.address}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Иконка Telegram + Гамбургер */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 border-black/10 text-[#333231] hover:bg-black/5"
                  aria-label="Корзина"
                >
                  <ShoppingCart className="h-4.5 w-4.5" aria-hidden />
                </button>
                <a
                  href={TG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 border-black/10 text-[#333231] hover:bg-black/5"
                  aria-label="Написать в Telegram"
                >
                  <Send className="h-4.5 w-4.5 -ml-0.5 mt-0.5" aria-hidden />
                </a>

                <button
                  ref={burgerRef}
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-60 text-[#333231]"
                  aria-expanded={menuOpen}
                  aria-controls="catalog-burger-nav"
                  aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="flex flex-col gap-1.5" aria-hidden>
                    <span className="block h-0.5 w-8 rounded-full bg-current" />
                    <span className="block h-0.5 w-8 rounded-full bg-current" />
                    <span className="block h-0.5 w-8 rounded-full bg-current" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
    </header>

      {/* Overlay (blur background) */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`absolute inset-0 transition-[backdrop-filter,background-color] duration-300 ${
            menuOpen ? "bg-black/20 backdrop-blur-sm" : "bg-transparent backdrop-blur-0"
          }`}
        />
      </div>

      {/* Right drawer */}
      <aside
        id="catalog-burger-nav"
        style={{ top: drawerPos.top, right: drawerPos.right }}
        className={`fixed z-[60] w-[min(360px,calc(100vw-24px))] origin-top-right rounded-2xl border border-black/10 bg-white/85 p-4 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 ${
          menuOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "pointer-events-none translate-x-4 opacity-0 scale-[0.98]"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#333231] transition hover:bg-black/5"
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {catalogLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/" || to === "/catalog"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-heraclito rounded-xl px-3 py-2 text-[22px] leading-none transition ${
                  isActive ? "text-[#111]" : "text-[#333231]"
                } hover:bg-black/5`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/reviews"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `font-heraclito inline-flex items-center justify-between rounded-xl px-3 py-2 text-[22px] leading-none transition hover:bg-black/5 ${
                isActive ? "text-[#111]" : "text-[#333231]"
              }`
            }
          >
            <span>Отзывы</span>
            <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
          </NavLink>
        </nav>

        <div className="mt-4 flex items-center justify-end gap-3">
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#1a1a1a]"
            aria-label="Telegram"
          >
            <Send className="h-5 w-5" aria-hidden />
          </a>
          <a
            href={VK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#1a1a1a]"
            aria-label="ВКонтакте"
          >
            <span className="text-sm font-bold leading-none">VK</span>
          </a>
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black text-white"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
              <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </span>
        </div>
      </aside>
    </>
  );
}
