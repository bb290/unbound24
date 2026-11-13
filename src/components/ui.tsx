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

export function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="w-5 h-5 shrink-0 mt-[2px]">
      <circle cx="10" cy="10" r="9" fill="var(--teal)" stroke="var(--border)" strokeWidth="1.5" />
      <path d="M6 10.5l2.6 2.6L14 7.6" fill="none" stroke="#121318" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-2.5 ${className}`}>
      {items.map((i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-snug"><Check />{i}</li>
      ))}
    </ul>
  );
}
