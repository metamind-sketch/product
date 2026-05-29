import { DigitalProduct } from "./types";

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "prod-1",
    title: "SEO Backlinks Blueprint & Verified DR 50+ Dir Database",
    tagline: "Get ranked! Vetted directory list, submission forms, and outreach pitch templates to secure domain authority.",
    description: "Rank higher on search engines and attract organic traffic. This premium SEO tool provides 150+ high-authority (Domain Rating 50-95) tech blogs, software directories, template stores, and asset websites that accept submissions, partner links, and user guest features. Perfect for ebooks, newsletters, and SaaS startups.",
    category: "Backlinks",
    price: 39.00,
    rating: 4.9,
    reviewsCount: 61,
    salesCount: 145,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    author: "Zarah Chen",
    tags: ["SEO", "Backlinks", "Marketing"],
    badge: "Trending",
    createdAt: "2026-03-10T11:20:00Z",
    contents: `# SEO Backlinks Blueprint & outreach databases

Congratulations on securing the Premium Directory & Outreach database! Use this checklist and resource database to construct safe, search-engine-approved editorial backlinks.

## 🔗 The Complete Master Database
[Click here to duplicate the Backlink Tracker & Directory Dashboard (AirTable & Notion)](https://notion.so/coursezy-backlinks-database)

---

## 🛠️ Step-by-Step Backlink Guide

1. **Clean Site Foundations**: Before out-reaching, verify that your webpage loads in 1.4s or faster and features clean sitemaps.
2. **Directory Submissions**: Register your template or e-book in the directory list under the "Free Submissions" tab of our Notion board.
3. **Niche Editorial Pitches**: Customize the provided copy templates inside our checklist to email editors of DR 60+ blogs.
4. **Anchor Diversity**: Never link 100% of your backlinks to the homepage. Keep 60% pointing to descriptive blog posts or specific feature lists.`,
  },
  {
    id: "prod-2",
    title: "React 19 Clean Architecture Guide",
    tagline: "A deep dive into writing scalable, bulletproof React web apps with TypeScript and production folder layouts.",
    description: "Learn to build frontend projects using real React 19 methodologies. This comprehensive handbook covers directory modular structures, custom hook processors, data context management, and optimization profiles to write robust, type-safe full-stack software without dependencies.",
    category: "E-Book",
    price: 14.99,
    rating: 4.8,
    reviewsCount: 54,
    salesCount: 197,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    author: "Elena Vance",
    tags: ["React", "TypeScript", "Clean Architecture"],
    badge: "Hot",
    createdAt: "2026-02-15T09:15:33Z",
    contents: `# React 19 Clean Architecture Guide
Elena Vance, Senior UI Architect

## Chapter 1: Separation of Concerns

Writing scalable React apps starts with establishing rigid fences between logic layers.

### 1. The Domain Layer (Core Entities)
This layer contains plain TypeScript files that define core business models, types, helper utilities, and mathematical algorithms. It has strictly zero imports from React or any state managers.

\`\`\`typescript
export interface ShoppingCart {
  items: CartItem[];
  coupon?: string;
}

export function calculateTotal(cart: ShoppingCart): number {
  const base = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return cart.coupon ? base * 0.9 : base;
}
\`\`\`

### 2. The Application Layer (React Hooks / State Providers)
Custom hooks process server fetch interactions, wrap state machines, and provide simple APIs to visual designs.

\`\`\`typescript
import { useState, useCallback } from 'react';

export function useShoppingCart() {
  const [cart, setCart] = useState<ShoppingCart>({ items: [] });
  const addItem = useCallback((item: CartItem) => {
    setCart(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  }, []);
  return { cart, addItem };
}
\`\`\`

## Chapter 2: Folder Structures

An organized workspace reduces cognitive friction. Use a domain-based layout:

\`\`\`text
src/
  features/
    shopping-cart/
      components/
        CartTable.tsx
        CheckoutCard.tsx
      hooks/
        useShoppingCart.ts
      domain/
        cartCalculator.ts
  components/
    Button.tsx
    Card.tsx
\`\`\`

---

## Chapter 3: Mastering React 19 Core Hooks

React 19 upgrades async states handling using the built-in Actions pattern. Leverage \`useActionState\` and \`useOptimistic\` to avoid manual loading wheel flags or messy try-catch state mutations.`,
  },
  {
    id: "prod-3",
    title: "SaaS Product Launch Checklist",
    tagline: "Cover 120 critical checkpoints: security testing, pricing tags, analytics, SEO setups, and legal standards.",
    description: "Deploy and publicize microtransactions and service apps safely with this 120-checkpoint directory sheet. It covers visual domain setups, Stripe API verification, compliance protocols, user terms, analytics tracking, and social preview cards to prevent deployment emergencies.",
    category: "Checklist",
    price: 4.99,
    rating: 5.0,
    reviewsCount: 42,
    salesCount: 289,
    coverImage: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=600&q=80",
    author: "Markus Finch",
    tags: ["SaaS", "Launch", "Product Guide"],
    badge: "Essential",
    createdAt: "2026-03-01T18:44:00Z",
    contents: `# SaaS Launch Checklist

Use this structured sheet to guarantee your product launch goes smoothly on Product Hunt, HackerNews, or Twitter.

## Section 1: Pre-Launch Readiness

- [ ] **SSL / Custom Domain Verification**: Check all SSL renewals and redirect settings.
- [ ] **SEO Meta Tags & Sitemaps**: Configure proper robots.txt, sitemap.xml, and visual open-graph social previews.
- [ ] **Stripe Sandbox to Production Toggle**: Double-check api signatures and webhooks.
- [ ] **Error Auditing Service**: Confirm Bugsnag or Sentry is capturing client-side crashes safely.

## Section 2: Analytics & Trackers

- [ ] **Custom Event Pipelines**: Verify click tags on checkout buttons inside Mixpanel or PostHog.
- [ ] **Google Tag Manager Ingress**: Check header script codes.
- [ ] **Conversion Attribution Parameters**: Log traffic referrals accurately.

## Section 3: Compliance & Legal

- [ ] **Privacy Policy Page**: Clear disclosure of cookie telemetry.
- [ ] **Terms of Service**: Dispute resolution mechanisms stated.
- [ ] **GDPR/CCPA Cookie Modals**: Give users appropriate consent switches.`,
  },
  {
    id: "prod-4",
    title: "Framer Motion Interactive Magic",
    tagline: "Hands-on video course with code assets, mastering spring structures, exit transitions, and scroll states.",
    description: "An intensive video curriculum complete with ready-to-use boilerplate source copy that takes your user interfaces to spectacular levels. You will master spring models, staggered exit overlays, custom layout transitions, and high-performance scrolling feedback tags.",
    category: "Mini-Course",
    price: 29.00,
    rating: 4.9,
    reviewsCount: 31,
    salesCount: 115,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    author: "Zarah Chen",
    tags: ["Animation", "Framer Motion", "Design"],
    badge: "Complete",
    createdAt: "2025-12-05T10:00:15Z",
    contents: "Framer Motion Interactive Magic Class Materials and Assets Overview: This course contains video lessons plus dynamic code workspaces.",
    chapters: [
      {
        title: "1. Spring Physics vs Duration",
        content: `### Chapter 1: The Magic of Spring Physics

In modern animation, relying on simple duration curves (ease-in-out) can feel rigid and artificial. Nature works on **mass, stiffness, and damping**.

#### 🚀 Key Code Implementation
\`\`\`jsx
import { motion } from "motion/react";

export function BounceButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold"
    >
      Click Me
    </motion.button>
  );
}
\`\`\`

#### ✏️ Mini Exercise
Adjust stiffness to \`500\` and damping to \`8\` to build an ultra-bouncy, hyper-responsive UI widget.`
      },
      {
        title: "2. Layout Animations (AnimateSharedLayout)",
        content: `### Chapter 2: Seamless Layout Transitions

Layout changes can feel disorienting. Using Framer Motion's \`layout\` prop instructs Vite to animate layout mutations gracefully behind the scenes using FLIP mechanics.

#### ⚙️ Creating a Smooth Todo Stagger
\`\`\`jsx
<motion.div layout id="todo-box">
  {todos.map(todo => (
    <motion.div layoutId={todo.id} key={todo.id} className="p-4 border-b">
      {todo.text}
    </motion.div>
  ))}
</motion.div>
\`\`\``
      },
      {
        title: "3. Exit Animations & Layout Transitions",
        content: `### Chapter 3: Safe Dismounts Using AnimatePresence

Removing components from the DOM normally triggers an abrupt pop. Wrap removable widgets in \`AnimatePresence\` to enable elegant fade-out transitions before they dismount.

#### 📦 Example Modal Blueprint
\`\`\`jsx
import { motion, AnimatePresence } from "motion/react";

export function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/50 grid place-items-center"
        >
          {/* Modal Elements */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\``
      }
    ]
  },
  {
    id: "prod-5",
    title: "CreatorOS: Complete Notion System",
    tagline: "Run your entire content business, project scopes, and finance trackers in one beautifully clean workspace.",
    description: "CreatorOS is a unified workspace designed specifically for creators. It combines task management, project roadmaps, invoice automation, page outline structures, and asset repositories under a clean, sophisticated dark UX flow. This Notion workspace makes organization secondary so you can prioritize creating quality digital assets.",
    category: "Template",
    price: 19.99,
    rating: 4.9,
    reviewsCount: 88,
    salesCount: 342,
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
    author: "Alex Rivers",
    tags: ["Notion", "Productivity", "Workspace"],
    badge: "Bestseller",
    createdAt: "2026-01-10T14:22:11Z",
    templateUrl: "https://notion.so/coursezy-creatoros-template",
    contents: `## CreatorOS Notion Setup Guide

Thank you for purchasing **CreatorOS**! This Notion system was carefully engineered to organize your projects, schedules, and assets.

### 🔗 Duplicate Your Template
[Click here to duplicate the CreatorOS Template to your workspace](https://notion.so/coursezy-creatoros-template)

---

### ⚙️ Workspace Overview
1. **Inbox**: Capture tasks, links, and ideas on the go.
2. **Projects Board**: High-level tracker based on Scrum principles.
3. **Finance Hub**: Clean invoice planner and cost calculator.
4. **Asset Library**: Store standard images, styles, and written copy securely.

### 💡 Tips for Customization
* Keep database relations intact to preserve automatic project rollup sums.
* Create a filtered view of the **Inbox** on your mobile phone screen for fast entries.
* Update your **Finance Hub** at the end of each week to keep analytics reports accurate.`,
  },
  {
    id: "prod-6",
    title: "SaaS Directory Booster: 60+ Platforms Outreach",
    tagline: "The absolute directory list for startup submissions, tools, libraries, and asset directories.",
    description: "A complete list of 60+ high DR startups directories, curation portals, and web utilities. We provide direct submission URLs, traffic size insights, and pre-crafted boilerplate text descriptions at copy-paste readiness.",
    category: "Backlinks",
    price: 19.00,
    rating: 4.7,
    reviewsCount: 22,
    salesCount: 92,
    coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80",
    author: "Elena Vance",
    tags: ["SEO", "Directories", "Growth Hacks"],
    createdAt: "2026-04-12T07:10:00Z",
    contents: `# SaaS Directory Booster Guide
Thank you for downloading the SaaS Directory Booster directory database. 

## 📝 Complete Submission Directory Link
* [Google Sheet Verified Directory Platform Link](https://docs.google.com/spreadsheets/d/your-curated-link)

## 📌 Top High DR Backlink Target Curation
Directories sorted by DR:
- Product Hunt (DR 92)
- IndieHackers (DR 81)
- BetaList (DR 74)
- AlternativeTo (DR 84)
- Devpost (DR 88)
- SaaSHub (DR 71)`
  },
  {
    id: "prod-7",
    title: "Freelance Mastery: Step-by-Step Ebook",
    tagline: "Land $5k+ monthly retainers using high-conversion sales pitches and package strategies.",
    description: "Whether you design templates, build websites, or write copies, this ebook provides a transparent framework for charging high-premium retainer agreements, building custom pitches, and securing stellar monthly recurring revenue.",
    category: "E-Book",
    price: 12.99,
    rating: 4.9,
    reviewsCount: 39,
    salesCount: 172,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    author: "Alex Rivers",
    tags: ["Ebook", "Freelancing", "Client Acquisition"],
    badge: "5★ Rated",
    createdAt: "2026-03-22T16:05:00Z",
    contents: `# Freelance Mastery Playbook
Alex Rivers

*The Complete Field-Tested Blueprint to Sign Premium Tech & Design Retainer Clients Without Middleman Platforms.*

---

## Chapter 1: The Transition From Hour Rates to Deliverables
Selling by the hour is a defensive trap. It penalizes performance: the faster you work, the less you get paid. Focus purely on value outcomes.

## Chapter 2: The $5,000/Month Retainer Blueprint
Do not pitch "I will design an app". Pitch "I will optimize your signup funnel conversion from 2.1% to 4.5% using a 4-week high-fidelity design redesign, and monitor changes weekly."

## Chapter 3: High DR Outreach Copy
Use the SEO checklists and outreach methods to pitch startup webmasters with diagnostic, zero-friction review notes.`
  },
  {
    id: "prod-8",
    title: "Ultimate Figma & Tailwind Design System",
    tagline: "The pixel-perfect UI kit to build modern dark-themed web landing pages and landing structures instantly.",
    description: "Save 100+ hours of setup. A Figma UI library tokenized with variables, matched to standard typography and Tailwind configuration values. Build spectacular visual hierarchies with high-contrast buttons, badges, navigation arrays, and rich cards.",
    category: "Template",
    price: 24.99,
    rating: 4.8,
    reviewsCount: 29,
    salesCount: 104,
    coverImage: "https://images.unsplash.com/photo-1541462608141-ad4979e408c9?auto=format&fit=crop&w=600&q=80",
    author: "Elena Vance",
    tags: ["Figma", "UI Design", "Tailwind Theme"],
    createdAt: "2026-04-18T12:00:00Z",
    templateUrl: "https://figma.com/file/coursezy-tailwind-design-system",
    contents: `# Ultimate Figma & Tailwind Design Kit Setup Guide

Thank you for selecting the Unified Dark Theme Design Kit! This system is token-aligned to speed up standard styling.

## 🔗 Duplicate Figma Archive
[Direct Link to duplicate the Figma File](https://figma.com/file/coursezy-tailwind-design-system)

## ⚡ Setup Features
1. **Dynamic CSS Global Palette**: Features custom dark slates and rich amber accent colors.
2. **Typography Scale**: Built on "Arial" and "Space Grotesk" pairings.
3. **Fully Responsive Elements**: Auto-layout enabled buttons, header bars, and form variables.`
  }
];

export const MOCK_REVIEWS = [
  { id: "rev-1", author: "James Miller", rating: 5, comment: "This is easily the cleanest, most concise guide on react architecture I have ever read. Worth every penny.", date: "May 12, 2026" },
  { id: "rev-2", author: "Sophia Lopez", rating: 4, comment: "Very well structured templates. Notion Workspace saved me hours. Highly recommend DeveloperOS.", date: "May 18, 2026" },
  { id: "rev-3", author: "Devin K.", rating: 5, comment: "Checking things off the SaaS launch list right now. Super thorough, avoids huge disaster mistakes.", date: "May 25, 2026" }
];
