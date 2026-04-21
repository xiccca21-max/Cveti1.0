import { useMemo, useState } from "react";
import { LayoutGrid, Search, SlidersHorizontal } from "lucide-react";
import { CatalogProductCard } from "../components/CatalogProductCard";
import { CatalogPromoHero } from "../components/CatalogPromoHero";
import { VkCtaButton } from "../components/VkCtaButton";
import { useShopData } from "../context/useShopData";
import {
  CATALOG_CATEGORIES,
  CATALOG_CATEGORY_ALL,
  type CatalogCategoryFilter,
} from "../data/catalog-products";
import { shopProductToDisplay } from "../shop/display";

type SortKey = "name-asc" | "name-desc";

export function CatalogPage() {
  const { products, promos } = useShopData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CatalogCategoryFilter>(
    CATALOG_CATEGORY_ALL,
  );
  const [sort, setSort] = useState<SortKey>("name-asc");

  const displayProducts = useMemo(
    () => products.map(shopProductToDisplay),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = displayProducts.filter((p) => {
      const catOk =
        category === CATALOG_CATEGORY_ALL || p.categoryId === category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) =>
      sort === "name-asc"
        ? a.name.localeCompare(b.name, "ru")
        : b.name.localeCompare(a.name, "ru"),
    );
    return list;
  }, [query, category, sort, displayProducts]);

  return (
    <div className="space-y-8 text-foreground md:space-y-10">
      <div className="space-y-3">
        <p className="hero-pill-glass-3d inline-flex rounded-full px-4 py-1.5 font-body text-xs font-medium text-white/95">
          Магазин · каталог
        </p>
        <h1 className="font-heading text-4xl font-semibold not-italic tracking-tight text-white md:text-5xl">
          Каталог цветов
        </h1>
        <p className="max-w-2xl font-body text-sm font-light leading-relaxed text-white/90 md:text-base">
          Цены и ссылки на заказ задаются в админ-панели; данные хранятся в вашем
          браузере. Для публичной витрины сделайте резервную копию JSON в админке.
        </p>
      </div>

      <CatalogPromoHero promos={promos} />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:w-60 xl:w-64">
          <div className="liquid-glass-strong sticky top-28 rounded-3xl p-4 md:p-5">
            <div className="flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-wider text-white/50">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Категории
            </div>
            <nav className="mt-3 flex flex-col gap-1" aria-label="Фильтр каталога">
              <button
                type="button"
                onClick={() => setCategory(CATALOG_CATEGORY_ALL)}
                className={`rounded-2xl px-4 py-3 text-left font-body text-sm font-medium transition ${
                  category === CATALOG_CATEGORY_ALL
                    ? "bg-white/20 text-white"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                Все товары
                <span className="mt-0.5 block font-body text-xs font-normal text-white/50">
                  {displayProducts.length} позиций
                </span>
              </button>
              {CATALOG_CATEGORIES.map((c) => {
                const count = displayProducts.filter(
                  (p) => p.categoryId === c.id,
                ).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`rounded-2xl px-4 py-3 text-left font-body text-sm font-medium transition ${
                      category === c.id
                        ? "bg-white/20 text-white"
                        : "text-white/85 hover:bg-white/10"
                    }`}
                  >
                    {c.label}
                    <span className="mt-0.5 block font-body text-xs font-normal text-white/50">
                      {c.shortHint} · {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5">
          <div className="liquid-glass-strong rounded-3xl p-4 md:flex md:flex-wrap md:items-end md:justify-between md:gap-4 md:p-5">
            <label className="block min-w-[12rem] flex-1 font-body text-sm text-white/80">
              <span className="mb-1.5 block font-medium text-white">
                Поиск по каталогу
              </span>
              <span className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-4 h-4 w-4 text-white/45"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Название или слово из описания"
                  className="w-full rounded-full border border-white/20 bg-black/15 py-3 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/45"
                  autoComplete="off"
                />
              </span>
            </label>
            <label className="mt-4 block w-full font-body text-sm text-white/80 md:mt-0 md:w-52">
              <span className="mb-1.5 block font-medium text-white">
                Сортировка
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="w-full cursor-pointer rounded-full border border-white/20 bg-black/15 px-4 py-3 font-body text-sm text-white outline-none transition focus:border-white/45"
              >
                <option value="name-asc" className="bg-slate-900 text-white">
                  По названию А → Я
                </option>
                <option value="name-desc" className="bg-slate-900 text-white">
                  По названию Я → А
                </option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-body text-sm text-white/70">
              <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
              <span>
                Показано{" "}
                <strong className="font-semibold text-white">
                  {filtered.length}
                </strong>{" "}
                из {displayProducts.length}
              </span>
            </p>
            {(query.trim() || category !== CATALOG_CATEGORY_ALL) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(CATALOG_CATEGORY_ALL);
                }}
                className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-body text-xs font-medium text-white/90 transition hover:bg-white/10"
              >
                Сбросить фильтры
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="liquid-glass-strong rounded-3xl p-10 text-center">
              <p className="font-body text-base text-white/85">
                Ничего не найдено по текущим фильтрам.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(CATALOG_CATEGORY_ALL);
                }}
                className="hero-cta-glass-3d mt-6 inline-flex rounded-full px-6 py-2.5 font-body text-sm font-medium text-foreground"
              >
                Показать весь каталог
              </button>
            </div>
          ) : (
            <ul className="grid list-none gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <li key={product.id}>
                  <CatalogProductCard product={product} />
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
            <VkCtaButton>Открыть витрину во ВКонтакте</VkCtaButton>
            <p className="max-w-md font-body text-xs leading-relaxed text-white/55">
              Оплата и доставка согласуются в переписке: для магазина важнее актуальный
              прайс и фото партии, чем «корзина» на сайте.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
