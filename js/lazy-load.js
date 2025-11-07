// 懒加载管理器
class LazyLoadManager {
    constructor() {
        this.observer = null;
        this.observedElements = new Set();
        this.init();
    }

    // 初始化Intersection Observer
    init() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackLoad(); // 浏览器不支持时的降级方案
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    this.observer.unobserve(entry.target);
                    this.observedElements.delete(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px开始加载
            threshold: 0.1
        });
    }

    // 添加需要懒加载的元素
    addElement(element, options = {}) {
        if (!this.observer) {
            this.loadElement(element); // 直接加载
            return;
        }

        const { src, srcset, background } = options;
        
        // 保存原始数据
        element.setAttribute('data-lazy-src', src || element.getAttribute('src') || '');
        element.setAttribute('data-lazy-srcset', srcset || element.getAttribute('srcset') || '');
        element.setAttribute('data-lazy-background', background || element.style.backgroundImage || '');

        // 清除内容，等待加载
        if (src) element.removeAttribute('src');
        if (srcset) element.removeAttribute('srcset');
        if (background) element.style.backgroundImage = 'none';

        element.classList.add('lazy-loading');
        this.observer.observe(element);
        this.observedElements.add(element);
    }

    // 加载元素内容
    loadElement(element) {
        const src = element.getAttribute('data-lazy-src');
        const srcset = element.getAttribute('data-lazy-srcset');
        const background = element.getAttribute('data-lazy-background');

        return new Promise((resolve) => {
            const onLoad = () => {
                element.classList.remove('lazy-loading');
                element.classList.add('lazy-loaded');
                resolve();
            };

            if (src && element.tagName === 'IMG') {
                element.src = src;
                if (srcset) element.srcset = srcset;
                element.onload = onLoad;
                element.onerror = onLoad; // 即使出错也继续
            } else if (background) {
                const img = new Image();
                img.onload = () => {
                    element.style.backgroundImage = `url('${background}')`;
                    onLoad();
                };
                img.onerror = onLoad;
                img.src = background.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            } else {
                onLoad();
            }
        });
    }

    // 强制加载所有可见元素
    loadVisible() {
        this.observedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) { // 100px缓冲
                this.loadElement(element);
                this.observer?.unobserve(element);
                this.observedElements.delete(element);
            }
        });
    }

    // 浏览器不支持时的降级方案
    fallbackLoad() {
        document.querySelectorAll('[data-lazy-src], [data-lazy-background]').forEach(element => {
            this.loadElement(element);
        });
    }

    // 销毁观察器
    destroy() {
        this.observer?.disconnect();
        this.observedElements.clear();
    }
}

// 创建全局懒加载管理器
window.lazyLoader = new LazyLoadManager();

// 页面加载完成后初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
    // 懒加载背景图片
    const backgroundElements = document.querySelectorAll('.bgo');
    backgroundElements.forEach(element => {
        const currentBg = element.style.backgroundImage;
        if (currentBg && currentBg !== 'none') {
            window.lazyLoader.addElement(element, { 
                background: currentBg 
            });
        }
    });

    // 懒加载图标和图片
    const images = document.querySelectorAll('img[src], i[class*="fa-"]');
    images.forEach(img => {
        if (img.getAttribute('src') && !img.classList.contains('lazy-exclude')) {
            window.lazyLoader.addElement(img, { 
                src: img.getAttribute('src') 
            });
        }
    });

    // 监听窗口变化，重新检查可见性
    window.addEventListener('resize', () => {
        setTimeout(() => window.lazyLoader.loadVisible(), 100);
    });

    // 滚动时检查可见性（防抖）
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => window.lazyLoader.loadVisible(), 50);
    });

    // 页面显示时检查可见性（处理浏览器标签切换）
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => window.lazyLoader.loadVisible(), 100);
        }
    });
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoadManager;
}