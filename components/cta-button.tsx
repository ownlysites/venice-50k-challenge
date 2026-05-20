"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  trackEvent?: string;
};

export default function CtaButton({ href, variant = "primary", children, className, trackEvent }: Props) {
  const cls = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <a
      href={href}
      data-frame="modal"
      data-track={trackEvent}
      className={cn(cls, className)}
      rel="noopener"
    >
      {children}
    </a>
  );
}
