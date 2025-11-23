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

-- 插入初始数据
INSERT INTO categories (name, description, color, icon) VALUES
('平面设计', '海报、标志、品牌设计等平面视觉作品', '#FF6B6B', 'fa-paint-brush'),
('UI/UX设计', '用户界面和用户体验设计作品', '#4ECDC4', 'fa-desktop'),
('插画艺术', '手绘、数字插画等艺术创作', '#45B7D1', 'fa-paint-brush'),
('摄影作品', '风景、人像、商业摄影作品', '#96CEB4', 'fa-camera'),
('3D建模', '三维模型、渲染作品', '#FFEAA7', 'fa-cube'),
('动画视频', '动画短片、视频剪辑作品', '#DDA0DD', 'fa-video'),
('产品设计', '工业设计、产品设计作品', '#FFA500', 'fa-cube'),
('建筑设计', '建筑设计、室内设计作品', '#8B4513', 'fa-building');

-- 插入示例创作者数据
INSERT INTO creators (name, email, bio, specialty, featured) VALUES
('张创意', 'zhang@example.com', '资深平面设计师，专注于品牌视觉设计', '平面设计', true),
('李设计', 'li@example.com', 'UI/UX设计师，追求简约与实用的完美结合', 'UI/UX设计', true),
('王艺术', 'wang@example.com', '自由插画师，擅长数字插画和概念艺术', '插画艺术', true),
('赵摄影', 'zhao@example.com', '专业摄影师，专注于人像和商业摄影', '摄影作品', false),
('刘建模', 'liu@example.com', '3D建模师，专注于游戏和影视建模', '3D建模', false);

-- 插入示例作品数据
INSERT INTO works (title, description, category_id, creator_id, image_url, tags, featured, views) VALUES
('品牌标志设计', '为科技公司设计的现代简约标志，体现创新和科技感', 
 (SELECT id FROM categories WHERE name = '平面设计'), 
 (SELECT id FROM creators WHERE name = '张创意'),
 'https://picsum.photos/seed/brand-logo/800/600.jpg',
 ARRAY['品牌设计', '标志设计', '科技', '简约'],
 true, 156),

('移动应用界面', '健康管理APP的UI设计，注重用户体验和视觉层次', 
 (SELECT id FROM categories WHERE name = 'UI/UX设计'), 
 (SELECT id FROM creators WHERE name = '李设计'),
 'https://picsum.photos/seed/mobile-ui/800/600.jpg',
 ARRAY['UI设计', '移动应用', '健康管理', '用户体验'],
 true, 203),

('数字插画作品', '未来城市概念的数字插画，展现科技与自然的融合', 
 (SELECT id FROM categories WHERE name = '插画艺术'), 
 (SELECT id FROM creators WHERE name = '王艺术'),
 'https://picsum.photos/seed/digital-art/800/600.jpg',
 ARRAY['数字插画', '概念艺术', '未来城市', '科幻'],
 true, 178),

('城市夜景摄影', '捕捉城市夜晚的灯光和氛围，展现都市的繁华与宁静', 
 (SELECT id FROM categories WHERE name = '摄影作品'), 
 (SELECT id FROM creators WHERE name = '赵摄影'),
 'https://picsum.photos/seed/city-night/800/600.jpg',
 ARRAY['城市摄影', '夜景', '灯光', '都市'],
 false, 145),

('角色3D建模', '游戏角色的高精度3D建模，注重细节和质感', 
 (SELECT id FROM categories WHERE name = '3D建模'), 
 (SELECT id FROM creators WHERE name = '刘建模'),
 'https://picsum.photos/seed/character-3d/800/600.jpg',
 ARRAY['3D建模', '游戏角色', '高精度', '角色设计'],
 false, 167),

('海报设计', '音乐节主题海报设计，体现音乐的氛围和活力', 
 (SELECT id FROM categories WHERE name = '平面设计'), 
 (SELECT id FROM creators WHERE name = '张创意'),
 'https://picsum.photos/seed/music-poster/800/600.jpg',
 ARRAY['海报设计', '音乐节', '活动设计', '创意'],
 false, 134),

('网页界面设计', '电商网站首页设计，注重转化率和用户体验', 
 (SELECT id FROM categories WHERE name = 'UI/UX设计'), 
 (SELECT id FROM creators WHERE name = '李设计'),
 'https://picsum.photos/seed/web-design/800/600.jpg',
 ARRAY['网页设计', '电商', '首页设计', '用户体验'],
 false, 189),

('概念插画', '奇幻世界的概念插画，展现丰富的想象力和创造力', 
 (SELECT id FROM categories WHERE name = '插画艺术'), 
 (SELECT id FROM creators WHERE name = '王艺术'),
 'https://picsum.photos/seed/concept-art/800/600.jpg',
 ARRAY['概念插画', '奇幻', '世界构建', '创意'],
 false, 156);

-- 更新创作者的作品数量
UPDATE creators 
SET work_count = (
    SELECT COUNT(*) 
    FROM works 
    WHERE creator_id = creators.id
);

-- 更新创作者的总浏览量
UPDATE creators 
SET total_views = (
    SELECT COALESCE(SUM(views), 0) 
    FROM works 
    WHERE creator_id = creators.id
);