(function() {
    'use strict';
    
    const input = document.getElementById('search-text');
    const oUl = document.getElementById('ul');
    let currentScript = null;
    let debounceTimer = null;
    
    // 获取当前搜索引擎类型
    function getCurrentSearchEngine() {
        const selectedType = document.querySelector('input[name="type"]:checked');
        return selectedType ? selectedType.id.replace('type-', '') : 'xiaoyi';
    }
    
    // 获取联想词API URL
    function getSuggestionApiUrl(query, engine) {
        const encodedQuery = encodeURIComponent(query);
        
        switch(engine) {
            case 'search': // 百度
                return `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${encodedQuery}&cb=handleSuggestion`;
            case 'google': // Google
                return `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodedQuery}&callback=handleSuggestion`;
            case 'bing': // Bing
                return `https://api.bing.com/qsonhs.aspx?type=cb&q=${encodedQuery}&cb=handleSuggestion`;
            default:
                return null; // 其他搜索引擎不提供联想词
        }
    }
    
    // 获取搜索URL
    function getSearchUrl(query, engine) {
        const encodedQuery = encodeURIComponent(query);
        
        switch(engine) {
            case 'search': // 百度
                return `https://www.baidu.com/s?wd=${encodedQuery}`;
            case 'google': // Google
                return `https://www.google.com/search?q=${encodedQuery}`;
            case 'bing': // Bing
                return `https://cn.bing.com/search?q=${encodedQuery}`;
            default:
                return `https://xiaoyi.huawei.com/?q=${encodedQuery}`;
        }
    }
    
    // 防抖函数
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // 清理之前的script标签
    function cleanup() {
        if (currentScript && document.body.contains(currentScript)) {
            document.body.removeChild(currentScript);
            currentScript = null;
        }
    }
    
    // 显示错误信息
    function showError(message) {
        console.error('搜索建议错误:', message);
        oUl.innerHTML = '<li class="wei"><span class="a" style="color: #ff6b6b;">搜索建议暂时不可用</span></li>';
        oUl.style.display = 'block';
        
        // 3秒后自动隐藏错误提示
        setTimeout(() => {
            if (oUl.innerHTML.includes('搜索建议暂时不可用')) {
                oUl.style.display = 'none';
            }
        }, 3000);
    }
    
    // 处理输入事件（带防抖）
    const handleInput = debounce(function() {
        const value = this.value.trim();
        const currentEngine = getCurrentSearchEngine();
        cleanup();
        
        if (!value) {
            oUl.style.display = 'none';
            return;
        }
        
        // 检查是否支持联想词
        const apiUrl = getSuggestionApiUrl(value, currentEngine);
        if (!apiUrl) {
            oUl.style.display = 'none';
            return;
        }
        
        // 显示加载状态
        oUl.innerHTML = '<li class="wei"><span class="a" style="color: #aaa;">加载中...</span></li>';
        oUl.style.display = 'block';
        
        // 创建JSONP请求
        currentScript = document.createElement('script');
        currentScript.src = apiUrl;
        
        // 设置超时处理
        const timeoutId = setTimeout(() => {
            if (currentScript && document.body.contains(currentScript)) {
                showError('请求超时');
                cleanup();
            }
        }, 5000); // 5秒超时
        
        currentScript.onerror = function() {
            clearTimeout(timeoutId);
            showError('网络连接失败');
            cleanup();
        };
        
        document.body.appendChild(currentScript);
    }, 300); // 300ms防抖延迟
    
    // 处理结果点击
    function handleResultClick(e) {
        const target = e.target.closest('li');
        if (!target) return;
        
        const link = target.querySelector('a');
        if (link) {
            input.value = link.textContent;
            oUl.style.display = 'none';
            
            // 自动提交搜索
            const form = document.getElementById('super-search-fm');
            if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        }
    }
    
    // 全局回调函数
    window.handleSuggestion = function(data) {
        cleanup();
        
        if (!data) {
            showError('服务器返回数据格式错误');
            return;
        }
        
        const currentEngine = getCurrentSearchEngine();
        let suggestions = [];
        
        // 解析不同搜索引擎的返回数据
        switch(currentEngine) {
            case 'search': // 百度
                suggestions = data.s || [];
                break;
            case 'google': // Google
                suggestions = Array.isArray(data) && data.length > 1 ? data[1] : [];
                break;
            case 'bing': // Bing
                suggestions = data.AS && data.AS.Results && data.AS.Results.length > 0 
                    ? data.AS.Results[0].Suggests 
                        ? data.AS.Results[0].Suggests.map(s => s.Txt)
                        : []
                    : [];
                break;
            default:
                suggestions = [];
        }
        
        let str = '';
        
        if (suggestions.length > 0) {
            suggestions.forEach(function(ele) {
                if (ele && typeof ele === 'string') {
                    const searchUrl = getSearchUrl(ele, currentEngine);
                    str += '<li class="wei"><a class="a" href="' + searchUrl + 
                           '" target="_blank"><nobr>' + 
                           ele.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</nobr></a></li>';
                }
            });
            
            if (str) {
                oUl.innerHTML = str;
                oUl.style.display = 'block';
            } else {
                oUl.style.display = 'none';
            }
        } else {
            oUl.style.display = 'none';
        }
    };
    
    // 初始化事件监听
    input.addEventListener('input', handleInput);
    oUl.addEventListener('click', handleResultClick);
    
    // 输入框失去焦点时隐藏建议
    input.addEventListener('blur', function() {
        setTimeout(() => {
            oUl.style.display = 'none';
        }, 200);
    });
    
    // 输入框获得焦点时如果有内容，显示建议
    input.addEventListener('focus', function() {
        if (this.value.trim()) {
            handleInput.call(this);
        }
    });
    
    // 监听搜索引擎切换
    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // 切换搜索引擎时清空联想词
            oUl.style.display = 'none';
            cleanup();
            
            // 如果输入框有内容，重新获取联想词
            if (input.value.trim()) {
                handleInput.call(input);
            }
        });
    });
})();