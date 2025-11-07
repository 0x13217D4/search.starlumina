# 星芒起始页 (Star.Lumina)

> 最简洁的搜索导航，给你简单舒爽的搜索体验

## 🌟 项目简介

星芒起始页是一个简洁、美观、功能强大的浏览器起始页和导航网站。它集成了多种搜索引擎、快捷导航、个性化设置等功能，旨在为用户提供高效、舒适的上网体验。

## ✨ 主要特性

### 🔍 多引擎搜索
- **智能搜索**：支持小艺智能搜索、百度、Google、Bing等主流搜索引擎
- **分类搜索**：涵盖搜索、开发、社区等多个类别
- **搜索建议**：实时搜索建议，提升搜索效率
- **快捷键支持**：Ctrl+K 或 / 快速聚焦搜索框

### 🧭 快捷导航
- **分类导航**：邮箱、社交、影音、工具、开发、AI、购物等常用网站
- **自定义导航**：支持添加个人常用网站
- **图标美化**：使用Font Awesome图标，界面美观
- **响应式布局**：适配各种屏幕尺寸

### 🎨 个性化设置
- **主题切换**：支持浅色、深色、跟随系统三种主题模式
- **背景设置**：必应每日一图、自定义背景图片
- **链接打开方式**：可选择新标签页或当前标签页打开
- **设置持久化**：所有设置自动保存，下次访问保持不变

### 🚀 性能优化
- **懒加载**：图片和资源按需加载
- **缓存机制**：壁纸缓存，减少重复加载
- **防抖处理**：搜索输入防抖，提升性能
- **响应式设计**：完美适配桌面和移动设备

### 🎭 特殊效果
- **毛玻璃效果**：现代化的毛玻璃UI设计
- **平滑动画**：流畅的过渡和交互动画
- **特殊日期**：重要日期自动切换黑白模式
- **响应式布局**：自适应各种屏幕尺寸

## 📁 项目结构

```
1.0.6/
├── css/                    # 样式文件
│   ├── lazy-load.css      # 懒加载样式
│   ├── optimized.css       # 优化后的主样式
│   └── settings.css        # 设置页面样式
├── js/                     # JavaScript文件
│   ├── jquery.min.js       # jQuery库
│   ├── lazy-load.js        # 懒加载功能
│   ├── lianxiang.js        # 联想搜索
│   ├── navigation-loader.js # 导航加载器
│   ├── performance-optimizer.js # 性能优化器
│   ├── search-form.js      # 搜索表单处理
│   ├── settings-manager.js # 设置管理器
│   ├── storage-manager.js  # 存储管理器
│   ├── wallpaper-cache.js  # 壁纸缓存管理
│   └── xd.js              # 主脚本文件
├── json/                   # 配置文件
│   └── navigation.json     # 导航配置
├── 404.html               # 404错误页面
├── index.php              # 主页面文件
└── robots.txt             # 爬虫配置
```

## 🚀 快速开始

### 环境要求
- PHP 7.0+
- 现代浏览器（支持ES6+）

### 安装部署
1. 克隆或下载项目文件到服务器
2. 确保服务器支持PHP
3. 访问index.php即可使用

### 本地开发
```bash
# 使用PHP内置服务器
php -S localhost:8000

# 或使用其他Web服务器如Apache、Nginx
```

## 🔧 配置说明

### 导航配置
导航链接配置在 `json/navigation.json` 文件中：

```json
{
  "categories": [
    {
      "name": "分类名称",
      "items": [
        {
          "name": "网站名称",
          "url": "网站地址",
          "icon": "Font Awesome图标类",
          "color": "图标颜色"
        }
      ]
    }
  ]
}
```

### 搜索引擎配置
搜索引擎配置在 `index.php` 的搜索表单部分，可以添加或修改搜索引擎：

```html
<input type="radio" name="type" id="type-custom" value="搜索引擎URL" data-placeholder="提示文字" />
<label for="type-custom"><span>显示名称</span></label>
```

## 🎨 自定义主题

### CSS变量
项目使用CSS变量定义主题，可在 `css/optimized.css` 中修改：

```css
:root {
    --text-color: #ffffff;
    --bg-color: rgba(0, 0, 0, 0.5);
    --card-bg: rgba(30, 30, 30, 0.65);
    --accent-color: #29f;
    /* 更多变量... */
}
```

### 添加新主题
1. 在CSS中添加新的主题变量
2. 在设置管理器中添加主题选项
3. 实现主题切换逻辑

## 🔌 API接口

### Bing壁纸API
项目使用Bing壁纸API获取每日壁纸：

```php
$url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
```

### 搜索建议API
支持百度和Google搜索建议：

```javascript
// 百度搜索建议
https://suggestion.baidu.com/su?wd=关键词&json=1

// Google搜索建议
https://suggestqueries.google.com/complete/search?client=firefox&q=关键词
```

## 📱 浏览器支持

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 55+ | ✅ 完全支持 |
| Safari | 12+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 开发规范
1. 遵循现有的代码风格
2. 添加必要的注释
3. 确保响应式设计
4. 测试各种浏览器兼容性

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 📄 版本历史

### v1.0.6 (当前版本)
- 新增设置窗口：集成到首页，支持毛玻璃效果
- 优化导航布局：大屏幕显示更多网站
- 改进UI设计：统一毛玻璃风格
- 增强响应式：适配各种屏幕尺寸
- 性能优化：减少页面加载时间
- 用户体验：添加平滑动画和过渡效果

### 更早版本
- v1.0.5: 基础功能实现
- v1.0.4: 性能优化
- v1.0.3: UI改进
- v1.0.2: 响应式设计
- v1.0.1: 初始版本

## 📞 联系方式

- **官方网站**: https://www.starlumina.com/
- **作者**: 胡黄成霖
- **QQ群**: [官方QQ群链接](https://jq.qq.com/?_wv=1027&k=A6wxje1W)
- **博客**: [星芒博客](https://blog.starlumina.com/)
- **工具箱**: [星芒工具箱](https://tool.starlumina.com/)

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和服务：
- [Font Awesome](https://fontawesome.com/) - 图标库
- [jQuery](https://jquery.com/) - JavaScript库
- [Bing](https://www.bing.com/) - 壁纸API
- [百度](https://www.baidu.com/) - 搜索建议API
- [Google](https://www.google.com/) - 搜索建议API

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！