// 搜索页面逻辑
class SearchPage {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.searchQuery = '';
        this.selectedCategory = '';
        this.sortBy = 'created_at_desc';
        this.categories = [];
        
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.bindEvents();
        this.loadUrlParams();
        await this.performSearch();
    }

    async loadCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            
            this.categories = data || [];
            this.populateCategoryFilter();
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (!categoryFilter) return;

        const options = this.categories.map(category => 
            `<option value="${category.id}">${category.name}</option>`
        ).join('');

        categoryFilter.innerHTML = '<option value="">所有分类</option>' + options;
    }

    bindEvents() {
        // 搜索按钮
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
            
            // 防抖搜索
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.handleSearch();
            }, 500));
        }

        // 筛选器
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        const clearFilters = document.getElementById('clear-filters');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.handleFilterChange());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.handleFilterChange());
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        // 随机作品按钮
        const randomBtn = document.getElementById('random-work');
        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.goToRandomWork());
        }
    }

    loadUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        this.searchQuery = params.get('search') || '';
        this.selectedCategory = params.get('category') || '';
        this.sortBy = params.get('sort') || 'created_at_desc';
        this.currentPage = parseInt(params.get('page')) || 1;

        // 更新UI
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (searchInput) searchInput.value = this.searchQuery;
        if (categoryFilter) categoryFilter.value = this.selectedCategory;
        if (sortFilter) sortFilter.value = this.sortBy;
    }

    updateUrl() {
        const params = new URLSearchParams();
        
        if (this.searchQuery) params.set('search', this.searchQuery);
        if (this.selectedCategory) params.set('category', this.selectedCategory);
        if (this.sortBy !== 'created_at_desc') params.set('sort', this.sortBy);
        if (this.currentPage > 1) params.set('page', this.currentPage.toString());

        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
    }

    async handleSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.searchQuery = searchInput.value.trim();
        }
        
        this.currentPage = 1;
        await this.performSearch();
    }

    async handleFilterChange() {
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) this.selectedCategory = categoryFilter.value;
        if (sortFilter) this.sortBy = sortFilter.value;
        
        this.currentPage = 1;
        await this.performSearch();
    }

    clearFilters() {
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('sort-filter').value = 'created_at_desc';
        
        this.searchQuery = '';
        this.selectedCategory = '';
        this.sortBy = 'created_at_desc';
        this.currentPage = 1;
        
        this.performSearch();
    }

    async performSearch() {
        this.updateUrl();
        
        const grid = document.getElementById('search-results-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (!grid || !resultsCount) return;

        try {
            Utils.showLoading(grid, '搜索中...');

            // 构建查询
            let query = supabase
                .from('works')
                .select(`
                    *,
                    creators(name),
                    categories(name)
                `, { count: 'exact' });

            // 添加搜索条件
            if (this.searchQuery) {
                query = query.or(`title.ilike.%${this.searchQuery}%,description.ilike.%${this.searchQuery}%`);
            }

            if (this.selectedCategory) {
                query = query.eq('category_id', this.selectedCategory);
            }

            // 添加排序
            const sortField = this.sortBy.replace(/_(asc|desc)$/, '');
            const ascending = this.sortBy.endsWith('_asc');
            query = query.order(sortField, { ascending });

            // 添加分页
            const offset = (this.currentPage - 1) * APP_CONFIG.pageSize;
            query = query.range(offset, offset + APP_CONFIG.pageSize - 1);

            const { data, error, count } = await query;

            if (error) throw error;

            this.totalPages = Math.ceil((count || 0) / APP_CONFIG.pageSize);
            
            // 更新结果计数
            resultsCount.textContent = `找到 ${count || 0} 个作品`;

            if (!data || data.length === 0) {
                Utils.showEmpty(grid, '未找到符合条件的作品');
                document.getElementById('pagination').innerHTML = '';
            } else {
                this.renderResults(data, grid);
                this.renderPagination();
            }

        } catch (error) {
            console.error('搜索失败:', error);
            Utils.showError(grid, ERROR_MESSAGES.NETWORK_ERROR);
            resultsCount.textContent = '搜索出错';
        }
    }

    renderResults(works, container) {
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

    renderPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const paginationHtml = Utils.createPagination(
            this.currentPage, 
            this.totalPages,
            (page) => this.goToPage(page)
        );

        paginationContainer.innerHTML = paginationHtml;
    }

    goToPage(page) {
        this.currentPage = page;
        this.performSearch();
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

// 设置全局分页处理函数
window.onPageChange = function(page) {
    if (window.searchPage) {
        window.searchPage.goToPage(page);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.searchPage = new SearchPage();
});