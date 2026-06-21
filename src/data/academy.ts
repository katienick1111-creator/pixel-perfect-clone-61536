export type AcademyCategory = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  number: string;
};

export const academyCategories: AcademyCategory[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Your first event, from idea to setup day.",
    longDescription:
      "Pick a market that fits, register the right way, and walk in on day one knowing exactly what to do.",
    number: "01",
  },
  {
    slug: "festivals-events",
    title: "Festivals & Events",
    description: "Prep, packing, and on-site playbooks.",
    longDescription:
      "Multi-day festival logistics, weather contingencies, load-in rituals, and recovery checklists.",
    number: "02",
  },
  {
    slug: "booth-setup",
    title: "Booth Setup",
    description: "Layout, signage, displays, lighting.",
    longDescription:
      "Engineer a booth that stops foot traffic, tells your story in 6 seconds, and makes pricing obvious.",
    number: "03",
  },
  {
    slug: "pricing-sales",
    title: "Pricing & Sales",
    description: "Price with confidence, close more.",
    longDescription:
      "Real margin math, anchor pricing, upsell scripts, and bundle structures that actually work.",
    number: "04",
  },
  {
    slug: "marketing",
    title: "Marketing",
    description: "Get noticed before, during, and after.",
    longDescription:
      "Story-led social, email rhythms, post-event nurture, and a 7-day pre-launch playbook per event.",
    number: "05",
  },
  {
    slug: "business-tools",
    title: "Business Tools",
    description: "CRM, inventory, taxes, mileage.",
    longDescription:
      "Operate like a brand: bookkeeping rhythms, mileage logs, sales-tax basics, and CRM hygiene.",
    number: "06",
  },
  {
    slug: "vendor-stories",
    title: "Vendor Stories",
    description: "Learn from vendors who've done it.",
    longDescription:
      "Long-form interviews with vendors who turned a side hustle into a six-figure brand.",
    number: "07",
  },
  {
    slug: "downloads",
    title: "Downloads",
    description: "Printable checklists, planners, workbooks.",
    longDescription:
      "100+ printable PDFs alongside the interactive versions — checklists, planners, trackers, calendars.",
    number: "08",
  },
];

export const academyTools = [
  { slug: "packing", title: "Packing Checklist", category: "festivals-events", status: "ready" },
  { slug: "inventory", title: "Inventory Tracker", category: "business-tools", status: "ready" },
  { slug: "expenses", title: "Expense Tracker", category: "business-tools", status: "ready" },
  { slug: "sales", title: "Sales Tracker", category: "business-tools", status: "ready" },
  { slug: "pricing", title: "Pricing Calculator", category: "pricing-sales", status: "ready" },
  { slug: "profit", title: "Profit Calculator", category: "pricing-sales", status: "ready" },
  { slug: "event-planner", title: "Event Planner", category: "festivals-events", status: "ready" },
  { slug: "goals", title: "Goal Tracker", category: "business-tools", status: "ready" },
  
  { slug: "crm", title: "Vendor CRM", category: "business-tools", status: "ready" },
] as const;

export const academyFeaturedTip = {
  eyebrow: "tip of the week",
  body: "Price the experience, not the inventory.",
  byline: "Maven & Moth · 6 yrs vending farmers markets in Chicago",
};
