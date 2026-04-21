import { Flower2 } from "lucide-react";
import type { CatalogDisplayProduct } from "../shop/display";

function accentFromName(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  const hue = h % 360;
  return `linear-gradient(145deg, hsla(${hue}, 42%, 38%, 0.95) 0%, hsla(${(hue + 40) % 360}, 35%, 22%, 0.98) 100%)`;
}

type CatalogProductCardProps = {
  product: CatalogDisplayProduct;
};

export function CatalogProductCard({ product }: CatalogProductCardProps) {
  const href = product.orderUrl || "#";
  const hasImage = Boolean(product.imageUrl);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/15 bg-black/15 shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition hover:border-white/25 hover:shadow-[0_20px_56px_rgba(0,0,0,0.28)]">
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
        style={hasImage ? undefined : { background: accentFromName(product.name) }}
      >
        {hasImage ? (
          <img
            src={product.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        {!hasImage ? (
          <>
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 55%)",
              }}
              aria-hidden
            />
            <Flower2
              className="relative z-[1] h-20 w-20 text-white/35 transition duration-300 group-hover:scale-105 group-hover:text-white/45"
              strokeWidth={1}
              aria-hidden
            />
          </>
        ) : (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            aria-hidden
          />
        )}
        {product.badge ? (
          <span className="hero-pill-glass-3d absolute left-3 top-3 z-[2] rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="liquid-glass-strong flex flex-1 flex-col rounded-b-3xl rounded-t-none p-4 md:p-5">
        <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-white/55">
          {product.categoryId === "cut"
            ? "Срез"
            : product.categoryId === "greenery"
              ? "Зелень"
              : "Заполнитель"}
        </p>
        <h2 className="mt-1 font-heading text-2xl font-semibold not-italic leading-tight text-white md:text-[1.65rem]">
          {product.name}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 font-body text-sm leading-snug text-white/75">
          {product.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-white/10 pt-4">
          <div>
            <p className="font-body text-[11px] uppercase tracking-wide text-white/45">
              Фасовка
            </p>
            <p className="font-body text-sm font-medium text-white/90">
              {product.unitLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="font-body text-[11px] uppercase tracking-wide text-white/45">
              Цена
            </p>
            <p className="font-body text-base font-semibold text-white">
              {product.priceDisplay}
            </p>
          </div>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta-glass-3d mt-4 flex w-full items-center justify-center rounded-full py-3 text-center font-body text-sm font-semibold text-foreground transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          {product.orderLabel}
        </a>
      </div>
    </article>
  );
}
