export const SITE_NAME = "AI World Hub";
export const SITE_DESCRIPTION =
  "The world's most comprehensive AI discovery platform — news, tools, tutorials, prompts, and research in one place.";
export const SITE_URL = "https://aiworldhub.com";

export const NAV_ITEMS = [
  { label: "News", href: "/news" },
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "Prompts", href: "/prompts" },
  { label: "Compare", href: "/compare" },
  { label: "Papers", href: "/papers" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
] as const;

export const CATEGORIES = [
  { slug: "image-generation", name: "Image Generation", icon: "Image" },
  { slug: "video-generation", name: "Video Generation", icon: "Video" },
  { slug: "coding", name: "Coding", icon: "Code" },
  { slug: "writing", name: "Writing", icon: "PenTool" },
  { slug: "marketing", name: "Marketing", icon: "Megaphone" },
  { slug: "automation", name: "Automation", icon: "Zap" },
  { slug: "agents", name: "AI Agents", icon: "Bot" },
  { slug: "audio", name: "Audio & Voice", icon: "Mic" },
  { slug: "music", name: "Music", icon: "Music" },
  { slug: "3d", name: "3D & Spatial", icon: "Box" },
  { slug: "chatbots", name: "Chatbots", icon: "MessageSquare" },
  { slug: "research", name: "Research", icon: "Search" },
  { slug: "productivity", name: "Productivity", icon: "Rocket" },
  { slug: "data-analysis", name: "Data Analysis", icon: "BarChart3" },
  { slug: "education", name: "Education", icon: "GraduationCap" },
  { slug: "healthcare", name: "Healthcare", icon: "Heart" },
] as const;

export const PRICING_FILTERS = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "open-source", label: "Open Source" },
] as const;
