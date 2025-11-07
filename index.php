<!DOCTYPE html>
<html lang="zh-CN">
 <head> 
 <style>
        /* 设置整个页面的背景色为黑色 */
        body {
            background-color: black;
            margin: 0;
            padding: 0;
        }
    </style>
 <script>
    // 初始化主题设置
    (function() {
        var theme = localStorage.getItem('theme') || 'auto';
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
        
        // 初始化背景设置
        document.addEventListener('DOMContentLoaded', function() {
            var backgroundType = localStorage.getItem('backgroundType') || 'bing';
            
            // 完整的壁纸应用逻辑
            if (backgroundType === 'bing') {
                // 使用壁纸缓存管理
                const cachedWallpaper = localStorage.getItem('wallpaperCache');
                if (cachedWallpaper) {
                    const { date, url } = JSON.parse(cachedWallpaper);
                    const today = new Date().toDateString();
                    if (date === today) {
                        document.querySelector('.bgo').style.background = `url(${url})`;
                        document.querySelector('.bgo').style.backgroundSize = 'cover';
                        document.body.style.backgroundImage = `url(${url})`;
                    }
                } else {
                    // 如果没有缓存，使用PHP获取的Bing壁纸
                    document.querySelector('.bgo').style.background = `url('<?php echo $imgurl; ?>')`;
                    document.querySelector('.bgo').style.backgroundSize = 'cover';
                    document.body.style.backgroundImage = `url('<?php echo $imgurl; ?>')`;
                }
            } else if (backgroundType === 'custom') {
                var customBgUrl = localStorage.getItem('customBackgroundUrl');
                if (customBgUrl) {
                    document.querySelector('.bgo').style.background = 'url(' + customBgUrl + ')';
                    document.querySelector('.bgo').style.backgroundSize = 'cover';
                    document.body.style.backgroundImage = 'url(' + customBgUrl + ')';
                }
            }
            
        // 初始化链接打开方式
        var linkTarget = localStorage.getItem('linkTarget') || '_blank';
        // 应用链接打开方式到所有外部链接
        document.querySelectorAll('a').forEach(function(link) {
            var href = link.getAttribute('href');
            if (href && !href.startsWith('/') && !href.startsWith('#')) { // 不修改内部链接和锚点链接
                link.setAttribute('target', linkTarget);
            }
        });
        });
    })();
 </script>
  <meta charset="UTF-8" /> 
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" /> 
  <meta http-equiv="Cache-Control" content="no-siteapp" /> 
  <meta name="apple-mobile-web-app-capable" content="yes" /> 
  <meta name="apple-touch-fullscreen" content="yes" /> 
  <meta name="apple-mobile-web-app-status-bar-style" content="black" /> 
  <meta name="msvalidate.01" content="E6A585911EAC904DB98EFD927873E636" />
  <meta name="full-screen" content="yes" />
  <!--UC强制全屏--> 
  <meta name="browsermode" content="application" />
  <!--UC应用模式--> 
  <meta name="x5-fullscreen" content="true" />
  <!--QQ强制全屏--> 
  <meta name="x5-page-mode" content="app" />
  <!--QQ应用模式--> 
  <title>星芒起始页 - Star.Lumina</title> 
  <meta name="keywords" content="星芒导航,星芒搜索,星芒搜索导航,星芒,星芒起始页,起始页,搜索导航,首页,浏览器首页,百度,谷歌,谷歌搜索,必应,starlumina.com,快捷导航,浏览器,星芒浏览器">
  <meta name="description" content="最简洁的搜索导航，给你简单舒爽的搜索体验。">
    <link rel="shortcut icon" href="https://vip.123pan.cn/1832150722/yk6baz03t0n000d7w33gzr20dllunnpiDIYwDqeyDdUvDpxPAdDxDF==.png" type="image/x-icon" /> 
    <link href="/css/optimized.css" rel="stylesheet" /> 
    <link href="/css/lazy-load.css" rel="stylesheet" /> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <script src="/js/jquery.min.js"></script> 
  <script src="/js/xd.js" defer async onerror="console.error('Failed to load xd.js')"></script>
  <script src="/js/lazy-load.js" defer></script>
  <script src="/js/wallpaper-cache.js" defer></script>
  <script src="/js/storage-manager.js" defer></script>
  <script src="/js/search-form.js" defer></script>
  <script src="/js/navigation-loader.js" defer></script>
  <script src="/js/settings-manager.js" defer></script>

 </head> 
<?php
// 获取当日Bing壁纸URL
$url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$resp = curl_exec($curl);
curl_close($curl);
$array = json_decode($resp);
$imgurl = 'https://cn.bing.com'.$array->{"images"}[0]->{"urlbase"}.'_1920x1080.jpg';
?>
 <body style="background-size: cover; background-position: center; background-attachment: fixed;"> 

  <div id="settings-btn">
   <i class="fas fa-cog"></i>
  </div>
  <div id="menu">
   <div class="windows-icon">
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
    <div class="square"></div>
   </div>
  </div>
  <!-- 中间大窗口导航面板 -->
  <div class="navigation-modal" id="navigation-modal">
    <div class="navigation-content">
      <div class="navigation-header">
        <h3>快捷导航</h3>
        <button class="close-btn" id="close-navigation">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="navigation-body">
        <ul id="navigation-menu"></ul>
      </div>
    </div>
  </div>
  <!-- 遮罩层 -->
  <div class="modal-overlay" id="modal-overlay"></div>
  
  <!-- 设置窗口 -->
  <div class="settings-modal" id="settings-modal">
    <div class="settings-content">
      <div class="settings-header">
        <h3>系统设置</h3>
        <button class="close-btn" id="close-settings">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="settings-body">
        <!-- 主题设置 -->
        <div class="settings-section">
          <h4>主题设置</h4>
          <div class="radio-group">
            <label>
              <input type="radio" name="theme" value="light" id="lightTheme">
              <span>浅色模式</span>
            </label>
            <label>
              <input type="radio" name="theme" value="dark" id="darkTheme">
              <span>深色模式</span>
            </label>
            <label>
              <input type="radio" name="theme" value="auto" id="autoTheme">
              <span>跟随系统</span>
            </label>
          </div>
        </div>

        <!-- 链接打开方式 -->
        <div class="settings-section">
          <h4>链接打开方式</h4>
          <div class="radio-group">
            <label>
              <input type="radio" name="linkTarget" value="_blank" id="newTabOption">
              <span>新标签页打开</span>
            </label>
            <label>
              <input type="radio" name="linkTarget" value="_self" id="sameTabOption">
              <span>当前标签页打开</span>
            </label>
          </div>
        </div>

        <!-- 背景设置 -->
        <div class="settings-section">
          <h4>背景设置</h4>
          <div class="radio-group">
            <label>
              <input type="radio" name="background" value="bing" id="bingBackground">
              <span>必应每日一图</span>
            </label>
            <label>
              <input type="radio" name="background" value="custom" id="customBackground">
              <span>自定义背景</span>
            </label>
          </div>
          <div id="customBackgroundOptions" style="display: none;">
            <input type="text" id="backgroundUrlInput" placeholder="输入图片URL">
            <button id="uploadBackgroundBtn">上传图片</button>
            <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp">
            <div class="background-preview" id="backgroundPreview"></div>
          </div>
        </div>

        <!-- 设置按钮 -->
        <div class="settings-section">
          <div class="settings-buttons">
            <button id="saveSettings" class="settings-btn save-btn">保存设置</button>
            <button id="resetSettings" class="settings-btn reset-btn">恢复默认</button>
          </div>
        </div>

        <!-- 版本信息 -->
        <div class="settings-section">
          <h4>版本信息</h4>
          <div class="version-info" id="versionInfo">当前版本: <span id="currentVersion">加载中...</span></div>
        </div>
      </div>
    </div>
  </div>
  <div id="search" class="s-search">
   <div id="search-list" class="hide-type-list">
    <div class="s-type">
     <span></span>
     <div class="s-type-list animated fadeInUp">
      <label for="type-search">搜索</label>
      <label for="type-GitHub">开发</label>
      <label for="type-zhihu">社区</label>
     </div>
    </div>
    <div class="search-group group-a">
     <span class="type-text">搜索</span>
     <ul class="search-type">
      <li><input hidden="" type="radio" name="type" id="type-xiaoyi" value="https://xiaoyi.huawei.com/?q=" data-placeholder="小艺智能搜索" checked /><label for="type-xiaoyi"><span style="color: #ffffff;">小艺</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-search" value="https://www.baidu.com/s?wd=" data-placeholder="百度一下" /><label for="type-search"><span>百度</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-google" value="https://www.google.com/search?q=" data-placeholder="谷歌搜索" /><label for="type-google"><span>Google</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-bing" value="https://cn.bing.com/search?q=" data-placeholder="微软Bing搜索" /><label for="type-bing"><span>Bing</span></label></li>
     </ul>
    </div>
    <div class="search-group group-b">
     <span class="type-text">开发</span>
     <ul class="search-type">
      <li><input hidden="" type="radio" name="type" id="type-GitHub" value="https://github.com/search?q=" data-placeholder="GitHub" /><label for="type-GitHub"><span>GitHub</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-gitee" value="https://so.gitee.com/?q=" data-placeholder="gitee" /><label for="type-gitee"><span>gitee</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-CSDN" value="https://so.csdn.net/so/search?q=" data-placeholder="CSDN" /><label for="type-CSDN"><span>CSDN</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-ping" value="https://ping.pe/" data-placeholder="请输入网址" /><label for="type-ping"><span>Ping</span></label></li>

     </ul>
    </div>
    <div class="search-group group-c">
     <span class="type-text">社区</span>
     <ul class="search-type">
      <li><input hidden="" type="radio" name="type" id="type-zhihu" value="https://www.zhihu.com/search?type=content&amp;q=" data-placeholder="知乎" /><label for="type-zhihu"><span>知乎</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-weibo" value="http://s.weibo.com/weibo/" data-placeholder="微博" /><label for="type-weibo"><span>微博</span></label></li>
      <li><input hidden="" type="radio" name="type" id="type-快递100" value="http://www.kuaidi100.com/?" data-placeholder="快递100" /><label for="type-快递100"><span>快递100</span></label></li>
    <li><input hidden="" type="radio" name="type" id="type-bili" value="https://search.bilibili.com/all?keyword=" data-placeholder="请输入在Bilibili上想搜索关键词" /><label for="type-bili"><span>哔哩哔哩</span></label></li>
     </ul>
    </div>
   </div>
   <form action="https://xiaoyi.huawei.com/?q=" method="get" target="_blank" id="super-search-fm">
    <input type="text" id="search-text" placeholder="输入关键字搜索" style="outline:0" />
    <button type="submit"><i class="fas fa-search"></i></button>
    <ul id="ul" class="ko"></ul>
   </form>
   <div class="set-check hidden-xs">
    <input type="checkbox" id="set-search-blank" class="bubble-3" autocomplete="off" />
   </div>
  </div> 
  <script type="text/javascript" src="/js/sousuo.js"></script> 
  <script type="text/javascript" src="/js/lianxiang.js"></script> 
 <div class="bgo"></div> 
 <?php 
 $currentYear = date('Y');
 ?>
 <div style="position: fixed;width: 100%;height: 30px;line-height: 30px;bottom: 0;left: 0;text-align: center;">
            <a><?php echo $currentYear; ?></a>
            <a style="color: #fff;">Made by&nbsp;&copy</a>
            <a style="color: #fff;" href="https://starlumina.com/">胡黄成霖</a>
			<a style="color: #fff;" href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024095899号-3</a>
			<img class="logos" src="https://vip.123pan.cn/1832150722/ymjew503t0l000d7w32xfcwa742s0k5lDIYwDqeyDdUvDpxPAdDxDF==.png"  width="15" height="15" >
			<a style="color: #fff;" href="https://beian.mps.gov.cn/#/query/webSearch?code=51019002007728" rel="noreferrer" target="_blank"> 川公网安备51019002007728号</a>
			</div>
 </body>




<script>

	
	function setCookie(name, value, liveMinutes) {
		if (liveMinutes == undefined || liveMinutes == null) {
			liveMinutes = 60 * 2;
		}
		if (typeof (liveMinutes) != 'number') {
			liveMinutes = 60 * 2;//默认120分钟
		}
		var minutes = liveMinutes * 60 * 1000;
		var exp = new Date();
		exp.setTime(exp.getTime() + minutes + 8 * 3600 * 1000);
		//path=/表示全站有效，而不是当前页
		document.cookie = name + "=" + value + ";path=/;expires=" + exp.toUTCString();
	}

	
</script>


<style>
        /* 默认样式 */
        body {
            color: white;
            background-color: white;
        }

        /* 黑白样式 */
        .grayscale {
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
            -moz-filter: grayscale(100%);
            -ms-filter: grayscale(100%);
            -o-filter: grayscale(100%);
        }
    </style>
<script>
        // 获取当前日期
        const today = new Date();
        const month = today.getMonth() + 1; // 月份从0开始，所以要加1
        const day = today.getDate();

        // 指定日期
        const specialDates = [
            { month: 5, day: 12 },  // 5月12日
            { month: 9, day: 18 },  // 9月18日
            { month: 12, day: 13 }  // 12月13日
        ];

        // 检查当前日期是否为指定日期
        const isSpecialDate = specialDates.some(date => date.month === month && date.day === day);

        // 如果是指定日期，应用黑白样式
        if (isSpecialDate) {
            document.body.classList.add('grayscale');
        }
    </script>
    
    
  <script>
// 壁纸缓存管理
function manageWallpaper(imgUrl) {
    const today = new Date().toDateString();
    const cached = localStorage.getItem('wallpaperCache');
    
    // 如果有缓存且未过期(当天00:00前)，使用缓存
    if (cached) {
        const { date, url } = JSON.parse(cached);
        if (date === today) {
            applyWallpaper(url);
            return; // 使用缓存，不继续下载
        }
    }
    
    // 下载并缓存新壁纸
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function() {
                const wallpaperUrl = this.result;
                localStorage.setItem('wallpaperCache', JSON.stringify({
                    date: today,
                    url: wallpaperUrl
                }));
                applyWallpaper(wallpaperUrl);
            }
            reader.readAsDataURL(blob);
        });
}

function applyWallpaper(url) {
    const wallpaperElement = document.querySelector('.bgo');
    wallpaperElement.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundImage = `url('${url}')`;
}

// 初始化壁纸
const wallpaperElement = document.querySelector('.bgo');
const img = new Image();
img.onload = function() {
    wallpaperElement.classList.add('loaded');
    manageWallpaper('<?php echo $imgurl; ?>');
};
img.onerror = function() {
    console.log('背景图片加载失败，使用备用背景');
    wallpaperElement.classList.add('loaded');
};
img.src = '<?php echo $imgurl; ?>';

// 每日检查更新
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() < 1) {
        manageWallpaper('<?php echo $imgurl; ?>');
    }
}, 60000); // 每分钟检查一次

// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?31f85df8d6bbcc62ef282c2b4a5340f5";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
