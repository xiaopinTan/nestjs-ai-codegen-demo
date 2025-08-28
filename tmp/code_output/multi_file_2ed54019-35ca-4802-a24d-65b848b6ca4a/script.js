// 网站的交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 示例：在页面加载时显示欢迎信息
    const welcomeMessage = document.querySelector('.site-header h1');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
});