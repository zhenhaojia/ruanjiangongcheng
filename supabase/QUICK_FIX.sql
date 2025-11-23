-- 🔧 快速修复：创建表并插入数据
-- 在 Supabase SQL 编辑器中完整复制并运行整个文件

-- 1. 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#667eea',
    icon VARCHAR(50) DEFAULT 'fa-palette',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建创作者表
CREATE TABLE IF NOT EXISTS creators (
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

-- 3. 创建作品表
CREATE TABLE IF NOT EXISTS works (
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

-- 4. 插入分类数据
INSERT INTO categories (name, description, color, icon) VALUES
('平面设计', '海报、标志、品牌设计等平面视觉作品', '#FF6B6B', 'fa-paint-brush'),
('UI/UX设计', '用户界面和用户体验设计作品', '#4ECDC4', 'fa-desktop'),
('插画艺术', '手绘、数字插画等艺术创作', '#45B7D1', 'fa-paint-brush'),
('摄影作品', '风景、人像、商业摄影作品', '#96CEB4', 'fa-camera'),
('3D建模', '三维模型、渲染作品', '#FFEAA7', 'fa-cube'),
('动画视频', '动画短片、视频剪辑作品', '#DDA0DD', 'fa-video'),
('产品设计', '工业设计、产品设计作品', '#FFA500', 'fa-cube'),
('建筑设计', '建筑设计、室内设计作品', '#8B4513', 'fa-building')
ON CONFLICT (name) DO NOTHING;

-- 5. 插入创作者数据
INSERT INTO creators (name, email, bio, specialty, featured) VALUES
('张创意', 'zhang@example.com', '资深平面设计师，专注于品牌视觉设计', '平面设计', true),
('李设计', 'li@example.com', 'UI/UX设计师，追求简约与实用的完美结合', 'UI/UX设计', true),
('王艺术', 'wang@example.com', '自由插画师，擅长数字插画和概念艺术', '插画艺术', true),
('赵摄影', 'zhao@example.com', '专业摄影师，专注于人像和商业摄影', '摄影作品', false),
('刘建模', 'liu@example.com', '3D建模师，专注于游戏和影视建模', '3D建模', false)
ON CONFLICT (email) DO NOTHING;

-- 6. 插入作品数据
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
 false, 167)
ON CONFLICT DO NOTHING;

-- 7. 更新创作者统计
UPDATE creators 
SET work_count = (
    SELECT COUNT(*) 
    FROM works 
    WHERE creator_id = creators.id
),
total_views = (
    SELECT COALESCE(SUM(views), 0) 
    FROM works 
    WHERE creator_id = creators.id
);

-- 8. 验证创建结果
SELECT 
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM creators) as creators_count,
    (SELECT COUNT(*) FROM works) as works_count;