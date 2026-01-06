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

// GitHub Projects Loader
class GitHubProjectsLoader {
    constructor() {
        this.username = 'overthinking-dev';
        this.container = document.getElementById('githubProjects');
        this.init();
    }

    async init() {
        if (!this.container) return;
        
        try {
            const repos = await this.fetchRepositories();
            this.displayProjects(repos);
        } catch (error) {
            this.displayError(error);
        }
    }

    async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=10`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить проекты с GitHub');
        }
        return await response.json();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // Приводим обе даты к UTC для корректного сравнения
        const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = Math.abs(nowUTC - dateUTC);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'сегодня';
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`;
        return `${Math.floor(diffDays / 365)} лет назад`;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'C++': '#f34b7d',
            'C': '#555555',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'Shell': '#89e051',
            'Vue': '#41b883',
            'React': '#61dafb'
        };
        return colors[language] || '#858585';
    }

    createProjectCard(repo) {
        const language = repo.language || 'Unknown';
        const languageColor = this.getLanguageColor(language);
        const updatedAt = this.formatDate(repo.updated_at);
        
        return `
            <div class="github-project">
                <div class="github-project-header">
                    <a href="${repo.html_url}" class="github-project-title" target="_blank">
                        ${repo.name}
                    </a>
                    <span class="github-project-date">${updatedAt}</span>
                </div>
                <p class="github-project-description">
                    ${repo.description || 'Описание отсутствует'}
                </p>
                <div class="github-project-meta">
                    <div class="github-project-language">
                        <span class="language-dot" style="background: ${languageColor}"></span>
                        <span>${language}</span>
                    </div>
                    <div class="github-project-stars">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                </div>
                <a href="${repo.html_url}" class="github-project-link" target="_blank">
                    Посмотреть на GitHub →
                </a>
            </div>
        `;
    }

    displayProjects(repos) {
        // Фильтруем репозитории (исключаем форки и слишком старые)
        const filteredRepos = repos.filter(repo => 
            !repo.fork && 
            !repo.archived && 
            repo.name !== this.username
        ).slice(0, 3);

        if (filteredRepos.length === 0) {
            this.displayEmpty();
            return;
        }

        const projectsHTML = filteredRepos.map(repo => this.createProjectCard(repo)).join('');
        this.container.innerHTML = `
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        `;
    }

    displayEmpty() {
        this.container.innerHTML = `
            <div class="loading-spinner">
                <p>Проекты не найдены. <a href="https://github.com/${this.username}" target="_blank">Посмотреть на GitHub</a></p>
            </div>
        `;
    }

    displayError(error) {
        console.error('GitHub Projects Error:', error);
        this.container.innerHTML = `
            <div class="loading-spinner">
                <p>Не удалось загрузить проекты. <a href="https://github.com/${this.username}" target="_blank">Посмотреть на GitHub</a></p>
            </div>
        `;
    }
}

// GitHub Projects Gallery Loader
class GitHubProjectsGalleryLoader {
    constructor() {
        this.username = 'overthinking-dev';
        this.container = document.getElementById('githubProjectsGallery');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projects = [];
        this.activeFilter = 'all';
        
        console.log('GitHubProjectsGalleryLoader конструктор:');
        console.log('Контейнер:', this.container);
        console.log('Фильтры:', this.filterButtons.length);
        
        this.init();
    }

    async init() {
        console.log('Начинаем инициализацию...');
        
        try {
            console.log('Загружаем репозитории...');
            const repos = await this.fetchRepositories();
            console.log('Репозитории загружены:', repos.length);
            
            this.projects = repos;
            
            // Создаем динамические фильтры
            console.log('Создаем динамические фильтры...');
            this.createDynamicFilters(this.projects);
            
            console.log('Отображаем проекты...');
            this.displayProjects(this.projects);
            
            console.log('Обновляем статистику...');
            this.updateStats();
            
        } catch (error) {
            console.error('Ошибка при инициализации:', error);
            this.displayError(error);
        }
    }

    async fetchRepositories() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=50`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить проекты с GitHub');
        }
        const repos = await response.json();
        
        console.log('Загружено репозиториев:', repos.length);
        
        // Загружаем темы для каждого репозитория (без анализа файлов для скорости)
        const reposWithTopics = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const topicsResponse = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/topics`);
                    if (topicsResponse.ok) {
                        const topics = await topicsResponse.json();
                        repo.topics = topics;
                    } else {
                        repo.topics = [];
                    }
                } catch (error) {
                    repo.topics = [];
                }
                return repo;
            })
        );
        
        console.log('Репозитории с темами:', reposWithTopics.length);
        return reposWithTopics;
    }

    // Глубокий анализ структуры проекта
    async analyzeRepository(repo) {
        const analysis = {
            hasPackageJson: false,
            hasDiscordFiles: false,
            hasFigmaFiles: false,
            hasApiRoutes: false,
            hasFrontendFiles: false,
            fileStructure: []
        };
        
        try {
            // 1. Проверяем package.json
            const packageJson = await this.fetchFile(repo, 'package.json');
            if (packageJson) {
                analysis.hasPackageJson = true;
                const deps = JSON.parse(packageJson);
                analysis.dependencies = deps.dependencies || {};
            }
            
            // 2. Проверяем структуру файлов
            const contents = await this.fetchContents(repo);
            analysis.fileStructure = this.analyzeFileStructure(contents);
            
            // 3. Определяем тип проекта
            analysis.projectType = this.determineProjectType(analysis);
            
        } catch (error) {
            console.log('Не удалось проанализировать репозиторий:', repo.name);
        }
        
        return analysis;
    }

    async fetchFile(repo, filename) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/contents/${filename}`);
            if (response.ok) {
                const file = await response.json();
                return atob(file.content);
            }
        } catch (error) {
            console.log('Не удалось загрузить файл:', filename);
        }
        return null;
    }

    async fetchContents(repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.username}/${repo.name}/contents`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Не удалось загрузить содержимое репозитория:', repo.name);
        }
        return [];
    }

    analyzeFileStructure(contents) {
        const structure = {
            hasIndexHtml: false,
            hasAppJs: false,
            hasServerJs: false,
            hasRoutes: false,
            hasComponents: false,
            hasPublic: false,
            hasSrc: false,
            hasFigmaFiles: false,
            hasDiscordFiles: false
        };

        contents.forEach(item => {
            const name = item.name.toLowerCase();
            
            if (name === 'index.html') structure.hasIndexHtml = true;
            if (name === 'app.js' || name === 'main.js') structure.hasAppJs = true;
            if (name === 'server.js' || name === 'app.js') structure.hasServerJs = true;
            if (name === 'routes' || name === 'api') structure.hasRoutes = true;
            if (name === 'components' || name === 'src') structure.hasComponents = true;
            if (name === 'public' || name === 'dist') structure.hasPublic = true;
            if (name === 'src') structure.hasSrc = true;
            
            if (name.includes('figma') || name.includes('.fig')) structure.hasFigmaFiles = true;
            if (name.includes('discord') || name.includes('bot')) structure.hasDiscordFiles = true;
        });

        return structure;
    }

    determineProjectType(analysis) {
        const { fileStructure, dependencies, hasPackageJson } = analysis;
        
        // Discord бот
        if (this.hasDiscordDependencies(dependencies) || 
            this.hasDiscordFiles(fileStructure)) {
            return 'discord';
        }
        
        // Дизайн проект
        if (this.hasFigmaFiles(fileStructure) || 
            this.hasDesignFiles(fileStructure)) {
            return 'design';
        }
        
        // Backend API
        if (this.hasApiStructure(fileStructure) || 
            this.hasBackendDependencies(dependencies)) {
            return 'backend';
        }
        
        // Full Stack
        if (this.hasFullStackStructure(fileStructure)) {
            return 'fullstack';
        }
        
        // Frontend
        if (this.hasFrontendStructure(fileStructure)) {
            return 'frontend';
        }
        
        return 'other'; // Новая категория для уникальных проектов
    }

    hasDiscordDependencies(dependencies) {
        if (!dependencies) return false;
        return Object.keys(dependencies).some(dep => 
            dep.includes('discord') || dep.includes('discord.js') || dep.includes('discord.py')
        );
    }

    hasDiscordFiles(fileStructure) {
        return fileStructure.hasDiscordFiles;
    }

    hasFigmaFiles(fileStructure) {
        return fileStructure.hasFigmaFiles;
    }

    hasDesignFiles(fileStructure) {
        return fileStructure.hasFigmaFiles || 
               fileStructure.hasComponents;
    }

    hasApiStructure(fileStructure) {
        return fileStructure.hasRoutes || fileStructure.hasServerJs;
    }

    hasBackendDependencies(dependencies) {
        if (!dependencies) return false;
        return Object.keys(dependencies).some(dep => 
            dep.includes('express') || dep.includes('fastify') || 
            dep.includes('koa') || dep.includes('nestjs')
        );
    }

    hasFullStackStructure(fileStructure) {
        return (fileStructure.hasIndexHtml || fileStructure.hasPublic) && 
               (fileStructure.hasServerJs || fileStructure.hasRoutes);
    }

    hasFrontendStructure(fileStructure) {
        return fileStructure.hasIndexHtml || 
               fileStructure.hasComponents || 
               fileStructure.hasPublic ||
               fileStructure.hasSrc;
    }

    createDynamicFilters(repos) {
        const categories = new Set();
        const categoryInfo = {};
        
        repos.forEach(repo => {
            const category = this.getCategory(repo);
            categories.add(category);
            
            if (!categoryInfo[category]) {
                categoryInfo[category] = {
                    name: this.getCategoryDisplayName(category),
                    icon: this.getCategoryIcon(category),
                    count: 0
                };
            }
            categoryInfo[category].count++;
        });
        
        // Создаем фильтры динамически
        this.renderDynamicFilters(Array.from(categories), categoryInfo);
    }

    getCategoryDisplayName(category) {
        const names = {
            'discord': 'Discord Боты',
            'design': 'Дизайн',
            'backend': 'Backend',
            'frontend': 'Frontend',
            'fullstack': 'Full Stack',
            'other': 'Другое'
        };
        return names[category] || category;
    }

    getCategoryIcon(category) {
        const icons = {
            'discord': '🤖',
            'design': '🎨',
            'backend': '⚙️',
            'frontend': '💻',
            'fullstack': '🌐',
            'other': '📦'
        };
        return icons[category] || '📁';
    }

    renderDynamicFilters(categories, categoryInfo) {
        const filtersContainer = document.querySelector('.filters');
        if (!filtersContainer) return;
        
        let filtersHTML = '<button class="filter-btn active" data-filter="all">Все проекты</button>';
        
        categories.forEach(category => {
            const info = categoryInfo[category];
            filtersHTML += `<button class="filter-btn" data-filter="${category}">${info.icon} ${info.name} (${info.count})</button>`;
        });
        
        filtersContainer.innerHTML = filtersHTML;
        
        // Переинициализируем фильтры
        this.setupFilters();
    }

    getCategory(repo) {
        // 1. Пытаемся определить по GitHub Topics
        if (repo.topics && repo.topics.length > 0) {
            return this.getCategoryFromTopics(repo.topics);
        }
        
        // 2. Если нет тем - используем базовую логику
        return this.analyzeAndCategorize(repo);
    }

    getCategoryFromTopics(topics) {
        if (topics.includes('discord') || topics.includes('discord-bot') || topics.includes('discord.js')) {
            return 'discord';
        }
        if (topics.includes('design') || topics.includes('figma') || topics.includes('ui') || topics.includes('ux') ||
            topics.includes('portfolio') || topics.includes('website') || topics.includes('portfolio-website')) {
            return 'design';
        }
        if (topics.includes('api') || topics.includes('backend') || topics.includes('server') || topics.includes('express')) {
            return 'backend';
        }
        if (topics.includes('fullstack') || topics.includes('full-stack') || topics.includes('mern') || topics.includes('mean')) {
            return 'fullstack';
        }
        if (topics.includes('frontend') || topics.includes('react') || topics.includes('vue') || topics.includes('angular')) {
            return 'frontend';
        }
        return 'other';
    }

    analyzeAndCategorize(repo) {
        // Если анализ не удался, используем базовую логику
        const name = repo.name.toLowerCase();
        const description = repo.description?.toLowerCase() || '';
        const language = repo.language?.toLowerCase() || '';
        
        if (name.includes('discord') || name.includes('bot') || description.includes('discord')) {
            return 'discord';
        }
        
        // Портфолио и дизайн-сайты в категорию "Дизайн"
        if (name.includes('portfolio') || name.includes('website') || name.includes('site') || 
            name.includes('design') || name.includes('figma') || 
            description.includes('portfolio') || description.includes('design') || 
            description.includes('веб-сайт') || description.includes('сайт')) {
            return 'design';
        }
        
        if (name.includes('api') || name.includes('backend') || language.includes('node') || language.includes('python')) {
            return 'backend';
        }
        
        // Остальные фронтенд проекты
        if (language.includes('html') || language.includes('css') || language.includes('javascript')) {
            return 'frontend';
        }
        
        return 'other';
    }

    updateStats() {
        const stats = this.calculateStats(this.projects);
        this.displayStats(stats);
        this.displayLanguageStats(stats.languages);
    }

    calculateStats(repos) {
        // Фильтруем только оригинальные репозитории (без форков)
        const originalRepos = repos.filter(repo => !repo.fork);
        
        const languages = {};
        originalRepos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        return {
            totalRepos: originalRepos.length,
            totalStars: originalRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            totalForks: originalRepos.reduce((sum, repo) => sum + repo.forks_count, 0),
            languages: Object.entries(languages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([lang, count]) => ({ language: lang, count }))
        };
    }

    displayStats(stats) {
        console.log('Отображаем статистику:', stats);
        
        const totalReposEl = document.getElementById('totalRepos');
        const totalStarsEl = document.getElementById('totalStars');
        const totalForksEl = document.getElementById('totalForks');
        
        console.log('Элементы статистики:', {
            totalRepos: totalReposEl,
            totalStars: totalStarsEl,
            totalForks: totalForksEl
        });
        
        if (totalReposEl) {
            totalReposEl.textContent = stats.totalRepos;
            console.log('Установлено количество проектов:', stats.totalRepos);
        }
        if (totalStarsEl) {
            totalStarsEl.textContent = stats.totalStars;
            console.log('Установлено количество звезд:', stats.totalStars);
        }
        if (totalForksEl) {
            totalForksEl.textContent = stats.totalForks;
            console.log('Установлено количество форков:', stats.totalForks);
        }
    }

    displayLanguageStats(languages) {
        console.log('Отображаем языки, количество:', languages.length);
        
        const languagesGrid = document.getElementById('languagesGrid');
        console.log('Контейнер языков:', languagesGrid);
        
        if (!languagesGrid) {
            console.log('Контейнер языков не найден!');
            return;
        }

        if (languages.length === 0) {
            languagesGrid.innerHTML = '<p>Языки не найдены</p>';
            return;
        }

        const maxCount = Math.max(...languages.map(l => l.count));
        const languagesHTML = languages.map(({ language, count }) => {
            const percentage = (count / maxCount) * 100;
            return '<div class="language-stat">' +
                '<div class="language-bar">' +
                '<div class="language-progress" style="width: ' + percentage + '%"></div>' +
                '</div>' +
                '<div class="language-info">' +
                '<span class="language-name">' + language + '</span>' +
                '<span class="language-count">' + count + ' проект' + (count > 1 ? 'ов' : '') + '</span>' +
                '</div>' +
                '</div>';
        }).join('');

        languagesGrid.innerHTML = languagesHTML;
        console.log('Языки отображены успешно');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        
        // Приводим обе даты к UTC для корректного сравнения
        const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = Math.abs(nowUTC - dateUTC);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'сегодня';
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`;
        return `${Math.floor(diffDays / 365)} лет назад`;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'C++': '#f34b7d',
            'C': '#555555',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'Shell': '#89e051',
            'Vue': '#41b883',
            'React': '#61dafb',
            'Node.js': '#339933',
            'Discord.js': '#5865F2'
        };
        return colors[language] || '#858585';
    }

    createProjectCard(repo) {
        const language = repo.language || 'Unknown';
        const languageColor = this.getLanguageColor(language);
        const updatedAt = this.formatDate(repo.updated_at);
        const category = this.getCategory(repo);
        
        return `
            <div class="project-item" data-category="${category}">
                <div class="project-card">
                    <div class="project-header">
                        <div class="project-info">
                            <h3 class="project-title">
                                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                            </h3>
                            <div class="project-meta">
                                <span class="project-language" style="color: ${languageColor}">
                                    <span class="language-dot" style="background: ${languageColor}"></span>
                                    ${language}
                                </span>
                                <span class="project-date">${updatedAt}</span>
                            </div>
                        </div>
                        <div class="project-stats">
                            ${repo.stargazers_count > 0 ? `<span class="stat">⭐ ${repo.stargazers_count}</span>` : ''}
                            ${repo.forks_count > 0 ? `<span class="stat">🔀 ${repo.forks_count}</span>` : ''}
                        </div>
                    </div>
                    <p class="project-description">
                        ${repo.description || 'Описание отсутствует'}
                    </p>
                    <div class="project-footer">
                        <div class="project-tags">
                            ${repo.fork ? '<span class="project-tag">Fork</span>' : ''}
                            ${repo.archived ? '<span class="project-tag">Archived</span>' : ''}
                        </div>
                        <a href="${repo.html_url}" class="project-link" target="_blank">
                            Посмотреть на GitHub →
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    displayProjects(projects) {
        const filteredProjects = this.filterProjects(projects);
        
        if (filteredProjects.length === 0) {
            this.container.innerHTML = `
                <div class="loading-spinner">
                    <p>Проекты не найдены. <a href="https://github.com/${this.username}" target="_blank">Посмотреть на GitHub</a></p>
                </div>
            `;
            return;
        }

        const projectsHTML = filteredProjects.map(repo => this.createProjectCard(repo)).join('');
        this.container.innerHTML = `
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        `;
    }

    filterProjects(projects) {
        if (this.activeFilter === 'all') {
            return projects.filter(repo => !repo.fork && !repo.archived);
        }
        
        return projects.filter(repo => {
            const category = this.getCategory(repo);
            return category === this.activeFilter && !repo.fork && !repo.archived;
        });
    }

    setupFilters() {
        console.log('Настраиваем фильтры, кнопок найдено:', this.filterButtons.length);
        
        if (this.filterButtons.length === 0) {
            console.log('Фильтры не найдены, пропускаем настройку');
            return;
        }
        
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Удаляем active у всех кнопок
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем active к нажатой кнопке
                e.target.classList.add('active');
                
                this.activeFilter = e.target.dataset.filter;
                console.log('Фильтр изменен на:', this.activeFilter);
                this.displayProjects(this.projects);
            });
        });
    }

    displayError(error) {
        console.error('GitHub Projects Gallery Error:', error);
        this.container.innerHTML = `
            <div class="loading-spinner">
                <p>Не удалось загрузить проекты. <a href="https://github.com/${this.username}" target="_blank">Посмотреть на GitHub</a></p>
            </div>
        `;
    }
}

// Инициализируем загрузчики проектов
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация загрузчиков проектов...');
    
    // Инициализация для главной страницы
    const mainContainer = document.getElementById('githubProjects');
    if (mainContainer) {
        console.log('Контейнер главной страницы найден, создаем GitHubProjectsLoader...');
        new GitHubProjectsLoader();
    }
    
    // Инициализация для страницы проектов
    const galleryContainer = document.getElementById('githubProjectsGallery');
    if (galleryContainer) {
        console.log('Контейнер галереи найден, создаем GitHubProjectsGalleryLoader...');
        new GitHubProjectsGalleryLoader();
    }
});

// Lazy loading для изображений
const imageObserver = new IntersectionObserver((entries) => {
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
            imageObserver.unobserve(img);
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
    
    // Проверяем, что все элементы существуют
    if (!mobileMenuToggle || !mobileMenu || !mobileMenuOverlay) {
        console.log('Мобильная навигация: элементы не найдены, пропускаем инициализацию');
        return;
    }
    
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
