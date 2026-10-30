import Image from "next/image";

// TODO: replace with the Stan Store course link once the store page is live.
const COURSE_URL = "#";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero: full-width cyan band with a slanted bottom edge */}
      <header className="bg-cyan [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)] pb-24 sm:pb-32">
        <nav className="flex items-center justify-between px-4 py-5 max-w-6xl mx-auto sm:px-8">
          <Wordmark />
          <a
            href={COURSE_URL}
            className="px-5 py-2.5 rounded-full bg-background text-foreground text-sm font-extrabold hover:bg-card transition"
          >
            Get the free course
          </a>
        </nav>

        <div className="px-4 pt-10 max-w-6xl mx-auto grid items-center gap-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-sm font-extrabold tracking-widest uppercase mb-5">
              A free course for home service owners
            </p>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
              Running a business is simple.
            </h1>
            <p className="mt-5 text-2xl font-extrabold sm:text-3xl">
              Why is it so complicated?
            </p>
            <p className="mt-6 text-lg leading-relaxed max-w-lg">
              Own Your 24 helps plumbers, electricians, HVAC techs and roofers
              get their business out of their head and onto paper. One short
              lesson at a time, with Claude doing the writing.
            </p>
            <CourseButton dark className="mt-9" />
            <p className="mt-4 text-sm font-semibold">Free. No sales call. No catch.</p>
          </div>
          <div className="rounded-[2.5rem] bg-background p-4 shadow-[0_24px_60px_rgba(10,28,51,0.18)] rotate-2 sm:p-6">
            <Image
              src="/hero-juggling.webp"
              alt="A stick figure juggling a ringing phone, a clipboard, a wrench, a calendar, a coffee mug, a house and loose papers"
              width={1536}
              height={1024}
              priority
              className="w-full h-auto -rotate-2"
            />
          </div>
        </div>
      </header>

      {/* Simple habits */}
      <FeatureRow
        eyebrow="What actually works"
        title="Simple habits beat fancy marketing."
        body="The shops that stay booked aren't doing anything fancy. They pick up the phone, they're easy to find, they get reviews, and they stay in touch with past customers. That's what I'll help you build."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <HabitCard title="Answer fast" description="Every call and estimate gets a quick, clear reply." />
          <HabitCard title="Be easy to find" description="Show up when someone nearby needs you." />
          <HabitCard title="Earn the reviews" description="Keep your promises, then ask every happy customer." />
          <HabitCard title="Follow up" description="Past customers are your easiest next job." />
        </div>
      </FeatureRow>

      {/* How it works */}
      <FeatureRow
        reverse
        tinted
        eyebrow="How it works"
        title="One brick at a time."
        body="No overhaul, no new software. Each lesson takes one small piece of your business and gets it written down."
      >
        <div className="flex flex-col gap-4">
          <StepCard number="1" title="Watch one short lesson" description="One idea per lesson. Fits between jobs." />
          <StepCard number="2" title="Do one Action with Claude" description="Each lesson has one prompt. You talk, Claude writes it up." />
          <StepCard number="3" title="Keep what you made" description="Your process, your numbers, your way of doing things, written down." />
        </div>
      </FeatureRow>

      {/* What you'll build */}
      <FeatureRow
        eyebrow="What you'll build"
        title="Your whole business, not a handful of tricks."
        body="Level 1 lays the foundation. Level 2 helps you grow on purpose."
      >
        <div className="flex flex-wrap gap-3">
          {AREAS.map((area) => (
            <span
              key={area}
              className="px-5 py-3 rounded-2xl bg-card border border-line text-lg font-bold"
            >
              <span className="inline-block w-3 h-3 rounded-sm bg-cyan mr-3 align-middle" />
              {area}
            </span>
          ))}
        </div>
      </FeatureRow>

      {/* About */}
      <section className="px-4 py-20 bg-card sm:px-8 sm:py-28">
        <div className="max-w-6xl mx-auto grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          {/* TODO: Brittany's photo */}
          <div className="w-48 h-48 rounded-full bg-highlight border-4 border-cyan sm:w-64 sm:h-64" aria-hidden="true" />
          <div className="max-w-2xl">
            <Eyebrow>Who&rsquo;s teaching</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Hi, I&rsquo;m Brittany.</h2>
            <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">
              I&rsquo;ve spent [15] years running a service business. I built
              this course because nobody should need a $2,000 a month coach to
              write down how their own business works.
            </p>
          </div>
        </div>
      </section>

      {/* For / not for */}
      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Eyebrow>Fair warning</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Is this for you?</h2>
          </div>
          <div className="mt-12 grid gap-4 max-w-4xl mx-auto sm:grid-cols-2">
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
      <section className="px-4 py-20 bg-card sm:px-8 sm:py-28">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">What&rsquo;s the catch?</h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              There isn&rsquo;t one. Here are the questions people ask.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="p-6 rounded-3xl bg-background border border-line">
                <h3 className="text-lg font-extrabold">{faq.q}</h3>
                <p className="mt-2 text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
          Build it once. Brick by brick.
        </h2>
        <p className="mt-4 text-lg text-muted">Free. No sales call. No catch.</p>
        <CourseButton dark className="mt-10" />
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-line sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
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
    <div className={`font-black tracking-tight ${small ? "text-base" : "text-2xl"}`}>
      <span>Unbound</span>
      <span className={small ? "text-cyan-text" : ""}>24</span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-cyan-text text-sm font-extrabold tracking-widest uppercase mb-4">
      {children}
    </p>
  );
}

function CourseButton({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <a
      href={COURSE_URL}
      className={`inline-flex items-center gap-3 px-9 py-4 rounded-full text-lg font-extrabold transition ${
        dark
          ? "bg-foreground text-background hover:bg-[#16304f]"
          : "bg-cyan text-foreground hover:brightness-95"
      } ${className}`}
    >
      Get the free course <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  children,
  reverse = false,
  tinted = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
  reverse?: boolean;
  tinted?: boolean;
}) {
  return (
    <section className={`px-4 py-20 sm:px-8 sm:py-28 ${tinted ? "bg-card" : ""}`}>
      <div className="max-w-6xl mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={reverse ? "lg:order-2" : ""}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{title}</h2>
          <p className="mt-5 text-lg text-muted leading-relaxed sm:text-xl">{body}</p>
        </div>
        <div className={reverse ? "lg:order-1" : ""}>{children}</div>
      </div>
    </section>
  );
}

function HabitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-3xl bg-card border border-line">
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
    <div className="flex gap-5 p-6 rounded-3xl bg-background border border-line">
      <div className="shrink-0 w-11 h-11 rounded-full bg-cyan flex items-center justify-center text-lg font-black">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-extrabold">{title}</h3>
        <p className="mt-1 text-muted leading-relaxed">{description}</p>
      </div>
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
