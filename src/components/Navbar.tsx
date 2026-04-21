import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { VK_URL } from "../config/site";

const links = [
  { label: "Главная", to: "/" },
  { label: "Каталог", to: "/catalog" },
  { label: "Букеты", to: "/bouquets" },
  { label: "Опт", to: "/opt" },
  { label: "Контакты", to: "/contacts" },
] as const;

const navItemClass =
  "relative z-[1] rounded-full px-3 py-2 font-body text-sm font-medium text-foreground/90 transition hover:text-foreground";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16">
      <div className="relative mx-auto flex h-16 max-w-[1920px] items-center">
        <Link
          to="/"
          aria-label="ЦВЕТИ — на главную"
          className="header-logo-3d relative z-10 inline-flex shrink-0 items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
        >
          <img
            src="/logo-flower.png"
            alt=""
            className="relative z-[1] h-12 w-12 shrink-0 object-contain brightness-0 invert"
            width={48}
            height={48}
          />
          <span className="relative z-[1] font-heading text-xl font-semibold not-italic tracking-tight text-white md:text-2xl">
            ЦВЕТИ
          </span>
        </Link>

        <nav
          className="header-nav-glass-3d absolute left-1/2 hidden -translate-x-1/2 flex-row items-center gap-1 rounded-full px-2 py-1.5 lg:flex"
          aria-label="Основное меню"
        >
          {links.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `${navItemClass} ${isActive ? "bg-white/15 text-foreground" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href={VK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] ml-1 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-body text-sm font-medium text-black shadow-[0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,1)] transition hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
          >
            Заказ в ВК
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
          </a>
        </nav>

        <button
          type="button"
          className="header-nav-glass-3d relative z-20 ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="liquid-glass-strong relative z-40 mx-auto mt-2 max-w-[1920px] rounded-3xl px-4 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.2)] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Меню"
        >
          <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
            {links.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 font-body text-base font-medium ${isActive ? "bg-white/20 text-foreground" : "text-foreground/90"}`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href={VK_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 font-body text-sm font-medium text-black"
            >
              Заказ в ВК
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
