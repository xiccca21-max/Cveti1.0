import type { CatalogCategoryId } from "../data/catalog-products";

export const SHOP_STORAGE_KEY = "cveti_shop_v1" as const;
export const SHOP_STORAGE_VERSION = 1 as const;

export type ShopProduct = {
  id: string;
  name: string;
  categoryId: CatalogCategoryId;
  subtitle: string;
  unitLabel: string;
  badge?: string;
  /** null — показываем «по запросу» */
  priceRub: number | null;
  /** URL или data:image (после загрузки файла в админке) */
  imageUrl: string;
  /** Куда ведёт кнопка заказа (ВК, мессенджер, форма) */
  orderUrl: string;
  orderLabel: string;
};

export type ShopPromo = {
  id: string;
  title: string;
  subtitle: string;
  discountLabel?: string;
  /** CSS background для плитки (градиент или #rrggbb) */
  backgroundStyle: string;
  linkUrl: string;
  linkLabel: string;
  sortOrder: number;
};

/** Идея букета на странице «Букеты» (редактируется в админке). */
export type ShopBouquet = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  orderUrl: string;
  orderLabel: string;
  sortOrder: number;
};

export type ShopPersisted = {
  v: typeof SHOP_STORAGE_VERSION;
  products: ShopProduct[];
  promos: ShopPromo[];
  bouquets: ShopBouquet[];
};
