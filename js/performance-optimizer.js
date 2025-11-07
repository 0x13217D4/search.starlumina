// 性能优化器 - 提升页面加载速度和用户体验
class PerformanceOptimizer {
    constructor() {
        this.debounceTimers = new Map();
        this.init();
    }

    // 初始化性能优化
    init() {
        this.setupSearchDebounce();
        this.setupPreloadStrategy();
        this.setupPerformanceMonitoring();
        this.setupKeyboardShortcuts();
        this.setupSearchSuggestions();
    }

    // 搜索框防抖功能
    setupSearchDebounce() {
        const searchInput = document.getElementById('search-text');
        if (!searchInput) return;

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.handleSearchInput(e.target.value);
            }, 300);
        });

        // 添加搜索建议显示/隐藏逻辑
        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions();
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSearchSuggestions(), 200);
        });
    }

    // 处理搜索输入
    handleSearchInput(query) {
        if (query.length > 2) {
            this.fetchSearchSuggestions(query);
        } else {
            this.hideSearchSuggestions();
        }
    }

    // 获取搜索建议
    async fetchSearchSuggestions(query) {
        try {
            // 使用多个搜索引擎的API获取建议
            const suggestions = await Promise.race([
                this.getBaiduSuggestions(query),
                this.getGoogleSuggestions(query),
                new Promise(resolve => setTimeout(() => resolve([]), 1000))
            ]);
            
            this.displaySearchSuggestions(suggestions, query);
        } catch (error) {
            console.log('搜索建议获取失败:', error);
        }
    }

    // 百度搜索建议
    async getBaiduSuggestions(query) {
        try {
            const response = await fetch(`https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&json=1`);
            const data = await response.json();
            return data.s || [];
        } catch (error) {
            console.log('百度搜索建议获取失败:', error);
            return [];
        }
    }

    // Google搜索建议
    async getGoogleSuggestions(query) {
        try {
            const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data[1] || [];
        } catch (error) {
            console.log('Google搜索建议获取失败:', error);
            return [];
        }
    }

    // 显示搜索建议
    displaySearchSuggestions(suggestions, query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
            return;
        }

        const html = suggestions.slice(0, 8).map(suggestion => `
            <div class="search-suggestion" onclick="window.performanceOptimizer.selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                <i class="fas fa-search"></i>
                <span>${this.escapeHtml(suggestion)}</span>
            </div>
        `).join('');

        suggestionsContainer.innerHTML = html;
        suggestionsContainer.style.display = 'block';
    }

    // 显示搜索建议
    showSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) container.style.display = 'block';
    }

    // 隐藏搜索建议
    hideSearchSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) container.style.display = 'none';
    }

    // 选择搜索建议
    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('search-text');
        if (searchInput) {
            searchInput.value = suggestion;
            searchInput.focus();
        }
        this.hideSearchSuggestions();
    }

    // 预加载策略
    setupPreloadStrategy() {
        // 预加载关键资源
        this.preloadCriticalResources();
        
        // 延迟加载非关键资源
        this.delayNonCriticalResources();
    }

    // 预加载关键资源
    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            '/css/optimized.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    // 延迟加载非关键资源
    delayNonCriticalResources() {
        window.addEventListener('load', () => {
            // 延迟加载非关键CSS
            const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([href*="optimized"])');
            nonCriticalCSS.forEach(link => {
                link.media = 'print';
                link.onload = () => { link.media = 'all'; };
            });
        });
    }

    // 性能监控
    setupPerformanceMonitoring() {
        // 监控核心性能指标
        this.monitorCoreWebVitals();
        
        // 监控资源加载
        this.monitorResourceLoading();
    }

    // 监控核心Web指标
    monitorCoreWebVitals() {
        if (!('PerformanceObserver' in window)) return;
        
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                console.log(`${entry.name}: ${entry.value.toFixed(2)}`);
                
                // 可以发送到分析服务
                if (entry.name === 'LCP' && entry.value > 2500) {
                    console.warn('LCP时间过长，需要优化');
                }
            });
        });

        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }

    // 监控资源加载
    monitorResourceLoading() {
        const resourceTimings = performance.getEntriesByType('resource');
        const slowResources = resourceTimings.filter(resource => 
            resource.duration > 1000
        );
        
        if (slowResources.length > 0) {
            console.warn('发现慢速资源:', slowResources);
        }
    }

    // 键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K 或 / 聚焦搜索框
            if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
                e.preventDefault();
                const searchInput = document.getElementById('search-text');
                if (searchInput) searchInput.focus();
            }
            
            // Escape 清除搜索框
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('search-text');
                if (searchInput && document.activeElement === searchInput) {
                    searchInput.value = '';
                    this.hideSearchSuggestions();
                }
            }
        });
    }

    // 设置搜索建议容器
    setupSearchSuggestions() {
        // 搜索建议容器样式
        const style = document.createElement('style');
        style.textContent = `
            #search-suggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--card-bg);
                backdrop-filter: blur(var(--blur-amount));
                border: 1px solid var(--card-border);
                border-top: none;
                border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            }

            .search-suggestion {
                padding: 10px 15px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.2s ease;
            }

            .search-suggestion:hover {
                background-color: var(--hover-color);
            }

            .search-suggestion i {
                color: var(--accent-color);
                width: 16px;
            }

            .search-suggestion span {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        document.head.appendChild(style);

        // 在搜索框下方添加建议容器
        const searchForm = document.getElementById('super-search-fm');
        if (searchForm) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.id = 'search-suggestions';
            searchForm.appendChild(suggestionsContainer);
        }
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 销毁清理
    destroy() {
        this.debounceTimers.clear();
    }
}

// 创建全局性能优化器
window.performanceOptimizer = new PerformanceOptimizer();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}