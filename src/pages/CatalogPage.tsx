import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgePercent, Search, ShoppingCart, SlidersHorizontal, Sparkles, Truck, X } from "lucide-react";
import {
  CATALOG_ALL_FLOWERS,
  getEditorialImage,
  type BookSlot,
} from "../data/catalog-editorial";
import { stemPriceForSlot } from "../data/catalog-market-prices";
import { tagsForShop } from "../data/catalog-slot-tags";
import { CITY, TG_URL, VK_URL } from "../config/site";
import { useShopData } from "../context/useShopData";
import { formatPriceRub, shopProductToDisplay, type CatalogDisplayProduct } from "../shop/display";
import type { ShopProduct } from "../shop/types";
import { Footer } from "../components/ui/footer";

const INITIAL_GRID = 12;
const LOAD_STEP = 12;

type CatalogChip = {
  id: string;
  label: string;
  tag: string | null;
};

const CATALOG_CHIPS: readonly CatalogChip[] = [
  { id: "all", label: "Все цветы", tag: null },
  { id: "roses", label: "Розы", tag: "roses" },
  { id: "peonies", label: "Пионы", tag: "peonies" },
  { id: "chrys", label: "Хризантемы", tag: "chrys" },
  { id: "exotic", label: "Экзотика", tag: "tropical" },
] as const;

function BenefitCard({
  icon,
  title,
  lines,
  accentClassName,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  accentClassName: string;
}) {
  return (
    <div className="flex h-full min-h-[92px] min-w-[240px] items-start gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-[0_10px_26px_-22px_rgba(0,0,0,0.18)] sm:min-w-0">
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10",
          accentClassName,
        ].join(" ")}
      >
        <div className="text-[#1f1f1f]">{icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#1f1f1f] leading-snug">
          {title}
        </p>
        {lines.map((t) => (
          <p key={t} className="text-[12px] text-[#6a6a6a] leading-snug break-words">
            {t}
          </p>
        ))}
      </div>
    </div>
  );
}

function resolveStemRub(slot: BookSlot, product: ShopProduct | null): number | null {
  return stemPriceForSlot(slot.shop, product?.priceRub ?? null);
}

export function CatalogPage() {
  const { products } = useShopData();
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const [benefitsCollapsed, setBenefitsCollapsed] = useState(false);

  const productByName = useMemo(
    () => new Map<string, ShopProduct>(products.map((p) => [p.name, p])),
    [products],
  );
  const displayByName = useMemo(
    () => new Map<string, CatalogDisplayProduct>(products.map((p) => [p.name, shopProductToDisplay(p)])),
    [products],
  );

  const [visibleCount, setVisibleCount] = useState(INITIAL_GRID);
  const [activeChipId, setActiveChipId] = useState<(typeof CATALOG_CHIPS)[number]["id"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeChip = useMemo(
    () => CATALOG_CHIPS.find((c) => c.id === activeChipId) ?? CATALOG_CHIPS[0],
    [activeChipId],
  );

  useEffect(() => {
    const tag = searchParams.get("tag");
    if (!tag) return;
    const next = CATALOG_CHIPS.find((c) => c.id === tag)?.id;
    if (next && next !== activeChipId) {
      setActiveChipId(next);
      setVisibleCount(INITIAL_GRID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // На первом рендере не скроллим (иначе попадаем не в верх страницы).
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const next = new URLSearchParams(searchParams);
    if (activeChipId === "all") next.delete("tag");
    else next.set("tag", activeChipId);
    setSearchParams(next, { replace: true });

    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChipId]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CATALOG_ALL_FLOWERS.filter((slot) => {
      const p = productByName.get(slot.shop) ?? null;
      const stem = resolveStemRub(slot, p);
      if (stem == null) return false;
      if (activeChip.tag) {
        const tags = tagsForShop(slot.shop);
        if (!tags.includes(activeChip.tag)) return false;
      }
      if (q.length > 0) {
        const hay = `${slot.label} ${slot.shop}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [activeChip.tag, productByName, searchQuery]);

  const countsByChipId = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = CATALOG_ALL_FLOWERS.filter((slot) => {
      const p = productByName.get(slot.shop) ?? null;
      const stem = resolveStemRub(slot, p);
      if (stem == null) return false;
      if (q.length > 0) {
        const hay = `${slot.label} ${slot.shop}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const out = new Map<(typeof CATALOG_CHIPS)[number]["id"], number>();
    for (const chip of CATALOG_CHIPS) {
      if (!chip.tag) {
        out.set(chip.id, base.length);
        continue;
      }
      out.set(
        chip.id,
        base.filter((slot) => tagsForShop(slot.shop).includes(chip.tag!)).length,
      );
    }
    return out;
  }, [productByName, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  const isDataEmpty = products.length === 0;
  const hasQuery = searchQuery.trim().length > 0;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setBenefitsCollapsed(window.scrollY > 140);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const quickQueries = ["роза", "пион", "гортензия", "тюльпан"] as const;

  return (
    <div className="flex w-full min-h-[calc(100dvh-5.5rem)] flex-col bg-white text-[#333231]">
      <div className="w-full flex-1 px-3 pb-16 pt-3 sm:px-5 lg:px-6">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.10s", opacity: 0 }}>
          {/* Хлебные крошки */}
          <nav className="mb-5 text-sm text-[#858585]" aria-label="Хлебные крошки">
            <Link to="/" className="hover:text-[#9e9e9e] transition-colors">
              Главная
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#333231]">Каталог</span>
          </nav>

          <section className="mb-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-xl">
                <div className="flex items-baseline gap-3">
                  <h1 className="font-heraclito text-[30px] uppercase tracking-wide text-[#333231] sm:text-[38px] lg:text-[44px]">
                    КАТАЛОГ
                  </h1>
                  <p className="hidden text-sm uppercase tracking-[0.22em] text-[#8a8a8a] sm:block">
                    цветов
                  </p>
                </div>
                <p className="mt-2 text-sm text-[#8a8a8a]">
                  Цены за штуку · Опт и розница · {CITY}
                </p>
                
              </div>

              <div
                className={[
                  "flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:max-w-[720px] lg:flex-1",
                  "transition-[max-height,opacity,transform] duration-300 will-change-[opacity,transform]",
                  benefitsCollapsed
                    ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                    : "max-h-[120px] opacity-100 translate-y-0",
                ].join(" ")}
              >
                <BenefitCard
                  icon={<BadgePercent className="h-6 w-6" aria-hidden />}
                  title="Опт и розница"
                  lines={["честный прайс", "без условий"]}
                  accentClassName="bg-white"
                />
                <BenefitCard
                  icon={<Truck className="h-6 w-6" aria-hidden />}
                  title="Доставка"
                  lines={["от 2 000 ₽ бесплатно", "по городу"]}
                  accentClassName="bg-white"
                />
                <BenefitCard
                  icon={<Sparkles className="h-6 w-6" aria-hidden />}
                  title="Свежий срез"
                  lines={["ежедневно", "прямые поставки"]}
                  accentClassName="bg-white"
                />
              </div>
            </div>

            {/* Поиск (не липкий) */}
            <div className="mt-7">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:max-w-[420px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858585]" aria-hidden />
                    <input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setVisibleCount(INITIAL_GRID);
                      }}
                      placeholder="Поиск…"
                      className="w-full rounded-full border border-black/10 bg-white px-10 py-2.5 text-[13px] text-[#333231] outline-none placeholder:text-[#9b9b9b] focus:border-black/20 sm:text-sm"
                    />
                    {searchQuery.trim().length > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setVisibleCount(INITIAL_GRID);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#333231] hover:bg-black/5"
                        aria-label="Очистить поиск"
                        title="Очистить"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </button>
                    ) : null}
                  </div>

                  {activeChipId !== "all" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChipId("all");
                        setVisibleCount(INITIAL_GRID);
                      }}
                      className="hidden shrink-0 rounded-full border border-black/10 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#333231] hover:bg-black/5 sm:inline-flex"
                    >
                      Сбросить
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-[#333231] hover:bg-black/5 sm:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden />
                    Фильтр
                  </button>
                </div>

                {/* Быстрые подсказки */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8a8a8a]">
                  <span className="uppercase tracking-[0.22em] text-[#b0b0b0]">быстро</span>
                  {quickQueries.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setSearchQuery(q);
                        setVisibleCount(INITIAL_GRID);
                      }}
                      className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] text-[#333231] hover:bg-black/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Табы (липкие) */}
            <div className="z-20 -mx-3 mt-3 bg-white/95 px-3 py-2 backdrop-blur-sm sm:mt-4 sm:rounded-none">
              <div className="hidden sm:block">
                <div className="flex items-center gap-6 border-b border-black/10">
                  {CATALOG_CHIPS.map((chip) => {
                    const active = chip.id === activeChipId;
                    const count = countsByChipId.get(chip.id) ?? 0;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => {
                          setActiveChipId(chip.id);
                          setVisibleCount(INITIAL_GRID);
                        }}
                        className={`relative -mb-px py-2 text-sm transition-colors ${
                          active ? "text-[#111]" : "text-[#6a6a6a] hover:text-[#333231]"
                        }`}
                      >
                        <span className="font-semibold">{chip.label}</span>{" "}
                        <span className="text-[#9a9a9a] tabular-nums">{count}</span>
                        <span
                          aria-hidden
                          className={`absolute inset-x-0 bottom-[-1px] h-[2px] ${
                            active ? "bg-black" : "bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Мобильная панель фильтров */}
            {filtersOpen ? (
              <div className="fixed inset-0 z-[80] sm:hidden">
                <button
                  type="button"
                  className="absolute inset-0 bg-black/30"
                  aria-label="Закрыть фильтры"
                  onClick={() => setFiltersOpen(false)}
                />
                <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4 shadow-[0_-24px_70px_-40px_rgba(0,0,0,0.6)]">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-[#333231]">Фильтр</p>
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className="rounded-full p-2 hover:bg-black/5"
                      aria-label="Закрыть"
                    >
                      <X className="h-5 w-5 text-[#333231]" aria-hidden />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {CATALOG_CHIPS.map((chip) => {
                      const active = chip.id === activeChipId;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => {
                            setActiveChipId(chip.id);
                            setVisibleCount(INITIAL_GRID);
                            setFiltersOpen(false);
                          }}
                          className={`rounded-full px-4 py-2 text-[13px] transition ${
                            active ? "bg-black text-white" : "bg-[#ebebeb] text-[#333231]"
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                    {activeChipId !== "all" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveChipId("all");
                          setVisibleCount(INITIAL_GRID);
                          setFiltersOpen(false);
                        }}
                        className="rounded-full px-4 py-2 text-[13px] text-[#333231] ring-1 ring-black/10"
                      >
                        Сбросить
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className="w-full rounded-full bg-black px-6 py-3 text-[13px] font-bold text-white"
                    >
                      Применить
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>

        {/* Сетка товаров */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.22s", opacity: 0 }}>
          <div ref={gridRef} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4 [&>*:nth-child(even)]:mt-8 sm:[&>*:nth-child(even)]:mt-12">
            {isDataEmpty
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    className="rounded-2xl bg-white p-2.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] sm:p-3"
                  >
                    <div className="relative w-full overflow-hidden rounded-xl bg-[#f3f3f3]" style={{ paddingBottom: "125%" }}>
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#f6f6f6] via-[#ededed] to-[#f6f6f6] opacity-70" />
                    </div>
                    <div className="mt-3 space-y-2 px-1 pb-1">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#ececec]" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-[#ececec]" />
                    </div>
                  </div>
                ))
              : visible.map((slot) => (
                  <CatalogProductCard
                    key={slot.shop}
                    slot={slot}
                    product={productByName.get(slot.shop) ?? null}
                    display={displayByName.get(slot.shop) ?? null}
                  />
                ))}
          </div>
        </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-[#858585]">
          {hasQuery ? (
            <>
              Ничего не нашли по запросу{" "}
              <span className="font-semibold text-[#333231]">«{searchQuery.trim()}»</span>.{" "}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(INITIAL_GRID);
                }}
                className="font-semibold underline underline-offset-2 hover:text-[#333231]"
              >
                Очистить поиск
              </button>
              .
            </>
          ) : (
            <>
              В этой подборке сейчас пусто.{" "}
              <button
                type="button"
                onClick={() => {
                  setActiveChipId("all");
                  setVisibleCount(INITIAL_GRID);
                }}
                className="font-semibold underline underline-offset-2 hover:text-[#333231]"
              >
                Сбросить фильтр
              </button>{" "}
              или{" "}
              <a href={TG_URL} target="_blank" rel="noopener noreferrer" className="accent-link font-semibold text-[#333231] hover:text-[#a0522d]">
                уточнить наличие
              </a>
              .
            </>
          )}
        </p>
      ) : null}

      {canLoadMore ? (
        <div className="animate-fade-in-up mt-10 flex justify-center" style={{ animationDelay: "0.34s", opacity: 0 }}>
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + LOAD_STEP)}
            className="rounded-full border-0 bg-black px-10 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#1a1a1a]"
          >
            Показать ещё
          </button>
        </div>
      ) : null}

      </div>

      <div className="mt-auto pt-10">
        <div className="mx-auto mb-6 w-full max-w-[calc(100vw-24px)] text-center text-[11px] uppercase tracking-[0.22em] text-[#9a9a9a] sm:max-w-[calc(100vw-40px)] lg:max-w-[calc(100vw-120px)]">
          <a
            href={TG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="accent-link text-[#6a6a6a] hover:text-[#333231]"
          >
            наличие и фото — Telegram
          </a>{" "}
          ·{" "}
          <a
            href={VK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="accent-link text-[#6a6a6a] hover:text-[#333231]"
          >
            заказ — VK
          </a>{" "}
          · доставка от 2&nbsp;000&nbsp;₽
        </div>
        <Footer />
      </div>
    </div>
  );
}

type CatalogProductCardProps = {
  slot: BookSlot;
  product: ShopProduct | null;
  display: CatalogDisplayProduct | null;
};

function CatalogProductCard({ slot, product, display }: CatalogProductCardProps) {
  const stem = resolveStemRub(slot, product);
  const imageSrc =
    display?.imageUrl && display.imageUrl.length > 0 ? display.imageUrl : getEditorialImage(slot.shop);
  const href = display?.orderUrl?.trim() || VK_URL;
  const imageObjectClass =
    slot.shop === "Ирисы" ? "object-cover object-top" : "object-cover object-center";

  const isHit = slot.shop.toLowerCase().includes("роза") || slot.shop.toLowerCase().includes("хризантема");
  const isSeason = slot.shop.toLowerCase().includes("пион") || slot.shop.toLowerCase().includes("гортензия") || slot.shop.toLowerCase().includes("тюльпан");
  const badge = isHit ? "Хит" : isSeason ? "Сезон" : null;
  const subtitleFallback = "Свежий срез. Сорт и длину стебля — при заказе.";
  const unitLabel =
    display?.unitLabel && display.unitLabel.trim().length > 0 ? display.unitLabel : "от 10 шт.";

  return (
    <article className="group flex min-w-0 flex-col rounded-2xl bg-white p-2.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.12)] sm:p-3 text-left">
      <a href={href} target="_blank" rel="noopener noreferrer" className="relative block shrink-0 overflow-hidden rounded-xl bg-[#fdfbf7]">
        <div className="relative w-full" style={{ paddingBottom: "125%" }}>
          <img
            src={imageSrc}
            alt={slot.label}
            sizes="(max-width: 640px) 45vw, 22vw"
            decoding="async"
            className={`absolute inset-0 h-full w-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105 ${imageObjectClass}`}
            loading="lazy"
          />
        </div>

        {badge && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-md sm:left-3 sm:top-3 sm:px-3 text-[#333231]">
            {badge}
          </div>
        )}

        {/* Быстрый просмотр шторка */}
        <div className="absolute bottom-0 left-0 w-full translate-y-full bg-white/80 py-3 text-center text-sm font-bold text-[#333231] backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
          Подробнее
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-1.5 px-1 pb-2 pt-3.5">
        {stem != null ? (
          <p className="whitespace-nowrap text-[16px] font-semibold tabular-nums leading-tight text-[#111] sm:text-[17px]">
            {formatPriceRub(stem)}{" "}
            <span className="text-[12px] font-medium text-[#8a8a8a]">за шт.</span>
          </p>
        ) : (
          <p className="text-[14px] font-medium leading-tight text-[#858585] sm:text-[15px]">по запросу</p>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 min-h-[2.4rem] font-heraclito text-[17px] leading-snug text-[#222] transition-colors hover:text-[#858585] sm:text-[19px] break-words"
        >
          {slot.label}
        </a>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#b0b0b0]">
          {unitLabel}
        </p>
        <p className="line-clamp-2 text-[12px] leading-snug text-[#8a8a8a] sm:text-[13px]">
          {display?.subtitle && display.subtitle.trim().length > 0 ? display.subtitle : subtitleFallback}
        </p>
      </div>
      <div className="mt-auto px-1 pb-1">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="cart-cta-glass-3d group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full px-5 py-3 text-[14px] font-semibold text-[#333231]"
        >
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
            Добавить в корзину
          </span>
          <i className="absolute bottom-1 right-1 top-1 z-10 grid w-[26%] place-items-center rounded-full bg-black/10 text-[#333231] transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
            <ShoppingCart className="h-4 w-4" aria-hidden />
          </i>
        </a>
      </div>
    </article>
  );
}
