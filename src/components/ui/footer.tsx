import React from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FrameIcon, Phone, Send } from "lucide-react";
import { TG_URL, VK_URL, PHONE_DISPLAY } from "../../config/site";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Каталог",
    links: [
      { title: "Каталог цветов", href: "/catalog" },
      { title: "Букеты", href: "/bouquets" },
      { title: "Контакты", href: "/contacts" },
      { title: "Опт", href: "/opt" },
    ],
  },
  {
    label: "Покупателям",
    links: [
      { title: "Доставка и самовывоз", href: "/contacts" },
      { title: "Наличие и фото", href: "/contacts" },
      { title: "Политика конфиденциальности", href: "/privacy" },
      { title: "Условия", href: "/terms" },
    ],
  },
  {
    label: "Ресурсы",
    links: [
      { title: "ВКонтакте", href: VK_URL, icon: ArrowUpRight },
      { title: "Telegram", href: TG_URL, icon: Send },
      ...(PHONE_DISPLAY ? [{ title: PHONE_DISPLAY, href: "tel:+79375888882", icon: Phone } satisfies FooterLink] : []),
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-[calc(100vw-24px)] rounded-t-[28px] border-t border-white/10 bg-[#0b0a09] px-6 py-12 text-white shadow-[0_-30px_90px_-60px_rgba(0,0,0,0.8)] sm:max-w-[calc(100vw-40px)] lg:max-w-[calc(100vw-120px)] lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[180px] rounded-t-[28px]"
        style={{
          background:
            "radial-gradient(35% 128px at 50% 0%, rgba(255,255,255,0.10), rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur"
        style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
      />
      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-10">
        <AnimatedContainer className="space-y-4">
          <FrameIcon className="h-8 w-8 text-white/90" aria-hidden />
          <p className="mt-8 text-sm text-white/55 md:mt-0">
            © {new Date().getFullYear()} Цвети. Все права защищены.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  {section.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-white/55">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center transition-colors duration-300 hover:text-white"
                      >
                        {link.icon ? <link.icon className="me-1 h-4 w-4 text-white/70" /> : null}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

