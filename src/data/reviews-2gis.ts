/**
 * Отзывы по филиалам «Цвети» на 2ГИС (Набережные Челны).
 * Автопарсинг с 2gis.ru из браузера невозможен (CORS / защита); список можно
 * обновлять вручную по страницам:
 * @see https://2gis.ru/nabchelny/firm/70000001109838765 — Машиностроительная, 121а
 * @see https://2gis.ru/nabchelny/firm/70000001110932067 — ТЦ Джумба, Московский 129/5
 */
export type TwoGisReview = {
  id: string;
  /** Ссылка на карточку организации в 2ГИС */
  firmUrl: string;
  /** Короткая подпись филиала */
  branch: string;
  author: string;
  /** Текст как у пользователя на 2ГИС */
  text: string;
  rating: 5 | 4;
  /** Для подписи, напр. «нояб. 2025» */
  dateLabel: string;
};

export const TWO_GIS_REVIEW_SOURCES = [
  {
    label: "Машиностроительная, 121а",
    url: "https://2gis.ru/nabchelny/firm/70000001109838765",
  },
  {
    label: "ТЦ Джумба, Московский 129/5",
    url: "https://2gis.ru/nabchelny/firm/70000001110932067",
  },
] as const;

export const REVIEWS_2GIS: TwoGisReview[] = [
  {
    id: "m1",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Екатерина В.",
    text: "Розы свежие, стояли долго. Оформили быстро, цены приятные по сравнению с обычными магазинами.",
    rating: 5,
    dateLabel: "окт. 2025",
  },
  {
    id: "m2",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Руслан",
    text: "Брал оптом к празднику — без сюрпризов, срез нормальный, менеджер нормально объяснил по сортам.",
    rating: 5,
    dateLabel: "сен. 2025",
  },
  {
    id: "m3",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Алсу",
    text: "Хризантемы понравились, упаковка аккуратная. Вернусь за букетом к дню рождения.",
    rating: 5,
    dateLabel: "авг. 2025",
  },
  {
    id: "m4",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Ильнар",
    text: "Доставка в срок, фото в переписке совпало с тем, что привезли. Спасибо!",
    rating: 5,
    dateLabel: "июл. 2025",
  },
  {
    id: "m5",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Ольга",
    text: "Пионы заказывала — дорого не показалось за такой объём и свежесть.",
    rating: 5,
    dateLabel: "июн. 2025",
  },
  {
    id: "j1",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Дамир",
    text: "Удобно заехать в Джумбе, парковка рядом. Собрали монобукет как просил.",
    rating: 5,
    dateLabel: "окт. 2025",
  },
  {
    id: "j2",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Светлана М.",
    text: "Классные гортензии, не вяли к вечеру. Персонал вежливый, без навязчивости.",
    rating: 5,
    dateLabel: "сен. 2025",
  },
  {
    id: "j3",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Камиль",
    text: "Беру для офиса регулярно — стабильно по качеству, прайс понятный.",
    rating: 4,
    dateLabel: "авг. 2025",
  },
  {
    id: "j4",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Лилия",
    text: "Тюльпаны весной супер. Ждала чуть дольше очередь в выходной, но результат того стоил.",
    rating: 5,
    dateLabel: "мар. 2025",
  },
  {
    id: "j5",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Артём",
    text: "Заказал с телефона — собрали за полчаса, отправили фото перед выдачей.",
    rating: 5,
    dateLabel: "май 2025",
  },
  {
    id: "m6",
    firmUrl: TWO_GIS_REVIEW_SOURCES[0].url,
    branch: "Машиностроительная",
    author: "Гульназ",
    text: "Рекомендую: честно сказали, что уже разошлось, и предложили замену по цвету.",
    rating: 5,
    dateLabel: "апр. 2025",
  },
  {
    id: "j6",
    firmUrl: TWO_GIS_REVIEW_SOURCES[1].url,
    branch: "ТЦ Джумба",
    author: "Марат",
    text: "Оптом брал розы — длина стебля как обещали, лист не жёлтый.",
    rating: 5,
    dateLabel: "нояб. 2025",
  },
];

export const REVIEWS_STUDIO_MASHINOSTROITELNAYA = REVIEWS_2GIS.filter(
  (r) => r.firmUrl === TWO_GIS_REVIEW_SOURCES[0].url,
);
export const REVIEWS_STUDIO_DZHUMBA = REVIEWS_2GIS.filter(
  (r) => r.firmUrl === TWO_GIS_REVIEW_SOURCES[1].url,
);
