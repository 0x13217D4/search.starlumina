/**
 * 设置管理器
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeSettingsBtn = document.getElementById('close-settings');

    // 默认设置
    const defaultSettings = {
        theme: 'auto',
        linkTarget: '_blank',
        backgroundType: 'bing',
        customBackgroundUrl: ''
    };

    // 版本信息数据
    const versionData = {
        "version": "1.0.6",
        "updateContent": 
        "1.新增设置窗口：集成到首页，支持毛玻璃效果<br>\
        2.优化导航布局：大屏幕显示更多网站<br>\
        3.改进UI设计：统一毛玻璃风格<br>\
        4.增强响应式：适配各种屏幕尺寸<br>\
        5.性能优化：减少页面加载时间<br>\
        6.用户体验：添加平滑动画和过渡效果"
    };

    // 显示设置窗口
    function showSettingsModal() {
        settingsModal.classList.add('show');
        modalOverlay.classList.add('show');
        settingsBtn.classList.add('on');
        document.body.style.overflow = 'hidden';
        
        // 初始化设置界面
        initializeSettingsUI();
    }

    // 隐藏设置窗口
    function hideSettingsModal() {
        settingsModal.classList.remove('show');
        modalOverlay.classList.remove('show');
        settingsBtn.classList.remove('on');
        document.body.style.overflow = '';
    }

    // 初始化设置界面
    function initializeSettingsUI() {
        // 加载当前设置
        const theme = localStorage.getItem('theme') || defaultSettings.theme;
        const linkTarget = localStorage.getItem('linkTarget') || defaultSettings.linkTarget;
        const backgroundType = localStorage.getItem('backgroundType') || defaultSettings.backgroundType;
        const customBackgroundUrl = localStorage.getItem('customBackgroundUrl') || defaultSettings.customBackgroundUrl;

        // 设置主题选项
        document.querySelector(`input[name="theme"][value="${theme}"]`).checked = true;
        
        // 设置链接打开方式
        document.querySelector(`input[name="linkTarget"][value="${linkTarget}"]`).checked = true;
        
        // 设置背景类型
        document.querySelector(`input[name="background"][value="${backgroundType}"]`).checked = true;
        
        // 设置自定义背景URL
        document.getElementById('backgroundUrlInput').value = customBackgroundUrl;
        
        // 显示/隐藏自定义背景选项
        const customBackgroundOptions = document.getElementById('customBackgroundOptions');
        customBackgroundOptions.style.display = backgroundType === 'custom' ? 'block' : 'none';
        
        // 设置背景预览
        if (backgroundType === 'custom' && customBackgroundUrl) {
            document.getElementById('backgroundPreview').style.backgroundImage = `url(${customBackgroundUrl})`;
        }
        
        // 加载版本信息
        loadVersionInfo();
    }

    // 加载版本信息
    function loadVersionInfo() {
        const versionElement = document.getElementById('currentVersion');
        const versionInfo = document.getElementById('versionInfo');
        
        if (versionElement && versionInfo) {
            versionElement.textContent = versionData.version;
            versionInfo.classList.remove('loading');
        }
    }

    // 应用主题设置
    function applyTheme(theme) {
        if (theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    // 应用背景设置
    function applyBackground(type, customUrl = '') {
        const bgo = document.querySelector('.bgo');
        
        if (type === 'bing') {
            // 使用缓存的Bing壁纸
            const cachedWallpaper = localStorage.getItem('wallpaperCache');
            if (cachedWallpaper) {
                const { date, url } = JSON.parse(cachedWallpaper);
                const today = new Date().toDateString();
                if (date === today) {
                    bgo.style.background = `url(${url})`;
                    bgo.style.backgroundSize = 'cover';
                    document.body.style.backgroundImage = `url(${url})`;
                    return;
                }
            }
            // 如果没有缓存，使用默认背景
            bgo.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            bgo.style.backgroundSize = 'cover';
        } else if (type === 'custom' && customUrl) {
            bgo.style.background = `url(${customUrl})`;
            bgo.style.backgroundSize = 'cover';
            document.body.style.backgroundImage = `url(${customUrl})`;
        }
    }

    // 绑定事件监听器
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 如果设置窗口已经显示，则关闭它
        if (settingsModal.classList.contains('show')) {
            hideSettingsModal();
        } else {
            // 如果导航窗口正在显示，先关闭导航窗口
            const navigationModal = document.getElementById('navigation-modal');
            if (navigationModal && navigationModal.classList.contains('show')) {
                navigationModal.classList.remove('show');
                document.getElementById('menu').classList.remove('on');
            }
            
            showSettingsModal();
            // 设置设置按钮为最高层级
            settingsBtn.style.zIndex = '1001';
            document.getElementById('menu').style.zIndex = '1000';
        }
    });

    closeSettingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        hideSettingsModal();
    });

    modalOverlay.addEventListener('click', function() {
        // 检查哪个弹窗正在显示，并关闭对应的弹窗
        if (settingsModal.classList.contains('show')) {
            hideSettingsModal();
        }
    });

    // ESC键关闭设置窗口
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
            hideSettingsModal();
        }
    });

    // 阻止设置窗口内容点击事件冒泡
    settingsModal.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 主题切换事件
    document.querySelectorAll('input[name="theme"]').forEach(input => {
        input.addEventListener('change', function() {
            const theme = this.value;
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    });

    // 链接打开方式切换事件
    document.querySelectorAll('input[name="linkTarget"]').forEach(input => {
        input.addEventListener('change', function() {
            localStorage.setItem('linkTarget', this.value);
        });
    });

    // 背景设置切换事件
    document.querySelectorAll('input[name="background"]').forEach(input => {
        input.addEventListener('change', function() {
            const type = this.value;
            localStorage.setItem('backgroundType', type);
            
            const customBackgroundOptions = document.getElementById('customBackgroundOptions');
            customBackgroundOptions.style.display = type === 'custom' ? 'block' : 'none';
            
            if (type === 'bing') {
                applyBackground('bing');
            } else if (type === 'custom') {
                const customUrl = localStorage.getItem('customBackgroundUrl') || '';
                applyBackground('custom', customUrl);
            }
        });
    });

    // 背景URL输入事件
    document.getElementById('backgroundUrlInput').addEventListener('input', function() {
        const url = this.value;
        localStorage.setItem('customBackgroundUrl', url);
        
        if (url) {
            document.getElementById('backgroundPreview').style.backgroundImage = `url(${url})`;
            applyBackground('custom', url);
        }
    });

    // 上传图片按钮事件
    document.getElementById('uploadBackgroundBtn').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });

    // 文件选择事件
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const dataUrl = e.target.result;
                localStorage.setItem('customBackgroundUrl', dataUrl);
                document.getElementById('backgroundUrlInput').value = dataUrl;
                document.getElementById('backgroundPreview').style.backgroundImage = `url(${dataUrl})`;
                applyBackground('custom', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // 保存设置按钮事件
    document.getElementById('saveSettings').addEventListener('click', function() {
        const currentSettings = {
            theme: document.querySelector('input[name="theme"]:checked').value,
            linkTarget: document.querySelector('input[name="linkTarget"]:checked').value,
            backgroundType: document.querySelector('input[name="background"]:checked').value,
            customBackgroundUrl: document.getElementById('backgroundUrlInput').value
        };

        // 保存所有设置到localStorage
        Object.entries(currentSettings).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });

        // 应用设置
        applyTheme(currentSettings.theme);
        applyBackground(currentSettings.backgroundType, currentSettings.customBackgroundUrl);

        alert('设置已保存！');
    });

    // 恢复默认设置按钮事件
    document.getElementById('resetSettings').addEventListener('click', function() {
        if (confirm('确定要恢复默认设置吗？这将清除所有自定义设置。')) {
            // 恢复默认设置
            Object.entries(defaultSettings).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });

            // 更新界面
            document.querySelector(`input[name="theme"][value="${defaultSettings.theme}"]`).checked = true;
            document.querySelector(`input[name="linkTarget"][value="${defaultSettings.linkTarget}"]`).checked = true;
            document.querySelector(`input[name="background"][value="${defaultSettings.backgroundType}"]`).checked = true;
            document.getElementById('backgroundUrlInput').value = defaultSettings.customBackgroundUrl;
            document.getElementById('customBackgroundOptions').style.display = 'none';
            
            // 更新背景和主题
            applyBackground(defaultSettings.backgroundType, defaultSettings.customBackgroundUrl);
            applyTheme(defaultSettings.theme);

            alert('已恢复默认设置！');
        }
    });

    // 版本信息点击事件
    document.getElementById('versionInfo').addEventListener('click', function() {
        const versionInfo = this;
        
        if (!versionData) return;
        
        versionInfo.classList.add('loading');
        
        // 格式化更新内容
        const formattedContent = versionData.updateContent
            .split('<br>')
            .filter(line => line.trim())
            .map(line => `<li>${line.trim()}</li>`)
            .join('');
        
        // 显示更新内容
        const updateContent = `
            <h3>当前版本: ${versionData.version}</h3>
            <ul>${formattedContent}</ul>`;
        
        // 创建临时模态框显示更新内容
        const tempModal = document.createElement('div');
        tempModal.className = 'settings-modal show';
        tempModal.style.zIndex = '3002'; // 确保在最上层
        tempModal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h3>版本更新内容</h3>
                    <button class="close-btn close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="settings-body">
                    <h3>当前版本: ${versionData.version}</h3>
                    <ul>${formattedContent}</ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(tempModal);
        
        // 关闭临时模态框
        tempModal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(tempModal);
        });
        
        tempModal.addEventListener('click', function(e) {
            if (e.target === tempModal) {
                document.body.removeChild(tempModal);
            }
        });
        
        // ESC键关闭临时模态框
        const escHandler = function(e) {
            if (e.key === 'Escape' && document.body.contains(tempModal)) {
                document.body.removeChild(tempModal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        versionInfo.classList.remove('loading');
    });
});