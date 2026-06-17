class FontPreviewTool {
    constructor() {
        this.fonts = [
            { name: 'Inter', category: 'sans-serif', popular: true },
            { name: 'Roboto', category: 'sans-serif', popular: true },
            { name: 'Open Sans', category: 'sans-serif', popular: true },
            { name: 'Lato', category: 'sans-serif', popular: true },
            { name: 'Montserrat', category: 'sans-serif', popular: true },
            { name: 'Poppins', category: 'sans-serif', popular: true },
            { name: 'Source Sans Pro', category: 'sans-serif', popular: true },
            { name: 'Nunito', category: 'sans-serif', popular: false },
            { name: 'Raleway', category: 'sans-serif', popular: false },
            { name: 'Ubuntu', category: 'sans-serif', popular: false },
            { name: 'Playfair Display', category: 'serif', popular: true },
            { name: 'Merriweather', category: 'serif', popular: true },
            { name: 'Libre Baskerville', category: 'serif', popular: false },
            { name: 'Crimson Text', category: 'serif', popular: false },
            { name: 'Oswald', category: 'display', popular: true },
            { name: 'Fira Sans', category: 'sans-serif', popular: false },
            { name: 'Work Sans', category: 'sans-serif', popular: false },
            { name: 'DM Sans', category: 'sans-serif', popular: false },
            { name: 'Space Grotesk', category: 'sans-serif', popular: false },
            { name: 'PT Sans', category: 'sans-serif', popular: false }
        ];

        this.additionalFonts = [
            { name: 'Bebas Neue', category: 'display', popular: false },
            { name: 'Dancing Script', category: 'handwriting', popular: false },
            { name: 'Pacifico', category: 'handwriting', popular: false },
            { name: 'Lobster', category: 'display', popular: false },
            { name: 'Righteous', category: 'display', popular: false },
            { name: 'Fredoka One', category: 'display', popular: false },
            { name: 'Comfortaa', category: 'display', popular: false },
            { name: 'Quicksand', category: 'sans-serif', popular: false },
            { name: 'Rubik', category: 'sans-serif', popular: false },
            { name: 'Mukti', category: 'sans-serif', popular: false }
        ];

        this.filteredFonts = [...this.fonts];
        this.favorites = JSON.parse(localStorage.getItem('fontFavorites') || '[]');
        this.currentText = 'The quick brown fox jumps over the lazy dog';
        this.currentFontSize = 24;
        this.currentTextColor = '#333333';
        this.currentBgColor = '#ffffff';
        this.currentCategory = 'all';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.renderFonts();
        this.updateCharCount();
    }

    setupEventListeners() {
        // Text input
        const textInput = document.getElementById('textInput');
        textInput.addEventListener('input', (e) => {
            this.currentText = e.target.value || 'The quick brown fox jumps over the lazy dog';
            this.updateAllPreviews();
            this.updateCharCount();
        });

        // Font size slider
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        fontSizeSlider.addEventListener('input', (e) => {
            this.currentFontSize = e.target.value;
            document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
            this.updateAllPreviews();
        });

        // Color pickers
        const textColor = document.getElementById('textColor');
        const bgColor = document.getElementById('bgColor');

        textColor.addEventListener('input', (e) => {
            this.currentTextColor = e.target.value;
            document.querySelector('.color-input-wrapper .color-value').textContent = e.target.value.toUpperCase();
            this.updateAllPreviews();
        });

        bgColor.addEventListener('input', (e) => {
            this.currentBgColor = e.target.value;
            document.querySelectorAll('.color-input-wrapper .color-value')[1].textContent = e.target.value.toUpperCase();
            this.updateAllPreviews();
        });

        // Category filter
        const categorySelect = document.getElementById('fontCategory');
        categorySelect.addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.filterFonts();
        });

        // Search
        const searchInput = document.getElementById('fontSearch');
        searchInput.addEventListener('input', (e) => {
            this.searchFonts(e.target.value);
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Action buttons
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetToDefaults();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.showExportModal();
        });

        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMoreFonts();
        });

        // Modal events
        this.setupModalEvents();
    }

    setupModalEvents() {
        const modal = document.getElementById('exportModal');
        const closeBtn = modal.querySelector('.modal-close');

        closeBtn.addEventListener('click', () => {
            this.hideExportModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideExportModal();
            }
        });

        document.getElementById('exportPNG').addEventListener('click', () => {
            this.exportAsPNG();
        });

        document.getElementById('exportCSS').addEventListener('click', () => {
            this.exportAsCSS();
        });
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('fontToolTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('fontToolTheme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    renderFonts() {
        const fontGrid = document.getElementById('fontGrid');
        fontGrid.innerHTML = '';

        this.filteredFonts.forEach(font => {
            const fontElement = this.createFontPreview(font);
            fontGrid.appendChild(fontElement);
        });

        this.updateResultsCount();
    }

    createFontPreview(font) {
        const fontPreview = document.createElement('div');
        fontPreview.className = `font-preview ${font.popular ? 'featured' : ''}`;

        const isFavorite = this.favorites.includes(font.name);

        fontPreview.innerHTML = `
            <div class="font-header">
                <div class="font-name">${font.name}</div>
                <div class="font-category">${font.category}</div>
            </div>
            <div class="font-sample" style="font-family: '${font.name}', ${this.getFallbackFont(font.category)}; font-size: ${this.currentFontSize}px; color: ${this.currentTextColor}; background-color: ${this.currentBgColor};">
                ${this.currentText}
            </div>
            <div class="font-actions">
                <button class="copy-btn" onclick="fontTool.copyFontCSS('${font.name}', this)">
                    📋 Copy CSS
                </button>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="fontTool.toggleFavorite('${font.name}', this)">
                    ${isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
        `;

        return fontPreview;
    }

    getFallbackFont(category) {
        const fallbacks = {
            'sans-serif': 'sans-serif',
            'serif': 'serif',
            'display': 'cursive',
            'handwriting': 'cursive',
            'monospace': 'monospace'
        };
        return fallbacks[category] || 'sans-serif';
    }

    updateAllPreviews() {
        const samples = document.querySelectorAll('.font-sample');
        samples.forEach(sample => {
            sample.style.fontSize = `${this.currentFontSize}px`;
            sample.style.color = this.currentTextColor;
            sample.style.backgroundColor = this.currentBgColor;
            sample.textContent = this.currentText;
        });
    }

    filterFonts() {
        if (this.currentCategory === 'all') {
            this.filteredFonts = [...this.fonts];
        } else {
            this.filteredFonts = this.fonts.filter(font => font.category === this.currentCategory);
        }

        this.renderFonts();
    }

    searchFonts(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            this.filterFonts();
            return;
        }

        const baseFiltered = this.currentCategory === 'all'
            ? [...this.fonts]
            : this.fonts.filter(font => font.category === this.currentCategory);

        this.filteredFonts = baseFiltered.filter(font =>
            font.name.toLowerCase().includes(searchTerm)
        );

        this.renderFonts();
    }

    copyFontCSS(fontName, button) {
        const cssCode = `/* Import this in your HTML head or CSS file */
@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');

/* Or use this link tag in your HTML head */
<link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">

/* CSS rule */
font-family: '${fontName}', ${this.getFallbackFont(this.getCurrentFontCategory(fontName))};`;

        navigator.clipboard.writeText(cssCode).then(() => {
            button.textContent = '✅ Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = '📋 Copy CSS';
                button.classList.remove('copied');
            }, 2000);

            this.showToast('CSS code copied to clipboard!');
        }).catch(() => {
            this.showToast('Failed to copy CSS code', 'error');
        });
    }

    getCurrentFontCategory(fontName) {
        const font = this.fonts.find(f => f.name === fontName);
        return font ? font.category : 'sans-serif';
    }

    toggleFavorite(fontName, button) {
        const index = this.favorites.indexOf(fontName);

        if (index > -1) {
            this.favorites.splice(index, 1);
            button.textContent = '🤍';
            button.classList.remove('active');
        } else {
            this.favorites.push(fontName);
            button.textContent = '❤️';
            button.classList.add('active');
        }

        localStorage.setItem('fontFavorites', JSON.stringify(this.favorites));
    }

    resetToDefaults() {
        // Reset form values
        document.getElementById('textInput').value = 'The quick brown fox jumps over the lazy dog';
        document.getElementById('fontSizeSlider').value = 24;
        document.getElementById('fontSizeValue').textContent = '24px';
        document.getElementById('textColor').value = '#333333';
        document.getElementById('bgColor').value = '#ffffff';
        document.getElementById('fontCategory').value = 'all';
        document.getElementById('fontSearch').value = '';

        // Update color value displays
        const colorValues = document.querySelectorAll('.color-value');
        colorValues[0].textContent = '#333333';
        colorValues[1].textContent = '#FFFFFF';

        // Reset internal state
        this.currentText = 'The quick brown fox jumps over the lazy dog';
        this.currentFontSize = 24;
        this.currentTextColor = '#333333';
        this.currentBgColor = '#ffffff';
        this.currentCategory = 'all';

        // Re-render
        this.updateCharCount();
        this.filterFonts();

        this.showToast('Settings reset to defaults');
    }

    updateCharCount() {
        const charCount = document.getElementById('charCount');
        const textInput = document.getElementById('textInput');
        charCount.textContent = textInput.value.length;
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = `${this.filteredFonts.length} fonts`;
    }

    showExportModal() {
        const modal = document.getElementById('exportModal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideExportModal() {
        const modal = document.getElementById('exportModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    async exportAsPNG() {
        try {
            this.showLoadingStatus('Generating image...');

            const fontGrid = document.getElementById('fontGrid');
            const canvas = await html2canvas(fontGrid, {
                backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-primary'),
                scale: 2,
                logging: false,
                useCORS: true
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `font-preview-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();

            this.hideExportModal();
            this.showToast('Image exported successfully!');
            this.showLoadingStatus('Ready');
        } catch (error) {
            console.error('Export failed:', error);
            this.showToast('Failed to export image', 'error');
            this.showLoadingStatus('Ready');
        }
    }

    exportAsCSS() {
        const allCSS = this.filteredFonts.map(font => {
            return `/* ${font.name} */
@import url('https://fonts.googleapis.com/css2?family=${font.name.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap');

.font-${font.name.toLowerCase().replace(/\s+/g, '-')} {
    font-family: '${font.name}', ${this.getFallbackFont(font.category)};
    font-size: ${this.currentFontSize}px;
    color: ${this.currentTextColor};
}`;
        }).join('\n\n');

        const blob = new Blob([allCSS], { type: 'text/css' });
        const link = document.createElement('a');
        link.download = `font-preview-styles-${Date.now()}.css`;
        link.href = URL.createObjectURL(blob);
        link.click();

        this.hideExportModal();
        this.showToast('CSS file exported successfully!');
    }

    loadMoreFonts() {
        this.showLoadingStatus('Loading more fonts...');

        setTimeout(() => {
            // Add additional fonts
            this.additionalFonts.forEach(font => {
                if (!this.fonts.find(f => f.name === font.name)) {
                    this.fonts.push(font);
                }
            });

            // Load Google Fonts dynamically
            this.loadAdditionalGoogleFonts();

            // Re-filter and render
            this.filterFonts();

            this.showToast(`Loaded ${this.additionalFonts.length} additional fonts!`);
            this.showLoadingStatus('Ready');
        }, 1000);
    }

    loadAdditionalGoogleFonts() {
        const additionalFontsQuery = this.additionalFonts
            .map(font => font.name.replace(/\s+/g, '+'))
            .join('&family=');

        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${additionalFontsQuery}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    showLoadingStatus(status) {
        const loadingStatus = document.getElementById('loadingStatus');
        loadingStatus.textContent = status;

        if (status === 'Ready') {
            loadingStatus.style.color = 'var(--accent-color)';
        } else {
            loadingStatus.style.color = 'var(--text-secondary)';
        }
    }
}

// Initialize the tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fontTool = new FontPreviewTool();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'k':
                e.preventDefault();
                document.getElementById('fontSearch').focus();
                break;
            case 'r':
                e.preventDefault();
                window.fontTool.resetToDefaults();
                break;
            case 'e':
                e.preventDefault();
                window.fontTool.showExportModal();
                break;
        }
    }
});
