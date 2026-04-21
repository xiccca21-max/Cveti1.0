import { useContext } from "react";
import { ShopDataContext, type ShopDataContextValue } from "./shop-context";

export function useShopData(): ShopDataContextValue {
  const ctx = useContext(ShopDataContext);
  if (!ctx) {
    throw new Error("useShopData must be used within ShopDataProvider");
  }
  return ctx;
}
