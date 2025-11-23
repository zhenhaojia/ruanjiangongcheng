// Supabase配置
const SUPABASE_URL = 'https://gajnqjntotjcqzedhprk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdham5xam50b3RqY3F6ZWRocHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzMyNjQsImV4cCI6MjA3OTQ0OTI2NH0.0VMHuLYjI2Rkd9MJ9tcXHFwovRsvcxBT_q8M9mxmmF4';

// 初始化Supabase客户端
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 应用配置
const APP_CONFIG = {
    name: '创意工坊',
    version: '1.0.0',
    pageSize: 12,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp']
};

// 数据库表名
const TABLES = {
    CREATORS: 'creators',
    WORKS: 'works', 
    CATEGORIES: 'categories'
};

// 存储桶配置
const STORAGE = {
    IMAGES: 'work-images',
    AVATARS: 'creator-avatars'
};

// 错误消息
const ERROR_MESSAGES = {
    NETWORK_ERROR: '网络连接错误，请检查您的网络连接',
    NOT_FOUND: '未找到相关信息',
    PERMISSION_DENIED: '权限不足',
    VALIDATION_ERROR: '输入信息有误',
    UNKNOWN_ERROR: '发生未知错误，请稍后重试'
};

// 成功消息
const SUCCESS_MESSAGES = {
    LOADED: '加载成功',
    SAVED: '保存成功',
    UPDATED: '更新成功',
    DELETED: '删除成功'
};