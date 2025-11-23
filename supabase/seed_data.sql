-- 额外的示例数据插入脚本
-- 这个文件包含更多示例数据，用于丰富网站内容

-- 插入更多分类
INSERT INTO categories (name, description, color, icon) VALUES
('字体设计', '字体创作、排版设计作品', '#E74C3C', 'fa-font'),
('包装设计', '产品包装设计作品', '#3498DB', 'fa-box'),
('网页设计', '网站界面设计作品', '#2ECC71', 'fa-globe'),
('APP设计', '移动应用界面设计', '#9B59B6', 'fa-mobile-alt'),
('动效设计', '动画效果设计作品', '#F39C12', 'fa-magic'),
('室内设计', '室内空间设计作品', '#1ABC9C', 'fa-home'),
('时尚设计', '服装、时尚设计作品', '#E67E22', 'fa-tshirt'),
('工业设计', '工业产品设计作品', '#34495E', 'fa-industry');

-- 插入更多创作者
INSERT INTO creators (name, email, bio, specialty, website_url, social_links, featured) VALUES
('陈字体', 'chen@example.com', '专业字体设计师，致力于中文字体设计创新', '字体设计', 'https://chen-fonts.com', '{"behance": "chen-fonts", "dribbble": "chen-design"}', true),
('周包装', 'zhou@example.com', '包装设计专家，注重环保与美观的结合', '包装设计', 'https://zhou-packaging.com', '{"instagram": "zhou_packaging"}', true),
('吴网页', 'wu@example.com', '全栈网页设计师，专注于响应式设计', '网页设计', 'https://wu-webdesign.com', '{"github": "wu-design", "codepen": "wu-web"}', false),
('郑动效', 'zheng@example.com', '动效设计师，为UI添加生命力', '动效设计', 'https://zheng-motion.com', '{"vimeo": "zheng-motion"}', false),
('孙室内', 'sun@example.com', '室内设计师，打造舒适的居住空间', '室内设计', 'https://sun-interior.com', '{"pinterest": "sun-interior"}', false);

-- 插入更多作品数据
-- 为新创作者创建作品
INSERT INTO works (title, description, category_id, creator_id, image_url, tags, featured, views) VALUES
('中文字体设计', '现代中文字体设计，融合传统与现代美感', 
 (SELECT id FROM categories WHERE name = '字体设计'), 
 (SELECT id FROM creators WHERE name = '陈字体'),
 'https://picsum.photos/seed/chinese-font/800/600.jpg',
 ARRAY['字体设计', '中文', '现代', '传统'],
 true, 245),

('环保包装设计', '可持续包装设计，使用环保材料和结构', 
 (SELECT id FROM categories WHERE name = '包装设计'), 
 (SELECT id FROM creators WHERE name = '周包装'),
 'https://picsum.photos/seed/eco-package/800/600.jpg',
 ARRAY['包装设计', '环保', '可持续', '创新'],
 false, 198),

('企业官网设计', '科技公司官网设计，体现专业和创新', 
 (SELECT id FROM categories WHERE name = '网页设计'), 
 (SELECT id FROM creators WHERE name = '吴网页'),
 'https://picsum.photos/seed/corporate-web/800/600.jpg',
 ARRAY['网页设计', '企业网站', '科技公司', '响应式'],
 false, 167),

('加载动画设计', 'APP加载动画，提升用户体验', 
 (SELECT id FROM categories WHERE name = '动效设计'), 
 (SELECT id FROM creators WHERE name = '郑动效'),
 'https://picsum.photos/seed/loading-animation/800/600.jpg',
 ARRAY['动效设计', '加载动画', '用户体验', 'APP'],
 false, 134),

('现代客厅设计', '简约现代风格的客厅室内设计', 
 (SELECT id FROM categories WHERE name = '室内设计'), 
 (SELECT id FROM creators WHERE name = '孙室内'),
 'https://picsum.photos/seed/modern-living/800/600.jpg',
 ARRAY['室内设计', '客厅', '现代风格', '简约'],
 false, 189),

('logo动画', '品牌logo的动态效果展示', 
 (SELECT id FROM categories WHERE name = '动效设计'), 
 (SELECT id FROM creators WHERE name = '郑动效'),
 'https://picsum.photos/seed/logo-animation/800/600.jpg',
 ARRAY['动效设计', 'logo动画', '品牌', '动态设计'],
 false, 156);

-- 为现有创作者添加更多作品
INSERT INTO works (title, description, category_id, creator_id, image_url, tags, featured, views) VALUES
('书籍封面设计', '小说书籍封面设计，体现故事氛围', 
 (SELECT id FROM categories WHERE name = '平面设计'), 
 (SELECT id FROM creators WHERE name = '张创意'),
 'https://picsum.photos/seed/book-cover/800/600.jpg',
 ARRAY['书籍设计', '封面设计', '小说', '创意'],
 false, 145),

('仪表板UI', '数据分析仪表板界面设计', 
 (SELECT id FROM categories WHERE name = 'UI/UX设计'), 
 (SELECT id FROM creators WHERE name = '李设计'),
 'https://picsum.photos/seed/dashboard-ui/800/600.jpg',
 ARRAY['UI设计', '仪表板', '数据可视化', 'B端'],
 false, 178),

('儿童插画', '儿童绘本插画，色彩明亮活泼', 
 (SELECT id FROM categories WHERE name = '插画艺术'), 
 (SELECT id FROM creators WHERE name = '王艺术'),
 'https://picsum.photos/seed/children-book/800/600.jpg',
 ARRAY['插画', '儿童绘本', '色彩', '活泼'],
 false, 167),

('产品摄影', '产品商业摄影，突出产品特点', 
 (SELECT id FROM categories WHERE name = '摄影作品'), 
 (SELECT id FROM creators WHERE name = '赵摄影'),
 'https://picsum.photos/seed/product-photo/800/600.jpg',
 ARRAY['商业摄影', '产品摄影', '广告', '专业'],
 false, 134),

('场景3D建模', '游戏场景的高精度建模', 
 (SELECT id FROM categories WHERE name = '3D建模'), 
 (SELECT id FROM creators WHERE name = '刘建模'),
 'https://picsum.photos/seed/scene-3d/800/600.jpg',
 ARRAY['3D建模', '游戏场景', '环境设计', '高精度'],
 false, 189),

('活动海报', '艺术展览活动海报设计', 
 (SELECT id FROM categories WHERE name = '平面设计'), 
 (SELECT id FROM creators WHERE name = '张创意'),
 'https://picsum.photos/seed/art-poster/800/600.jpg',
 ARRAY['海报设计', '活动设计', '艺术展览', '文化'],
 false, 156);

-- 更新所有创作者的作品数量和总浏览量
UPDATE creators 
SET work_count = (
    SELECT COUNT(*) 
    FROM works 
    WHERE creator_id = creators.id
);

UPDATE creators 
SET total_views = (
    SELECT COALESCE(SUM(views), 0) 
    FROM works 
    WHERE creator_id = creators.id
);

-- 更新一些作品的精选状态
UPDATE works 
SET featured = true 
WHERE id IN (
    SELECT works.id 
    FROM works 
    JOIN categories ON works.category_id = categories.id 
    WHERE categories.name IN ('字体设计', '动效设计', '网页设计')
    LIMIT 3
);