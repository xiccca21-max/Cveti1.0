import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { TwoGisReview } from "@/data/reviews-2gis";
import "./reviews-carousel-skinwave.css";

const AVATAR_PAIRS: readonly [string, string][] = [
  ["#4d6f50", "#7cb87d"],
  ["#5c7348", "#8fb88a"],
  ["#3d6650", "#6a9e78"],
  ["#4a7c59", "#9bc49a"],
  ["#556b2f", "#8fbc8f"],
  ["#4f6f52", "#a3c9a4"],
  ["#5b7c5e", "#b8d4b9"],
] as const;

function pairFor(id: string): readonly [string, string] {
  const n = id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return AVATAR_PAIRS[n % AVATAR_PAIRS.length]!;
}

/** Реальные портреты (Unsplash), привязка к id отзыва — не к конкретному автору из 2ГИС */
const PORTRAIT_URLS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&q=80",
] as const;

function portraitUrlFor(id: string): string {
  const n = id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return PORTRAIT_URLS[n % PORTRAIT_URLS.length]!;
}

function slideOffset(i: number, current: number, total: number): number {
  let offset = i - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function slideClass(i: number, current: number, total: number): string {
  const offset = slideOffset(i, current, total);
  if (offset === 0) return "is-active";
  if (offset === -1) return "is-prev";
  if (offset === 1) return "is-next";
  if (offset === -2) return "is-far-prev";
  if (offset === 2) return "is-far-next";
  return "";
}

function Star({ dim }: { dim?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={dim ? "dim" : undefined}
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ReviewCard({ review }: { review: TwoGisReview }) {
  const [av1, av2] = pairFor(review.id);
  const [photoFailed, setPhotoFailed] = useState(false);
  const initial = review.author.trim().charAt(0) || "?";
  const photoUrl = portraitUrlFor(review.id);
  const cardStyle = {
    "--av1": av1,
    "--av2": av2,
  } as CSSProperties;

  return (
    <div className="review-card" style={cardStyle}>
      <span className="review-card__quote">&quot;</span>
      <div className="review-card__header">
        <div className="review-card__avatar">
          {!photoFailed ? (
            <img
              src={photoUrl}
              alt=""
              className="review-card__avatar-img"
              loading="lazy"
              decoding="async"
              onError={() => setPhotoFailed(true)}
            />
          ) : null}
          <span className="review-card__avatar-letter">{initial}</span>
        </div>
        <div className="review-card__user">
          <a href={review.firmUrl} className="review-card__name" target="_blank" rel="noopener noreferrer">
            {review.author}
          </a>
          <div className="review-card__stars" aria-label={`${review.rating} из 5`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} dim={i >= review.rating} />
            ))}
          </div>
        </div>
      </div>
      <p className="review-card__text">{review.text}</p>
      <div className="review-card__footer">
        <span className="review-card__game">{review.branch}</span>
        <a href={review.firmUrl} className="review-card__link-btn" target="_blank" rel="noopener noreferrer">
          Открыть в 2ГИС
        </a>
      </div>
    </div>
  );
}

export type ReviewsCarouselSkinwaveProps = {
  reviews: TwoGisReview[];
};

const AUTO_MS = 5000;

export function ReviewsCarouselSkinwave({ reviews }: ReviewsCarouselSkinwaveProps) {
  const total = reviews.length;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX0 = useRef(0);
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    if (prefersReduced || total <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTO_MS);
  }, [prefersReduced, stopAuto, total]);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="skinwave-reviews">
      <div
        className="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Отзывы покупателей"
        tabIndex={0}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
            startAuto();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
            startAuto();
          }
        }}
        onTouchStart={(e) => {
          touchX0.current = e.changedTouches[0]?.clientX ?? 0;
          stopAuto();
        }}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          if (!t) return;
          const dx = touchX0.current - t.clientX;
          if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
          startAuto();
        }}
      >
        <div className="carousel__viewport">
          {reviews.map((review, i) => {
            const cls = slideClass(i, current, total);
            return (
              <div
                key={review.id}
                className={`carousel__slide ${cls}`.trim()}
                data-index={i}
                role="group"
                aria-roledescription="slide"
                aria-hidden={cls !== "is-active"}
                onClick={() => {
                  if (i !== current) {
                    goTo(i);
                    startAuto();
                  }
                }}
              >
                <ReviewCard review={review} />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          aria-label="Предыдущий отзыв"
          onClick={() => {
            prev();
            startAuto();
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          aria-label="Следующий отзыв"
          onClick={() => {
            next();
            startAuto();
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="carousel__dots" role="tablist" aria-label="Навигация по отзывам">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={`carousel__dot${i === current ? " active" : ""}`}
              aria-label={`Отзыв ${i + 1}`}
              aria-selected={i === current}
              onClick={() => {
                goTo(i);
                startAuto();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
