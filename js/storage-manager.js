// 本地存储管理器
class StorageManager {
    constructor() {
        this.prefix = 'superSearch';
    }

    // 安全获取存储项
    getItem(key) {
        try {
            return window.localStorage.getItem(`${this.prefix}${key}`);
        } catch (e) {
            console.error('LocalStorage access error:', e);
            return null;
        }
    }

    // 安全设置存储项
    setItem(key, value) {
        try {
            window.localStorage.setItem(`${this.prefix}${key}`, value);
            return true;
        } catch (e) {
            console.error('LocalStorage set error:', e);
            return false;
        }
    }

    // 获取搜索类型设置
    getSearchType() {
        return this.getItem('type') || 'https://xiaoyi.huawei.com/?q=';
    }

    // 设置搜索类型
    setSearchType(type) {
        return this.setItem('type', type);
    }

    // 获取新窗口打开设置
    getNewWindowSetting() {
        return this.getItem('newWindow') === '1';
    }

    // 设置新窗口打开
    setNewWindowSetting(enabled) {
        return this.setItem('newWindow', enabled ? '1' : '-1');
    }

    // 获取主题设置
    getTheme() {
        return this.getItem('theme') || 'auto';
    }

    // 设置主题
    setTheme(theme) {
        return this.setItem('theme', theme);
    }
    // 清空所有相关设置
    clearAll() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Clear storage error:', e);
            return false;
        }
    }

    // 获取存储统计信息
    getStats() {
        try {
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith(this.prefix)
            );
            const totalSize = keys.reduce((sum, key) => 
                sum + (localStorage.getItem(key) || '').length, 0
            );
            
            return {
                count: keys.length,
                totalSize: totalSize,
                keys: keys
            };
        } catch (e) {
            return { count: 0, totalSize: 0, keys: [] };
        }
    }
}

// 创建全局存储管理器
window.storageManager = new StorageManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}