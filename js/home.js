// 首页逻辑
class HomePage {
    constructor() {
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadFeaturedWorks();
        await this.loadFeaturedCreators();
    }

    bindEvents() {
        // 随机作品按钮
        const randomBtn = document.getElementById('random-work');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.goToRandomWork());
        }
    }

    async loadFeaturedWorks() {
        const grid = document.getElementById('featured-works-grid');
        if (!grid) return;

        try {
            Utils.showLoading(grid, '加载热门作品中...');

            const { data, error } = await supabase
                .from('works')
                .select(`
                    *,
                    creators(name),
                    categories(name)
                `)
                .eq('featured', true)
                .order('views', { ascending: false })
                .limit(6);

            if (error) throw error;

            if (!data || data.length === 0) {
                // 如果没有精选作品，获取最新作品
                const { data: latestData, error: latestError } = await supabase
                    .from('works')
                    .select(`
                        *,
                        creators(name),
                        categories(name)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(6);

                if (latestError) throw latestError;
                this.renderWorks(latestData || [], grid);
            } else {
                this.renderWorks(data, grid);
            }

        } catch (error) {
            console.error('加载热门作品失败:', error);
            Utils.showError(grid, ERROR_MESSAGES.NETWORK_ERROR);
        }
    }

    async loadFeaturedCreators() {
        const grid = document.getElementById('featured-creators-grid');
        if (!grid) return;

        try {
            Utils.showLoading(grid, '加载推荐创作者中...');

            const { data, error } = await supabase
                .from('creators')
                .select('*')
                .eq('featured', true)
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;

            if (!data || data.length === 0) {
                // 如果没有精选创作者，获取有作品的创作者
                const { data: creatorsWithWorks, error: worksError } = await supabase
                    .from('creators')
                    .select(`
                        *,
                        works(count)
                    `)
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (worksError) throw worksError;
                this.renderCreators(creatorsWithWorks || [], grid);
            } else {
                this.renderCreators(data, grid);
            }

        } catch (error) {
            console.error('加载推荐创作者失败:', error);
            Utils.showError(grid, ERROR_MESSAGES.NETWORK_ERROR);
        }
    }

    renderWorks(works, container) {
        if (!works || works.length === 0) {
            Utils.showEmpty(container, '暂无作品展示');
            return;
        }

        const worksHtml = works.map(work => {
            // 处理关联数据
            const workWithDetails = {
                ...work,
                creator_name: work.creators?.name || '未知创作者',
                category_name: work.categories?.name || '未分类'
            };
            return Utils.createWorkCard(workWithDetails);
        }).join('');

        container.innerHTML = worksHtml;
    }

    renderCreators(creators, container) {
        if (!creators || creators.length === 0) {
            Utils.showEmpty(container, '暂无创作者推荐');
            return;
        }

        const creatorsHtml = creators.map(creator => {
            // 计算作品数量
            const workCount = creator.works ? (Array.isArray(creator.works) ? creator.works.length : creator.works.count || 0) : 0;
            
            const creatorWithStats = {
                ...creator,
                work_count: workCount
            };
            
            return Utils.createCreatorCard(creatorWithStats);
        }).join('');

        container.innerHTML = creatorsHtml;
    }

    async goToRandomWork() {
        try {
            const { data, error } = await supabase
                .from('works')
                .select('id')
                .limit(1000);

            if (error) throw error;

            if (!data || data.length === 0) {
                Utils.showNotification('暂无作品可浏览', 'info');
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});