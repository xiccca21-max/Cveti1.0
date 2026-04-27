/**
 * Каталог: упорядоченный перечень позиций.
 * `shop` — как в админке; `label` — подпись на сайте (рус.).
 * `priceOnRequest` — в каталоге всегда показывать «по запросу», не цену из админки.
 */

export type BookSlot = { shop: string; label: string; priceOnRequest?: boolean };

/** Все цвета в фиксированном порядке. */
export const CATALOG_ALL_FLOWERS: readonly BookSlot[] = [
  { shop: "Красная роза", label: "Роза" },
  { shop: "Амариллис (красный)", label: "Амариллис" },
  { shop: "Антуриум (красный)", label: "Антуриум" },
  { shop: "Гладиолус (красный)", label: "Гладиолус" },
  { shop: "Каллы", label: "Каллы" },
  { shop: "Орхидеи", label: "Орхидеи" },
  { shop: "Гиацинты", label: "Гиацинты" },
  { shop: "Лилии", label: "Лилии", priceOnRequest: true },
  { shop: "Пионы", label: "Пионы" },
  { shop: "Ранункулюсы", label: "Ранункулюсы", priceOnRequest: true },
  { shop: "Эустома", label: "Эустома" },
  { shop: "Альстромерия", label: "Альстромерия" },
  { shop: "Гвоздики", label: "Гвоздики" },
  { shop: "Герберы", label: "Герберы" },
  { shop: "Тюльпаны", label: "Тюльпаны", priceOnRequest: true },
  { shop: "Матиола", label: "Матиола" },
  { shop: "Ирисы", label: "Ирисы" },
  { shop: "Фрезия", label: "Фрезия" },
  { shop: "Хризантемы", label: "Хризантемы" },
  { shop: "Гортензия", label: "Гортензия" },
];

const DEFAULT_BLOSSOM =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80&auto=format&fit=crop";

/** Фото, если в админке пусто. */
export const EDITORIAL_FALLBACK_IMAGE: Record<string, string> = {
  "Красная роза": "/catalog/red-rose.png",
  "Амариллис (красный)": "/catalog/amaryllis-red.png",
  Пионы: "/catalog/peony.png",
  "Антуриум (красный)": "/catalog/anthurium-red.png",
  "Гладиолус (красный)": "/catalog/gladiolus-red.png",
  Тюльпаны: "/catalog/tulips.png",
  Орхидеи: "/catalog/orchid.png",
  Гортензия: "/catalog/hydrangea.png",
  Ранункулюсы:
    "/catalog/ranunculus.png",
  Лилии: "/catalog/lily.png",
  Гвоздики: "/catalog/carnation.png",
  Герберы: "/catalog/gerbera.png",
  Эустома: "/catalog/eustoma.png",
  Альстромерия: "/catalog/alstroemeria.png",
  Матиола: "/catalog/matthiola.png",
  Фрезия: "/catalog/freesia.png",
  Хризантемы: "/catalog/chrysanthemum.png",
  Каллы: "/catalog/calla.png",
  Ирисы: "/catalog/iris.png",
  Гиацинты: "/catalog/hyacinth.png",
};

export function getEditorialImage(shopName: string): string {
  return EDITORIAL_FALLBACK_IMAGE[shopName] ?? DEFAULT_BLOSSOM;
}
