import { NextRequest, NextResponse } from "next/server";
import pg from "pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getProjectRef(): string {
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] || "";
}

async function getClient(): Promise<pg.Client> {
  const ref = getProjectRef();

  if (process.env.DATABASE_URL) {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    return client;
  }

  const hosts = [
    `db.${ref}.supabase.co`,
    `aws-0-ap-south-1.pooler.supabase.com`,
    `aws-0-us-east-1.pooler.supabase.com`,
    `aws-0-us-west-1.pooler.supabase.com`,
    `aws-0-eu-west-1.pooler.supabase.com`,
    `aws-0-ap-southeast-1.pooler.supabase.com`,
  ];

  const users = [`postgres.${ref}`, `postgres`];

  for (const host of hosts) {
    for (const user of users) {
      for (const port of [5432, 6543]) {
        try {
          const client = new pg.Client({
            host,
            port,
            database: "postgres",
            user,
            password: serviceRoleKey,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000,
          });
          await client.connect();
          return client;
        } catch {
          continue;
        }
      }
    }
  }

  throw new Error("Could not connect to database. Add DATABASE_URL to .env.local (find it in Supabase Dashboard > Project Settings > Database > Connection string > URI)");
}

const TABLES_SQL = `
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
`;

const SEARCH_SQL = `
DROP TRIGGER IF EXISTS trg_news_search_vector ON news_articles;
DROP TRIGGER IF EXISTS trg_tools_search_vector ON ai_tools;
DROP TRIGGER IF EXISTS trg_guides_search_vector ON guides;
DROP TRIGGER IF EXISTS trg_prompts_search_vector ON prompts;
DROP TRIGGER IF EXISTS trg_papers_search_vector ON research_papers;

CREATE OR REPLACE FUNCTION update_news_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.summary, '') || ' ' ||
    COALESCE(NEW.source, '') || ' ' || COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_news_search_vector BEFORE INSERT OR UPDATE ON news_articles FOR EACH ROW EXECUTE FUNCTION update_news_search_vector();

CREATE OR REPLACE FUNCTION update_tools_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.tagline, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' || COALESCE(NEW.company, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' || COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_tools_search_vector BEFORE INSERT OR UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION update_tools_search_vector();

CREATE OR REPLACE FUNCTION update_guides_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.summary, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' || COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_guides_search_vector BEFORE INSERT OR UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_guides_search_vector();

CREATE OR REPLACE FUNCTION update_prompts_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.prompt_text, '') || ' ' || COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_prompts_search_vector BEFORE INSERT OR UPDATE ON prompts FOR EACH ROW EXECUTE FUNCTION update_prompts_search_vector();

CREATE OR REPLACE FUNCTION update_papers_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.abstract, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' || COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_papers_search_vector BEFORE INSERT OR UPDATE ON research_papers FOR EACH ROW EXECUTE FUNCTION update_papers_search_vector();

CREATE INDEX IF NOT EXISTS idx_news_search ON news_articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_tools_search ON ai_tools USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_guides_search ON guides USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_prompts_search ON prompts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_papers_search ON research_papers USING GIN(search_vector);

CREATE OR REPLACE FUNCTION search_all_content(search_query TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (id UUID, type TEXT, slug TEXT, title TEXT, summary TEXT, category TEXT, rank REAL) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    SELECT n.id, 'news'::TEXT, n.slug, n.title, n.summary, n.category,
      ts_rank(n.search_vector, websearch_to_tsquery('english', search_query)) FROM news_articles n
      WHERE n.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT t.id, 'tool'::TEXT, t.slug, t.name, t.tagline, t.category,
      ts_rank(t.search_vector, websearch_to_tsquery('english', search_query)) FROM ai_tools t
      WHERE t.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT g.id, 'guide'::TEXT, g.slug, g.title, g.summary, g.category,
      ts_rank(g.search_vector, websearch_to_tsquery('english', search_query)) FROM guides g
      WHERE g.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT p.id, 'prompt'::TEXT, p.slug, p.title, p.description, p.category,
      ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) FROM prompts p
      WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT r.id, 'paper'::TEXT, r.slug, r.title, r.abstract, r.category,
      ts_rank(r.search_vector, websearch_to_tsquery('english', search_query)) FROM research_papers r
      WHERE r.search_vector @@ websearch_to_tsquery('english', search_query)
  ) combined ORDER BY rank DESC LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
`;

const RLS_SQL = `
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_logs ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'news_articles','ai_tools','guides','prompts','research_papers',
    'events','jobs','companies','categories','rss_feeds','ingestion_logs'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "allow_public_read" ON %I', tbl);
    EXECUTE format('CREATE POLICY "allow_public_read" ON %I FOR SELECT USING (true)', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "allow_all_operations" ON %I', tbl);
    EXECUTE format('CREATE POLICY "allow_all_operations" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
`;

const SEED_SQL = `
INSERT INTO rss_feeds (name, url, category) VALUES
  ('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'AI News'),
  ('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'AI News'),
  ('MIT Tech Review AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'AI Research'),
  ('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'AI Business'),
  ('Ars Technica', 'https://feeds.arstechnica.com/arstechnica/technology-lab', 'Technology'),
  ('OpenAI Blog', 'https://openai.com/blog/rss.xml', 'Model Release'),
  ('Google AI Blog', 'https://blog.google/technology/ai/rss/', 'AI Research'),
  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'Open Source')
ON CONFLICT (url) DO NOTHING;

INSERT INTO categories (slug, name, description, icon, count) VALUES
  ('image-generation', 'Image Generation', 'AI tools for creating and editing images', 'Image', 0),
  ('video-generation', 'Video Generation', 'AI-powered video creation tools', 'Video', 0),
  ('coding', 'Coding', 'AI coding assistants and developer tools', 'Code', 0),
  ('writing', 'Writing', 'AI writing and content creation tools', 'PenTool', 0),
  ('marketing', 'Marketing', 'AI marketing and growth tools', 'Megaphone', 0),
  ('automation', 'Automation', 'AI workflow automation tools', 'Zap', 0),
  ('agents', 'AI Agents', 'Autonomous AI agent platforms', 'Bot', 0),
  ('audio', 'Audio & Voice', 'AI audio and voice tools', 'Mic', 0),
  ('music', 'Music', 'AI music generation tools', 'Music', 0),
  ('3d', '3D & Spatial', 'AI 3D modeling and spatial tools', 'Box', 0),
  ('chatbots', 'Chatbots', 'AI chatbot and assistant platforms', 'MessageSquare', 0),
  ('research', 'Research', 'AI research and analysis tools', 'Search', 0),
  ('productivity', 'Productivity', 'AI productivity tools', 'Rocket', 0),
  ('data-analysis', 'Data Analysis', 'AI data analysis tools', 'BarChart3', 0),
  ('education', 'Education', 'AI education and learning tools', 'GraduationCap', 0),
  ('healthcare', 'Healthcare', 'AI healthcare tools', 'Heart', 0)
ON CONFLICT (slug) DO NOTHING;
`;

function verifyAdminKey(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { step: string; success: boolean; error?: string }[] = [];
  let client: pg.Client | null = null;

  try {
    client = await getClient();
    results.push({ step: "Database connection", success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      success: false,
      results: [{ step: "Database connection", success: false, error: msg }],
    }, { status: 500 });
  }

  const steps = [
    { name: "Create tables", sql: TABLES_SQL },
    { name: "Search triggers & indexes", sql: SEARCH_SQL },
    { name: "Enable RLS", sql: RLS_SQL },
    { name: "Seed data", sql: SEED_SQL },
  ];

  for (const step of steps) {
    try {
      await client.query(step.sql);
      results.push({ step: step.name, success: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ step: step.name, success: false, error: msg });
      break;
    }
  }

  await client.end();

  const allSuccess = results.every((r) => r.success);
  return NextResponse.json({ success: allSuccess, results }, { status: allSuccess ? 200 : 500 });
}
