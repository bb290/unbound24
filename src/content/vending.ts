// The Value Vending Machine (2026-11-13). 12 free one-pagers, pay with an email.
// PLACEHOLDERS: titles and copy are drafts until Brittany's 12 PDFs exist. Drop each PDF at public/vending/<code>.pdf
// (a1.pdf ... d3.pdf). No "Download the free report" buttons: the button is the headline (Brittany, 2026-11-13).

export type VendingItem = {
  code: string; // A1..D3: row letter, column number
  short: string; // label on the cover, 2 to 4 words
  headline: string; // what it is, said plainly; also the button text
  what: string;
  why: string;
  fill: "cyan" | "teal" | "lilac" | "gray";
};

export const VENDING: VendingItem[] = [
  { code: "A1", short: "Google Profile Tune-Up", headline: "The 60-minute Google Business Profile tune-up", what: "A one-page checklist to fix your Google profile in an hour.", why: "It's the first thing people see when they search for you, and most are half filled in.", fill: "cyan" },
  { code: "A2", short: "Review Request Texts", headline: "5 review request texts that get answered", what: "Copy-and-paste texts that ask how the job went, then ask for the review.", why: "Asking is the whole game. These make it take 10 seconds.", fill: "teal" },
  { code: "A3", short: "1-Star Reply Guide", headline: "How to reply to a 1-star review", what: "A simple reply formula, plus three real-world examples.", why: "Future customers read your reply more closely than the review.", fill: "lilac" },
  { code: "B1", short: "Job Photo Checklist", headline: "The job photo checklist", what: "The 8 shots to take on every job, and what to skip.", why: "Your photos are your best marketing, if you take the right ones.", fill: "gray" },
  { code: "B2", short: "1-Page Brand Guide", headline: "Your one-page brand guide", what: "Fill-in-the-blanks for your values, voice, colors and stances.", why: "Everything you post gets easier once this exists.", fill: "cyan" },
  { code: "B3", short: "FAQ Page Starter", headline: "The FAQ page starter", what: "The 20 questions every home service customer asks, ready for your answers.", why: "Answer them once on your site and stop answering them on the phone.", fill: "teal" },
  { code: "C1", short: "Price Range Worksheet", headline: "Build your instant price range", what: "A worksheet to turn your past jobs into honest price ranges.", why: "A price range on your site filters out the tire-kickers for you.", fill: "lilac" },
  { code: "C2", short: "Service Area Pages", headline: "The service area page template", what: "One page per town you serve, with the outline filled in.", why: "It's how you show up when someone searches your service plus their town.", fill: "gray" },
  { code: "C3", short: "Follow-Up Script", headline: "The estimate follow-up script", what: "What to say on day 2, day 7 and day 21 after an estimate.", why: "Most jobs are won on the follow-up nobody sends.", fill: "cyan" },
  { code: "D1", short: "Weekly Post Planner", headline: "The weekly post planner", what: "Plan a week of posts from the jobs you already did.", why: "Showing up every week beats going viral once.", fill: "teal" },
  { code: "D2", short: "Lead Source Tracker", headline: "The lead source tracker", what: "One question to ask every new customer, and where to write the answer.", why: "Stop guessing which marketing works.", fill: "lilac" },
  { code: "D3", short: "Hand-Off Checklist", headline: "The hand-off checklist", what: "What your business needs written down to sell it or pass it on.", why: "Keep the business you built local when it's time to step back.", fill: "gray" },
];

export const VENDING_ROWS = ["A", "B", "C", "D"];
export const VENDING_COLS = ["1", "2", "3"];
