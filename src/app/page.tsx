// TODO: replace with the Stan Store course link once the store page is live.
const COURSE_URL = "#";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-5 max-w-5xl mx-auto sm:px-8">
        <Wordmark />
        <a
          href={COURSE_URL}
          className="px-5 py-2.5 rounded-full bg-cyan text-foreground text-sm font-extrabold hover:brightness-95 transition"
        >
          Get the free course
        </a>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-16 pb-24 max-w-3xl mx-auto text-center sm:px-8 sm:pt-28 sm:pb-32">
        <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase mb-6">
          A free course for home service owners
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl sm:leading-[1.08]">
          Running a business shouldn&rsquo;t be this complicated.
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl mx-auto sm:text-xl">
          Own Your 24 helps plumbers, electricians, HVAC techs and roofers get
          their business out of their head and onto paper. One short lesson at
          a time, with Claude doing the writing.
        </p>
        <CourseButton className="mt-10" />
        <p className="mt-4 text-sm text-muted">Free. No sales call. No catch.</p>
      </section>

      {/* Simple habits */}
      <section className="px-4 py-20 bg-card sm:px-8 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="What actually works"
            title="Simple habits beat fancy marketing."
          >
            The shops that stay booked aren&rsquo;t doing anything fancy. They
            pick up the phone, they&rsquo;re easy to find, they get reviews, and
            they stay in touch with past customers. That&rsquo;s what I&rsquo;ll
            help you build.
          </SectionHeading>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <HabitCard title="Answer fast" description="Every call and estimate gets a quick, clear reply." />
            <HabitCard title="Be easy to find" description="Show up when someone nearby needs you." />
            <HabitCard title="Earn the reviews" description="Keep your promises, then ask every happy customer." />
            <HabitCard title="Follow up" description="Past customers are your easiest next job." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="How it works" title="One brick at a time." />
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <StepCard number="1" title="Watch one short lesson" description="One idea per lesson. Fits between jobs." />
            <StepCard number="2" title="Do one Action with Claude" description="Each lesson has one prompt. You talk, Claude writes it up." />
            <StepCard number="3" title="Keep what you made" description="Your process, your numbers, your way of doing things, written down." />
          </div>
        </div>
      </section>

      {/* What you'll build */}
      <section className="px-4 py-20 bg-card sm:px-8 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="What you'll build" title="Your whole business, not a handful of tricks.">
            Level 1 lays the foundation. Level 2 helps you grow on purpose.
          </SectionHeading>
          <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {AREAS.map((area) => (
              <span
                key={area}
                className="px-5 py-3 rounded-2xl bg-background border border-line text-base font-bold"
              >
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-cyan mr-2.5 align-middle" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
          {/* TODO: Brittany's photo */}
          <div className="shrink-0 w-36 h-36 rounded-full bg-highlight border-4 border-cyan" aria-hidden="true" />
          <div>
            <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase mb-3">
              Who&rsquo;s teaching
            </p>
            <h2 className="text-3xl font-black tracking-tight">Hi, I&rsquo;m Brittany.</h2>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              I&rsquo;ve spent [15] years running a service business. I built
              this course because nobody should need a $2,000 a month coach to
              write down how their own business works.
            </p>
          </div>
        </div>
      </section>

      {/* For / not for */}
      <section className="px-4 py-20 bg-card sm:px-8 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <SectionHeading eyebrow="Fair warning" title="Is this for you?" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <ListCard
              title="It's for you if"
              highlight
              items={[
                "You run a home service business and you're past your first year",
                "Everything goes through you",
                "Your best processes live in your head",
              ]}
            />
            <ListCard
              title="It's not for you if"
              items={[
                "You want someone to do it for you",
                "You're looking for another course to bookmark",
                "You want a get-rich-quick plan",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="Questions" title="What's the catch?" />
          <div className="mt-12 flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="p-6 rounded-3xl bg-card border border-line">
                <h3 className="text-lg font-extrabold">{faq.q}</h3>
                <p className="mt-2 text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-8 sm:pb-32">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-foreground px-6 py-16 text-center sm:py-20">
          <h2 className="text-3xl font-black tracking-tight text-background sm:text-5xl">
            Build it once. Brick by brick.
          </h2>
          <p className="mt-4 text-lg text-line">Free. No sales call. No catch.</p>
          <CourseButton className="mt-10" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-line sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Wordmark small />
          <p className="text-sm text-muted">
            Questions?{" "}
            <a href="mailto:brittany@unbound24.com" className="text-cyan-text font-bold hover:underline">
              brittany@unbound24.com
            </a>
          </p>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Unbound Consulting LLC
          </p>
        </div>
      </footer>
    </div>
  );
}

const AREAS = [
  "Documentation",
  "Data",
  "Delivery",
  "Reputation",
  "Attract",
  "Convert",
  "Retain",
  "Brand",
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. There's nothing to buy to get started, and no call to book.",
  },
  {
    q: "Do I need to be good with tech?",
    a: "No. If you can send a text, you can do this. An early lesson walks you through setting up Claude.",
  },
  {
    q: "How much time does it take?",
    a: "Each lesson is short and has one Action. Do one when you have a gap in your day.",
  },
  {
    q: "Is this a pitch for coaching?",
    a: "No. The course stands on its own.",
  },
];

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <div className={`font-black tracking-tight ${small ? "text-base" : "text-xl"}`}>
      <span>Unbound</span>
      <span className="text-cyan-text">24</span>
    </div>
  );
}

function CourseButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={COURSE_URL}
      className={`inline-block px-9 py-4 rounded-full bg-cyan text-foreground text-lg font-extrabold shadow-[0_8px_24px_rgba(46,212,232,0.35)] hover:brightness-95 transition ${className}`}
    >
      Get the free course
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase mb-4">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      {children && (
        <p className="mt-5 text-lg text-muted leading-relaxed">{children}</p>
      )}
    </div>
  );
}

function HabitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-3xl bg-background border border-line">
      <div className="w-8 h-4 rounded bg-cyan mb-5" aria-hidden="true" />
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="mt-2 text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-7 rounded-3xl bg-card border border-line">
      <div className="w-11 h-11 rounded-full bg-cyan flex items-center justify-center text-lg font-black mb-5">
        {number}
      </div>
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function ListCard({
  title,
  items,
  highlight = false,
}: {
  title: string;
  items: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-7 rounded-3xl border ${
        highlight ? "bg-highlight border-cyan" : "bg-background border-line"
      }`}
    >
      <h3 className="text-xl font-extrabold">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-lg leading-snug">
            <span
              className={`mt-2 shrink-0 w-2.5 h-2.5 rounded-sm ${highlight ? "bg-cyan" : "bg-line"}`}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
