// Resources page (Brittany, 2026-11-14): a laundry list of things B likes. Some links are affiliate links
// (Amazon Associates for books, plus services), some aren't. Set affiliate: true on any affiliate link so it
// gets rel="sponsored" and the disclosure stays true.
// DRAFT: the seed items and their notes were written by Claude from Brittany's plan and brand interview;
// Brittany rewrites the notes in her own words. placeholder: true items show a "Placeholder" tag until replaced.

export type Resource = {
  title: string;
  by?: string; // author, host, channel or company
  short: string; // the one line on the card: what I like about it
  more: string; // the longer note in the pop-up
  href: string;
  linkLabel: string; // pop-up button, e.g. "See it on Amazon"
  affiliate?: boolean;
  placeholder?: boolean;
};

export type ResourceSection = {
  key: string;
  title: string;
  fill: "cyan" | "teal" | "lilac" | "gray";
  items: Resource[];
};

export const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    key: "books",
    title: "Essential Reading",
    fill: "cyan",
    // TODO: swap the Amazon search links for Brittany's Amazon Associates links once she has them.
    items: [
      { title: "It's Not Luck", by: "Eliyahu M. Goldratt", short: "Find the one thing holding the business back.", more: "The sequel to The Goal, told as a story. A manager uses the Theory of Constraints to fix sales, pricing and the rest. The lesson: stop fixing everything at once and find the one thing that's actually in the way.", href: "https://www.amazon.com/s?k=It%27s+Not+Luck+Goldratt", linkLabel: "See it on Amazon", affiliate: true },
      { title: "The Millionaire Fastlane", by: "MJ DeMarco", short: "Build something that doesn't trade every hour for money.", more: "Why a paycheck and slow saving is the long way around, and what to build instead: a business that keeps growing without you there for every hour of it.", href: "https://www.amazon.com/s?k=The+Millionaire+Fastlane+DeMarco", linkLabel: "See it on Amazon", affiliate: true },
      { title: "The $100M Series", by: "Alex Hormozi", short: "Offers, leads and pricing, in plain language.", more: "$100M Offers, $100M Leads and $100M Money Models. How to make an offer people feel silly saying no to, how to get it in front of more people, and how to price it.", href: "https://www.amazon.com/s?k=Alex+Hormozi+%24100M", linkLabel: "See them on Amazon", affiliate: true },
    ],
  },
  {
    key: "podcasts",
    title: "Podcasts",
    fill: "teal",
    items: [
      { title: "From Zero to 850 Doors", by: "Unfiltered", short: "How a social worker ended up running 850 rentals.", more: "My episode on Unfiltered: answering a Craigslist ad, talking my way into running 55 units, and figuring the rest out with a pro bono lawyer and a PhD from YouTube University.", href: "https://www.youtube.com/watch?v=6RQhPNKUqeo", linkLabel: "Listen" },
    ],
  },
  {
    key: "youtube",
    title: "YouTube Videos",
    fill: "lilac",
    items: [
      { title: "Video title", by: "Channel", short: "What I like about it, in one line.", more: "A few lines on why it's worth watching.", href: "https://www.youtube.com", linkLabel: "Watch on YouTube", placeholder: true },
    ],
  },
  {
    key: "services",
    title: "Services",
    fill: "gray",
    items: [
      { title: "Housecall Pro", by: "Field service software", short: "Scheduling, invoices and payments in one place.", more: "What we run our own service businesses on. We build marketing into it instead of asking anyone to switch.", href: "https://www.housecallpro.com", linkLabel: "Visit Housecall Pro", affiliate: true },
      { title: "Wispr Flow", by: "Voice dictation", short: "Talk instead of type, anywhere on your computer.", more: "I talk, it types, and it cleans up the ums. Most of what I write starts here.", href: "https://wisprflow.ai", linkLabel: "Visit Wispr Flow", affiliate: true },
      // TODO: swap href for Brittany's Paige affiliate link (she has one; 2026-11-14).
      { title: "Paige", by: "Merchynt", short: "Keeps your Google Business Profile busy for you.", more: "AI that works on your Google profile: posts, photos, review replies and review requests, plus a map of where you rank around town. Good for owners who know the profile matters and never get to it.", href: "https://www.merchynt.com/paige", linkLabel: "Visit Paige", affiliate: true },
    ],
  },
];
