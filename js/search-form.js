// 搜索表单管理器
class SearchFormManager {
    constructor() {
        this.elements = {
            form: document.querySelector("#super-search-fm"),
            searchText: document.querySelector("#search-text"),
            setBlank: document.querySelector("#set-search-blank"),
            searchGroups: document.querySelectorAll(".search-group"),
            searchTypes: document.querySelectorAll('input[name="type"]')
        };
        this.errorElement = null;
        this.init();
    }

    // 初始化搜索表单
    init() {
        this.setupSearchType();
        this.setupBlankSetting();
        this.setupPlaceholder();
        this.setupFormAction();
        this.setupInputFocus();
    }

    // 设置搜索类型
    setupSearchType() {
        const savedType = window.storageManager.getSearchType();
        const defaultType = this.elements.searchTypes[0].value;
        const typeToSelect = savedType || defaultType;
        
        this.elements.searchTypes.forEach(type => {
            if (type.value === typeToSelect) {
                type.checked = true;
                this.updateCurrentClass(type);
            }
        });
    }

    // 设置新窗口打开选项
    setupBlankSetting() {
        // 使用与设置页面相同的 linkTarget 设置
        const linkTarget = localStorage.getItem('linkTarget') || '_blank';
        const isBlank = linkTarget === '_blank';
        this.elements.setBlank.checked = isBlank;
        this.updateFormTarget(isBlank);
    }

    // 设置占位符文本
    setupPlaceholder() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            const placeholder = selectedType.getAttribute("data-placeholder");
            this.elements.searchText.setAttribute("placeholder", placeholder);
        }
    }

    // 设置表单动作
    setupFormAction() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            this.elements.form.action = selectedType.value;
        }
    }

    // 设置输入框焦点效果
    setupInputFocus() {
        this.elements.searchText.addEventListener("focus", () => {
            this.elements.form.classList.add("input-focus");
        });
        
        this.elements.searchText.addEventListener("blur", () => {
            this.elements.form.classList.remove("input-focus");
        });
    }

    // 处理表单提交
    handleSubmit(event) {
        event.preventDefault();
        const query = this.elements.searchText.value.trim();
        
        if (!query) {
            this.showError('请输入搜索关键词');
            this.elements.searchText.focus();
            return false;
        }
        
        // 验证搜索关键词长度
        if (query.length > 200) {
            this.showError('搜索关键词过长，请控制在200个字符以内');
            return false;
        }
        
        // 显示搜索加载状态
        this.showLoading();
        
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            this.elements.form.action = selectedType.value + encodeURIComponent(query);
        }
        
        // 使用与设置页面相同的 linkTarget 设置
        const linkTarget = localStorage.getItem('linkTarget') || '_blank';
        const isBlank = linkTarget === '_blank';
        
        // 使用setTimeout确保UI更新后再进行跳转
        setTimeout(() => {
            try {
                if (isBlank) {
                    const newWindow = window.open(this.elements.form.action, '_blank');
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        throw new Error('弹出窗口被阻止，请允许弹出窗口或在新标签页中打开');
                    }
                } else {
                    window.location.href = this.elements.form.action;
                }
            } catch (error) {
                this.hideLoading();
                this.showError('搜索跳转失败: ' + error.message);
                console.error('搜索跳转错误:', error);
            }
        }, 100);
    }

    // 显示加载状态
    showLoading() {
        const submitButton = this.elements.form.querySelector('button[type="submit"]');
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

    // 隐藏加载状态
    hideLoading() {
        const submitButton = this.elements.form.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-search"></i>';
        submitButton.disabled = false;
    }

    // 显示错误信息
    showError(message) {
        if (!this.errorElement) {
            this.errorElement = document.createElement('div');
            this.errorElement.id = 'search-error-message';
            this.errorElement.style.cssText = `
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
            this.elements.form.style.position = 'relative';
            this.elements.form.appendChild(this.errorElement);
        }
        
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (this.errorElement) {
                this.errorElement.style.display = 'none';
            }
        }, 3000);
    }

    // 更新占位符
    updatePlaceholder() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        if (selectedType) {
            const placeholder = selectedType.getAttribute("data-placeholder");
            this.elements.searchText.setAttribute("placeholder", placeholder);
        }
    }

    // 更新表单动作
    updateFormAction(action) {
        this.elements.form.action = action;
    }

    // 更新表单目标
    updateFormTarget(shouldBlank) {
        if (shouldBlank) {
            this.elements.form.target = "_blank";
        } else {
            this.elements.form.removeAttribute("target");
        }
    }

    // 更新当前类
    updateCurrentClass(type) {
        this.elements.searchGroups.forEach(group => {
            group.classList.remove("s-current");
        });
        type.closest(".search-group").classList.add("s-current");
    }

    // 聚焦搜索框
    focus() {
        this.elements.searchText.focus();
    }

    // 清空搜索框
    clear() {
        this.elements.searchText.value = '';
    }

    // 销毁清理
    destroy() {
        if (this.errorElement && this.errorElement.parentNode) {
            this.errorElement.parentNode.removeChild(this.errorElement);
        }
    }
}

// 创建全局搜索表单管理器
window.searchForm = new SearchFormManager();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchFormManager;
}