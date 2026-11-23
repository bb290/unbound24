// Small building blocks shared by the home and Local + Loud pages (Unbound design system).

export function Label({ children, fill = "bg-teal" }: { children: React.ReactNode; fill?: string }) {
  return <span className={`label inline-block self-start rounded-full ${fill} text-ink px-3 py-[7px]`}>{children}</span>;
}

export function Section({ id, children, tinted = false }: { id?: string; children: React.ReactNode; tinted?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-20 border-t-2 border-border ${tinted ? "bg-surface-2" : ""}`}>
      <div className="max-w-[1200px] mx-auto px-4 py-16 sm:px-8 sm:py-24">{children}</div>
    </section>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display font-extrabold text-[32px] leading-[1.05] tracking-[-0.01em] sm:text-[48px]">{children}</h2>;
}

export function Check({ fill = "var(--teal)", className = "w-5 h-5 mt-[2px]" }: { fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`shrink-0 ${className}`}>
      <circle cx="10" cy="10" r="9" fill={fill} stroke="var(--border)" strokeWidth="1.5" />
      <path d="M6 10.5l2.6 2.6L14 7.6" fill="none" stroke="#121318" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A "no" mark to pair with Check (Website Dev hero, 2026-11-17).
export function Cross({ className = "w-5 h-5 mt-[2px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`shrink-0 ${className}`}>
      <circle cx="10" cy="10" r="9" fill="#c4c4c4" stroke="var(--border)" strokeWidth="1.5" />
      <path d="M7 7l6 6M13 7l-6 6" fill="none" stroke="#121318" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function CheckList({ items, className = "", itemClass = "text-[15px]", fill }: { items: string[]; className?: string; itemClass?: string; fill?: string }) {
  return (
    <ul className={`flex flex-col gap-2.5 ${className}`}>
      {items.map((i) => (
        <li key={i} className={`flex gap-2.5 leading-snug ${itemClass}`}><Check fill={fill} />{i}</li>
      ))}
    </ul>
  );
}
