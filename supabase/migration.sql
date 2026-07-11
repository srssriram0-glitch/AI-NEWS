-- AI World Hub Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- ============================================================
-- 1. TABLES
-- ============================================================

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
  impact_score INTEGER DEFAULT 50 CHECK (impact_score BETWEEN 0 AND 100),
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
  pricing JSONB DEFAULT '{"model":"free","plans":[]}',
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  company TEXT DEFAULT '',
  founder TEXT DEFAULT '',
  launch_date TEXT DEFAULT '',
  rating NUMERIC(2,1) DEFAULT 0,
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
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
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
  type TEXT DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
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
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
  articles_found INTEGER DEFAULT 0,
  articles_added INTEGER DEFAULT 0,
  error_message TEXT DEFAULT '',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);


-- ============================================================
-- 2. FULL-TEXT SEARCH TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_news_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.summary, '') || ' ' ||
    COALESCE(NEW.source, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_news_search_vector
  BEFORE INSERT OR UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_news_search_vector();

CREATE OR REPLACE FUNCTION update_tools_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.tagline, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.company, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tools_search_vector
  BEFORE INSERT OR UPDATE ON ai_tools
  FOR EACH ROW EXECUTE FUNCTION update_tools_search_vector();

CREATE OR REPLACE FUNCTION update_guides_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.summary, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guides_search_vector
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_guides_search_vector();

CREATE OR REPLACE FUNCTION update_prompts_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.prompt_text, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prompts_search_vector
  BEFORE INSERT OR UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_prompts_search_vector();

CREATE OR REPLACE FUNCTION update_papers_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.abstract, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_papers_search_vector
  BEFORE INSERT OR UPDATE ON research_papers
  FOR EACH ROW EXECUTE FUNCTION update_papers_search_vector();


-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_news_search ON news_articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news_articles(slug);

CREATE INDEX IF NOT EXISTS idx_tools_search ON ai_tools USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_trending ON ai_tools(is_trending) WHERE is_trending = true;

CREATE INDEX IF NOT EXISTS idx_guides_search ON guides USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);

CREATE INDEX IF NOT EXISTS idx_prompts_search ON prompts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);

CREATE INDEX IF NOT EXISTS idx_papers_search ON research_papers USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_papers_slug ON research_papers(slug);

CREATE INDEX IF NOT EXISTS idx_feeds_active ON rss_feeds(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ingestion_status ON ingestion_logs(status);


-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

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

-- Public read access for all content tables
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ai_tools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON guides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON prompts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON research_papers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON jobs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rss_feeds FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ingestion_logs FOR SELECT USING (true);

-- Service role has full access (used by API routes with service role key)
CREATE POLICY "Service role full access" ON news_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON ai_tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON guides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON prompts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON research_papers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON rss_feeds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON ingestion_logs FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- 5. HELPER FUNCTION: Full-text search across all content
-- ============================================================

CREATE OR REPLACE FUNCTION search_all_content(search_query TEXT, max_results INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  type TEXT,
  slug TEXT,
  title TEXT,
  summary TEXT,
  category TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    SELECT
      n.id, 'news'::TEXT as type, n.slug, n.title, n.summary, n.category,
      ts_rank(n.search_vector, websearch_to_tsquery('english', search_query)) as rank
    FROM news_articles n
    WHERE n.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT
      t.id, 'tool'::TEXT, t.slug, t.name as title, t.tagline as summary, t.category,
      ts_rank(t.search_vector, websearch_to_tsquery('english', search_query))
    FROM ai_tools t
    WHERE t.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT
      g.id, 'guide'::TEXT, g.slug, g.title, g.summary, g.category,
      ts_rank(g.search_vector, websearch_to_tsquery('english', search_query))
    FROM guides g
    WHERE g.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT
      p.id, 'prompt'::TEXT, p.slug, p.title, p.description as summary, p.category,
      ts_rank(p.search_vector, websearch_to_tsquery('english', search_query))
    FROM prompts p
    WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT
      r.id, 'paper'::TEXT, r.slug, r.title, r.abstract as summary, r.category,
      ts_rank(r.search_vector, websearch_to_tsquery('english', search_query))
    FROM research_papers r
    WHERE r.search_vector @@ websearch_to_tsquery('english', search_query)
  ) combined
  ORDER BY rank DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 6. SEED DEFAULT RSS FEEDS
-- ============================================================

INSERT INTO rss_feeds (name, url, category) VALUES
  ('TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'AI News'),
  ('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'AI News'),
  ('MIT Technology Review AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'AI Research'),
  ('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'AI Business'),
  ('Ars Technica AI', 'https://feeds.arstechnica.com/arstechnica/technology-lab', 'Technology'),
  ('OpenAI Blog', 'https://openai.com/blog/rss.xml', 'Model Release'),
  ('Google AI Blog', 'https://blog.google/technology/ai/rss/', 'AI Research'),
  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'Open Source')
ON CONFLICT (url) DO NOTHING;


-- ============================================================
-- 7. SEED CATEGORIES
-- ============================================================

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
