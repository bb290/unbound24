// Free Brand Guide widget (Brittany, 2026-11-14): the home page's primary CTA. No email gate, 7 questions,
// the guide is written on the site through OpenRouter, then downloads as PDF and .md with the PROMPTS below.
// Optional upgrade: send the guide (name + email) for a free marketing plan and website redesign, gone over on a
// 20-minute call. That booking link is the ONE exception to the "no book a call" rule (Brittany, 2026-11-14),
// shown only after someone has sent their guide.
// A condensed version of unbound-toolkit/docs/prompts/brand-intake.md (7 parts into 7 questions).
// DRAFT copy: written by Claude from Brittany's brief; Brittany reviews the wording. No em dashes (customer-facing).

// TODO: Brittany's scheduling link for the 20-minute review. Empty = "we'll email you to pick a time".
export const BOOKING_URL = "";

export type Field =
  | { id: string; kind: "text" | "textarea"; label: string; placeholder?: string; optional?: boolean; max?: number }
  | { id: string; kind: "chips"; label: string; options: string[]; pick: number; optional?: boolean; other?: boolean }
  | { id: string; kind: "choice"; label: string; options: string[]; optional?: boolean };

export type Step = { title: string; fields: Field[] };

export const VALUES = [
  "Honesty", "Craftsmanship", "Speed", "Reliability", "Fairness", "Family", "Community", "Safety", "Courage", "Humor",
  "Simplicity", "Generosity", "Grit", "Respect", "Accountability", "Curiosity", "Independence", "Loyalty", "Transparency",
  "Patience", "Pride in the work", "Teaching", "Calm", "Hustle", "Faith", "Freedom", "Play", "Ownership", "Consistency",
  "Doing it right the first time",
];

export const VOICES = ["Plain-spoken", "Warm", "Funny", "Dry", "Bold", "Calm", "Straight-talking", "Neighborly", "Nerdy", "Polished"];

export const STEPS: Step[] = [
  {
    title: "The basics",
    fields: [
      { id: "name", kind: "text", label: "Business name", placeholder: "Smith Family Plumbing", max: 80 },
      { id: "what", kind: "text", label: "What you do, in one sentence", placeholder: "We fix and replace water heaters and leaky pipes.", max: 200 },
      { id: "where", kind: "text", label: "Where you work", placeholder: "Springfield and the towns around it", max: 120 },
      { id: "site", kind: "text", label: "Website", placeholder: "Leave blank if you don't have one", optional: true, max: 120 },
    ],
  },
  {
    title: "Your story",
    fields: [
      { id: "story", kind: "textarea", label: "Why did you start this business, and what were you doing before?", placeholder: "Ramble. We'll clean it up.", max: 1500 },
    ],
  },
  {
    title: "Your customers",
    fields: [
      { id: "best", kind: "textarea", label: "Describe your best customer ever. What made them great?", max: 1000 },
      { id: "never", kind: "textarea", label: "Who would you never take on again, and why?", optional: true, max: 800 },
    ],
  },
  {
    title: "Your values",
    fields: [{ id: "values", kind: "chips", label: "Pick 5 that are really true about how you work.", options: VALUES, pick: 5, other: true }],
  },
  {
    title: "Your stance",
    fields: [
      { id: "mad", kind: "textarea", label: "What does your industry do that makes you mad, or what do customers believe that's just wrong?", max: 1200 },
      { id: "promise", kind: "textarea", label: "What do you promise every customer instead?", max: 600 },
    ],
  },
  {
    title: "Your voice",
    fields: [
      { id: "voice", kind: "chips", label: "Pick up to 3 that sound like you.", options: VOICES, pick: 3 },
      { id: "cringe", kind: "text", label: "Marketing words that make you cringe", placeholder: "Premier, solutions, top-notch...", optional: true, max: 200 },
    ],
  },
  {
    title: "Your look",
    fields: [
      { id: "colors", kind: "text", label: "Colors you already use (logo, trucks, shirts, signs)", placeholder: "Navy and orange", optional: true, max: 200 },
      { id: "feel", kind: "text", label: "What should someone feel in the first 5 seconds on your website?", placeholder: "Like they called the right person", max: 200 },
      { id: "photos", kind: "choice", label: "Photos", options: ["Real photos of us and our work", "Polished and staged", "Not sure yet"], optional: true },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

// Ready-to-use prompts that ship with every download (Brittany: 3-5, for people who skip the call).
export const PROMPTS: { title: string; text: string }[] = [
  { title: "Google Business Profile post", text: "Using my brand guide, write a Google Business Profile post about [a recent job: what we did and where]. Under 120 words, in my voice, with one clear next step at the end. Don't invent any facts." },
  { title: "Review reply", text: "Using my brand guide, write a reply to this review: [paste the review]. Thank them by name, mention one specific thing they said, and keep it under 60 words." },
  { title: "Homepage top", text: "Using my brand guide, rewrite the top of my homepage: a headline, one sentence under it, and a button label. Give me 3 options that sound like me, not like an ad." },
  { title: "Social caption", text: "Using my brand guide, turn this job into a social media caption: [what we did, where, and anything the customer said]. Give me a short version and a storytelling version." },
  { title: "Quote follow-up text", text: "Using my brand guide, write a friendly text to a customer 2 days after I sent them a quote. Under 40 words, no pressure, and easy to reply to." },
];

export const PROMPTS_INTRO = "Open ChatGPT or Claude, attach your brand guide (the .md file works best) or paste it in, then use one of these. Swap the parts in [brackets] for your own details.";
