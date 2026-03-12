import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">
            {title}
          </h2>
          {subtitle && (
            <p className="section-subtitle">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
