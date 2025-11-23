# 创意作品展示查询平台

基于 Supabase 和 Netlify 构建的现代创意作品展示与查询平台。

## 🎨 项目概述

这是一个展示创意作品的在线平台，支持：
- 作品展示与查询
- 创作者信息管理  
- 分类筛选
- 搜索与排序
- 响应式设计

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端服务**: Supabase (数据库 + 认证 + 存储)
- **部署平台**: Netlify
- **UI框架**: 自定义CSS + Font Awesome图标
- **数据库**: PostgreSQL (通过Supabase)

## 📊 数据库设计

### 三张核心数据表：

1. **categories** - 作品分类表
   - id: 主键
   - name: 分类名称
   - description: 分类描述
   - color: 分类颜色
   - icon: 图标类名

2. **creators** - 创作者信息表
   - id: 主键
   - name: 创作者姓名
   - email: 邮箱
   - bio: 个人简介
   - specialty: 专业领域
   - avatar_url: 头像URL
   - featured: 是否精选

3. **works** - 作品信息表
   - id: 主键
   - title: 作品标题
   - description: 作品描述
   - image_url: 作品图片URL
   - category_id: 分类ID (外键)
   - creator_id: 创作者ID (外键)
   - tags: 标签数组
   - featured: 是否精选
   - views: 浏览量
   - status: 状态 (published/draft/archived)

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd creative-works-platform
```

### 2. 设置 Supabase
1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL 编辑器中运行 `supabase/migrations/001_create_tables.sql`
3. 运行 `supabase/seed_data.sql` 插入示例数据
4. 获取项目的 URL 和 Anon Key
5. 在 `js/config.js` 中更新配置：
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. 本地开发
```bash
# 安装依赖
npm install

# 启动本地服务器
npm run dev
```

访问 http://localhost:3000 查看网站

### 4. 部署到 Netlify
1. 将代码推送到 GitHub 仓库
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建配置（静态网站，无需构建命令）
4. 部署完成！

## 📁 项目结构

```
creative-works-platform/
├── index.html              # 首页
├── search.html             # 搜索页面
├── detail.html             # 详情页面
├── package.json            # 项目配置
├── netlify.toml            # Netlify部署配置
├── README.md               # 项目说明
├── styles/
│   └── main.css            # 主样式文件
├── js/
│   ├── config.js           # 配置文件
│   ├── utils.js            # 工具函数
│   ├── home.js             # 首页逻辑
│   ├── search.js           # 搜索页逻辑
│   └── detail.js           # 详情页逻辑
└── supabase/
    ├── migrations/
    │   └── 001_create_tables.sql  # 数据库迁移
    └── seed_data.sql        # 示例数据
```

## 🎯 功能特性

### 🏠 首页
- 热门作品展示
- 推荐创作者
- 随机作品跳转
- 响应式布局

### 🔍 搜索页
- 关键词搜索
- 分类筛选
- 多种排序方式
- 分页功能
- 实时搜索结果

### 📄 详情页
- 作品详细信息
- 创作者信息
- 浏览量统计
- 相关作品推荐
- 分享功能

## 🔧 自定义配置

### 环境变量
在 `js/config.js` 中可以配置：
- Supabase 连接信息
- 分页大小
- 图片大小限制
- 错误消息等

### 样式定制
在 `styles/main.css` 中：
- 修改颜色主题
- 调整布局
- 添加动画效果
- 响应式断点

## 📱 响应式设计

网站完全响应式，支持：
- 桌面端 (1200px+)
- 平板端 (768px-1199px)
- 移动端 (320px-767px)

## 🎨 视觉设计

- 现代渐变色彩方案
- 卡片式布局设计
- 平滑过渡动画
- 悬浮交互效果

## 🔄 数据流程

1. 页面加载 → 从 Supabase 获取数据
2. 用户交互 → 前端处理 → 数据库查询
3. 结果展示 → 动态渲染HTML
4. 浏览统计 → 更新浏览量

## 📈 性能优化

- 图片懒加载
- 请求防抖
- 分页加载
- 缓存策略
- 压缩优化

## 🔒 安全特性

- Supabase RLS 行级安全
- XSS 防护
- CSRF 保护
- 安全头部设置

## 🌐 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📝 开发说明

### 添加新功能
1. 在相应 JS 文件中添加逻辑
2. 更新样式文件
3. 测试响应式布局
4. 更新数据库结构（如需要）

### 部署更新
1. 提交代码到 GitHub
2. Netlify 自动触发部署
3. 几分钟后更新生效

## 🐛 故障排除

### 常见问题
1. **数据加载失败** → 检查 Supabase 配置
2. **样式显示异常** → 清除浏览器缓存
3. **图片无法加载** → 检查图片URL格式

## 👥 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Supabase](https://supabase.com) - 后端服务
- [Netlify](https://netlify.com) - 部署平台  
- [Font Awesome](https://fontawesome.com) - 图标库
- [Picsum](https://picsum.photos) - 占位图片

---

**学生项目作业 | 2025年11月23日**