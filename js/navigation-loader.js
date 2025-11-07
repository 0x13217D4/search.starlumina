/**
 * 从JSON文件加载导航菜单并处理窗口显示
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const menu = document.getElementById('menu');
    const settingsBtn = document.getElementById('settings-btn');
    const navigationModal = document.getElementById('navigation-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-navigation');
    const navMenu = document.getElementById('navigation-menu');

    // 加载导航JSON文件
    fetch('json/navigation.json')
        .then(res => res.json())
        .then(data => {
            // 生成导航菜单HTML
            data.categories.forEach(category => {
                // 添加分类标题
                const titleLi = document.createElement('li');
                titleLi.className = 'title';
                titleLi.textContent = category.name;
                navMenu.appendChild(titleLi);

                // 添加分类项
                category.items.forEach(item => {
                    const itemLi = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.rel = 'nofollow';
                    link.target = '_blank';
                    
                    // 添加图标
                    if (item.icon) {
                        const icon = document.createElement('i');
                        icon.className = item.icon;
                        if (item.color) {
                            icon.style.color = item.color;
                        }
                        link.appendChild(icon);
                    }
                    
                    // 添加文本
                    link.appendChild(document.createTextNode(' ' + item.name));
                    itemLi.appendChild(link);
                    navMenu.appendChild(itemLi);
                });
            });
        })
        .catch(error => {
            console.error('加载导航菜单失败:', error);
        });

    // 显示导航窗口
    function showNavigationModal() {
        navigationModal.classList.add('show');
        modalOverlay.classList.add('show');
        menu.classList.add('on');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    // 隐藏导航窗口
    function hideNavigationModal() {
        navigationModal.classList.remove('show');
        modalOverlay.classList.remove('show');
        menu.classList.remove('on');
        document.body.style.overflow = ''; // 恢复滚动
    }

    // 绑定事件监听器
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // 如果导航窗口已经显示，则关闭它
        if (navigationModal.classList.contains('show')) {
            hideNavigationModal();
        } else {
            // 如果设置窗口正在显示，先关闭设置窗口
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal && settingsModal.classList.contains('show')) {
                settingsModal.classList.remove('show');
                settingsBtn.classList.remove('on');
            }
            
            showNavigationModal();
            // 设置导航按钮为最高层级
            menu.style.zIndex = '1001';
            settingsBtn.style.zIndex = '1000';
        }
    });

    // 设置按钮点击事件 - 移除，已在settings-manager.js中处理
    // settingsBtn.addEventListener('click', function(e) {
    //     e.stopPropagation();
    //     showSettingsModal();
    // });

    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        hideNavigationModal();
    });

    modalOverlay.addEventListener('click', function() {
        // 检查哪个弹窗正在显示，并关闭对应的弹窗
        if (navigationModal.classList.contains('show')) {
            hideNavigationModal();
        }
    });

    // ESC键关闭窗口
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navigationModal.classList.contains('show')) {
            hideNavigationModal();
        }
    });

    // 阻止窗口内容点击事件冒泡
    navigationModal.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});