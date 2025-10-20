class PortfolioManager {
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
        this.renderProjects();
        this.updateStats();
        this.animateOnScroll();
        this.addHeaderAnimation();
        this.setupNavigation();
        this.setupFormHandling();
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

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        navToggle.addEventListener('click', () => this.toggleMobileMenu());
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
        
        // Add animation effect
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
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

        // Animate cards with staggered delay
        this.animateCards();
    }

    createProjectCard(project, isPinned = false) {
        const pinnedClass = isPinned ? 'pinned' : '';
        const pinnedBadge = isPinned ? '<span class="pin-badge"><i class="fas fa-thumbtack"></i> Pinned</span>' : '';
        
        // Truncate description to 2 lines (approximately 100-120 characters)
        let shortDescription = project.description;
        if (shortDescription.length > 120) {
            shortDescription = project.description.substring(0, 120) + '...';
        }

        return `
      <article class="project-card ${pinnedClass}" data-project='${JSON.stringify(project)}'>
        <div class="project-header">
          <div>
            <h3 class="project-title">${project.name}</h3>
            ${pinnedBadge}
          </div>
        </div>
        
        <p class="project-description">${shortDescription}</p>
        
        <div class="project-tags">
          ${project.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        
        <div class="project-links">
          <a href="${project.repo}" target="_blank" rel="noopener" class="project-link secondary">
            <i class="fab fa-github"></i>
            Repo
          </a>
          <a href="${project.demo}" target="_blank" rel="noopener" class="project-link primary">
            <i class="fas fa-external-link-alt"></i>
            Demo
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
            
            // Add hover effect enhancement
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
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
            // Count unique projects
            projectCount.textContent = `${this.projects.length}+`;
        }
    }

    animateCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            // Reset animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            
            // Staggered animation with enhanced effect
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
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
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const animateElements = document.querySelectorAll('.project-card, .section-header, .hero-content');
        animateElements.forEach(el => observer.observe(el));
    }
    
    addHeaderAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            // Add a subtle animation to the hero title
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
        // Handle scroll for main navigation
        window.addEventListener('scroll', () => {
            const mainNav = document.querySelector('.main-nav');
            if (window.scrollY > 50) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    handleNavClick(e) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Close mobile menu if open
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

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // In a real implementation, you would send the form data to a server
                alert('Thank you for your message! In a real implementation, this would be sent to a server.');
                contactForm.reset();
            });
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
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 800;
  }
  
  .modal-meta {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
  
  .category-badge, .language-badge, .stars-badge {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.35rem 0.85rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .language-badge {
    background: var(--gradient-primary);
    color: white;
  }
  
  .stars-badge {
    background: var(--gradient-secondary);
    color: white;
  }
  
  .modal-description {
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 1.75rem;
    color: var(--text-secondary);
  }
  
  .modal-tags h4 {
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    font-weight: 600;
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.75rem;
  }
  
  .modal-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .featured-badge {
    background: var(--gradient-secondary);
    color: white;
    padding: 0.6rem 1.25rem;
    border-radius: var(--border-radius-md);
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .modal-links {
      flex-direction: column;
    }
    
    .modal-meta {
      justify-content: center;
    }
    
    .modal-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);