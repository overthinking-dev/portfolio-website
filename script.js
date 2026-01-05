// Лоадер
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Имитация загрузки
        setTimeout(() => {
            loader.classList.add('fade-out');
            // Показываем контент после начала анимации лоадера
            document.body.classList.add('loaded');
            // Удаляем лоадер после анимации
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500); // Показываем лоадер 1.5 секунды
    } else {
        // Если лоадера нет, сразу показываем контент
        document.body.classList.add('loaded');
    }
});

// Lazy Loading для изображений с поддержкой WebP
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const picture = entry.target.closest('picture');
            const img = entry.target;
            
            if (picture) {
                // Для picture элементов - обновляем source и img
                const source = picture.querySelector('source');
                if (source) {
                    source.srcset = source.srcset;
                }
                img.src = img.dataset.src;
            } else {
                // Для обычных img элементов
                img.src = img.dataset.src;
            }
            
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.01
});

// Наблюдаем за всеми изображениями с data-src
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Проверка поддержки WebP
function checkWebPSupport() {
    return new Promise(resolve => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Применение WebP оптимизации
checkWebPSupport().then(support => {
    if (!support) {
        // Если WebP не поддерживается, удаляем source элементы
        document.querySelectorAll('picture source[type="image/webp"]').forEach(source => {
            source.remove();
        });
    }
});

// Оптимизированный скролл с debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Оптимизированный параллакс эффект
const optimizedParallax = debounce(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-placeholder');
    
    if (hero && heroContent) {
        // Параллакс эффект
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.2}px) scale(${1 - scrolled * 0.0005})`;
        }
        
        // Fade-out эффект при скролле
        const fadeStart = 100;
        const fadeEnd = 500;
        const fadeRange = fadeEnd - fadeStart;
        
        if (scrolled > fadeStart) {
            const fadeProgress = Math.min((scrolled - fadeStart) / fadeRange, 1);
            const opacity = 1 - fadeProgress;
            const scale = 1 - fadeProgress * 0.1;
            
            hero.style.opacity = opacity;
            hero.style.transform = `translateY(${scrolled * 0.5}px) scale(${scale})`;
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = Math.max(opacity * 1.2, 0);
        } else {
            hero.style.opacity = 1;
        }
        
        // Блюр эффект при сильном скролле
        if (scrolled > 300) {
            const blurProgress = Math.min((scrolled - 300) / 200, 1);
            hero.style.filter = `blur(${blurProgress * 2}px)`;
        } else {
            hero.style.filter = 'none';
        }
    }
}, 16); // ~60fps

// Оптимизированное изменение навигации при скролле
const optimizedHeaderScroll = debounce(() => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (currentScroll > 100) {
        header.style.background = 'var(--nav-bg)';
        header.style.boxShadow = '0 2px 20px var(--shadow)';
    } else {
        header.style.background = 'var(--nav-bg)';
        header.style.boxShadow = 'none';
    }
}, 16);

// Используем requestAnimationFrame для плавной анимации
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

function updateScrollEffects() {
    optimizedParallax();
    optimizedHeaderScroll();
    ticking = false;
}

// Эффективный обработчик скролла
window.addEventListener('scroll', requestTick, { passive: true });

// Предзагрузка критических ресурсов
function preloadCriticalResources() {
    // Предзагружаем шрифты
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Irish+Grover&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
    
    // Предзагружаем WebP изображения для главной страницы
    const criticalImages = [
        'https://via.placeholder.com/400x300/6c757d/ffffff?text=Todo+App&format=webp',
        'https://via.placeholder.com/400x300/6c757d/ffffff?text=Weather+App&format=webp',
        'https://via.placeholder.com/400x300/6c757d/ffffff?text=E+Commerce&format=webp'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.type = 'image/webp';
        document.head.appendChild(link);
    });
}

// Оптимизация загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalResources();
    
    // Отложенная загрузка некритического JavaScript
    setTimeout(() => {
        // Инициализация некритичных функций
        initializeNonCriticalFeatures();
    }, 1000);
});

function initializeNonCriticalFeatures() {
    // Анимации при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами
    const animateElements = document.querySelectorAll('.info-card, .project-card, .skill-category');
    animateElements.forEach(el => observer.observe(el));
}

// SVG иконки анимации
function animateSVGIcons() {
    const svgIcons = document.querySelectorAll('.info-icon svg');
    
    svgIcons.forEach((icon, index) => {
        // Добавляем индивидуальную задержку для каждой иконки
        icon.style.animationDelay = `${index * 0.2}s`;
        
        // Добавляем интерактивность при наведении
        const card = icon.closest('.info-card');
        if (card) {
            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'translateY(-3px) scale(1.1) rotate(5deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                icon.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });
        }
    });
}

// Анимация аватара
function animateAvatar() {
    const avatar = document.querySelector('.avatar svg');
    if (avatar) {
        // Добавляем пульсирующую анимацию
        setInterval(() => {
            avatar.style.transform = 'scale(1.05)';
            setTimeout(() => {
                avatar.style.transform = 'scale(1)';
            }, 1000);
        }, 3000);
    }
}

// Ripple эффект для кнопок
function createRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Интерактивные карточки с параллакс эффектом
function addCardInteractions() {
    const cards = document.querySelectorAll('.info-card, .project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            this.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
        });
    });
}

// Анимация навыковых тегов при наведении
function animateSkillTags() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            // Создаем частицы
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('span');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = 'var(--accent)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.animation = `particleFloat 1s ease-out forwards`;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                this.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }
        });
    });
}

// CSS для частиц
const particleStyles = `
@keyframes particleFloat {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-20px) scale(0);
        opacity: 0;
    }
}
`;

// Добавляем стили частиц в head
if (!document.querySelector('#particle-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'particle-styles';
    styleSheet.textContent = particleStyles;
    document.head.appendChild(styleSheet);
}

// Кэширование DOM элементов
const domCache = {
    header: null,
    hero: null,
    heroContent: null,
    heroImage: null,
    
    init() {
        this.header = document.querySelector('.header');
        this.hero = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.heroImage = document.querySelector('.hero-image-placeholder');
    }
};

// Инициализация кэша
domCache.init();

// Мобильная навигация
function initMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    let isMenuOpen = false;
    
    // Открытие/закрытие меню
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.classList.add('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Фокус на первом элементе меню
        setTimeout(() => {
            const firstLink = mobileMenu.querySelector('.mobile-nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }, 100);
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Обработчики событий
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Закрытие меню при клике на ссылку
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Закрытие меню по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
            mobileMenuToggle.focus();
        }
    });
    
    // Предотвращение скролла внутри меню
    mobileMenu.addEventListener('touchmove', (e) => {
        if (mobileMenu.scrollHeight > mobileMenu.clientHeight) {
            e.stopPropagation();
        }
    }, { passive: false });
}

// Активная ссылка в мобильном меню
function setActiveMobileLink() {
    const currentPath = window.location.pathname;
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        
        if (linkPath === currentPath || 
            (currentPath === '/' && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });
}

// Вызываем все анимации после загрузки
window.addEventListener('load', () => {
    animateSVGIcons();
    animateAvatar();
    createRippleEffect();
    addCardInteractions();
    animateSkillTags();
    initMobileNavigation();
    setActiveMobileLink();
});

// Кнопка "Наверх"
const backToTopButton = document.getElementById('backToTop');

function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

// Плавная прокрутка наверх
function scrollToTop() {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    
    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / 500, 1); // 500ms duration
        
        const easeInOutCubic = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition * (1 - easeInOutCubic));
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

if (backToTopButton) {
    // Оптимизированный обработчик скролла для кнопки
    const optimizedToggleBackToTop = debounce(toggleBackToTopButton, 16);
    
    window.addEventListener('scroll', optimizedToggleBackToTop, { passive: true });
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Инициализация состояния кнопки
    toggleBackToTopButton();
}

// Инициализация темы
const html = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

// Проверка сохраненной темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Мобильное меню
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Анимации при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Наблюдаем за элементами
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.info-card, .project-card, .skill-category');
    animateElements.forEach(el => observer.observe(el));
});

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Параллакс эффект для hero секции с fade-out при скролле (уже оптимизирован выше)

// Анимация при загрузке страницы
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Анимация hero секции
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image-placeholder');
    
    if (heroTitle) heroTitle.style.animation = 'fadeInUp 0.8s ease forwards';
    if (heroSubtitle) heroSubtitle.style.animation = 'fadeInUp 0.8s ease 0.2s forwards';
    if (heroDescription) heroDescription.style.animation = 'fadeInUp 0.8s ease 0.4s forwards';
    if (heroButtons) heroButtons.style.animation = 'fadeInUp 0.8s ease 0.6s forwards';
    if (heroImage) heroImage.style.animation = 'fadeInScale 0.8s ease 0.8s forwards';
});

// Микроанимации для кнопок
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    button.addEventListener('click', function(e) {
        // Создаем ripple эффект
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Интерактивные карточки проектов
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Анимация навыков при наведении
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Изменение навигации при скролле (уже оптимизировано выше)

// Плавное появление элементов
const fadeInElements = document.querySelectorAll('.info-card, .project-card, .skill-category');

fadeInElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elementObserver.observe(element);
});

// Данные о проектах для модального окна
const projectsData = {
    1: {
        title: "Todo Application",
        tags: ["HTML/CSS", "JavaScript"],
        description: "Это был мой первый серьезный проект, где я научился работать с DOM элементами и локальным хранилищем. Приложение позволяет создавать, редактировать и удалять задачи, а также сохранять их в браузере пользователя. Проект помог мне понять основы JavaScript и работу с событиями.",
        tech: ["HTML5", "CSS3", "Vanilla JavaScript", "LocalStorage", "DOM Manipulation"],
        image: "https://via.placeholder.com/600x400/6c757d/ffffff?text=Todo+App+Screenshot",
        demo: "#",
        github: "https://github.com/yourusername/todo-app"
    },
    2: {
        title: "Weather Application",
        tags: ["API", "JavaScript"],
        description: "Приложение для получения данных о погоде из внешнего API. Я научился работать с асинхронными запросами, обрабатывать JSON данные и создавать динамический интерфейс. Приложение определяет геолокацию пользователя и показывает актуальную погоду.",
        tech: ["HTML5", "CSS3", "JavaScript", "Fetch API", "OpenWeather API", "Geolocation API"],
        image: "https://via.placeholder.com/600x400/6c757d/ffffff?text=Weather+App+Screenshot",
        demo: "#",
        github: "https://github.com/yourusername/weather-app"
    },
    3: {
        title: "Blog API",
        tags: ["Node.js", "API"],
        description: "Мой первый опыт создания backend части приложения. Я разработал RESTful API для блога с полной функциональностью CRUD операций. Проект включал работу с базой данных, аутентификацию и валидацию данных.",
        tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST API", "JWT"],
        image: "https://via.placeholder.com/600x400/6c757d/ffffff?text=Blog+API+Structure",
        demo: "#",
        github: "https://github.com/yourusername/blog-api"
    },
    4: {
        title: "E-Commerce Mini",
        tags: ["Full Stack", "React"],
        description: "Самый амбициозный проект на данный момент. Я создал упрощенный интернет-магазин с frontend на React и backend на Node.js. Проект включал корзину покупок, систему аутентификации и админ-панель для управления товарами.",
        tech: ["React (изучаю)", "Node.js", "Express.js", "MongoDB", "Redux", "JWT"],
        image: "https://via.placeholder.com/600x400/6c757d/ffffff?text=E+Commerce+Platform",
        demo: "#",
        github: "https://github.com/yourusername/ecommerce-mini"
    },
    5: {
        title: "Portfolio Website",
        tags: ["Portfolio", "Responsive"],
        description: "Этот самый сайт-портфолио, который ты сейчас смотришь! Я создал его с нуля, уделяя особое внимание адаптивному дизайну, современным CSS техникам и интерактивным элементам. Проект стал отличной практикой для улучшения навыков верстки.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "CSS Grid", "Flexbox", "Animations"],
        image: "https://via.placeholder.com/600x400/6c757d/ffffff?text=Portfolio+Website",
        demo: "#",
        github: "https://github.com/yourusername/portfolio"
    }
};

// Фильтрация проектов
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Модальное окно проекта
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const projectViewBtns = document.querySelectorAll('.project-view-btn');

function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
    // Заполняем модальное окно данными
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalDemo').href = project.demo;
    document.getElementById('modalGithub').href = project.github;
    
    // Заполняем теги
    const modalTags = document.getElementById('modalTags');
    modalTags.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'project-tag';
        tagElement.textContent = tag;
        modalTags.appendChild(tagElement);
    });
    
    // Заполняем технологии
    const modalTech = document.getElementById('modalTech');
    modalTech.innerHTML = '';
    project.tech.forEach(tech => {
        const techElement = document.createElement('span');
        techElement.className = 'tech-item';
        techElement.textContent = tech;
        modalTech.appendChild(techElement);
    });
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (projectViewBtns.length > 0) {
    projectViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Закрытие модального окна по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Функциональность формы обратной связи
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Простая валидация
        if (!data.name || !data.email || !data.message) {
            showFormStatus('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormStatus('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }
        
        // Имитация отправки формы
        showFormStatus('Отправка сообщения...', 'success');
        
        setTimeout(() => {
            // Здесь должна быть реальная отправка на сервер
            console.log('Данные формы:', data);
            
            showFormStatus('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            contactForm.reset();
        }, 1500);
    });
}

function showFormStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
}

// FAQ функциональность
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем другие открытые FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий FAQ
            item.classList.toggle('active');
        });
    });
}

// Анимация элементов при скролле для страницы контактов
const contactElements = document.querySelectorAll('.contact-card, .social-card, .faq-item');
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

contactElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    contactObserver.observe(element);
});

// Анимация навыков при скролле
const skillBars = document.querySelectorAll('.skill-progress');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBar = entry.target;
            const width = skillBar.style.width;
            skillBar.style.width = '0';
            setTimeout(() => {
                skillBar.style.width = width;
            }, 100);
            skillsObserver.unobserve(skillBar);
        }
    });
}, { threshold: 0.5 });

if (skillBars.length > 0) {
    skillBars.forEach(bar => skillsObserver.observe(bar));
}

// Анимация элементов при скролле для страницы "Обо мне"
const aboutElements = document.querySelectorAll('.highlight-item, .timeline-item, .interest-card');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

aboutElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    aboutObserver.observe(element);
});

// Анимация статистики при скролле
const statsNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalNumber = target.textContent;
            
            // Анимация только для чисел, не для символов
            if (!isNaN(parseInt(finalNumber))) {
                const number = parseInt(finalNumber);
                let currentNumber = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= number) {
                        currentNumber = number;
                        clearInterval(timer);
                    }
                    target.textContent = Math.floor(currentNumber) + '+';
                }, 30);
            }
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statsNumbers.forEach(stat => statsObserver.observe(stat));

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background: var(--nav-bg);
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 10px 30px var(--shadow);
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    body.loaded .hero-title,
    body.loaded .hero-subtitle,
    body.loaded .hero-description,
    body.loaded .hero-buttons,
    body.loaded .hero-image-placeholder {
        opacity: 1;
    }
    
    .project-item {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;

document.head.appendChild(style);
