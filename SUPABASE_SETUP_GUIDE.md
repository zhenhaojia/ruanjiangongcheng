# Supabase 数据库设置指南

## 🚨 问题解决

您遇到的错误 `不存在关系"categories"` 是因为需要先创建表，然后才能插入数据。

## 📋 正确的设置步骤

### 第一步：创建表结构

1. 打开您的 Supabase 项目
2. 进入 "SQL Editor"
3. 复制并运行 `supabase/setup_step1_create_tables.sql` 的内容

### 第二步：插入数据

1. 在第一步成功完成后
2. 复制并运行 `supabase/setup_step2_insert_data.sql` 的内容

## 🔍 验证设置

完成上述步骤后，您可以在 Supabase 的 "Table Editor" 中看到：
- ✅ `categories` 表（8条记录）
- ✅ `creators` 表（5条记录）  
- ✅ `works` 表（8条记录）

## ⚠️ 重要提醒

- **必须按顺序执行**：先创建表，再插入数据
- 如果第一步失败，不要执行第二步
- 每个SQL文件中的所有代码都要完整复制并运行

## 🔧 完成后的配置

数据库设置完成后，请在 `js/config.js` 中配置：

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

获取方式：
1. 在 Supabase 项目设置中
2. 找到 "API" 部分
3. 复制 "Project URL" 和 "anon public" key

## 🚀 测试功能

配置完成后：
1. 刷新您的本地网站 http://127.0.0.1:3000
2. 测试搜索功能
3. 查看作品详情页面
4. 验证数据正确显示

如果仍有问题，请检查：
- Supabase 项目是否正确创建
- SQL是否完全执行成功
- config.js 中的连接信息是否正确