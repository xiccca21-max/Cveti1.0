import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { BlurText } from "../components/BlurText";
import { FlowerMarquee } from "../components/FlowerMarquee";
import { Navbar } from "../components/Navbar";
import { VK_URL } from "../config/site";
import { SHOP_FLOWERS } from "../data/shop-flowers";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4";

export function HomePage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/hero_bg.jpeg"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-black/5" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
            <div className="hero-pill-glass-3d mb-2 inline-flex max-w-full items-center justify-center rounded-full px-5 py-2.5">
              <span className="relative z-[1] font-body text-sm text-foreground/95 drop-shadow-sm">
                Свежий цветок · опт и розница · Набережные Челны
              </span>
            </div>

            <div className="flex max-w-3xl flex-col items-center gap-0">
              <BlurText
                text="От поля к вам"
                className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading font-semibold italic text-foreground leading-[0.92] max-w-2xl justify-center tracking-[-4px]"
                delay={100}
                animateBy="words"
                direction="bottom"
              />
              <BlurText
                text="свежий цветок каждый день"
                className="text-3xl md:text-4xl lg:text-[2.65rem] font-heading font-normal italic text-foreground/95 leading-[0.78] max-w-2xl justify-center tracking-[-2px] -mt-1"
                delay={380}
                animateBy="words"
                direction="bottom"
              />
            </div>

            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center gap-6"
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <a
                href={VK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-glass-3d relative z-[1] inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-foreground"
              >
                <span className="relative z-[1]">Перейти в каталог</span>
                <ArrowUpRight className="relative z-[1] h-5 w-5 shrink-0" aria-hidden />
              </a>
              <Link
                to="/bouquets"
                className="hero-cta-ghost-glass-3d relative z-[1] inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white"
              >
                <span className="relative z-[1]">Смотреть идеи букетов</span>
                <Play className="relative z-[1] h-4 w-4 fill-current" aria-hidden />
              </Link>
            </motion.div>

            <motion.p
              className="mt-5 max-w-2xl px-2 font-body text-sm font-light leading-tight text-white md:text-base"
              initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              ЦВЕТИ — проверенные поставки и бережная логистика. Букеты,
              композиции и оптовые объёмы: закажите удобно во{" "}
              <a
                href={VK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/50 underline-offset-2 transition hover:decoration-white"
              >
                ВКонтакте
              </a>
              , обсудим сроки и состав.
            </motion.p>
          </div>

          <div className="flex flex-col items-center gap-4 pb-8">
            <div className="hero-pill-glass-3d relative z-[1] max-w-[min(100%,42rem)] rounded-full px-4 py-2 text-center font-body text-xs font-medium leading-snug text-white drop-shadow-sm">
              <span className="relative z-[1]">
                Работаем с проверенными плантациями и поставщиками
              </span>
            </div>
            <div
              className="w-full"
              role="region"
              aria-label="Позиции каталога цветов"
            >
              <FlowerMarquee items={SHOP_FLOWERS} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
