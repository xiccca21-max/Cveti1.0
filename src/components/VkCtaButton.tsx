import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { VK_URL } from "../config/site";

type VkCtaButtonProps = {
  children: ReactNode;
  className?: string;
};

/** Первичная кнопка «во ВКонтакте» для внутренних страниц. */
export function VkCtaButton({ children, className = "" }: VkCtaButtonProps) {
  return (
    <a
      href={VK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`hero-cta-glass-3d relative z-[1] inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-foreground transition hover:opacity-95 ${className}`}
    >
      <span className="relative z-[1]">{children}</span>
      <ArrowUpRight className="relative z-[1] h-5 w-5 shrink-0" aria-hidden />
    </a>
  );
}
