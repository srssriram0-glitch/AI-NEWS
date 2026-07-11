export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceUrl: string;
  imageUrl: string;
  category: string;
  tags: string[];
  impactScore: number;
  publishedAt: string;
  createdAt: string;
  relatedTools: string[];
}

export interface AITool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  screenshotUrl: string;
  websiteUrl: string;
  category: string;
  subcategory: string;
  pricing: PricingInfo;
  features: string[];
  tags: string[];
  company: string;
  founder: string;
  launchDate: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  pros: string[];
  cons: string[];
  alternatives: string[];
  apiAvailable: boolean;
  changelog: ChangelogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface PricingInfo {
  model: "free" | "freemium" | "paid" | "enterprise" | "open-source";
  startingPrice?: string;
  plans: PricingPlan[];
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export interface ChangelogEntry {
  date: string;
  version: string;
  changes: string[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: number;
  author: string;
  tags: string[];
  requirements: string[];
  steps: GuideStep[];
  relatedTools: string[];
  publishedAt: string;
}

export interface GuideStep {
  title: string;
  content: string;
  codeExample?: string;
  imageUrl?: string;
}

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  description: string;
  promptText: string;
  category: string;
  model: string;
  tags: string[];
  useCase: string;
  output?: string;
  tips: string[];
  author: string;
  likes: number;
  saves: number;
  createdAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  category: string;
  contextWindow: string;
  speed: number;
  coding: number;
  vision: boolean;
  apiPricing: string;
  benchmarks: Record<string, number>;
}

export interface ResearchPaper {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  abstract: string;
  arxivUrl: string;
  pdfUrl: string;
  category: string;
  publishedAt: string;
  citations: number;
  tags: string[];
}

export interface AIEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  isVirtual: boolean;
  url: string;
  organizer: string;
  imageUrl: string;
  tags: string[];
}

export interface AIJob {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  remote: boolean;
  salary?: string;
  description: string;
  requirements: string[];
  tags: string[];
  applyUrl: string;
  postedAt: string;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  founded: string;
  headquarters: string;
  employees: string;
  funding: string;
  products: string[];
  tags: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bookmarks: string[];
  collections: Collection[];
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  items: string[];
}
