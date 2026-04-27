import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { VK_URL } from "../config/site";
import { Footer } from "../components/ui/footer";
import { useShopData } from "../context/useShopData";
import Dropdown01 from "../components/ui/dropdown-01";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import { usePagination } from "../components/hooks/use-pagination";

export function BouquetsPage() {
  const { bouquets } = useShopData();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortMode, setSortMode] = useState<"popular" | "priceAsc" | "priceDesc">("popular");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loadedImageIds, setLoadedImageIds] = useState<Set<string>>(() => new Set());

  const sorted = useMemo(
    () => [...bouquets].sort((a, b) => a.sortOrder - b.sortOrder),
    [bouquets],
  );

  const heroIds = useMemo(() => sorted.slice(0, 4).map((b) => b.id), [sorted]);

  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    sorted.forEach((b, idx) => map.set(b.id, idx));
    return map;
  }, [sorted]);

  const filterOptions = useMemo(
    () => [
      { id: "hits", label: "Хиты", indexes: [0, 1, 2, 3] },
      { id: "romantic", label: "Романтичные", indexes: [1, 9, 10, 11] },
      { id: "soft", label: "Нежные", indexes: [4, 5, 9, 10, 11] },
      { id: "bold", label: "Яркие", indexes: [0, 2, 6, 7, 8] },
      { id: "violet", label: "Фиолетовая гамма", indexes: [4, 5, 6, 7, 8, 11] },
      { id: "premium", label: "Премиум подача", indexes: [3, 8, 10, 11] },
    ],
    [],
  );

  const colorOptions = useMemo(
    () => [
      { id: "white", label: "Белый", swatchClass: "bg-[#f5f5f5]", indexes: [9, 10] },
      { id: "red", label: "Красный", swatchClass: "bg-[#b3122f]", indexes: [0, 1, 2, 3] },
      { id: "pink", label: "Розовый", swatchClass: "bg-[#d58ab2]", indexes: [9, 10, 11] },
      { id: "yellow", label: "Жёлтый", swatchClass: "bg-[#f3cf4b]", indexes: [4, 5] },
      { id: "orange", label: "Оранжевый", swatchClass: "bg-[#e3913a]", indexes: [0, 4] },
      { id: "blue", label: "Синий", swatchClass: "bg-[#3f69c8]", indexes: [6, 7] },
      { id: "violet", label: "Фиолетовый", swatchClass: "bg-[#7a4bc2]", indexes: [4, 5, 6, 7, 8, 11] },
      { id: "burgundy", label: "Бордовый", swatchClass: "bg-[#7a1630]", indexes: [1, 2, 3] },
      { id: "cream", label: "Кремовый", swatchClass: "bg-[#efe2cb]", indexes: [9, 10, 11] },
      { id: "green", label: "Зелёный", swatchClass: "bg-[#5d9b62]", indexes: [5, 8] },
    ],
    [],
  );

  const getPriceForId = (bouquetId: string) => {
    const idx = indexById.get(bouquetId) ?? 0;
    return 2900 + (idx % 6) * 350;
  };

  const matchesFilters = (bouquetId: string) => {
    if (activeFilters.size === 0) return true;
    const idx = indexById.get(bouquetId);
    if (idx == null) return false;
    return filterOptions.some((opt) => activeFilters.has(opt.id) && opt.indexes.includes(idx));
  };

  const countsByFilter = useMemo(() => {
    const map = new Map<string, number>();
    for (const opt of filterOptions) {
      map.set(
        opt.id,
        sorted.filter((b) => {
          const idx = indexById.get(b.id);
          return idx != null && opt.indexes.includes(idx);
        }).length,
      );
    }
    return map;
  }, [filterOptions, indexById, sorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = priceMin.trim().length > 0 ? Number(priceMin) : null;
    const max = priceMax.trim().length > 0 ? Number(priceMax) : null;

    const base = sorted.filter((b) => {
      if (!matchesFilters(b.id)) return false;
      if (activeColor) {
        const idx = indexById.get(b.id);
        const color = colorOptions.find((c) => c.id === activeColor);
        if (idx == null || !color || !color.indexes.includes(idx)) return false;
      }
      const price = getPriceForId(b.id);
      if (min !== null && Number.isFinite(min) && price < min) return false;
      if (max !== null && Number.isFinite(max) && price > max) return false;
      if (q.length > 0) {
        const hay = `${b.title} ${b.description} ${b.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortMode === "popular") return base;
    const sortedByPrice = [...base].sort((a, b) => getPriceForId(a.id) - getPriceForId(b.id));
    return sortMode === "priceAsc" ? sortedByPrice : sortedByPrice.reverse();
  }, [activeColor, colorOptions, indexById, priceMax, priceMin, query, sortMode, sorted, activeFilters, filterOptions]);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filterId)) next.delete(filterId);
      else next.add(filterId);
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setActiveFilters(new Set());
    setPriceMin("");
    setPriceMax("");
    setSortMode("popular");
    setActiveColor(null);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      if (!prev.has(filterId)) return prev;
      const next = new Set(prev);
      next.delete(filterId);
      return next;
    });
  };

  const markImageLoaded = (id: string) => {
    setLoadedImageIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const extraCards = useMemo(() => {
    if (
      query.trim().length > 0 ||
      activeFilters.size > 0 ||
      activeColor !== null ||
      priceMin.trim().length > 0 ||
      priceMax.trim().length > 0 ||
      sortMode !== "popular"
    ) {
      return [];
    }
    return [
      {
        id: "__extra_1__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/bouquets/bouquet-extra-1.png?v=1",
      },
      {
        id: "__extra_2__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/bouquets/bouquet-extra-2.png?v=1",
      },
      {
        id: "__extra_3__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/catalog/hero-roses.png",
      },
      {
        id: "__extra_4__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/catalog/hero-roses.png",
      },
      {
        id: "__extra_5__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/catalog/hero-roses.png",
      },
      {
        id: "__extra_6__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/catalog/hero-roses.png",
      },
      {
        id: "__extra_7__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/bouquets/bouquet-pink.jpg?v=1",
      },
      {
        id: "__extra_8__",
        title: "Букет",
        description: "Идея. Состав и оттенки согласуем под ваш повод и бюджет.",
        tags: [] as string[],
        orderUrl: VK_URL,
        orderLabel: "Уточнить",
        imageSrc: "/catalog/hero-roses.png",
      },
    ];
  }, [activeColor, activeFilters.size, priceMax, priceMin, query, sortMode]);

  const displayList = useMemo(() => {
    return [...filtered, ...extraCards];
  }, [extraCards, filtered]);

  const itemsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(displayList.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeFilters, priceMin, priceMax, sortMode, activeColor]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: currentPageSafe,
    totalPages,
    paginationItemsToDisplay: 7,
  });

  const pagedDisplayList = useMemo(() => {
    const from = (currentPageSafe - 1) * itemsPerPage;
    return displayList.slice(from, from + itemsPerPage);
  }, [currentPageSafe, displayList]);

  const visualContentByIndex = useMemo<Record<number, { title: string; description: string }>>(
    () => ({
      0: {
        title: "Красная георгина и розы",
        description:
          "Насыщенный красный букет с крупной георгиной и розами. Выразительная композиция для признания, яркого поздравления и эффектной подачи.",
      },
      1: {
        title: "Классика в красном",
        description:
          "Глубокие красные розы в аккуратной сборке и стильной упаковке. Подходит для романтического повода, даты и вечернего вручения.",
      },
      2: {
        title: "Рубиновый акцент",
        description:
          "Плотный букет в рубиново-алой палитре с выразительным объёмом. Универсальный вариант для подарка с сильным эмоциональным эффектом.",
      },
      3: {
        title: "Бордовый моно-букет",
        description:
          "Сдержанный и благородный букет в темно-красных оттенках. Идеален для деликатного, но статусного подарка.",
      },
      4: {
        title: "Лавандовая нежность",
        description:
          "Лёгкая композиция в лавандовых и сиреневых тонах с воздушной подачей. Подходит для дня рождения, благодарности и тёплого жеста.",
      },
      5: {
        title: "Сиреневый микс",
        description:
          "Нежный микс роз и сезонных цветов в мягкой сиреневой гамме. Гармоничный букет для спокойного, элегантного впечатления.",
      },
      6: {
        title: "Фиолетовый сад",
        description:
          "Контрастный букет с анемонами и розами в фиолетовой палитре. Стильный выбор для творческих людей и особых случаев.",
      },
      7: {
        title: "Пурпурная коллекция",
        description:
          "Выразительная композиция с насыщенными пурпурными акцентами и нежными переходами цвета. Дарит яркое, но утонченное настроение.",
      },
      8: {
        title: "Гортензии и каллы",
        description:
          "Фактурный букет из сиреневых гортензий и калл с мягкой пластикой линий. Изысканный вариант для эффектного, современного подарка.",
      },
      9: {
        title: "Розовый акцент",
        description:
          "Нежная композиция в пудрово-розовой гамме с аккуратной сборкой. Подходит для романтического повода и камерного поздравления.",
      },
      10: {
        title: "Светлая романтика",
        description:
          "Элегантный букет в мягких розовых оттенках с воздушной упаковкой. Универсальный выбор для праздника, свидания и комплимента.",
      },
      11: {
        title: "Пудровая классика",
        description:
          "Сбалансированный букет с нежной цветовой растяжкой от сиреневого к розовому. Смотрится дорого и деликатно в любом формате вручения.",
      },
    }),
    [],
  );

  const activeFilterList = filterOptions.filter((f) => activeFilters.has(f.id));
  const activeColorLabel = colorOptions.find((c) => c.id === activeColor)?.label ?? null;
  const hasPriceFilter = priceMin.trim().length > 0 || priceMax.trim().length > 0;
  const activeControlsCount =
    activeFilters.size +
    (activeColor ? 1 : 0) +
    (hasPriceFilter ? 1 : 0) +
    (sortMode !== "popular" ? 1 : 0);

  const filterPanel = (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)]">
        <p className="font-heraclito text-[28px] font-bold text-[#222]">
          Поиск
        </p>
        <div className="mt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858585]" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти букет…"
              className="w-full rounded-full border border-black/10 bg-white px-10 py-2.5 text-[13px] text-[#333231] outline-none placeholder:text-[#9b9b9b] focus:border-black/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between">
          <p className="font-heraclito text-[28px] font-bold text-[#222]">
            Фильтры
          </p>
          {(query.trim().length > 0 || activeControlsCount > 0) ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#333231] hover:bg-black/5"
            >
              <X className="h-4 w-4" aria-hidden />
              Сбросить
            </button>
          ) : null}
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
              Сортировка
            </p>
            <Dropdown01
              className="mt-2"
              value={sortMode}
              onChange={(v) => setSortMode(v as "popular" | "priceAsc" | "priceDesc")}
              options={[
                { id: "popular", label: "По популярности" },
                { id: "priceAsc", label: "Сначала дешевле" },
                { id: "priceDesc", label: "Сначала дороже" },
              ]}
            />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
              Цена
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="от"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] text-[#333231] outline-none placeholder:text-[#9b9b9b] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-black/20"
              />
              <input
                type="number"
                min={0}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="до"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[13px] text-[#333231] outline-none placeholder:text-[#9b9b9b] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:border-black/20"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
              Цвет букета
            </p>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {colorOptions.map((color) => {
                const active = activeColor === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setActiveColor(active ? null : color.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                      active ? "border-black ring-2 ring-black/20" : "border-black/15 hover:border-black/35"
                    }`}
                    title={color.label}
                    aria-label={`Цвет: ${color.label}`}
                  >
                    <span className={`h-5 w-5 rounded-full ${color.swatchClass}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
              Подборки
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {filterOptions.map((filter) => {
                const checked = activeFilters.has(filter.id);
                const count = countsByFilter.get(filter.id) ?? 0;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex h-[60px] w-full items-start justify-between rounded-2xl border px-2.5 py-2 text-left transition ${
                      checked
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-[#333231] hover:bg-black/5"
                    }`}
                  >
                    <span className="line-clamp-2 pr-2 text-[12px] font-semibold leading-snug">
                      {filter.label}
                    </span>
                    <span
                      className={`shrink-0 self-center tabular-nums text-[12px] ${checked ? "text-white/80" : "text-[#8f8f8f]"}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full min-h-[calc(100dvh-5.5rem)] flex-col bg-white text-[#333231]">
      <div className="w-full flex-1 pb-16 pt-3">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.10s", opacity: 0 }}>
          <nav className="mb-5 text-sm text-[#858585]" aria-label="Хлебные крошки">
            <Link to="/" className="hover:text-[#9e9e9e] transition-colors">
              Главная
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#333231]">Букеты</span>
          </nav>

          {/* Фильтры + карточки */}
          <section className="border-t border-black/10 pt-10">
            {sorted.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white p-10 text-center text-[13px] text-[#8a8a8a] shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)]">
                Пока нет карточек — добавьте идеи букетов в админке{" "}
                <Link to="/admin" className="accent-link font-semibold text-[#333231] hover:text-[#858585]">
                  /admin
                </Link>
                , вкладка «Букеты».
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <aside className="lg:col-span-3">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#333231] shadow-[0_8px_20px_-16px_rgba(0,0,0,0.28)] lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden />
                    Фильтры
                    {activeControlsCount > 0 ? (
                      <span className="rounded-full bg-black px-2 py-0.5 text-[11px] text-white">
                        {activeControlsCount}
                      </span>
                    ) : null}
                  </button>
                  <div className="hidden lg:block">
                    {filterPanel}
                  </div>
                </aside>

                <div className="lg:col-span-9">
                  <div className="mb-4 flex items-center justify-end gap-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                      найдено{" "}
                      <span className="text-[#333231] tabular-nums">116</span>
                    </p>
                  </div>
                  {activeFilterList.length > 0 || activeColorLabel || hasPriceFilter || sortMode !== "popular" ? (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {activeFilterList.map((filter) => (
                        <button
                          key={`chip-${filter.id}`}
                          type="button"
                          onClick={() => removeFilter(filter.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#333231] hover:bg-black/5"
                        >
                          {filter.label}
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ))}
                      {activeColorLabel ? (
                        <button
                          type="button"
                          onClick={() => setActiveColor(null)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#333231] hover:bg-black/5"
                        >
                          Цвет: {activeColorLabel}
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : null}
                      {hasPriceFilter ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPriceMin("");
                            setPriceMax("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#333231] hover:bg-black/5"
                        >
                          Цена: {priceMin || "0"} - {priceMax || "max"}
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : null}
                      {sortMode !== "popular" ? (
                        <button
                          type="button"
                          onClick={() => setSortMode("popular")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#333231] hover:bg-black/5"
                        >
                          {sortMode === "priceAsc" ? "Сначала дешевле" : "Сначала дороже"}
                          <X className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {pagedDisplayList.map((idea, idx) => {
                      const absoluteIdx = (currentPageSafe - 1) * itemsPerPage + idx;
                      const isExtra = idea.id.startsWith("__extra_");
                      const href = (idea.orderUrl || "").trim() || VK_URL;
                      const label = "Добавить в корзину";
                      const heroPos = isExtra ? -1 : heroIds.indexOf(idea.id);
                      const imageSrc = isExtra
                        ? (idea as unknown as { imageSrc: string }).imageSrc
                        : heroPos === 0
                          ? "/bouquets/bouquet-hero-1.jpg?v=1"
                          : heroPos === 1
                            ? "/bouquets/bouquet-hero-2.png?v=1"
                            : heroPos === 2
                              ? "/bouquets/bouquet-hero-3.png?v=1"
                              : heroPos === 3
                                ? "/bouquets/bouquet-hero-4.png?v=1"
                                : "/catalog/hero-roses.png";
                      const imageSrcByOrder =
                        absoluteIdx === 6
                          ? "/bouquets/bouquet-7.png?v=3"
                          : absoluteIdx === 7
                            ? "/bouquets/bouquet-8.png?v=3"
                            : absoluteIdx === 8
                              ? "/bouquets/bouquet-9.png?v=3"
                              : absoluteIdx === 9 || absoluteIdx === 11
                                ? "/bouquets/bouquet-pink.jpg?v=4"
                              : imageSrc;
                      const visualContent = visualContentByIndex[absoluteIdx];
                      const cardTitle = visualContent?.title ?? idea.title;
                      const cardDescription = visualContent?.description ?? idea.description;
                      const imageKey = `${idea.id}-${absoluteIdx}`;
                      const isLoaded = loadedImageIds.has(imageKey);
                      const showHitBadge =
                        absoluteIdx % 3 === 0 || (absoluteIdx + 1) % 4 === 0;
                      const basePrice = getPriceForId(idea.id);
                      const priceFrom = `${new Intl.NumberFormat("ru-RU").format(basePrice)} ₽`;
                      const isHero = heroPos >= 0 || isExtra;
                      return (
                        <article
                          key={idea.id}
                          className="group flex min-w-0 flex-col rounded-2xl bg-white p-2.5 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.16)] sm:p-3"
                        >
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative block shrink-0 overflow-hidden rounded-xl ${isHero ? "bg-white" : "bg-[#fdfbf7]"}`}
                            aria-label={label}
                          >
                            {showHitBadge ? (
                              <span className="pointer-events-none absolute -left-11 top-5 z-20 w-36 -rotate-45 text-center">
                                <span className="absolute -left-[10px] top-0 h-0 w-0 border-b-[13px] border-r-[10px] border-t-[13px] border-b-transparent border-r-black/75 border-t-transparent transition-colors duration-300 group-hover:border-r-white/85" />
                                <span className="absolute -right-[10px] top-0 h-0 w-0 border-b-[13px] border-l-[10px] border-t-[13px] border-b-transparent border-l-black/75 border-t-transparent transition-colors duration-300 group-hover:border-l-white/85" />
                                <span className="relative block overflow-hidden rounded-[1px] bg-white/95 px-2 py-1.5 text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                                  <span className="absolute inset-y-0 left-[30%] w-[40%] bg-white/70 transition-colors duration-300 group-hover:bg-black/45" />
                                  <span className="font-heraclito relative inline-block whitespace-nowrap text-[13px] leading-[13px] font-normal uppercase tracking-[0.08em]">ХИТ</span>
                                </span>
                              </span>
                            ) : null}
                            <div className={`relative w-full ${isHero ? "bg-white" : ""}`} style={{ paddingBottom: "125%" }}>
                              {!isLoaded ? (
                                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f6f6f6] via-[#f2f2f2] to-[#ececec]" />
                              ) : null}
                              <img
                                src={imageSrcByOrder}
                                alt={cardTitle}
                                sizes="(max-width: 640px) 45vw, 22vw"
                                decoding="async"
                                className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03] ${isHero ? "mix-blend-normal" : "mix-blend-multiply"}`}
                                loading="lazy"
                                onLoad={() => markImageLoaded(imageKey)}
                              />
                            </div>

                            {/* Быстрый заказ шторка */}
                            <div className="absolute bottom-0 left-0 flex w-full translate-y-full items-center justify-center bg-white/80 py-3 text-center text-sm font-bold text-[#333231] backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
                              Подробнее
                            </div>
                          </a>

                          <div className="flex flex-1 flex-col gap-2 px-1.5 pb-2 pt-4">
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-2 min-h-[2.5rem] font-heraclito text-[18px] leading-snug text-[#222] transition-colors hover:text-[#858585] sm:text-[20px] break-words"
                            >
                              {cardTitle}
                            </a>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[#aeaeae]">
                              идея · состав согласуем
                            </p>
                            <p className="text-[16px] font-semibold leading-none text-[#2d2d2d]">
                              {priceFrom}
                            </p>
                            <p className="line-clamp-2 text-[12px] leading-snug text-[#919191] sm:text-[13px]">
                              {cardDescription}
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
                                {label}
                              </span>
                              <i className="absolute bottom-1 right-1 top-1 z-10 grid w-[26%] place-items-center rounded-full bg-black/10 text-[#333231] transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                                <ShoppingCart className="h-4 w-4" aria-hidden />
                              </i>
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPageSafe === 1}
                            className="border-black bg-black text-white hover:bg-[#1a1a1a] hover:text-white disabled:border-black/10 disabled:bg-[#f1f1f1] disabled:text-[#9a9a9a]"
                          >
                            ←
                          </Button>
                        </PaginationItem>

                        {showLeftEllipsis && (
                          <>
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(1)}>
                                1
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          </>
                        )}

                        {pages.map((page) => (
                          <PaginationItem key={`bouquet-page-${page}`}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPageSafe === page}
                              className={
                                currentPageSafe === page
                                  ? "border-black bg-black text-white hover:bg-[#1a1a1a] hover:text-white"
                                  : "text-[#333231] hover:bg-black/10"
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {showRightEllipsis && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPageSafe === totalPages}
                            className="border-black bg-black text-white hover:bg-[#1a1a1a] hover:text-white disabled:border-black/10 disabled:bg-[#f1f1f1] disabled:text-[#9a9a9a]"
                          >
                            →
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть фильтры"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/35"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-auto rounded-t-3xl bg-white p-4 shadow-[0_-20px_40px_-18px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-heraclito text-[24px] text-[#222]">Фильтры</p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex items-center justify-center rounded-full p-2 text-[#333231] hover:bg-black/5"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-black px-4 py-3 text-[13px] font-semibold text-white"
            >
              Показать {filtered.length} букетов
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-auto pt-10">
        <Footer />
      </div>
    </div>
  );
}
