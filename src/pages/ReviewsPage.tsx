import { Link } from "react-router-dom";
import { Footer } from "@/components/ui/footer";
import { SHOPS } from "@/config/site";
import { ReviewsCarouselSkinwave } from "@/components/ui/ReviewsCarouselSkinwave";
import { REVIEWS_2GIS, TWO_GIS_REVIEW_SOURCES } from "@/data/reviews-2gis";

/** Два знака после запятой, как в блоке рейтинга на странице отзывов. */
function formatRatingTwoDecimals(value: number) {
  return value.toFixed(2);
}

export function ReviewsPage() {
  const ratings = SHOPS.map((s) => s.rating);
  const reviewsTotal = SHOPS.reduce((sum, s) => sum + s.reviews, 0);
  const minRating = ratings.length ? Math.min(...ratings) : null;
  const maxRating = ratings.length ? Math.max(...ratings) : null;
  const ratingNumbers =
    minRating == null || maxRating == null
      ? null
      : minRating === maxRating
        ? formatRatingTwoDecimals(minRating)
        : `${formatRatingTwoDecimals(minRating)}–${formatRatingTwoDecimals(maxRating)}`;
  const twoGisHref = TWO_GIS_REVIEW_SOURCES[0]?.url ?? "https://2gis.ru";
  return (
    <div className="relative z-10 flex w-full min-h-[calc(100dvh-5.5rem)] flex-col bg-white text-[#333231]">
      <div className="w-full flex-1 px-3 pb-6 pt-3 sm:px-5 lg:px-6">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.10s" }}>
          <nav className="mb-8 text-sm text-[#858585]" aria-label="Хлебные крошки">
            <Link to="/" className="transition-colors hover:text-[#9e9e9e]">
              Главная
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#333231]">Отзывы</span>
          </nav>

          <header className="mb-10 text-center sm:mb-12">
            <h1 className="mb-5 font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[clamp(40px,6vw,64px)] font-extrabold leading-none tracking-[0.04em] text-[#5c8a5e] sm:mb-6">
              Отзывы
            </h1>
            <p className="mx-auto max-w-2xl font-[Inter,ui-sans-serif,system-ui,sans-serif] text-base font-normal leading-normal text-[#64748b]">
              Что говорят покупатели о наших студиях
            </p>
          </header>

          <div className="mx-auto mb-0 mt-4 flex justify-center sm:mt-5">
            <a
              href={twoGisHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-pill-glass-3d inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-black transition hover:opacity-95"
              aria-label="Открыть отзывы в 2ГИС"
            >
              <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
                <img
                  src="/icons/2gis.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full min-h-full min-w-full scale-[1.55] object-cover object-center"
                  decoding="async"
                />
              </span>
              <span className="text-xs font-medium text-black/90 sm:text-sm">
                {ratingNumbers ? (
                  <>
                    <span className="font-semibold text-[#5c8a5e]">{ratingNumbers}</span> рейтинг ·{" "}
                    {reviewsTotal} оценок
                  </>
                ) : (
                  <>
                    Рейтинг · {reviewsTotal} оценок
                  </>
                )}
              </span>
            </a>
          </div>

          <div className="mx-auto max-w-5xl">
            <ReviewsCarouselSkinwave reviews={REVIEWS_2GIS} />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Footer />
      </div>
    </div>
  );
}
