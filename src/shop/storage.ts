import { getDefaultBouquets, getDefaultShopPersisted } from "./defaults";
import type { ShopBouquet, ShopPersisted } from "./types";
import { SHOP_STORAGE_KEY, SHOP_STORAGE_VERSION } from "./types";

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function normalizePersisted(raw: unknown): ShopPersisted | null {
  if (!isRecord(raw)) return null;
  if (raw.v !== SHOP_STORAGE_VERSION) return null;
  if (!Array.isArray(raw.products) || !Array.isArray(raw.promos)) return null;
  const bouquets: ShopBouquet[] = Array.isArray(raw.bouquets)
    ? (raw.bouquets as ShopBouquet[])
    : getDefaultBouquets();
  return {
    v: SHOP_STORAGE_VERSION,
    products: raw.products as ShopPersisted["products"],
    promos: raw.promos as ShopPersisted["promos"],
    bouquets,
  };
}

export function loadShopPersisted(): ShopPersisted {
  try {
    const s = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!s) return getDefaultShopPersisted();
    const parsed: unknown = JSON.parse(s);
    const ok = normalizePersisted(parsed);
    if (!ok) return getDefaultShopPersisted();
    if (isRecord(parsed) && !Array.isArray(parsed.bouquets)) {
      saveShopPersisted(ok);
    }
    return ok;
  } catch {
    /* ignore */
  }
  return getDefaultShopPersisted();
}

export function saveShopPersisted(data: ShopPersisted): void {
  localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(data));
}

export function exportShopJson(data: ShopPersisted): string {
  return JSON.stringify(data, null, 2);
}

export function importShopJson(text: string): ShopPersisted | null {
  try {
    const parsed: unknown = JSON.parse(text);
    return normalizePersisted(parsed);
  } catch {
    return null;
  }
}
