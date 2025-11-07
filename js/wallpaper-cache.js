// 壁纸缓存管理器
class WallpaperCacheManager {
    constructor() {
        this.cacheKey = 'wallpaperCache';
        this.maxCacheSize = 10; // 最大缓存数量
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24小时过期
        this.init();
    }

    // 初始化缓存管理器
    init() {
        this.cleanupExpiredCache();
    }

    // 获取当前日期键（用于判断是否过期）
    getDateKey() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    // 缓存壁纸
    async cacheWallpaper(url, imageData) {
        try {
            const cache = this.getCache();
            const dateKey = this.getDateKey();
            
            // 清理过期缓存
            this.cleanupExpiredCache(cache);
            
            // 检查是否已缓存今日壁纸
            if (cache[dateKey] && cache[dateKey].url === url) {
                return cache[dateKey].data; // 直接返回已缓存的数据
            }

            // 下载并缓存新壁纸
            const blob = await this.downloadImage(url);
            const base64Data = await this.blobToBase64(blob);
            
            // 更新缓存
            cache[dateKey] = {
                url: url,
                data: base64Data,
                timestamp: Date.now(),
                size: base64Data.length
            };

            // 限制缓存大小
            this.limitCacheSize(cache);
            
            this.saveCache(cache);
            return base64Data;
        } catch (error) {
            console.error('壁纸缓存失败:', error);
            throw error;
        }
    }

    // 获取缓存的壁纸
    getCachedWallpaper(url) {
        try {
            const cache = this.getCache();
            const dateKey = this.getDateKey();
            
            const cached = cache[dateKey];
            if (cached && cached.url === url && 
                Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
            return null;
        } catch (error) {
            console.error('获取缓存壁纸失败:', error);
            return null;
        }
    }

    // 下载图片
    async downloadImage(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`下载失败: ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('网络错误'));
            xhr.ontimeout = () => reject(new Error('请求超时'));
            xhr.timeout = 10000; // 10秒超时
            
            xhr.send();
        });
    }

    // Blob转Base64
    blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // 获取缓存
    getCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            return cached ? JSON.parse(cached) : {};
        } catch {
            return {};
        }
    }

    // 保存缓存
    saveCache(cache) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        } catch (error) {
            console.error('保存缓存失败:', error);
            // 清理部分缓存后重试
            this.limitCacheSize(cache, this.maxCacheSize / 2);
            try {
                localStorage.setItem(this.cacheKey, JSON.stringify(cache));
            } catch {
                // 最终失败，清理所有缓存
                localStorage.removeItem(this.cacheKey);
            }
        }
    }

    // 清理过期缓存
    cleanupExpiredCache(cache = this.getCache()) {
        const now = Date.now();
        Object.keys(cache).forEach(key => {
            if (now - cache[key].timestamp > this.cacheExpiry) {
                delete cache[key];
            }
        });
        this.saveCache(cache);
    }

    // 限制缓存大小
    limitCacheSize(cache, maxSize = this.maxCacheSize) {
        const keys = Object.keys(cache);
        if (keys.length > maxSize) {
            // 按时间排序，删除最旧的
            keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
            for (let i = 0; i < keys.length - maxSize; i++) {
                delete cache[keys[i]];
            }
        }
    }

    // 获取缓存统计信息
    getCacheStats() {
        const cache = this.getCache();
        const keys = Object.keys(cache);
        const totalSize = keys.reduce((sum, key) => sum + (cache[key].size || 0), 0);
        
        return {
            count: keys.length,
            totalSize: totalSize,
            maxSize: this.maxCacheSize
        };
    }

    // 清空所有缓存
    clearCache() {
        localStorage.removeItem(this.cacheKey);
    }
}

// 创建全局壁纸缓存管理器
window.wallpaperCache = new WallpaperCacheManager();

// 壁纸加载器
class WallpaperLoader {
    constructor() {
        this.currentWallpaper = null;
    }

    // 加载壁纸
    async loadWallpaper(url, element = document.querySelector('.bgo')) {
        if (!element) return;

        try {
            // 显示加载状态
            element.classList.add('wallpaper-loading');
            
            // 检查缓存
            const cached = window.wallpaperCache.getCachedWallpaper(url);
            if (cached) {
                this.applyWallpaper(element, cached);
                return;
            }

            // 下载并缓存
            const imageData = await window.wallpaperCache.cacheWallpaper(url);
            this.applyWallpaper(element, imageData);
            
        } catch (error) {
            console.error('壁纸加载失败:', error);
            this.showFallbackWallpaper(element);
        } finally {
            element.classList.remove('wallpaper-loading');
            element.classList.add('wallpaper-loaded');
        }
    }

    // 应用壁纸
    applyWallpaper(element, imageData) {
        element.style.backgroundImage = `url('${imageData}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
        
        // 同时设置body背景
        document.body.style.backgroundImage = `url('${imageData}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        
        this.currentWallpaper = imageData;
    }

    // 显示备用壁纸
    showFallbackWallpaper(element) {
        const fallbackGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        element.style.background = fallbackGradient;
        document.body.style.background = fallbackGradient;
    }

    // 预加载壁纸（用于下一页）
    preloadWallpaper(url) {
        const img = new Image();
        img.src = url;
    }
}

// 创建全局壁纸加载器
window.wallpaperLoader = new WallpaperLoader();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WallpaperCacheManager, WallpaperLoader };
}