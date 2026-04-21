import { MapPin, MessageCircle } from "lucide-react";
import { VkCtaButton } from "../components/VkCtaButton";
import { CITY, PHONE_DISPLAY, VK_URL } from "../config/site";

export function ContactsPage() {
  return (
    <div className="space-y-10 text-foreground">
      <div className="space-y-3">
        <p className="hero-pill-glass-3d inline-flex rounded-full px-4 py-1.5 font-body text-xs font-medium text-white/95">
          Связь
        </p>
        <h1 className="font-heading text-4xl font-semibold not-italic tracking-tight text-white md:text-5xl">
          Контакты
        </h1>
        <p className="max-w-2xl font-body text-sm font-light leading-relaxed text-white/90 md:text-base">
          Удобнее всего написать во ВКонтакте — так быстрее согласуем состав, срок и
          способ получения.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="liquid-glass-strong rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-white/70" aria-hidden />
            <div>
              <h2 className="font-heading text-xl font-semibold not-italic text-white">
                Город
              </h2>
              <p className="mt-2 font-body text-sm text-white/85 md:text-base">
                {CITY}
              </p>
            </div>
          </div>
        </div>

        <div className="liquid-glass-strong rounded-3xl p-6">
          <div className="flex items-start gap-3">
            <MessageCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-white/70"
              aria-hidden
            />
            <div>
              <h2 className="font-heading text-xl font-semibold not-italic text-white">
                ВКонтакте
              </h2>
              <a
                href={VK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-body text-sm text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white md:text-base"
              >
                Сообщество ЦВЕТИ
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="liquid-glass-strong rounded-3xl p-6 md:p-8">
        <h2 className="font-heading text-xl font-semibold not-italic text-white md:text-2xl">
          Телефон
        </h2>
        {PHONE_DISPLAY ? (
          <p className="mt-3 font-body text-lg text-white">{PHONE_DISPLAY}</p>
        ) : (
          <p className="mt-3 font-body text-sm leading-relaxed text-white/85 md:text-base">
            Номер не указан на сайте — запросите в личных сообщениях сообщества ВКонтакте
            или оформите заказ через кнопку ниже.
          </p>
        )}
      </div>

      <VkCtaButton>Написать во ВКонтакте</VkCtaButton>
    </div>
  );
}
