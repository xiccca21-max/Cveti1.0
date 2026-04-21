import { useMemo } from "react";
import { Link } from "react-router-dom";
import { VK_URL } from "../config/site";
import { useShopData } from "../context/useShopData";

export function BouquetsPage() {
  const { bouquets } = useShopData();

  const sorted = useMemo(
    () => [...bouquets].sort((a, b) => a.sortOrder - b.sortOrder),
    [bouquets],
  );

  return (
    <div className="space-y-10 text-foreground">
      <div className="space-y-3">
        <p className="hero-pill-glass-3d inline-flex rounded-full px-4 py-1.5 font-body text-xs font-medium text-white/95">
          Идеи и направления
        </p>
        <h1 className="font-heading text-4xl font-semibold not-italic tracking-tight text-white md:text-5xl">
          Букеты и композиции
        </h1>
        <p className="max-w-2xl font-body text-sm font-light leading-relaxed text-white/90 md:text-base">
          Ниже — направления из админ-панели. Финальный состав, оттенки и декор
          согласуем под ваш повод и бюджет — кнопка на каждой карточке ведёт туда, куда
          вы настроили ссылку (часто во ВКонтакте).
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="liquid-glass-strong rounded-3xl p-10 text-center font-body text-white/80">
          Пока нет карточек — добавьте идеи букетов в админке (/admin), вкладка «Букеты».
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sorted.map((idea) => {
            const href = idea.orderUrl.trim() || VK_URL;
            const label = idea.orderLabel.trim() || "Уточнить";
            return (
              <article
                key={idea.id}
                className="liquid-glass-strong flex flex-col rounded-3xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
              >
                <h2 className="font-heading text-2xl font-semibold not-italic text-white md:text-3xl">
                  {idea.title}
                </h2>
                <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-white/85 md:text-base">
                  {idea.description}
                </p>
                {idea.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {idea.tags.map((tag, ti) => (
                      <li key={`${idea.id}-tag-${ti}`}>
                        <span className="hero-pill-glass-3d inline-flex rounded-full px-3 py-1 font-body text-xs font-medium text-white/95">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-6">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-cta-glass-3d relative z-[1] inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 font-body text-sm font-semibold text-foreground transition hover:opacity-95"
                  >
                    {label}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="font-body text-sm text-white/75">
        Вернуться на{" "}
        <Link
          to="/"
          className="font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
        >
          главную
        </Link>
        .
      </p>
    </div>
  );
}
