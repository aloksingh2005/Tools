class ToolHubManager {
  constructor() {
    this.projects = projectsData;
    this.filteredProjects = [...this.projects];
    this.currentFilter = 'all';
    this.searchTerm = '';
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupTheme();
    this.checkUrlForFilter();
    this.renderProjects();
    this.updateStats();
    this.animateOnScroll();
    this.addHeaderAnimation();
    this.setupNavigation();
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => this.toggleTheme());

    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');

    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    clearSearch.addEventListener('click', () => this.clearSearch());

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.handleFilter(category, e.currentTarget);
      });
    });

    document.querySelectorAll('.filter-btn-mobile').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.handleFilter(category, e.currentTarget);
        this.closeMobileFilters();
      });
    });

    const mobileFiltersBtn = document.getElementById('mobile-filters-btn');
    if (mobileFiltersBtn) {
      mobileFiltersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileFilters();
      });
    }

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    window.addEventListener('hashchange', () => this.checkUrlForFilter());
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('tools-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const appliedTheme = (savedTheme === 'dark' || (!savedTheme && prefersDark)) ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', appliedTheme);
    this.updateThemeIcon(appliedTheme === 'dark');
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('tools-theme', newTheme);
    this.updateThemeIcon(newTheme === 'dark');

    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  }

  updateThemeIcon(isDark) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
      themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  handleSearch(term) {
    this.searchTerm = term.toLowerCase();
    const clearBtn = document.getElementById('clear-search');

    if (term) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }

    this.filterProjects();
  }

  clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');

    searchInput.value = '';
    clearBtn.classList.remove('visible');
    this.searchTerm = '';
    this.filterProjects();
  }

  checkUrlForFilter() {
    const hash = window.location.hash;
    if (!hash.startsWith('#filter=')) {
      return;
    }

    let categorySlug = '';
    try {
      categorySlug = decodeURIComponent(hash.replace('#filter=', ''));
    } catch (error) {
      this.currentFilter = 'all';
      this.filterProjects();
      return;
    }

    let categoryName = 'all';
    const filterButtons = document.querySelectorAll('.filter-btn');

    for (const btn of filterButtons) {
      const datasetCategory = btn.dataset.category;
      const slug = datasetCategory.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      if (slug === categorySlug || datasetCategory === categorySlug) {
        categoryName = datasetCategory;
        filterButtons.forEach((filterBtn) => filterBtn.classList.remove('active'));
        btn.classList.add('active');
        break;
      }
    }

    this.currentFilter = categoryName;
    this.filterProjects();

    const toolsSection = document.getElementById('tools');
    if (toolsSection) {
      setTimeout(() => {
        const offsetTop = toolsSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }, 100);
    }
  }

  handleFilter(category, btnElement) {
    document.querySelectorAll('.filter-btn, .filter-btn-mobile').forEach((btn) => btn.classList.remove('active'));
    btnElement.classList.add('active');

    this.currentFilter = category;

    if (category === 'all') {
      if (window.location.hash.startsWith('#filter=')) {
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        history.replaceState(null, '', cleanUrl);
      }
    } else {
      const slug = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      window.location.hash = `filter=${encodeURIComponent(slug)}`;
    }

    this.filterProjects();
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter((project) => {
      const matchesFilter = this.currentFilter === 'all' || project.category === this.currentFilter;
      const matchesSearch = !this.searchTerm ||
        project.name.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(this.searchTerm));

      return matchesFilter && matchesSearch;
    });

    this.renderProjects();
  }

  renderProjects() {
    const trendingContainer = document.getElementById('trending-projects');
    const recentContainer = document.getElementById('recent-projects');
    const projectsContainer = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const trendingCount = document.getElementById('trending-count');
    const recentCount = document.getElementById('recent-count');
    const dashboardHighlights = document.querySelector('.dashboard-highlights');

    const trendingProjects = [...this.filteredProjects]
      .filter((project) => project.pinned || project.featured || project.trending)
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .slice(0, 4);

    const trendingSet = new Set(trendingProjects);
    const recentProjects = [...this.filteredProjects]
      .filter((project) => !trendingSet.has(project))
      .slice(-4)
      .reverse();

    if (resultsCount) {
      resultsCount.textContent = this.filteredProjects.length;
    }

    if (trendingCount) {
      trendingCount.textContent = `${trendingProjects.length}`;
    }

    if (recentCount) {
      recentCount.textContent = `${recentProjects.length}`;
    }

    if (this.filteredProjects.length === 0) {
      noResults.classList.add('visible');
      if (dashboardHighlights) {
        dashboardHighlights.style.display = 'none';
      }
    } else {
      noResults.classList.remove('visible');
      if (dashboardHighlights) {
        dashboardHighlights.style.display = '';
      }
    }

    if (trendingContainer) {
      trendingContainer.innerHTML = trendingProjects
        .map((project, index) => this.createProjectCard(project, { variant: 'spotlight', featured: index === 0 }))
        .join('');
    }

    if (recentContainer) {
      recentContainer.innerHTML = recentProjects
        .map((project) => this.createProjectCard(project, { variant: 'recent' }))
        .join('');
    }

    if (projectsContainer) {
      projectsContainer.innerHTML = this.filteredProjects
        .map((project) => this.createProjectCard(project, { variant: 'grid' }))
        .join('');
    }

    this.animateCards();
  }

  createProjectCard(project, options = {}) {
    const { variant = 'grid', featured = false } = options;
    const cardClasses = ['project-card'];

    if (variant !== 'grid') {
      cardClasses.push(`project-card--${variant}`);
    }

    if (variant === 'spotlight') {
      cardClasses.push('pinned');
    }

    if (featured) {
      cardClasses.push('project-card--featured');
    }

    const targetUrl = project.demo || project.repo || '#';

    let shortDescription = project.description;
    const descriptionLimit = featured ? 155 : variant === 'spotlight' ? 128 : variant === 'recent' ? 102 : 120;

    if (shortDescription.length > descriptionLimit) {
      shortDescription = `${project.description.substring(0, descriptionLimit)}...`;
    }

    const metaParts = [];
    if (project.language) {
      metaParts.push(project.language);
    }

    if (project.stars) {
      metaParts.push(`${project.stars} stars`);
    }

    const metaText = metaParts.join(' · ');

    return `
      <a class="${cardClasses.join(' ')}" href="${targetUrl}" target="_blank" rel="noopener" aria-label="Open ${project.name}">
        <div class="project-header">
          <span class="project-category">${project.category}</span>
          <h3 class="project-title">${project.name}</h3>
        </div>

        <p class="project-description">${shortDescription}</p>

        <div class="project-tags">
          ${project.tags.slice(0, 3).map((tag) => `<span class="tag" data-tag="${tag}">${tag}</span>`).join('')}
        </div>

        <div class="project-footer">
          <span class="project-meta">${metaText}</span>
          <span class="project-open">Open tool</span>
        </div>
      </a>
    `;
  }

  handleKeyboard(e) {
    if (e.key === 'Escape' && this.isMenuOpen) {
      this.toggleMobileMenu();
      return;
    }

    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.tagName === 'SELECT' ||
      activeElement.isContentEditable
    );

    if (isTyping) {
      return;
    }

    if (e.key === '/') {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }
  }

  updateStats() {
    const projectCount = document.getElementById('project-count');
    if (projectCount) {
      projectCount.textContent = `${this.projects.length}`;
    }

    const categoryCount = document.getElementById('category-count');
    if (categoryCount) {
      const uniqueCategories = new Set(this.projects.map((project) => project.category));
      categoryCount.textContent = uniqueCategories.size;
    }
  }

  animateCards() {
    const cards = document.querySelectorAll('.project-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 768px)').matches;

    if (reduceMotion) {
      cards.forEach((card) => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.transition = 'none';
      });
      return;
    }

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';

      setTimeout(() => {
        card.style.transition = 'opacity 0.42s ease, transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.42s ease, border-color 0.42s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 60);
    });
  }

  animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const animateElements = document.querySelectorAll('.project-card, .section-header, .hero-content, .highlight-panel');
    animateElements.forEach((element) => observer.observe(element));
  }

  addHeaderAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(20px)';

      setTimeout(() => {
        heroTitle.style.transition = 'all 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  setupNavigation() {
    window.addEventListener('scroll', () => {
      const mainNav = document.querySelector('.main-nav');
      if (!mainNav) {
        return;
      }

      if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#' || targetId.startsWith('#!')) {
          return;
        }
        if (!/^#[A-Za-z][\w-]*$/.test(targetId)) {
          return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  handleNavClick(e) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
    });

    e.currentTarget.classList.add('active');

    if (this.isMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      navMenu.classList.add('active');
      navToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      navMenu.classList.remove('active');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }

  toggleMobileFilters() {
    const mobileFilters = document.querySelector('.mobile-filters-dropdown');
    if (mobileFilters) {
      mobileFilters.classList.toggle('active');
    }
  }

  closeMobileFilters() {
    const mobileFilters = document.querySelector('.mobile-filters-dropdown');
    if (mobileFilters) {
      mobileFilters.classList.remove('active');
    }
  }
}

// Initialize the tool hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ToolHubManager();
});
