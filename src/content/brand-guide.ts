// Free Brand Guide widget (Brittany, 2026-11-14): the home page's primary CTA. No email gate, about 5 minutes of questions (never say how many: Brittany 2026-11-17),
// the guide is written on the site through OpenRouter, then downloads as PDF and .md with the PROMPTS below.
// The call to action on the finished guide: "Submit for Mock Up" (name + email) and we send back a full website
// mock up plus an SEO/AEO and social strategy (Brittany, 2026-11-17). No call, no booking link.
// A condensed version of unbound-toolkit/docs/prompts/brand-intake.md (7 parts into 7 steps).
// DRAFT copy: written by Claude from Brittany's brief; Brittany reviews the wording. No em dashes (customer-facing).

export type Field =
  | { id: string; kind: "text" | "textarea"; label: string; placeholder?: string; optional?: boolean; max?: number }
  // pick = the most they can choose; leave it out for no limit. Required chips need at least 1.
  | { id: string; kind: "chips"; label: string; options: string[]; pick?: number; optional?: boolean; other?: boolean }
  | { id: string; kind: "choice"; label: string; options: string[]; optional?: boolean };

export type Step = { title: string; fields: Field[] };

export const VALUES = [
  "Laid-back", "No-nonsense", "Old-school", "Modern", "Scrappy", "Family-run", "Hometown", "Friendly", "Easygoing", "Upfront",
  "Honest", "Reliable", "Hardworking", "Meticulous", "Fast", "Clean", "Rugged", "Gritty", "High-end", "Down to earth",
  "Quirky", "Fun", "Cheerful", "Thoughtful", "Approachable", "Organized", "Proud of the craft", "Small but mighty", "Classic", "Creative",
];

export const VISUALS = [
  "Real photos of us and our work", "Polished, staged photos", "Stock photos", "Graphics and illustrations", "Cartoons or a mascot",
  "AI-generated images", "Video", "Bold type, few images", "Not sure yet",
];

export const VOICES = ["Plain-spoken", "Warm", "Funny", "Dry", "Bold", "Calm", "Straight-talking", "Neighborly", "Nerdy", "Polished"];

export const STEPS: Step[] = [
  {
    title: "Basics",
    fields: [
      { id: "name", kind: "text", label: "Business name", placeholder: "Smith Family Plumbing", max: 80 },
      { id: "what", kind: "text", label: "What you do, in one sentence", placeholder: "We fix and replace water heaters and leaky pipes.", max: 200 },
      { id: "where", kind: "text", label: "Where you work", placeholder: "Springfield and the towns around it", max: 120 },
      { id: "site", kind: "text", label: "Website", placeholder: "Leave blank if you don't have one", optional: true, max: 120 },
    ],
  },
  {
    title: "Story",
    fields: [
      { id: "story", kind: "textarea", label: "Why did you start this business, and what were you doing before?", placeholder: "Ramble. We'll clean it up.", max: 1500 },
    ],
  },
  {
    title: "Customers",
    fields: [
      { id: "best", kind: "textarea", label: "Describe your best customer ever. What made them great?", max: 1000 },
      { id: "never", kind: "textarea", label: "Who would you never take on again, and why?", optional: true, max: 800 },
    ],
  },
  {
    title: "Vibe",
    fields: [{ id: "values", kind: "chips", label: "Pick 5 that feel like you.", options: VALUES, pick: 5, other: true }],
  },
  {
    title: "Stance",
    fields: [
      { id: "mad", kind: "textarea", label: "What does your industry do that makes you mad, or what do customers believe that's just wrong?", max: 1200 },
      { id: "promise", kind: "textarea", label: "What do you promise every customer instead?", max: 600 },
    ],
  },
  {
    title: "Voice",
    fields: [
      { id: "voice", kind: "chips", label: "Pick the ones that sound like you (at least 1).", options: VOICES },
      { id: "cringe", kind: "text", label: "Marketing words that make you cringe", placeholder: "Premier, solutions, top-notch...", optional: true, max: 200 },
    ],
  },
  {
    title: "Look",
    fields: [
      { id: "colors", kind: "text", label: "Colors you already use (logo, trucks, shirts, signs)", placeholder: "Navy and orange", optional: true, max: 200 },
      { id: "visual", kind: "chips", label: "Visual style (pick any)", options: VISUALS, optional: true },
      { id: "inspo", kind: "textarea", label: "Websites you love (1 to 3) and what you like about each", placeholder: "example.com: real photos of the crew, prices right on the page.", optional: true, max: 800 },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

// Ready-to-use prompts that ship with every download (Brittany: 3-5).
export const PROMPTS: { title: string; text: string }[] = [
  { title: "Google Business Profile post", text: "Using my brand guide, write a Google Business Profile post about [a recent job: what we did and where]. Under 120 words, in my voice, with one clear next step at the end. Don't invent any facts." },
  { title: "Review reply", text: "Using my brand guide, write a reply to this review: [paste the review]. Thank them by name, mention one specific thing they said, and keep it under 60 words." },
  { title: "Homepage top", text: "Using my brand guide, rewrite the top of my homepage: a headline, one sentence under it, and a button label. Give me 3 options that sound like me, not like an ad." },
  { title: "Social caption", text: "Using my brand guide, turn this job into a social media caption: [what we did, where, and anything the customer said]. Give me a short version and a storytelling version." },
  { title: "Quote follow-up text", text: "Using my brand guide, write a friendly text to a customer 2 days after I sent them a quote. Under 40 words, no pressure, and easy to reply to." },
];

export const PROMPTS_INTRO = "Open ChatGPT or Claude, attach your brand guide (the .md file works best) or paste it in, then use one of these. Swap the parts in [brackets] for your own details.";
