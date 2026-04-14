export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-6xl mx-auto sm:px-8">
        <div className="font-heading text-xl font-bold tracking-tight">
          <span className="text-foreground">Unbound</span>
          <span className="text-teal">24</span>
        </div>
        <a
          href="mailto:brittany@unbound24.com"
          className="text-sm text-grey/70 hover:text-teal transition-colors"
        >
          Contact
        </a>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-32 max-w-6xl mx-auto sm:px-8 sm:pt-32 sm:pb-40">
        <p className="text-teal text-sm font-medium tracking-widest uppercase mb-6">
          Business Consulting
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight max-w-2xl sm:text-5xl sm:leading-tight">
          We install systems that create predictable growth.
        </h1>
        <p className="mt-6 text-lg text-grey/70 max-w-xl leading-relaxed">
          Branding, lead generation, online presence, and sales enablement
          for service businesses ready to scale without the chaos.
        </p>
        <a
          href="mailto:brittany@unbound24.com"
          className="inline-block mt-10 px-8 py-3.5 bg-teal text-background font-medium rounded-lg hover:bg-cyan transition-colors"
        >
          Start a Conversation
        </a>
      </section>

      {/* What We Do */}
      <section className="px-6 py-24 border-t border-foreground/10 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal text-sm font-medium tracking-widest uppercase mb-4">
            What We Do
          </p>
          <h2 className="font-heading text-2xl font-bold tracking-tight max-w-lg mb-16 sm:text-3xl">
            Clear systems. No fluff. No confusion.
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              title="Brand Strategy"
              description="High-level positioning, visual identity, and messaging that builds the most trusted presence in your market."
            />
            <ServiceCard
              title="Lead Generation"
              description="SEO, content, and digital presence systems that create consistent inbound calls instead of chasing referrals."
            />
            <ServiceCard
              title="Sales Enablement"
              description="Pipelines, sequences, and follow-up systems that convert leads without manual chaos."
            />
            <ServiceCard
              title="Operational SOPs"
              description="Documented processes that let your business run without you being the bottleneck."
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24 border-t border-foreground/10 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal text-sm font-medium tracking-widest uppercase mb-4">
            How We Work
          </p>
          <h2 className="font-heading text-2xl font-bold tracking-tight max-w-lg mb-16 sm:text-3xl">
            Sustainable growth, not frantic marketing.
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard
              title="Growth"
              description="We build measurable, scalable momentum. Revenue, systems, and opportunity that compounds."
            />
            <ValueCard
              title="Freedom"
              description="Our systems create independence, not dependency. They work even when you're not."
            />
            <ValueCard
              title="Integrity"
              description="We treat your business like it's ours. Honest expectations, real conversations about ROI."
            />
            <ValueCard
              title="Simplicity"
              description="Clear strategies. Clear results. No noise. If it feels overwhelming, something is wrong."
            />
            <ValueCard
              title="Balance"
              description="Growth that doesn't destroy peace. Defined scope, defined timelines, sustainable scale."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-foreground/10 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to build systems that scale?
          </h2>
          <p className="mt-4 text-grey/70 max-w-md mx-auto">
            We work with service businesses that are ready to grow
            without adding complexity.
          </p>
          <a
            href="mailto:brittany@unbound24.com"
            className="inline-block mt-8 px-8 py-3.5 bg-teal text-background font-medium rounded-lg hover:bg-cyan transition-colors"
          >
            Start a Conversation
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-foreground/10 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="font-heading text-sm font-bold tracking-tight">
            <span className="text-foreground">Unbound</span>
            <span className="text-teal">24</span>
          </div>
          <p className="text-xs text-grey/40">
            &copy; {new Date().getFullYear()} Unbound24 Consulting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-teal" />
      </div>
      <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-grey/60 leading-relaxed">{description}</p>
    </div>
  );
}

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-foreground/5 bg-foreground/[0.02]">
      <h3 className="font-heading text-lg font-semibold mb-2 text-teal">
        {title}
      </h3>
      <p className="text-sm text-grey/60 leading-relaxed">{description}</p>
    </div>
  );
}
