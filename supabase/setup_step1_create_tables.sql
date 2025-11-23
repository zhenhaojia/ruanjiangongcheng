-- 第一步：创建数据库表结构
-- 请先在 Supabase SQL 编辑器中运行这个文件

-- 创建分类表
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#667eea',
    icon VARCHAR(50) DEFAULT 'fa-palette',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建创作者表
CREATE TABLE creators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    bio TEXT,
    specialty VARCHAR(200),
    avatar_url TEXT,
    website_url VARCHAR(500),
    social_links JSONB,
    featured BOOLEAN DEFAULT FALSE,
    work_count INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建作品表
CREATE TABLE works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引
CREATE INDEX idx_works_category_id ON works(category_id);
CREATE INDEX idx_works_creator_id ON works(creator_id);
CREATE INDEX idx_works_created_at ON works(created_at DESC);
CREATE INDEX idx_works_views ON works(views DESC);
CREATE INDEX idx_works_featured ON works(featured);
CREATE INDEX idx_works_status ON works(status);
CREATE INDEX idx_works_title ON works USING gin(to_tsvector('chinese', title));
CREATE INDEX idx_works_description ON works USING gin(to_tsvector('chinese', description));

CREATE INDEX idx_creators_featured ON creators(featured);
CREATE INDEX idx_creators_work_count ON creators(work_count DESC);
CREATE INDEX idx_creators_total_views ON creators(total_views DESC);

CREATE INDEX idx_categories_name ON categories(name);

-- 启用行级安全策略 (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 创建公开访问策略
-- 分类表：所有人都可以读取
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- 创作者表：所有人都可以读取，只有自己可以更新
CREATE POLICY "Creators are viewable by everyone" ON creators
    FOR SELECT USING (true);

CREATE POLICY "Creators can update own profile" ON creators
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 作品表：公开的作品所有人都可以读取
CREATE POLICY "Published works are viewable by everyone" ON works
    FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can manage own works" ON works
    FOR ALL USING (auth.uid()::text = creator_id::text);

-- 完成第一步：表结构创建完成
SELECT 'Tables and triggers created successfully' as status;