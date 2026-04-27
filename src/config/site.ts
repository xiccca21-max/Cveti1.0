/** Общие ссылки и копирайт для сайта. */
export const VK_URL = "https://vk.com/optmarket_cveti" as const;
export const TG_URL = "https://t.me/optmarket_cveti" as const;
export const IG_URL = "https://www.instagram.com/" as const;

export const CITY = "Набережные Челны";

export const PHONE_DISPLAY: string | null = "+7 937 588 88 82";

export type ShopLocation = {
  address: string;
  phone: string;
  phoneHref: string;
  rating: number;
  reviews: number;
};

export const SHOPS: readonly ShopLocation[] = [
  {
    address: "Машиностроительная 121 (рядом с TatVape)",
    phone: "+7 937 588 88 82",
    phoneHref: "tel:+79375888882",
    rating: 5,
    reviews: 147,
  },
  {
    address: "ТЦ Джумба Московский 129/5",
    phone: "+7 (937) 598-88-82",
    phoneHref: "tel:+79375988882",
    rating: 5,
    reviews: 63,
  },
] as const;
