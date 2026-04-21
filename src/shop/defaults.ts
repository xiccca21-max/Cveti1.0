import { VK_URL } from "../config/site";
import { BOUQUET_IDEAS } from "../data/bouquet-ideas";
import { getCatalogProducts } from "../data/catalog-products";
import type {
  ShopBouquet,
  ShopPersisted,
  ShopProduct,
  ShopPromo,
} from "./types";
import { SHOP_STORAGE_VERSION } from "./types";

export function getDefaultProducts(): ShopProduct[] {
  return getCatalogProducts().map((p) => ({
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    subtitle: p.subtitle,
    unitLabel: p.unitLabel,
    badge: p.badge,
    priceRub: null,
    imageUrl: "",
    orderUrl: VK_URL,
    orderLabel: "Заказать во ВК",
  }));
}

export function getDefaultBouquets(): ShopBouquet[] {
  return BOUQUET_IDEAS.map((b, i) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    tags: [...b.tags],
    orderUrl: VK_URL,
    orderLabel: "Уточнить во ВКонтакте",
    sortOrder: i,
  }));
}

export function getDefaultPromos(): ShopPromo[] {
  return [
    {
      id: "promo-seed-roses",
      title: "Розы недели",
      subtitle: "Свежий срез — уточните сорт и длину стебля во ВК",
      discountLabel: "Акция",
      backgroundStyle:
        "linear-gradient(128deg, hsl(330 35% 22%) 0%, hsl(350 40% 14%) 100%)",
      linkUrl: VK_URL,
      linkLabel: "Узнать цену",
      sortOrder: 0,
    },
    {
      id: "promo-seed-opt",
      title: "Опт от магазина",
      subtitle: "Объёмы и прайс для юрлиц и студий — в переписке",
      discountLabel: "Опт",
      backgroundStyle:
        "linear-gradient(128deg, hsl(200 40% 18%) 0%, hsl(210 35% 12%) 100%)",
      linkUrl: VK_URL,
      linkLabel: "Написать",
      sortOrder: 1,
    },
  ];
}

export function getDefaultShopPersisted(): ShopPersisted {
  return {
    v: SHOP_STORAGE_VERSION,
    products: getDefaultProducts(),
    promos: getDefaultPromos(),
    bouquets: getDefaultBouquets(),
  };
}
