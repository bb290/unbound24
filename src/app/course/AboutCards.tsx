// Numbered "about" cards on the course pages: a title and a few bullets each.
export type AboutBlock = { title: string; bullets: string[] };

export default function AboutCards({ blocks }: { blocks: AboutBlock[] }) {
  return (
    <div className={`grid gap-6 ${blocks.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {blocks.map((block, i) => (
        <section key={block.title} className="p-6 rounded-3xl bg-card border border-line">
          <h2 className="text-2xl font-black tracking-tight">
            <span className={i % 2 ? "text-magenta-text" : "text-cyan-text"}>{i + 1}.</span> {block.title}
          </h2>
          <ul className="mt-4 space-y-3">
            {block.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 leading-relaxed">
                <span className="mt-[0.6rem] w-2 h-2 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
