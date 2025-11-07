(function() {
    // 安全访问localStorage
    function getStorageItem(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            console.error('LocalStorage access error:', e);
            return null;
        }
    }

    function setStorageItem(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            console.error('LocalStorage set error:', e);
        }
    }

    // 缓存DOM元素
    const elements = {
        form: document.querySelector("#super-search-fm"),
        searchText: document.querySelector("#search-text"),
        setBlank: document.querySelector("#set-search-blank"),
        searchGroups: document.querySelectorAll(".search-group"),
        searchTypes: document.querySelectorAll('input[name="type"]')
    };

    function initialize() {
        setupSearchType();
        setupBlankSetting();
        setupPlaceholder();
        setupFormAction();
        setupInputFocus();
        setupEventListeners();
    }

    function setupSearchType() {
        const savedType = getStorageItem("superSearchtype");
        const defaultType = elements.searchTypes[0].value;
        const typeToSelect = savedType || defaultType;
        
        elements.searchTypes.forEach(type => {
            if (type.value === typeToSelect) {
                type.checked = true;
                updateCurrentClass(type);
            }
        });
    }

    function setupBlankSetting() {
        // 使用与设置页面相同的 linkTarget 设置
        const linkTarget = localStorage.getItem('linkTarget') || '_blank';
        const isBlank = linkTarget === '_blank';
        elements.setBlank.checked = isBlank;
        updateFormTarget(isBlank);
    }

    function setupPlaceholder() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            const placeholder = selectedType.getAttribute("data-placeholder");
            elements.searchText.setAttribute("placeholder", placeholder);
        }
    }

    function setupFormAction() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            elements.form.action = selectedType.value;
        }
    }

    function setupInputFocus() {
        elements.searchText.addEventListener("focus", () => {
            elements.form.classList.add("input-focus");
        });
        
        elements.searchText.addEventListener("blur", () => {
            elements.form.classList.remove("input-focus");
        });
    }

    function setupEventListeners() {
        elements.searchTypes.forEach(type => {
            type.addEventListener("change", handleTypeChange);
        });
        
        elements.setBlank.addEventListener("change", handleBlankChange);
        elements.form.addEventListener("submit", handleFormSubmit);
    }

    function handleTypeChange(event) {
        const type = event.target;
        updatePlaceholder();
        updateFormAction(type.value);
        setStorageItem("superSearchtype", type.value);
        elements.searchText.focus();
        updateCurrentClass(type);
    }

    function handleBlankChange(event) {
        const isChecked = event.target.checked;
        // 同时更新设置页面的 linkTarget 设置
        const linkTarget = isChecked ? '_blank' : '_self';
        localStorage.setItem('linkTarget', linkTarget);
        updateFormTarget(isChecked);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const query = elements.searchText.value.trim();
        
        if (!query) {
            showSearchError('请输入搜索关键词');
            elements.searchText.focus();
            return false;
        }
        
        // 验证搜索关键词长度
        if (query.length > 200) {
            showSearchError('搜索关键词过长，请控制在200个字符以内');
            return false;
        }
        
        // 显示搜索加载状态
        showSearchLoading();
        
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            elements.form.action = selectedType.value + encodeURIComponent(query);
        }
        
        // 使用与设置页面相同的 linkTarget 设置
        const linkTarget = localStorage.getItem('linkTarget') || '_blank';
        const isBlank = linkTarget === '_blank';
        
        // 使用setTimeout确保UI更新后再进行跳转
        setTimeout(() => {
            try {
                if (isBlank) {
                    const newWindow = window.open(elements.form.action, '_blank');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        throw new Error('弹出窗口被阻止，请允许弹出窗口或在新标签页中打开');
                    }
                } else {
                    window.location.href = elements.form.action;
                }
            } catch (error) {
                hideSearchLoading();
                showSearchError('搜索跳转失败: ' + error.message);
                console.error('搜索跳转错误:', error);
            }
        }, 100);
    }
    
    // 显示搜索加载状态
    function showSearchLoading() {
        const submitButton = elements.form.querySelector('button[type="submit"]');
        const originalHtml = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        // 3秒后自动恢复，防止卡死状态
        setTimeout(() => {
            if (submitButton.disabled) {
                submitButton.innerHTML = originalHtml;
                submitButton.disabled = false;
            }
        }, 3000);
    }
    
    // 隐藏搜索加载状态
    function hideSearchLoading() {
        const submitButton = elements.form.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-search"></i>';
        submitButton.disabled = false;
    }
    
    // 显示搜索错误提示
    function showSearchError(message) {
        // 创建或获取错误提示元素
        let errorElement = document.getElementById('search-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'search-error-message';
            errorElement.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #ff6b6b;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                margin-top: 5px;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            `;
            elements.form.style.position = 'relative';
            elements.form.appendChild(errorElement);
            
            // 添加淡入动画
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }, 3000);
    }

    function updatePlaceholder() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            const placeholder = selectedType.getAttribute("data-placeholder");
            elements.searchText.setAttribute("placeholder", placeholder);
        }
    }

    function updateFormAction(action) {
        elements.form.action = action;
    }

    function updateFormTarget(shouldBlank) {
        if (shouldBlank) {
            elements.form.target = "_blank";
        } else {
            elements.form.removeAttribute("target");
        }
    }

    function updateCurrentClass(type) {
        elements.searchGroups.forEach(group => {
            group.classList.remove("s-current");
        });
        type.closest(".search-group").classList.add("s-current");
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', initialize);
})();