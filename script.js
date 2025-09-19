class PortfolioManager {
    constructor() {
        this.projects = projectsData;
        this.filteredProjects = [...this.projects];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.renderProjects();
        this.updateStats();
        this.animateOnScroll();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Search functionality
        const searchInput = document.getElementById('search-input');
        const clearSearch = document.getElementById('clear-search');

        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        clearSearch.addEventListener('click', () => this.clearSearch());

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.handleFilter(category, e.currentTarget);
            });
        });

        // Modal functionality
        const modal = document.getElementById('project-modal');
        const modalClose = document.getElementById('modal-close');

        modalClose.addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-theme', savedTheme || 'dark');
            this.updateThemeIcon(savedTheme === 'dark' || prefersDark);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        this.updateThemeIcon(newTheme === 'dark');
    }

    updateThemeIcon(isDark) {
        const themeIcon = document.querySelector('#theme-toggle i');
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
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

    handleFilter(category, btnElement) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');

        this.currentFilter = category;
        this.filterProjects();
    }

    filterProjects() {
        this.filteredProjects = this.projects.filter(project => {
            const matchesFilter = this.currentFilter === 'all' || project.category === this.currentFilter;
            const matchesSearch = !this.searchTerm ||
                project.name.toLowerCase().includes(this.searchTerm) ||
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));

            return matchesFilter && matchesSearch;
        });

        this.renderProjects();
    }

    renderProjects() {
        const pinnedContainer = document.getElementById('pinned-projects');
        const projectsContainer = document.getElementById('projects-grid');
        const noResults = document.getElementById('no-results');
        const resultsCount = document.getElementById('results-count');

        // Separate pinned and regular projects
        const pinnedProjects = this.filteredProjects.filter(p => p.pinned);
        const regularProjects = this.filteredProjects.filter(p => !p.pinned);

        // Update results count
        resultsCount.textContent = this.filteredProjects.length;

        // Show/hide no results message
        if (this.filteredProjects.length === 0) {
            noResults.classList.add('visible');
            document.querySelector('.pinned-section').style.display = 'none';
        } else {
            noResults.classList.remove('visible');
            document.querySelector('.pinned-section').style.display = pinnedProjects.length ? 'block' : 'none';
        }

        // Render pinned projects
        pinnedContainer.innerHTML = pinnedProjects.map(project => this.createProjectCard(project, true)).join('');

        // Render regular projects
        projectsContainer.innerHTML = regularProjects.map(project => this.createProjectCard(project, false)).join('');

        // Add click listeners to cards
        this.addCardListeners();

        // Animate cards
        this.animateCards();
    }

    createProjectCard(project, isPinned = false) {
            const pinnedClass = isPinned ? 'pinned' : '';
            const pinnedBadge = isPinned ? '<span class="pin-badge"><i class="fas fa-thumbtack"></i> Pinned</span>' : '';

            return `
      <article class="project-card ${pinnedClass}" data-project='${JSON.stringify(project)}'>
        <div class="project-header">
          <div>
            <h3 class="project-title">${project.name}</h3>
            ${pinnedBadge}
          </div>
        </div>
        
        <p class="project-description">${project.description}</p>
        
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        
        <div class="project-links">
          <a href="${project.repo}" target="_blank" rel="noopener" class="project-link secondary">
            <i class="fab fa-github"></i>
            Repository
          </a>
          <a href="${project.demo}" target="_blank" rel="noopener" class="project-link primary">
            <i class="fas fa-external-link-alt"></i>
            Live Demo
          </a>
        </div>
      </article>
    `;
    }

    addCardListeners() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on links
                if (e.target.closest('.project-links')) return;

                const projectData = JSON.parse(card.dataset.project);
                this.openModal(projectData);
            });
        });
    }

    openModal(project) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
      <div class="modal-project">
        <div class="modal-header">
          <h2>${project.name}</h2>
          ${project.pinned ? '<span class="pin-badge"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
        </div>
        
        <div class="modal-meta">
          <span class="category-badge">${project.category}</span>
          <span class="language-badge">${project.language}</span>
          ${project.stars ? `<span class="stars-badge"><i class="fas fa-star"></i> ${project.stars}</span>` : ''}
        </div>
        
        <p class="modal-description">${project.description}</p>
        
        <div class="modal-tags">
          <h4>Technologies Used:</h4>
          <div class="tags-list">
            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
        
        <div class="modal-links">
          <a href="${project.repo}" target="_blank" rel="noopener" class="project-link secondary">
            <i class="fab fa-github"></i>
            View Repository
          </a>
          <a href="${project.demo}" target="_blank" rel="noopener" class="project-link primary">
            <i class="fas fa-external-link-alt"></i>
            Try Live Demo
          </a>
        </div>
        
        ${project.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Featured Project</div>' : ''}
      </div>
    `;

        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    updateStats() {
        const projectCount = document.getElementById('project-count');
        if (projectCount) {
            projectCount.textContent = `${this.projects.length}+`;
        }
    }

    animateCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        });

        const animateElements = document.querySelectorAll('.project-card, .section-header');
        animateElements.forEach(el => observer.observe(el));
    }

    handleKeyboard(e) {
        // ESC to close modal
        if (e.key === 'Escape') {
            this.closeModal();
        }

        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }

        // Ctrl/Cmd + T to toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleTheme();
        }
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Add some additional CSS for modal styles
const additionalStyles = `
  .modal-project {
    max-width: 100%;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .modal-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  
  .category-badge, .language-badge, .stars-badge {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .language-badge {
    background: var(--primary-color);
    color: white;
  }
  
  .stars-badge {
    background: var(--accent-color);
    color: white;
  }
  
  .modal-description {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    color: var(--text-secondary);
  }
  
  .modal-tags h4 {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .modal-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .featured-badge {
    background: linear-gradient(135deg, var(--accent-color), #f97316);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  @media (max-width: 768px) {
    .modal-links {
      flex-direction: column;
    }
    
    .modal-meta {
      justify-content: center;
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);