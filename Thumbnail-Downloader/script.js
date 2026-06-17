class YouTubeThumbnailDownloader {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.initializeTheme();
        this.loadFromURL();
        this.thumbnailQualities = [
            { name: 'Default Quality', resolution: '120×90', url: 'default.jpg', category: 'sd' },
            { name: 'Medium Quality', resolution: '320×180', url: 'mqdefault.jpg', category: 'sd' },
            { name: 'High Quality', resolution: '480×360', url: 'hqdefault.jpg', category: 'hd' },
            { name: 'Standard Definition', resolution: '640×480', url: 'sddefault.jpg', category: 'hd' },
            { name: 'Max Resolution', resolution: '1280×720', url: 'maxresdefault.jpg', category: 'hd' },
            { name: '4K Ultra HD', resolution: '1920×1080', url: 'maxresdefault.jpg', category: 'hd' }
        ];

        this.currentVideoId = null;
        this.currentVideoTitle = '';
        this.downloadedCount = 0;
    }

    initializeElements() {
        this.elements = {
            videoUrl: document.getElementById('videoUrl'),
            getThumbnails: document.getElementById('getThumbnails'),
            clearBtn: document.getElementById('clearBtn'),
            loadingSpinner: document.getElementById('loadingSpinner'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            successMessage: document.getElementById('successMessage'),
            successText: document.getElementById('successText'),
            videoInfo: document.getElementById('videoInfo'),
            videoTitle: document.getElementById('videoTitle'),
            videoId: document.getElementById('videoId'),
            thumbnailsGrid: document.getElementById('thumbnailsGrid'),
            thumbnailCards: document.getElementById('thumbnailCards'),
            themeToggle: document.getElementById('themeToggle'),
            filterButtons: document.querySelectorAll('.filter-btn'),
            downloadAll: document.getElementById('downloadAll'),
            copyAllLinks: document.getElementById('copyAllLinks'),
            toast: document.getElementById('toast'),
            toastMessage: document.getElementById('toastMessage'),
            toastClose: document.getElementById('toastClose')
        };
    }

    attachEventListeners() {
        // Main functionality
        this.elements.getThumbnails.addEventListener('click', () => this.handleGetThumbnails());
        this.elements.videoUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleGetThumbnails();
        });
        this.elements.videoUrl.addEventListener('input', () => this.handleInputChange());
        this.elements.clearBtn.addEventListener('click', () => this.clearInput());

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Filter buttons
        this.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Batch actions
        this.elements.downloadAll.addEventListener('click', () => this.downloadAllThumbnails());
        this.elements.copyAllLinks.addEventListener('click', () => this.copyAllLinks());

        // Toast close
        this.elements.toastClose.addEventListener('click', () => this.hideToast());

        // Auto-hide toast
        let toastTimeout;
        const showToast = this.showToast.bind(this);
        this.showToast = (message, duration = 5000) => {
            showToast(message);
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => this.hideToast(), duration);
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.elements.videoUrl.focus();
                        break;
                    case 'Enter':
                        if (e.target === this.elements.videoUrl) {
                            e.preventDefault();
                            this.handleGetThumbnails();
                        }
                        break;
                }
            }
            if (e.key === 'Escape') {
                this.clearInput();
                this.hideToast();
            }
        });

        // Analytics events (placeholder for future implementation)
        this.trackEvent = (action, category = 'thumbnail_downloader') => {
            // console.log(`Analytics: ${category} - ${action}`);
            // Implement your analytics tracking here
        };
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        this.trackEvent('theme_toggle', newTheme);
    }

    updateThemeIcon(theme) {
        const icon = this.elements.themeToggle.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const videoUrl = params.get('url') || params.get('v');
        if (videoUrl) {
            this.elements.videoUrl.value = videoUrl;
            this.handleGetThumbnails();
        }
    }

    handleInputChange() {
        const hasValue = this.elements.videoUrl.value.trim().length > 0;
        this.elements.clearBtn.style.opacity = hasValue ? '1' : '0';
        this.elements.clearBtn.style.pointerEvents = hasValue ? 'all' : 'none';

        // Clear previous results when input changes
        if (!hasValue) {
            this.hideAllMessages();
            this.elements.thumbnailsGrid.classList.add('hidden');
            this.elements.videoInfo.classList.add('hidden');
        }
    }

    clearInput() {
        this.elements.videoUrl.value = '';
        this.handleInputChange();
        this.elements.videoUrl.focus();
        this.hideAllMessages();
        this.elements.thumbnailsGrid.classList.add('hidden');
        this.elements.videoInfo.classList.add('hidden');
    }

    async handleGetThumbnails() {
        const url = this.elements.videoUrl.value.trim();

        if (!url) {
            this.showError('Please enter a YouTube video URL');
            return;
        }

        const videoId = this.extractVideoId(url);

        if (!videoId) {
            this.showError('Invalid YouTube URL. Please check and try again.');
            return;
        }

        this.showLoading();
        this.trackEvent('thumbnail_extraction_started');

        try {
            await this.generateThumbnails(videoId);
            this.showSuccess('Thumbnails loaded successfully!');
            this.trackEvent('thumbnail_extraction_completed');

            // Update URL with video parameter (optional)
            const newURL = `${window.location.pathname}?v=${videoId}`;
            window.history.replaceState({}, '', newURL);

        } catch (error) {
            this.showError('Failed to load thumbnails. Please try again.');
            console.error('Thumbnail generation error:', error);
        }
    }

    extractVideoId(url) {
        // Enhanced regex patterns for various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        // Try to extract from URL parameters
        try {
            const urlObj = new URL(url);
            const vParam = urlObj.searchParams.get('v');
            if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
                return vParam;
            }
        } catch (e) {
            // Invalid URL
        }

        return null;
    }

    showLoading() {
        this.hideAllMessages();
        this.elements.loadingSpinner.classList.remove('hidden');
        this.elements.getThumbnails.disabled = true;
        this.elements.getThumbnails.querySelector('.btn-text').textContent = 'Processing...';
    }

    hideLoading() {
        this.elements.loadingSpinner.classList.add('hidden');
        this.elements.getThumbnails.disabled = false;
        this.elements.getThumbnails.querySelector('.btn-text').textContent = 'Get Thumbnails';
    }

    showError(message) {
        this.hideAllMessages();
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        this.hideLoading();
    }

    showSuccess(message) {
        this.hideAllMessages();
        this.elements.successText.textContent = message;
        this.elements.successMessage.classList.remove('hidden');
        this.hideLoading();

        // Auto-hide success message
        setTimeout(() => {
            this.elements.successMessage.classList.add('hidden');
        }, 3000);
    }

    hideAllMessages() {
        this.elements.errorMessage.classList.add('hidden');
        this.elements.successMessage.classList.add('hidden');
        this.elements.loadingSpinner.classList.add('hidden');
    }

    async generateThumbnails(videoId) {
        this.currentVideoId = videoId;

        // Try to get video title using YouTube oEmbed API
        try {
            const oEmbedResponse = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            if (oEmbedResponse.ok) {
                const oEmbedData = await oEmbedResponse.json();
                this.currentVideoTitle = oEmbedData.title;
            }
        } catch (error) {
            this.currentVideoTitle = `Video ${videoId}`;
        }

        // Display video info
        this.showVideoInfo(videoId, this.currentVideoTitle);

        // Generate thumbnail cards
        const validThumbnails = await this.checkThumbnailAvailability(videoId);
        this.displayThumbnails(validThumbnails, videoId);

        // Show thumbnails grid
        this.elements.thumbnailsGrid.classList.remove('hidden');

        // Scroll to thumbnails
        setTimeout(() => {
            this.elements.thumbnailsGrid.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    showVideoInfo(videoId, title) {
        this.elements.videoTitle.textContent = title;
        this.elements.videoId.querySelector('span').textContent = videoId;
        this.elements.videoInfo.classList.remove('hidden');
    }

    async checkThumbnailAvailability(videoId) {
        const availableThumbnails = [];

        for (const quality of this.thumbnailQualities) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality.url}`;

            try {
                // Check if thumbnail exists by trying to load it
                const isAvailable = await this.checkImageExists(thumbnailUrl);
                if (isAvailable) {
                    availableThumbnails.push({
                        ...quality,
                        url: thumbnailUrl
                    });
                }
            } catch (error) {
                console.log(`Thumbnail ${quality.name} not available`);
            }
        }

        return availableThumbnails;
    }

    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    displayThumbnails(thumbnails, videoId) {
        this.elements.thumbnailCards.innerHTML = '';

        if (thumbnails.length === 0) {
            this.elements.thumbnailCards.innerHTML = `
                <div class="no-thumbnails">
                    <p>No thumbnails available for this video.</p>
                </div>
            `;
            return;
        }

        thumbnails.forEach((thumbnail, index) => {
            const card = this.createThumbnailCard(thumbnail, videoId, index);
            this.elements.thumbnailCards.appendChild(card);
        });

        // Animate cards appearance
        setTimeout(() => {
            const cards = this.elements.thumbnailCards.querySelectorAll('.thumbnail-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animate');
                }, index * 100);
            });
        }, 100);
    }

    createThumbnailCard(thumbnail, videoId, index) {
        const card = document.createElement('div');
        card.className = `thumbnail-card ${thumbnail.category}`;
        card.innerHTML = `
            <img 
                src="${thumbnail.url}" 
                alt="${thumbnail.name} thumbnail" 
                class="thumbnail-preview"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
            >
            <div class="thumbnail-error" style="display:none; text-align:center; padding:50px; color:var(--text-secondary);">
                <span>❌</span>
                <p>Thumbnail not available</p>
            </div>
            <div class="thumbnail-info">
                <div class="thumbnail-quality">${thumbnail.name}</div>
                <div class="thumbnail-resolution">${thumbnail.resolution}</div>
            </div>
            <div class="thumbnail-actions">
                <button class="action-btn view-btn" title="View full size">
                    <span>👁️</span> View
                </button>
                <button class="action-btn download-btn" title="Download image">
                    <span>⬇️</span> Download
                </button>
                <button class="action-btn copy-btn" title="Copy image URL">
                    <span>📋</span> Copy Link
                </button>
            </div>
        `;

        // Add event listeners
        const viewBtn = card.querySelector('.view-btn');
        const downloadBtn = card.querySelector('.download-btn');
        const copyBtn = card.querySelector('.copy-btn');
        const previewImg = card.querySelector('.thumbnail-preview');

        // View thumbnail
        viewBtn.addEventListener('click', () => {
            window.open(thumbnail.url, '_blank');
            this.trackEvent('thumbnail_view', thumbnail.name);
        });

        // Preview click
        previewImg.addEventListener('click', () => {
            window.open(thumbnail.url, '_blank');
            this.trackEvent('thumbnail_preview_click', thumbnail.name);
        });

        // Download thumbnail
        downloadBtn.addEventListener('click', () => {
            this.downloadThumbnail(thumbnail.url, `${this.currentVideoTitle || videoId}_${thumbnail.resolution}.jpg`);
            this.trackEvent('thumbnail_download', thumbnail.name);
        });

        // Copy link
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(thumbnail.url);
                this.showToast(`${thumbnail.name} link copied to clipboard!`);
                this.trackEvent('thumbnail_link_copy', thumbnail.name);
            } catch (error) {
                this.fallbackCopyToClipboard(thumbnail.url);
            }
        });

        return card;
    }

    async downloadThumbnail(url, filename) {
        try {
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.downloadedCount++;
            this.showToast(`Downloaded: ${filename}`);

        } catch (error) {
            console.error('Download error:', error);
            // Fallback: open in new tab
            window.open(url, '_blank');
            this.showToast('Opened in new tab. Right-click to save.');
        }
    }

    handleFilter(filter) {
        // Update active filter button
        this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter cards
        const cards = this.elements.thumbnailCards.querySelectorAll('.thumbnail-card');
        cards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        this.trackEvent('filter_applied', filter);
    }

    async downloadAllThumbnails() {
        const cards = Array.from(this.elements.thumbnailCards.querySelectorAll('.thumbnail-card:not([style*="display: none"])'));

        if (cards.length === 0) {
            this.showToast('No thumbnails to download');
            return;
        }

        this.showToast(`Starting download of ${cards.length} thumbnails...`);

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const img = card.querySelector('.thumbnail-preview');
            const quality = card.querySelector('.thumbnail-quality').textContent;
            const resolution = card.querySelector('.thumbnail-resolution').textContent;

            if (img && img.src) {
                const filename = `${this.currentVideoTitle || this.currentVideoId}_${resolution}_${quality.replace(/\s+/g, '_')}.jpg`;
                await this.downloadThumbnail(img.src, filename);

                // Add small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        this.trackEvent('download_all', `${cards.length}_thumbnails`);
    }

    async copyAllLinks() {
        const cards = Array.from(this.elements.thumbnailCards.querySelectorAll('.thumbnail-card:not([style*="display: none"])'));

        if (cards.length === 0) {
            this.showToast('No thumbnails to copy');
            return;
        }

        const links = cards.map(card => {
            const img = card.querySelector('.thumbnail-preview');
            const quality = card.querySelector('.thumbnail-quality').textContent;
            return `${quality}: ${img.src}`;
        }).join('\n');

        try {
            await navigator.clipboard.writeText(links);
            this.showToast(`Copied ${cards.length} thumbnail links to clipboard!`);
            this.trackEvent('copy_all_links', `${cards.length}_links`);
        } catch (error) {
            this.fallbackCopyToClipboard(links);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast('Copied to clipboard!');
        } catch (error) {
            this.showToast('Copy failed. Please copy manually.');
        }

        document.body.removeChild(textArea);
    }

    showToast(message, duration = 5000) {
        this.elements.toastMessage.textContent = message;
        this.elements.toast.classList.remove('hidden');

        // Auto-hide after duration
        setTimeout(() => {
            this.hideToast();
        }, duration);
    }

    hideToast() {
        this.elements.toast.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeThumbnailDownloader();
});

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeThumbnailDownloader;
}
