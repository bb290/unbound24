// "Sites I've Built" pop-up on /websites (Brittany, 2026-11-17). Proof: Brittany OK'd showing all five sites
// (2026-11-17), but never their customers' or owners' details: previews are cropped above any reviews.
// Service / Vibe / Components are Claude's drafts from each live site, for Brittany to edit. No status pills
// (Brittany, 2026-11-17). D2 added 2026-11-17; Double Take 2026-11-23.
// Previews: public/sites/<slug>.jpg (1280x530, top of the homepage) for the pop-up; public/projects/<slug>-1..6.jpg for
// /projects (Brittany, 2026-11-23). Every shot is checked for reviews, customer names, owner photos and contact details.

export type SiteBuilt = {
  slug: string;
  name: string;
  url: string;
  service: string;
  vibe: string;
  components: string[];
  // The 6 slides on /projects: public/projects/<slug>-1..6.jpg (1280x800), one label each (used as alt text).
  shots: string[];
};

export const SITES_BUILT: SiteBuilt[] = [
  {
    slug: "french-roofing",
    name: "French Roofing",
    url: "https://frenchroofing.com",
    service: "Roofing contractor, Damascus, Oregon",
    vibe: "Hometown, friendly, straight-talking",
    components: ["Instant roof estimate", "Before/after slider", "Service area pages", "Roofing guides", "Recent work feed", "Reviews"],
    shots: ["Homepage services", "Before/after slider", "Recent work feed", "Recent work photos", "Instant roof estimate", "Roofing guides"],
  },
  {
    slug: "sagareus",
    name: "Sagareus",
    url: "https://www.sagareus.com",
    service: "Property management, Seattle and the Puget Sound",
    vibe: "Calm, clear, owner-first",
    components: ["Free owner audit", "Proposal request", "Pricing page", "City pages for 31 cities", "Google reviews", "FAQ answers"],
    shots: ["Homepage", "Instant pricing estimate", "Owner hub", "Seattle city page", "Leasing service page", "Free owner audit request"],
  },
  {
    slug: "d2-scheduler",
    name: "D² Scheduler",
    url: "https://www.d2scheduling.com",
    service: "Production scheduling software for shops on OrderTime",
    vibe: "Practical, shop-floor plain, confident",
    components: ["Product tour", "Demo request", "45-day free trial", "Live app preview", "Integrations page", "Pricing page", "FAQ"],
    shots: ["Homepage", "The problem, in numbers", "How it works", "Product tour", "FAQ", "Demo and free trial"],
  },
  {
    slug: "malorie-moon",
    name: "Malorie Moon Sleep Consulting",
    url: "https://maloriemoonsleep.com",
    service: "Pediatric sleep consulting, online across the US",
    vibe: "Gentle, warm, reassuring",
    components: ["Free sleep assessment", "Free sleep guide", "Reviews page", "Story-led about page", "FAQ"],
    shots: ["Homepage", "Pediatric sleep guide", "Baby sleep consultant page", "Toddler sleep consultant page", "Blog", "Contact and sleep assessment"],
  },
  {
    slug: "rise-counselling",
    name: "Rise Counselling",
    url: "https://rise-counselling.com",
    service: "Trauma-focused counselling and EMDR, online across Australia",
    vibe: "Calm, grounded, unhurried",
    components: ["2-minute reflection", "Online booking", "Services pages", "Questions page"],
    shots: ["Homepage", "Services", "Trauma-focused counselling and EMDR", "2-minute reflection", "Fees and payment", "Reflection, first question"],
  },
  {
    // Added 2026-11-23 (Brittany). Links to the Vercel preview until doubletake.photos is live after handoff.
    slug: "double-take",
    name: "Double Take Real Estate Photos",
    url: "https://double-take-five.vercel.app",
    service: "Real estate photography, King and Snohomish County, Washington",
    vibe: "Polished, bright, easygoing",
    components: ["Online booking", "Before/after slider", "Portfolio galleries", "Pricing packages", "Video walkthroughs", "Reviews page"],
    shots: ["Homepage", "Styled, not just shot", "Portfolio gallery", "Pricing packages", "Recent work", "Portfolio gallery"],
  },
  {
    slug: "unbound24",
    name: "Unbound24",
    url: "https://www.unbound24.com",
    service: "Marketing for local service businesses",
    vibe: "Playful, bold, no fluff",
    components: ["Free brand guide", "Chaos Spinner", "Value Vending Machine", "Beast Mode timer"],
    shots: ["Homepage", "Chaos Spinner", "Local + Loud", "Website Dev", "Custom components", "Resources"],
  },
];
