// 详情页面逻辑
class DetailPage {
    constructor() {
        this.workId = null;
        this.work = null;
        
        this.init();
    }

    async init() {
        this.getWorkId();
        if (!this.workId) {
            this.showWorkNotFound();
            return;
        }
        
        await this.loadWorkDetail();
        await this.loadRelatedWorks();
        this.bindEvents();
    }

    getWorkId() {
        this.workId = Utils.getUrlParam('id');
    }

    async loadWorkDetail() {
        const loading = document.getElementById('loading');
        const detail = document.getElementById('work-detail');
        
        if (!loading || !detail) return;

        try {
            Utils.showLoading(loading, '加载作品详情中...');

            const { data, error } = await supabase
                .from('works')
                .select(`
                    *,
                    creators(*),
                    categories(*)
                `)
                .eq('id', this.workId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    this.showWorkNotFound();
                    return;
                }
                throw error;
            }

            this.work = data;
            this.renderWorkDetail(data);
            
            // 隐藏加载，显示详情
            loading.style.display = 'none';
            detail.style.display = 'block';
            
            // 更新页面标题
            document.title = `${data.title} - 创意作品展示查询平台`;
            
            // 增加浏览量
            await this.incrementViews();

        } catch (error) {
            console.error('加载作品详情失败:', error);
            Utils.showError(loading, ERROR_MESSAGES.NETWORK_ERROR);
        }
    }

    renderWorkDetail(work) {
        const detailContainer = document.getElementById('work-detail');
        if (!detailContainer) return;

        const imageUrl = work.image_url || Utils.generatePlaceholderImage(work.title);
        const creatorAvatar = work.creators?.avatar_url || Utils.generateAvatar(work.creators?.name || '创作者');

        const detailHtml = `
            <div class="detail-header">
                <div class="detail-image-container">
                    <img src="${imageUrl}" alt="${work.title}" class="detail-image" onerror="this.src='${Utils.generatePlaceholderImage(work.title)}'">
                </div>
                <div class="detail-info">
                    <h1>${work.title}</h1>
                    
                    <div class="detail-meta">
                        <p><strong>分类:</strong> ${work.categories?.name || '未分类'}</p>
                        <p><strong>创作者:</strong> ${work.creators?.name || '未知创作者'}</p>
                        <p><strong>发布时间:</strong> ${Utils.formatDate(work.created_at)}</p>
                        <p><strong>浏览量:</strong> <span id="views-count">${(work.views || 0) + 1}</span></p>
                    </div>
                    
                    <div class="creator-info" style="margin: 1.5rem 0; padding: 1rem; background: #f8f9fa; border-radius: 10px;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <img src="${creatorAvatar}" alt="${work.creators?.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'">
                            <div>
                                <p style="margin: 0; font-weight: 600;">${work.creators?.name || '未知创作者'}</p>
                                <p style="margin: 0; color: #666; font-size: 0.9rem;">${work.creators?.specialty || '创意工作者'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="btn btn-primary" onclick="window.shareWork()">
                            <i class="fas fa-share-alt"></i> 分享作品
                        </button>
                        <button class="btn btn-secondary" onclick="window.goBack()">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                    </div>
                </div>
            </div>
            
            ${work.description ? `
                <div class="detail-description">
                    <h3>作品介绍</h3>
                    <p>${work.description.replace(/\n/g, '<br>')}</p>
                </div>
            ` : ''}
        `;

        detailContainer.innerHTML = detailHtml;
    }

    async loadRelatedWorks() {
        const grid = document.getElementById('related-works-grid');
        if (!grid || !this.work) return;

        try {
            Utils.showLoading(grid, '加载相关作品中...');

            // 获取同分类或同一创作者的其他作品
            let query = supabase
                .from('works')
                .select(`
                    *,
                    creators(name),
                    categories(name)
                `)
                .neq('id', this.workId) // 排除当前作品
                .order('views', { ascending: false })
                .limit(6);

            // 优先展示同分类作品
            if (this.work.category_id) {
                query = query.eq('category_id', this.work.category_id);
            } else if (this.work.creator_id) {
                query = query.eq('creator_id', this.work.creator_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (!data || data.length === 0) {
                // 如果没有相关作品，获取最新作品
                const { data: latestData, error: latestError } = await supabase
                    .from('works')
                    .select(`
                        *,
                        creators(name),
                        categories(name)
                    `)
                    .neq('id', this.workId)
                    .order('created_at', { ascending: false })
                    .limit(6);

                if (latestError) throw latestError;
                this.renderRelatedWorks(latestData || [], grid);
            } else {
                this.renderRelatedWorks(data, grid);
            }

        } catch (error) {
            console.error('加载相关作品失败:', error);
            grid.style.display = 'none';
        }
    }

    renderRelatedWorks(works, container) {
        if (!works || works.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        const worksHtml = works.map(work => {
            const workWithDetails = {
                ...work,
                creator_name: work.creators?.name || '未知创作者',
                category_name: work.categories?.name || '未分类'
            };
            return Utils.createWorkCard(workWithDetails);
        }).join('');

        container.innerHTML = worksHtml;
    }

    async incrementViews() {
        if (!this.work) return;

        try {
            await supabase
                .from('works')
                .update({ 
                    views: (this.work.views || 0) + 1 
                })
                .eq('id', this.workId);
        } catch (error) {
            console.error('更新浏览量失败:', error);
        }
    }

    showWorkNotFound() {
        const loading = document.getElementById('loading');
        const mainContent = document.querySelector('.main-content .container');
        
        if (loading) {
            loading.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-search"></i>
                    <h2>作品未找到</h2>
                    <p>抱歉，您访问的作品不存在或已被删除。</p>
                    <a href="search.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">
                        <i class="fas fa-search"></i> 浏览其他作品
                    </a>
                </div>
            `;
        }
    }

    bindEvents() {
        // 随机作品按钮
        const randomBtn = document.getElementById('random-work');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.goToRandomWork());
        }
    }

    async goToRandomWork() {
        try {
            const { data, error } = await supabase
                .from('works')
                .select('id')
                .neq('id', this.workId) // 排除当前作品
                .limit(1000);

            if (error) throw error;

            if (!data || data.length === 0) {
                Utils.showNotification('暂无其他作品可浏览', 'info');
                return;
            }

            const randomIndex = Math.floor(Math.random() * data.length);
            const randomWork = data[randomIndex];

            if (randomWork) {
                window.location.href = `detail.html?id=${randomWork.id}`;
            }
        } catch (error) {
            console.error('获取随机作品失败:', error);
            Utils.showNotification('获取随机作品失败', 'error');
        }
    }
}

// 全局函数
window.shareWork = function() {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(() => {});
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(url).then(() => {
            Utils.showNotification('链接已复制到剪贴板', 'success');
        }).catch(() => {
            Utils.showNotification('复制链接失败', 'error');
        });
    }
};

window.goBack = function() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = 'search.html';
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new DetailPage();
});