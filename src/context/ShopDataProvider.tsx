import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDefaultShopPersisted } from "../shop/defaults";
import {
  exportShopJson,
  importShopJson,
  loadShopPersisted,
  saveShopPersisted,
} from "../shop/storage";
import type {
  ShopBouquet,
  ShopPersisted,
  ShopProduct,
  ShopPromo,
} from "../shop/types";
import { ShopDataContext, type ShopDataContextValue } from "./shop-context";

export function ShopDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ShopPersisted>(() => loadShopPersisted());

  const commit = useCallback((updater: (prev: ShopPersisted) => ShopPersisted) => {
    setData((prev) => {
      const next = updater(prev);
      saveShopPersisted(next);
      return next;
    });
  }, []);

  const setProducts = useCallback(
    (products: ShopProduct[]) => {
      commit((prev) => ({ ...prev, products }));
    },
    [commit],
  );

  const setPromos = useCallback(
    (promos: ShopPromo[]) => {
      commit((prev) => ({ ...prev, promos }));
    },
    [commit],
  );

  const upsertProduct = useCallback(
    (product: ShopProduct) => {
      commit((prev) => {
        const i = prev.products.findIndex((p) => p.id === product.id);
        if (i === -1) return { ...prev, products: [...prev.products, product] };
        const products = [...prev.products];
        products[i] = product;
        return { ...prev, products };
      });
    },
    [commit],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    },
    [commit],
  );

  const addProduct = useCallback(
    (product: ShopProduct) => {
      commit((prev) => ({ ...prev, products: [...prev.products, product] }));
    },
    [commit],
  );

  const upsertPromo = useCallback(
    (promo: ShopPromo) => {
      commit((prev) => {
        const i = prev.promos.findIndex((p) => p.id === promo.id);
        if (i === -1) return { ...prev, promos: [...prev.promos, promo] };
        const promos = [...prev.promos];
        promos[i] = promo;
        return { ...prev, promos };
      });
    },
    [commit],
  );

  const deletePromo = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        promos: prev.promos.filter((p) => p.id !== id),
      }));
    },
    [commit],
  );

  const addPromo = useCallback(
    (promo: ShopPromo) => {
      commit((prev) => ({ ...prev, promos: [...prev.promos, promo] }));
    },
    [commit],
  );

  const movePromo = useCallback(
    (id: string, direction: "up" | "down") => {
      commit((prev) => {
        const sorted = [...prev.promos].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        );
        const idx = sorted.findIndex((p) => p.id === id);
        if (idx < 0) return prev;
        const swapWith = direction === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= sorted.length) return prev;
        const a = sorted[idx];
        const b = sorted[swapWith];
        const orderA = a.sortOrder;
        const orderB = b.sortOrder;
        const promos = prev.promos.map((p) => {
          if (p.id === a.id) return { ...p, sortOrder: orderB };
          if (p.id === b.id) return { ...p, sortOrder: orderA };
          return p;
        });
        return { ...prev, promos };
      });
    },
    [commit],
  );

  const upsertBouquet = useCallback(
    (bouquet: ShopBouquet) => {
      commit((prev) => {
        const i = prev.bouquets.findIndex((b) => b.id === bouquet.id);
        if (i === -1) return { ...prev, bouquets: [...prev.bouquets, bouquet] };
        const bouquets = [...prev.bouquets];
        bouquets[i] = bouquet;
        return { ...prev, bouquets };
      });
    },
    [commit],
  );

  const deleteBouquet = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        bouquets: prev.bouquets.filter((b) => b.id !== id),
      }));
    },
    [commit],
  );

  const moveBouquet = useCallback(
    (id: string, direction: "up" | "down") => {
      commit((prev) => {
        const sorted = [...prev.bouquets].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        );
        const idx = sorted.findIndex((b) => b.id === id);
        if (idx < 0) return prev;
        const swapWith = direction === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= sorted.length) return prev;
        const a = sorted[idx];
        const b = sorted[swapWith];
        const orderA = a.sortOrder;
        const orderB = b.sortOrder;
        const bouquets = prev.bouquets.map((x) => {
          if (x.id === a.id) return { ...x, sortOrder: orderB };
          if (x.id === b.id) return { ...x, sortOrder: orderA };
          return x;
        });
        return { ...prev, bouquets };
      });
    },
    [commit],
  );

  const resetToDefaults = useCallback(() => {
    const next = getDefaultShopPersisted();
    saveShopPersisted(next);
    setData(next);
  }, []);

  const exportJson = useCallback(() => exportShopJson(data), [data]);

  const importJson = useCallback((text: string) => {
    const parsed = importShopJson(text);
    if (!parsed) return { ok: false as const, error: "Неверный формат JSON" };
    saveShopPersisted(parsed);
    setData(parsed);
    return { ok: true as const };
  }, []);

  const value = useMemo<ShopDataContextValue>(
    () => ({
      products: data.products,
      promos: data.promos,
      bouquets: data.bouquets,
      setProducts,
      setPromos,
      upsertProduct,
      deleteProduct,
      addProduct,
      upsertPromo,
      deletePromo,
      addPromo,
      movePromo,
      upsertBouquet,
      deleteBouquet,
      moveBouquet,
      resetToDefaults,
      exportJson,
      importJson,
    }),
    [
      data.products,
      data.promos,
      data.bouquets,
      setProducts,
      setPromos,
      upsertProduct,
      deleteProduct,
      addProduct,
      upsertPromo,
      deletePromo,
      addPromo,
      movePromo,
      upsertBouquet,
      deleteBouquet,
      moveBouquet,
      resetToDefaults,
      exportJson,
      importJson,
    ],
  );

  return (
    <ShopDataContext.Provider value={value}>{children}</ShopDataContext.Provider>
  );
}
