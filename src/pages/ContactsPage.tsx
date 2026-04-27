import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { CITY, PHONE_DISPLAY, VK_URL, TG_URL, IG_URL, SHOPS } from "../config/site";
import { Footer } from "../components/ui/footer";
import { LocationMap } from "../components/ui/location-map";

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M12.82 17.89h1.42s.43-.05.65-.28c.2-.2.2-.58.2-.58s-.03-1.78.8-2.04c.83-.26 1.9 1.72 3.03 2.48.86.58 1.51.45 1.51.45l3.04-.04s1.59-.1.83-1.35c-.06-.1-.4-.86-2.07-2.41-1.75-1.61-1.52-1.35.6-4.14 1.29-1.7 1.81-2.74 1.65-3.19-.15-.43-1.07-.32-1.07-.32l-3.42.02s-.25-.03-.43.08c-.18.11-.29.36-.29.36s-.54 1.44-1.26 2.66c-1.51 2.58-2.11 2.72-2.36 2.56-.58-.37-.44-1.47-.44-2.25 0-2.44.37-3.46-.72-3.72-.36-.09-.62-.15-1.54-.16-1.18-.01-2.18 0-2.74.28-.37.18-.66.59-.49.62.21.03.68.13.93.48.33.46.32 1.49.32 1.49s.19 2.87-.44 3.23c-.43.24-1.01-.25-2.26-2.6-.64-1.19-1.12-2.51-1.12-2.51s-.09-.24-.26-.37c-.2-.15-.47-.2-.47-.2l-3.25.02s-.49.01-.67.22c-.16.19-.01.58-.01.58s2.55 5.96 5.43 8.95c2.64 2.74 5.65 2.56 5.65 2.56z"
      />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M9.69 14.62l-.4 5.63c.58 0 .83-.25 1.14-.55l2.75-2.63 5.7 4.17c1.04.58 1.78.28 2.05-.96l3.71-17.36h0c.31-1.45-.53-2.02-1.55-1.64L1.33 9.58c-1.4.54-1.38 1.32-.24 1.67l5.66 1.76L19.9 4.78c.62-.41 1.18-.18.72.23L9.69 14.62z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M7.5 2.5h9A5 5 0 0 1 21.5 7.5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5Zm0 2A3 3 0 0 0 4.5 7.5v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9Zm4.5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm6.2-.85a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"
      />
    </svg>
  );
}

export function ContactsPage() {
  const CONTACTS_BANNER_VIDEO_URL =
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4";

  const getCoordinates = (index: number) => {
    if (index === 0) return "55.7485° N, 52.4431° E";
    return "55.7352° N, 52.4158° E";
  };

  const splitAddress = (address: string) => {
    if (address.includes(" (")) {
      const [primary, rest] = address.split(" (");
      const secondary = (rest ?? "").replace(/\)\s*$/, "");
      return { primary, secondary };
    }
    if (address.startsWith("ТЦ ")) {
      const parts = address.split(" ");
      const tcName = `${parts[0]} ${parts[1] ?? ""}`.trim(); // "ТЦ Джумба"
      const rest = parts.slice(2).join(" ").trim(); // "Московский 129/5"
      // Для читаемости на карточке: сначала улица/адрес, затем ТЦ.
      return { primary: rest || tcName, secondary: rest ? tcName : "" };
    }
    return { primary: address, secondary: "" };
  };

  const normalizePhoneDisplay = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    const d = digits.startsWith("7") ? digits : digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
    if (d.length !== 11 || !d.startsWith("7")) return phone;
    return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
  };

  const scrollToStudio = (index: number) => {
    const el = document.getElementById(`studio-${index}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex w-full min-h-[calc(100dvh-5.5rem)] flex-col bg-white text-[#333231]">
      <div className="w-full flex-1 px-3 pb-16 pt-3 sm:px-5 lg:px-6">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.10s", opacity: 0 }}>
          {/* Хлебные крошки */}
          <nav className="mb-5 text-sm text-[#858585]" aria-label="Хлебные крошки">
            <Link to="/" className="hover:text-[#9e9e9e] transition-colors">
              Главная
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[#333231]">Контакты</span>
          </nav>


          {/* HERO */}
          <section className="mb-10">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-black shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
              <div className="relative aspect-[16/9] w-full sm:aspect-[16/7] lg:aspect-[16/6]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={CONTACTS_BANNER_VIDEO_URL}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div
                  className="absolute inset-0"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.12) 100%)",
                  }}
                />

                <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-7 lg:p-10">
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#333231] shadow-sm ring-1 ring-black/10 backdrop-blur">
                    {CITY}
                    <span className="h-1 w-1 rounded-full bg-[#333231]/50" />
                    09:00–21:00 ежедневно
                  </div>
                  <h1 className="font-heraclito text-[32px] leading-[1.02] text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:text-[40px] lg:text-[52px]">
                    Контакты
                  </h1>
                  <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/80 sm:text-sm">
                    Две студии в городе. Напишите — пришлём фото по наличию и соберём букет под ваш бюджет.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {SHOPS.slice(0, 2).map((shop, idx) => (
                      <button
                        key={shop.address}
                        type="button"
                        onClick={() => scrollToStudio(idx)}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/20 backdrop-blur hover:bg-white/15"
                      >
                        {idx === 0 ? "Машиностроительная" : "Московский"}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <a
                      href={TG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Написать в Telegram"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:bg-white/15"
                    >
                      <TelegramIcon className="h-6 w-6" />
                    </a>
                    <a
                      href={VK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Заказ в VK"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:bg-white/15"
                    >
                      <VkIcon className="h-6 w-6" />
                    </a>
                    <a
                      href={IG_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:bg-white/15"
                    >
                      <InstagramIcon className="h-6 w-6" />
                    </a>
                    {PHONE_DISPLAY ? (
                      <a
                        href={`tel:${PHONE_DISPLAY.replace(/\D/g, "")}`}
                        className="inline-flex items-center gap-2.5 rounded-full bg-black/35 px-5 py-2.5 text-[14px] font-semibold text-white ring-1 ring-white/20 backdrop-blur hover:bg-black/45 sm:px-6 sm:py-3 sm:text-[15px]"
                      >
                        <Phone className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                        {PHONE_DISPLAY}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* СТУДИИ */}
          <section className="border-t border-black/10 pt-10">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                  Студии
                </h2>
                <p className="mt-2 max-w-xl text-[14px] text-[#333231]">
                  Выберите ближайшую — карта кликабельна и сразу откроет маршрут.
                </p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.22em] text-[#b0b0b0]">
                  Опт и розница · свежий срез ежедневно
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {SHOPS.map((shop, idx) => {
                const mapsHref = `https://yandex.ru/maps/?text=${encodeURIComponent(CITY + " " + shop.address)}`;
                const addr = splitAddress(shop.address);
                return (
                  <article
                    key={shop.address}
                    id={`studio-${idx}`}
                    className="rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)] sm:p-5"
                  >
                    <LocationMap
                      location={shop.address.split(" (")[0]}
                      coordinates={getCoordinates(idx)}
                      href={mapsHref}
                      openOnClick
                      hintText="Открыть маршрут"
                      variant="glass3d"
                      className="w-full"
                    />

                    <div className="mt-5">
                      <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-[#1f1f1f] sm:text-[18px]">
                        {addr.primary}
                      </h3>
                      {addr.secondary ? (
                        <p className="mt-1 text-[13px] text-[#8a8a8a]">
                          {addr.secondary}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <a
                          href={shop.phoneHref}
                          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-[#333231] transition-colors hover:bg-black/5"
                        >
                          <Phone className="h-4 w-4" aria-hidden />
                          {normalizePhoneDisplay(shop.phone)}
                        </a>
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium text-[#8a8a8a]">
                          <MapPin className="h-4 w-4" aria-hidden />
                          Клик по карте — маршрут
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ОНЛАЙН + ОПТ */}
          <section className="mt-12 grid grid-cols-1 gap-10 border-t border-black/10 pt-10 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                Написать онлайн
              </h2>
              <p className="mt-2 text-[13px] text-[#8a8a8a]">
                Обычно отвечаем за 5–15 минут в рабочее время.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={TG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)] transition hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                      Telegram
                    </p>
                    <p className="mt-2 text-[16px] font-semibold tracking-tight text-[#1f1f1f] group-hover:text-[#858585] transition-colors">
                      Написать
                    </p>
                    <p className="mt-1 text-[12px] text-[#8a8a8a]">
                      Фото по наличию · 5–15 минут
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#333231] shadow-sm transition group-hover:bg-black/5">
                    <Send className="h-4 w-4 -ml-0.5 mt-0.5" aria-hidden />
                  </div>
                </a>
                <a
                  href={VK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)] transition hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                      ВКонтакте
                    </p>
                    <p className="mt-2 text-[16px] font-semibold tracking-tight text-[#1f1f1f] group-hover:text-[#858585] transition-colors">
                      Заказ
                    </p>
                    <p className="mt-1 text-[12px] text-[#8a8a8a]">
                      Опт и розница · быстро оформим
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#333231] shadow-sm transition group-hover:bg-black/5">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-black/10">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a8a8a]">
                Сотрудничество и опт
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#333231] max-w-lg">
                По вопросам оптовых закупок и корпоративных заказов пишите на почту или в Telegram. Подготовим предложение.
              </p>
              <p className="mt-2 text-[13px] text-[#8a8a8a]">
                Пришлём прайс, условия и наличие — ответим в рабочее время.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="mailto:opt@cveti.ru"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1a1a1a]"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  opt@cveti.ru
                </a>
                <a
                  href={TG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-[#333231] transition hover:bg-black/5"
                >
                  <Send className="h-4 w-4 -ml-0.5 mt-0.5" aria-hidden />
                  Telegram
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-auto pt-10">
        <Footer />
      </div>
    </div>
  );
}
