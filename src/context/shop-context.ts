import { createContext } from "react";
import type { ShopBouquet, ShopProduct, ShopPromo } from "../shop/types";

export type ShopDataContextValue = {
  products: ShopProduct[];
  promos: ShopPromo[];
  bouquets: ShopBouquet[];
  setProducts: (products: ShopProduct[]) => void;
  setPromos: (promos: ShopPromo[]) => void;
  upsertProduct: (product: ShopProduct) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: ShopProduct) => void;
  upsertPromo: (promo: ShopPromo) => void;
  deletePromo: (id: string) => void;
  addPromo: (promo: ShopPromo) => void;
  movePromo: (id: string, direction: "up" | "down") => void;
  upsertBouquet: (bouquet: ShopBouquet) => void;
  deleteBouquet: (id: string) => void;
  moveBouquet: (id: string, direction: "up" | "down") => void;
  resetToDefaults: () => void;
  exportJson: () => string;
  importJson: (text: string) => { ok: boolean; error?: string };
};

export const ShopDataContext = createContext<ShopDataContextValue | null>(null);
