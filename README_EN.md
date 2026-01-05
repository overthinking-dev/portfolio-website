# POEPLE - Web Developer Portfolio

> A modern portfolio for a junior web developer featuring responsive design, animations, and performance optimization.

## 🌟 Project Overview

**POEPLE Portfolio** is a professional portfolio created to showcase frontend development skills. The project demonstrates modern web technology capabilities with a focus on user experience, accessibility, and performance.

### ✨ Key Features

- 🎨 **Modern design** with gradients and micro-animations
- 🌙 **Dark/Light theme** with smooth transitions
- 📱 **Full responsiveness** for all devices
- ⚡ **Performance optimization** (lazy loading, debouncing)
- ♿ **Complete accessibility** (ARIA labels, keyboard navigation)
- 🔍 **SEO optimization** with semantic markup
- 🎭 **Animated background** with patterns and particles
- 📊 **Breadcrumbs navigation** for easy orientation

## 🛠️ Technologies

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styles with variables and animations
- **Vanilla JavaScript** - Framework-free, clean code
- **CSS Grid & Flexbox** - Responsive layouts
- **WebP** - Optimized images

### Tools & Techniques
- **CSS Variables** - Theming
- **Intersection Observer** - Lazy loading
- **RequestAnimationFrame** - Animation optimization
- **Debouncing** - Scroll optimization
- **SVG icons** - Vector graphics
- **Structured Data** - SEO markup

## 📁 Project Structure

```
portfolio-website/
├── index.html          # Homepage
├── projects.html        # Projects page
├── about.html          # About page
├── contacts.html       # Contact page
├── styles.css          # All project styles
├── script.js           # JavaScript functionality
└── README_EN.md        # English documentation
```

## 🚀 Installation & Setup

### Clone Repository
```bash
git clone https://github.com/overthinking-dev/portfolio-website.git
cd portfolio-website
```

### Local Development
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (if http-server is installed)
npx http-server

# Or using VS Code Live Server
# Right-click on index.html → "Open with Live Server"
```

### Access Project
Open `http://localhost:8000` in your browser.

## 🎨 Implementation Details

### Design & Animations
- **Multi-layered animated background** with patterns, particles, and waves
- **Micro-animations** on all interactive elements
- **3D transforms** and parallax effects
- **Smooth transitions** between states

### Performance
- **Lazy loading** images with Intersection Observer
- **Debounced scroll** events for optimization
- **RequestAnimationFrame** for smooth animations
- **WebP format** for reduced image sizes
- **GPU acceleration** for CSS animations

### Accessibility
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Skip navigation** links
- **Semantic HTML5** markup
- **Contrast ratios** meet WCAG standards

### SEO Optimization
- **Meta tags** for search engines
- **Open Graph** for social media
- **Structured Data** (JSON-LD)
- **Semantic HTML** for better indexing
- **Canonical URLs** to prevent duplication

## 🎯 Functionality

### Main Pages
- **Home** - Hero section, quick info, project previews
- **Projects** - Project gallery with filtering
- **About** - Developer information and skills
- **Contact** - Contact form and social links

### Interactive Elements
- **Theme toggle** with localStorage persistence
- **Mobile menu** slide-out navigation
- **Breadcrumbs** for navigation
- **Hover effects** on cards and buttons
- **Progress bar** in loader

## 🔧 Customization

### Changing Color Scheme
```css
:root {
  --accent: #6c757d;        /* Primary accent */
  --bg-primary: #ffffff;      /* Primary background */
  --text-primary: #212529;    /* Primary text */
  /* ... other variables */
}
```

### Adding New Projects
1. Open `projects.html`
2. Add new `.project-card` element to `.projects-grid`
3. Update homepage preview in `index.html`

### Configuring Animations
```css
/* Change background animation speed */
.pattern-dots {
  animation: patternMove 20s linear infinite;
}

/* Configure micro-animations */
.info-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📊 Performance

### Metrics (Lighthouse)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 100

### Optimizations
- **Minimal JavaScript** (~5KB)
- **Optimized CSS** (~15KB)
- **WebP images** with fallback
- **Static resource caching**
- **Text content compression**

## 🔮 Future Improvements

### Planned Features
- [ ] PWA (Progressive Web App)
- [ ] Multi-language support (EN/RU)
- [ ] CMS for content management
- [ ] Contact form with validation
- [ ] Scroll animations (ScrollTrigger)
- [ ] Color theme customization

### Technical Enhancements
- [ ] TypeScript for type safety
- [ ] Webpack/Vite for bundling
- [ ] Unit tests
- [ ] E2E tests
- [ ] CI/CD pipeline

## 🤝 Contributing

Contributions are welcome! If you want to improve the project:

1. **Fork** the repository
2. Create a **branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**POEPLE**
- Junior Web Developer
- Specialization: Frontend Development
- Goal: Become a professional developer

### Contact
- **GitHub**: [overthinking-dev](https://github.com/overthinking-dev)
- **Telegram**: [@lol_lolin](https://t.me/lol_lolin)
- **Discord**: .overthink1ng
- **Email**: overth1nk1ngdeveloper@gmail.com

## 🙏 Acknowledgments

- [Google Fonts](https://fonts.google.com/) - Inter and Irish Grover fonts
- [Font Awesome](https://fontawesome.com/) - Icons (as SVG)
- [MDN Web Docs](https://developer.mozilla.org/) - Documentation
- [CSS Tricks](https://css-tricks.com/) - CSS techniques

---

⭐ If this project was helpful, give it a star on GitHub!

**Built with ❤️ and passion for web development**

