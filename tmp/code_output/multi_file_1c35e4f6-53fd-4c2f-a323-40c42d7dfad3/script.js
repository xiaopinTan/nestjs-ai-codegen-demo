// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动导航
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去导航栏高度
                    behavior: 'smooth'
                });
                
                // 更新活动导航项
                document.querySelectorAll('.main-nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // 滚动时更新活动导航项
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-section, .hero');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我们会尽快与您联系。');
            this.reset();
        });
    }

    // 移动端菜单切换（预留）
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    document.querySelector('.header .container').appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        const nav = document.querySelector('.main-nav ul');
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
});