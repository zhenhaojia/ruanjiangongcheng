// 工具函数
const Utils = {
    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
        if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;
        
        return date.toLocaleDateString('zh-CN');
    },

    // 截取文本
    truncateText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    // 生成随机ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // 显示加载状态
    showLoading(element, text = '加载中...') {
        element.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>${text}</span>
            </div>
        `;
    },

    // 显示错误信息
    showError(element, message) {
        element.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
    },

    // 显示空状态
    showEmpty(element, message = '暂无数据') {
        element.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <span>${message}</span>
            </div>
        `;
    },

    // 获取URL参数
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    // 设置URL参数
    setUrlParam(param, value) {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // 验证邮箱格式
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // 验证图片URL
    validateImageUrl(url) {
        if (!url) return false;
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        return imageExtensions.test(url) || url.includes('supabase.co');
    },

    // 创建工作卡片HTML
    createWorkCard(work) {
        const imageUrl = work.image_url || this.generatePlaceholderImage(work.title);
        const categoryBadge = `<span class="work-category">${work.category_name || '未分类'}</span>`;
        
        return `
            <div class="work-card" onclick="window.location.href='detail.html?id=${work.id}'">
                <img src="${imageUrl}" alt="${work.title}" class="work-image" onerror="this.src='${this.generatePlaceholderImage(work.title)}'">
                <div class="work-info">
                    <h3 class="work-title">${work.title}</h3>
                    ${categoryBadge}
                    <p class="work-creator">创作者: ${work.creator_name || '未知创作者'}</p>
                    <div class="work-meta">
                        <span><i class="fas fa-eye"></i> ${work.views || 0}</span>
                        <span>${this.formatDate(work.created_at)}</span>
                    </div>
                </div>
            </div>
        `;
    },

    // 创建创作者卡片HTML
    createCreatorCard(creator) {
        const avatarUrl = creator.avatar_url || this.generateAvatar(creator.name);
        
        return `
            <div class="creator-card" onclick="window.location.href='search.html?creator=${creator.id}'">
                <div class="creator-avatar">
                    ${creator.avatar_url ? 
                        `<img src="${avatarUrl}" alt="${creator.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\"fas fa-user\"></i>'">` : 
                        `<i class="fas fa-user"></i>`
                    }
                </div>
                <h3 class="creator-name">${creator.name}</h3>
                <p class="creator-specialty">${creator.specialty || '创意工作者'}</p>
                <div class="creator-stats">
                    <div>
                        <strong>${creator.work_count || 0}</strong>
                        <span>作品</span>
                    </div>
                    <div>
                        <strong>${creator.total_views || 0}</strong>
                        <span>浏览</span>
                    </div>
                </div>
            </div>
        `;
    },

    // 生成占位图片URL
    generatePlaceholderImage(title) {
        const seed = title ? title.replace(/\s+/g, '+') : 'creative';
        return `https://picsum.photos/seed/${seed}/400/300.jpg`;
    },

    // 生成头像占位符
    generateAvatar(name) {
        const seed = name ? name.replace(/\s+/g, '+') : 'user';
        return `https://picsum.photos/seed/${seed}/100/100.jpg`;
    },

    // 显示通知消息
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // 创建分页HTML
    createPagination(currentPage, totalPages, onPageClick) {
        if (totalPages <= 1) return '';
        
        let html = '<div class="pagination">';
        
        // 上一页按钮
        if (currentPage > 1) {
            html += `<button onclick="handlePageClick(${currentPage - 1})">上一页</button>`;
        }
        
        // 页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            html += `<button onclick="handlePageClick(1)">1</button>`;
            if (startPage > 2) {
                html += '<span>...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            html += `<button class="${isActive}" onclick="handlePageClick(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += '<span>...</span>';
            }
            html += `<button onclick="handlePageClick(${totalPages})">${totalPages}</button>`;
        }
        
        // 下一页按钮
        if (currentPage < totalPages) {
            html += `<button onclick="handlePageClick(${currentPage + 1})">下一页</button>`;
        }
        
        html += '</div>';
        return html;
    }
};

// 全局分页处理函数
window.handlePageClick = function(page) {
    if (window.onPageChange) {
        window.onPageChange(page);
    }
};

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error-message, .empty-state {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .error-message i, .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    .error-message {
        color: #dc3545;
    }
`;
document.head.appendChild(style);