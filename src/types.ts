export type ProductCategory = 'E-Book' | 'Template' | 'Mini-Course' | 'Checklist' | 'Backlinks';

export interface DigitalProduct {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  coverImage: string;
  author: string;
  tags: string[];
  contents: string; // eBook/Guide contents in Markdown or resource material
  templateUrl?: string; // If template, the Notion or Figma URL
  chapters?: { title: string; content: string }[]; // If mini-course chapters
  badge?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Purchase {
  id: string;
  productId: string;
  purchaseDate: string;
  amountPaid: number;
  transactionId: string;
}

export interface Sale {
  id: string;
  productId: string;
  productTitle: string;
  category: ProductCategory;
  amount: number;
  date: string;
  buyerName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface OutlineResult {
  title: string;
  tagline: string;
  suggestedPrice: number;
  targetAudience: string[];
  highlights: string[];
  chapters: { title: string; summary: string }[];
}

export type Currency = 'USD' | 'INR';

export const USD_TO_INR_RATE = 83;

export function formatPrice(priceUSD: number, currency: Currency): string {
  if (currency === 'INR') {
    const priceINR = Math.round(priceUSD * USD_TO_INR_RATE);
    return `₹${priceINR.toLocaleString('en-IN')}`;
  }
  return `$${priceUSD.toFixed(2)}`;
}
