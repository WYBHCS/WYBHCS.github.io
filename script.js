document.addEventListener('DOMContentLoaded', function() {
    // 导航切换功能
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活跃状态
            navItems.forEach(i => i.classList.remove('active'));
            contentSections.forEach(s => s.classList.add('hidden'));
            
            // 添加当前活跃状态
            this.classList.add('active');
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
    
    // 初始化轮播图
    initCarousel();
    
    // 初始化图片懒加载
    initLazyLoad();
    
    // 预加载图片
    preloadImages();
});

// 初始化轮播图
function initCarousel() {
    const carousel = document.getElementById('carousel');
    const slidesContainer = carousel.querySelector('.carousel-slides');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // 轮播图片列表
    const images = [
        { src: '/1.jpg', alt: '招商图片' },
        { src: '/2.jpg', alt: '经营理念' },
        { src: '/3.jpg', alt: '烘焙区' },
        { src: '/4.jpg', alt: '水产区' },
        { src: '/5.jpg', alt: '生鲜区' },
        { src: '/6.jpg', alt: '就餐区' }
    ];
    
    // 动态创建轮播项和指示器
    images.forEach((img, index) => {
        // 创建轮播项
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img data-src="${img.src}" alt="${img.alt}" class="lazy-load">`;
        slidesContainer.appendChild(slide);
        
        // 创建指示器
        const indicator = document.createElement('button');
        indicator.addEventListener('click', () => goToSlide(index));
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
    });
    
    let currentIndex = 0;
    const slideCount = images.length;
    let interval;
    
    // 轮播控制函数
    function goToSlide(index) {
        currentIndex = index;
        updateSlidePosition();
        updateIndicators();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlidePosition();
        updateIndicators();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlidePosition();
        updateIndicators();
    }
    
    function updateSlidePosition() {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('button');
        indicators.forEach((ind, i) => {
            if (i === currentIndex) ind.classList.add('active');
            else ind.classList.remove('active');
        });
    }
    
    // 自动轮播
    function startInterval() {
        interval = setInterval(nextSlide, 5000);
    }
    
    function stopInterval() {
        clearInterval(interval);
    }
    
    // 事件监听
    prevBtn.addEventListener('click', () => { stopInterval(); prevSlide(); startInterval(); });
    nextBtn.addEventListener('click', () => { stopInterval(); nextSlide(); startInterval(); });
    carousel.addEventListener('mouseenter', stopInterval);
    carousel.addEventListener('mouseleave', startInterval);
    
    // 开始自动轮播
    startInterval();
}

// 图片懒加载
function initLazyLoad() {
    window.addEventListener('scroll', throttle(lazyLoadImages, 200));
    lazyLoadImages();
}

// 懒加载执行函数
function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(img => {
        if (isInViewport(img) && !img.src.includes(img.getAttribute('data-src'))) {
            img.src = img.getAttribute('data-src');
            img.onload = () => img.classList.remove('lazy-load');
        }
    });
}

// 预加载图片
function preloadImages() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
            preloadImg.onload = () => {
                if (isInViewport(img)) {
                    img.src = src;
                    img.classList.remove('lazy-load');
                }
            };
        }
    });
}

// 检查元素是否在视口内
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// 节流函数
function throttle(func, delay) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            func.apply(this, args);
        }
    };
}