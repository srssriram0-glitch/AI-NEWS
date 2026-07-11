-- STEP 3: RLS policies and seed data
-- Paste this into Supabase Dashboard > SQL Editor > New query > Run

-- Enable RLS
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

-- Public read policies (allow anyone to read)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'news_articles','ai_tools','guides','prompts','research_papers',
    'events','jobs','companies','categories','rss_feeds','ingestion_logs'
  ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "allow_public_read" ON %I', tbl);
    EXECUTE format('CREATE POLICY "allow_public_read" ON %I FOR SELECT USING (true)', tbl);

    EXECUTE format('DROP POLICY IF EXISTS "allow_all_operations" ON %I', tbl);
    EXECUTE format('CREATE POLICY "allow_all_operations" ON %I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;

-- Seed RSS feeds
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

-- Seed categories
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
