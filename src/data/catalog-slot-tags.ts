/** Теги для чипов-категорий (фильтр по позициям каталога). */
export const CATALOG_SLOT_TAGS: Readonly<Record<string, readonly string[]>> = {
  "Красная роза": ["roses", "romantic", "feb14", "march8", "mono"],
  "Амариллис (красный)": ["gift", "seasonal", "mono"],
  "Антуриум (красный)": ["gift", "tropical", "mono"],
  "Гладиолус (красный)": ["summer", "mixed"],
  Каллы: ["wedding", "romantic", "mono", "gift"],
  Орхидеи: ["orchids", "gift", "premium", "mono"],
  Гиацинты: ["spring", "seasonal", "gift"],
  Лилии: ["lilies", "gift", "romantic", "mono"],
  Пионы: ["peonies", "romantic", "march8", "gift", "premium"],
  Ранункулюсы: ["spring", "romantic", "mono"],
  Эустома: ["mixed", "gift"],
  Альстромерия: ["alstro", "mixed", "gift"],
  Гвоздики: ["carnations", "march8", "mono", "gift"],
  Герберы: ["mixed", "gift"],
  Тюльпаны: ["tulips", "spring", "march8", "romantic", "mono"],
  Матиола: ["mixed", "gift", "fragrant"],
  Ирисы: ["spring", "gift", "mono"],
  Фрезия: ["fragrant", "mixed", "romantic", "gift"],
  Хризантемы: ["chrys", "march8", "mono", "gift"],
  Гортензия: ["hydrangea", "premium", "gift", "mono"],
};

export function tagsForShop(shop: string): readonly string[] {
  return CATALOG_SLOT_TAGS[shop] ?? ["mixed"];
}
