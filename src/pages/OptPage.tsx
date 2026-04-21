import { Link } from "react-router-dom";
import { VkCtaButton } from "../components/VkCtaButton";
import { OPT_CTA_NOTE, OPT_POINTS } from "../data/opt-info";

export function OptPage() {
  return (
    <div className="space-y-10 text-foreground">
      <div className="space-y-3">
        <p className="hero-pill-glass-3d inline-flex rounded-full px-4 py-1.5 font-body text-xs font-medium text-white/95">
          Оптовым клиентам
        </p>
        <h1 className="font-heading text-4xl font-semibold not-italic tracking-tight text-white md:text-5xl">
          Опт и регулярные поставки
        </h1>
        <p className="max-w-2xl font-body text-sm font-light leading-relaxed text-white/90 md:text-base">
          {OPT_CTA_NOTE}
        </p>
      </div>

      <div className="liquid-glass-strong rounded-3xl p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold not-italic text-white md:text-3xl">
          Кому подходит
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 font-body text-sm text-white/90 md:text-base">
          {OPT_POINTS.map((line) => (
            <li key={line} className="marker:text-white/50">
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-body text-sm leading-relaxed text-white/80 md:text-base">
          Сроки отгрузки, состав коробки и условия по Набережным Челным обсудим в переписке
          или в разделе{" "}
          <Link
            to="/contacts"
            className="font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
          >
            Контакты
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <VkCtaButton>Написать по опту во ВК</VkCtaButton>
      </div>
    </div>
  );
}
