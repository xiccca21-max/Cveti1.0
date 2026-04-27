/**
 * Ориентировочная розница по РФ (₽ за 1 стебель / шт.), средние значения
 * по открытым прайсам и витринам 2025–2026 г. Используется, если в админке цена не задана.
 */
export const MARKET_STEM_AVERAGE_RUB: Readonly<Record<string, number>> = {
  "Красная роза": 195,
  "Амариллис (красный)": 520,
  "Антуриум (красный)": 420,
  "Гладиолус (красный)": 95,
  Каллы: 310,
  Орхидеи: 340,
  Гиацинты: 175,
  Лилии: 265,
  Пионы: 720,
  Ранункулюсы: 235,
  Эустома: 165,
  Альстромерия: 115,
  Гвоздики: 72,
  Герберы: 145,
  Тюльпаны: 128,
  Матиола: 135,
  Ирисы: 155,
  Фрезия: 185,
  Хризантемы: 105,
  Гортензия: 620,
};

/** Оценка «небольшого моно» ~10 стеблей + оформление — для фильтров как на витрине букетов. */
export function bouquetEstimateRub(stemRub: number): number {
  return Math.round(stemRub * 10 + 800);
}

export function stemPriceForSlot(
  shop: string,
  adminRub: number | null | undefined,
): number | null {
  if (adminRub != null && !Number.isNaN(adminRub)) return adminRub;
  const m = MARKET_STEM_AVERAGE_RUB[shop];
  return m ?? null;
}
