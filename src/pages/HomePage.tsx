import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogNavbar } from "../components/CatalogNavbar";
import { SHOPS } from "../config/site";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_153826_e9005cf7-a1c7-4c7d-886f-fea22d644a9c.mp4";

const partnerMarks = ["Голландия", "Эквадор", "Кения", "Колумбия", "Чили"] as const;

function formatRatingValue(value: number) {
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}

export function HomePage() {
  const ratings = SHOPS.map((s) => s.rating);
  const reviewsTotal = SHOPS.reduce((sum, s) => sum + s.reviews, 0);
  const minRating = ratings.length ? Math.min(...ratings) : null;
  const maxRating = ratings.length ? Math.max(...ratings) : null;
  const ratingLabel =
    minRating == null || maxRating == null
      ? null
      : minRating === maxRating
        ? formatRatingValue(minRating)
        : `${formatRatingValue(minRating)}–${formatRatingValue(maxRating)}`;

  return (
    <section className="relative h-screen overflow-hidden bg-white text-black">
      <video
        className="absolute inset-0 h-full w-full object-cover pt-[120px] md:pt-[200px]"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/hero_bg.jpeg"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white to-transparent"
        style={{ top: 120, height: 200 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 z-10 hidden bg-gradient-to-b from-white to-transparent md:block"
        style={{ top: 200, height: 300 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white to-transparent md:hidden"
        style={{ top: 120, height: 200 }}
        aria-hidden
      />

      <div className="relative z-20 flex h-full flex-col">
        <CatalogNavbar />

        <div className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28 md:pt-36 lg:pt-44">
          <div
            className="animate-fade-in-up hero-pill-glass-3d mx-auto mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-black sm:mb-8"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
              <Star className="h-4 w-4 fill-black text-black" aria-hidden />
            </span>
            <span className="text-xs font-medium text-black/90 sm:text-sm">
              {ratingLabel ? `${ratingLabel} рейтинг` : "Рейтинг"} · {reviewsTotal} оценок
            </span>
          </div>

          <h1
            className="animate-fade-in-up mb-4 flex flex-col items-center font-purl font-semibold text-[42px] sm:mb-5 sm:text-6xl md:text-7xl lg:text-[80px] text-[#2a2a2a]"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            <span className="leading-[0.85]">Свежие цветы.</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mb-6 max-w-xl px-2 text-base text-gray-600 sm:mb-8 sm:text-lg md:text-xl font-light"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            Прямые поставки с лучших плантаций мира. Безупречное качество для вашего бизнеса и особых событий.
          </p>

          <div
            className="animate-fade-in-up flex items-center justify-center gap-3 sm:gap-4"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            <Link
              to="/catalog"
              className="hero-cta-glass-3d cta-pulse-3d inline-flex rounded-full px-6 py-3 text-sm font-bold text-[#111] sm:px-8 sm:text-base"
            >
              Каталог
            </Link>
            <Link
              to="/bouquets"
              className="hero-cta-glass-3d cta-pulse-3d inline-flex rounded-full px-6 py-3 text-sm font-bold text-[#111] sm:px-8 sm:text-base"
            >
              Букеты
            </Link>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-64 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          aria-hidden
        />
        <div
          className="animate-fade-in-up absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-3 px-4 pb-4 sm:gap-4 sm:pb-8"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          <div className="hero-pill-glass-3d rounded-full px-3 py-1 text-[10px] font-medium text-white sm:px-3.5 sm:text-xs">
            Работаем с поставщиками цветов из ведущих цветочных регионов
          </div>

          <div className="flex flex-wrap justify-center gap-5 sm:gap-12 md:gap-16">
            {partnerMarks.map((mark) => (
              <span
                key={mark}
                className="text-lg italic tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-2xl md:text-3xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
