-- STEP 2: Full-text search triggers, indexes, and search function
-- Paste this into Supabase Dashboard > SQL Editor > New query > Run

-- Drop existing triggers first (safe to run multiple times)
DROP TRIGGER IF EXISTS trg_news_search_vector ON news_articles;
DROP TRIGGER IF EXISTS trg_tools_search_vector ON ai_tools;
DROP TRIGGER IF EXISTS trg_guides_search_vector ON guides;
DROP TRIGGER IF EXISTS trg_prompts_search_vector ON prompts;
DROP TRIGGER IF EXISTS trg_papers_search_vector ON research_papers;

-- News search trigger
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

-- Tools search trigger
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

-- Guides search trigger
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

-- Prompts search trigger
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

-- Papers search trigger
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_search ON news_articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);

CREATE INDEX IF NOT EXISTS idx_tools_search ON ai_tools USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_tools_category ON ai_tools(category);

CREATE INDEX IF NOT EXISTS idx_guides_search ON guides USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_prompts_search ON prompts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_papers_search ON research_papers USING GIN(search_vector);

-- Cross-content search function
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
    SELECT n.id, 'news'::TEXT AS type, n.slug, n.title, n.summary, n.category,
      ts_rank(n.search_vector, websearch_to_tsquery('english', search_query)) AS rank
    FROM news_articles n
    WHERE n.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT t.id, 'tool'::TEXT, t.slug, t.name, t.tagline, t.category,
      ts_rank(t.search_vector, websearch_to_tsquery('english', search_query))
    FROM ai_tools t
    WHERE t.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT g.id, 'guide'::TEXT, g.slug, g.title, g.summary, g.category,
      ts_rank(g.search_vector, websearch_to_tsquery('english', search_query))
    FROM guides g
    WHERE g.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT p.id, 'prompt'::TEXT, p.slug, p.title, p.description, p.category,
      ts_rank(p.search_vector, websearch_to_tsquery('english', search_query))
    FROM prompts p
    WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
    UNION ALL
    SELECT r.id, 'paper'::TEXT, r.slug, r.title, r.abstract, r.category,
      ts_rank(r.search_vector, websearch_to_tsquery('english', search_query))
    FROM research_papers r
    WHERE r.search_vector @@ websearch_to_tsquery('english', search_query)
  ) combined
  ORDER BY rank DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
