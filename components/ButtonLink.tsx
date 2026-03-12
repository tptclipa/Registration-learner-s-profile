import Link from "next/link";
import { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const variantClass = variant === "primary" ? "btn--primary" : "btn--secondary";
  return (
    <Link
      href={href}
      className={`btn ${variantClass} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
