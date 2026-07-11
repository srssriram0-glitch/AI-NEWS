-- STEP 1: Create all tables
-- Paste this into Supabase Dashboard > SQL Editor > New query > Run

CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  impact_score INTEGER DEFAULT 50,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  related_tools TEXT[] DEFAULT '{}',
  search_vector TSVECTOR
);

CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  screenshot_url TEXT DEFAULT '',
  website_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  subcategory TEXT DEFAULT '',
  pricing JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  company TEXT DEFAULT '',
  founder TEXT DEFAULT '',
  launch_date TEXT DEFAULT '',
  rating NUMERIC(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  alternatives TEXT[] DEFAULT '{}',
  api_available BOOLEAN DEFAULT false,
  changelog JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_vector TSVECTOR
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  read_time INTEGER DEFAULT 10,
  author TEXT DEFAULT 'AI World Hub',
  tags TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  steps JSONB DEFAULT '[]',
  related_tools TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_vector TSVECTOR
);

CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  prompt_text TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  model TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  use_case TEXT DEFAULT '',
  output TEXT DEFAULT '',
  tips TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'AI World Hub',
  likes INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_vector TSVECTOR
);

CREATE TABLE IF NOT EXISTS research_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  abstract TEXT DEFAULT '',
  arxiv_url TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  published_at TIMESTAMPTZ DEFAULT now(),
  citations INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  search_vector TSVECTOR
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  end_date TEXT DEFAULT '',
  location TEXT DEFAULT '',
  is_virtual BOOLEAN DEFAULT false,
  url TEXT DEFAULT '',
  organizer TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  type TEXT DEFAULT 'full-time',
  remote BOOLEAN DEFAULT false,
  salary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  requirements TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  apply_url TEXT DEFAULT '',
  posted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  founded TEXT DEFAULT '',
  headquarters TEXT DEFAULT '',
  employees TEXT DEFAULT '',
  funding TEXT DEFAULT '',
  products TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'General',
  is_active BOOLEAN DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ingestion_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_id UUID REFERENCES rss_feeds(id) ON DELETE SET NULL,
  feed_name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'running',
  articles_found INTEGER DEFAULT 0,
  articles_added INTEGER DEFAULT 0,
  error_message TEXT DEFAULT '',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);
