import { VK_URL } from "../config/site";
import type { ShopProduct } from "./types";

export type CatalogDisplayProduct = {
  id: string;
  name: string;
  categoryId: ShopProduct["categoryId"];
  subtitle: string;
  unitLabel: string;
  badge?: string;
  priceDisplay: string;
  imageUrl: string;
  orderUrl: string;
  orderLabel: string;
};

export function formatPriceRub(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "по запросу";
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

/** Две строки цен под прайс-лист: основная и вторая (напр. с учётом наценки). */
export function formatCatalogPricePair(priceRub: number | null): {
  lineBlack: string;
  lineRed: string;
} {
  if (priceRub === null || Number.isNaN(priceRub)) {
    return { lineBlack: "—", lineRed: "по запросу" };
  }
  const a = Math.round(priceRub);
  const b = Math.round(a * 1.08);
  const fmt = (n: number) =>
    new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  return { lineBlack: fmt(a), lineRed: fmt(b) };
}

export function shopProductToDisplay(p: ShopProduct): CatalogDisplayProduct {
  return {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    subtitle: p.subtitle,
    unitLabel: p.unitLabel,
    badge: p.badge,
    priceDisplay: formatPriceRub(p.priceRub),
    imageUrl: p.imageUrl.trim(),
    orderUrl: p.orderUrl.trim() || VK_URL,
    orderLabel: p.orderLabel.trim() || "Заказать",
  };
}
