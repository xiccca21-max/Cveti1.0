import { SHOP_FLOWERS } from "./shop-flowers";

export const CATALOG_CATEGORY_ALL = "all" as const;

export type CatalogCategoryFilter =
  | typeof CATALOG_CATEGORY_ALL
  | "cut"
  | "greenery"
  | "filler";

export type CatalogCategoryId = Exclude<CatalogCategoryFilter, "all">;

export const CATALOG_CATEGORIES: readonly {
  id: CatalogCategoryId;
  label: string;
  shortHint: string;
}[] = [
  {
    id: "cut",
    label: "Срезанные цветы",
    shortHint: "Розы, пионы, тюльпаны и др.",
  },
  {
    id: "greenery",
    label: "Зелень и декор",
    shortHint: "Эвкалипт, рускус, срезанная зелень",
  },
  {
    id: "filler",
    label: "Заполнители",
    shortHint: "Гипсофила, гиперикум, сухоцветы",
  },
] as const;

const GREENERY = new Set<string>([
  "Эвкалипт",
  "Рускус",
  "Аспидистра",
  "Салал",
  "Лисохвост",
]);

const FILLER = new Set<string>([
  "Гипсофила",
  "Гиперикум",
  "Солидаго",
  "Статица",
  "Вероника",
  "Брассика",
]);

export function classifyFlower(name: string): CatalogCategoryId {
  if (GREENERY.has(name)) return "greenery";
  if (FILLER.has(name)) return "filler";
  return "cut";
}

export type CatalogProduct = {
  /** Стабильный id для ключа и якорей */
  id: string;
  name: string;
  categoryId: CatalogCategoryId;
  /** Подзаголовок в карточке */
  subtitle: string;
  /** Единица отображения на витрине */
  unitLabel: string;
  /** Короткий бейдж на карточке (опционально) */
  badge?: string;
};

function slugId(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function subtitleFor(category: CatalogCategoryId, name: string): string {
  if (category === "greenery") {
    return `${name}: свежий срез для букетов и композиций. Сорт и длину уточняйте при заказе.`;
  }
  if (category === "filler") {
    return `${name}: объём и текстура в букете. Наличие сортов — по сезону, уточняйте во ВК.`;
  }
  return `${name}: свежий срез, подбор сорта и длины стебля — в сообщениях сообщества.`;
}

function unitFor(category: CatalogCategoryId): string {
  if (category === "greenery") return "от 1 пучка";
  if (category === "filler") return "от 1 пучка / связка";
  return "от 10 шт / пучок";
}

/** Витрина каталога: одна карточка на каждую позицию из бегущей строки. */
export function getCatalogProducts(): readonly CatalogProduct[] {
  return SHOP_FLOWERS.map((name) => {
    const categoryId = classifyFlower(name);
    const badge =
      name === "Розы" || name === "Пионы" || name === "Тюльпаны"
        ? "Сезонный хит"
        : undefined;
    return {
      id: slugId(name) || `item-${name}`,
      name,
      categoryId,
      subtitle: subtitleFor(categoryId, name),
      unitLabel: unitFor(categoryId),
      badge,
    } satisfies CatalogProduct;
  });
}
