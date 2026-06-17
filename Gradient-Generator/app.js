/**
 * Gradient Background Generator
 * Advanced CSS gradient generator with full feature set
 */

class GradientGenerator {
    constructor() {
        this.state = {
            type: 'linear',
            angle: 90,
            position: 'center',
            colors: [
                { hex: '#ff7a18', position: 0 },
                { hex: '#319197', position: 100 }
            ],
            favorites: this.loadFavorites(),
            recent: this.loadRecent()
        };

        this.presets = this.initializePresets();
        this.updateFrame = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeColorStops();
        this.updatePreview();
        this.updateCSSOutput();
        this.renderPresets('popular');
        this.loadTheme();
        this.loadFromURL();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Gradient type
        document.getElementById('linearBtn').addEventListener('click', () => this.setGradientType('linear'));
        document.getElementById('radialBtn').addEventListener('click', () => this.setGradientType('radial'));

        // Controls
        document.getElementById('angleSlider').addEventListener('input', (e) => this.setAngle(e.target.value));
        document.getElementById('angleInput').addEventListener('change', (e) => this.setAngle(e.target.value));
        document.getElementById('radialPosition').addEventListener('change', (e) => this.setRadialPosition(e.target.value));

        // Actions
        document.getElementById('copyCssBtn').addEventListener('click', () => this.copyCss());
        document.getElementById('copyFormattedBtn').addEventListener('click', () => this.copyCss('formatted'));
        document.getElementById('copyVariablesBtn').addEventListener('click', () => this.copyCss('variables'));
        document.getElementById('copyScssBtn').addEventListener('click', () => this.copyCss('scss'));
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPNG());
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomizeGradient());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareGradient());

        // Color management
        document.getElementById('addColorBtn').addEventListener('click', () => this.addColorStop());
        document.getElementById('swapColorsBtn').addEventListener('click', () => this.swapColors());

        // Presets
        document.getElementById('saveFavoriteBtn').addEventListener('click', () => this.saveFavorite());
        document.getElementById('exportPresetsBtn').addEventListener('click', () => this.exportPresets());
        document.getElementById('importPresetsBtn').addEventListener('click', () => document.getElementById('importPresetsInput').click());
        document.getElementById('importPresetsInput').addEventListener('change', (e) => this.importPresets(e));

        // Preset tabs
        document.querySelectorAll('.preset-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchPresetTab(e.target.dataset.tab));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // URL hash changes
        window.addEventListener('hashchange', () => this.loadFromURL());
    }

    initializePresets() {
        return {
            popular: [
                { name: 'Ocean Blue', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', colors: [{ hex: '#667eea', position: 0 }, { hex: '#764ba2', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Sunset', css: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%)', colors: [{ hex: '#ff9a9e', position: 0 }, { hex: '#fecfef', position: 100 }], type: 'linear', angle: 90 },
                { name: 'Purple Rain', css: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', colors: [{ hex: '#667eea', position: 0 }, { hex: '#764ba2', position: 100 }], type: 'linear', angle: 45 },
                { name: 'Green Machine', css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', colors: [{ hex: '#a8edea', position: 0 }, { hex: '#fed6e3', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Cosmic Fusion', css: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)', colors: [{ hex: '#ff0844', position: 0 }, { hex: '#ffb199', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Winter Neva', css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', colors: [{ hex: '#a8edea', position: 0 }, { hex: '#fed6e3', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Royal Blue', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', colors: [{ hex: '#667eea', position: 0 }, { hex: '#764ba2', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Pinky', css: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', colors: [{ hex: '#ff9a9e', position: 0 }, { hex: '#fad0c4', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Grade Grey', css: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)', colors: [{ hex: '#bdc3c7', position: 0 }, { hex: '#2c3e50', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Piggy Pink', css: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', colors: [{ hex: '#ee9ca7', position: 0 }, { hex: '#ffdde1', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Fresh Mint', css: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)', colors: [{ hex: '#00b4db', position: 0 }, { hex: '#0083b0', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Mauve', css: 'linear-gradient(135deg, #42275a 0%, #734b6d 100%)', colors: [{ hex: '#42275a', position: 0 }, { hex: '#734b6d', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Royal', css: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', colors: [{ hex: '#141e30', position: 0 }, { hex: '#243b55', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Minimal Red', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', colors: [{ hex: '#f093fb', position: 0 }, { hex: '#f5576c', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Behongo', css: 'linear-gradient(135deg, #52c234 0%, #061700 100%)', colors: [{ hex: '#52c234', position: 0 }, { hex: '#061700', position: 100 }], type: 'linear', angle: 135 },
                { name: 'SkyLine', css: 'linear-gradient(135deg, #1488cc 0%, #2b32b2 100%)', colors: [{ hex: '#1488cc', position: 0 }, { hex: '#2b32b2', position: 100 }], type: 'linear', angle: 135 },
                { name: 'DIMIGO', css: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)', colors: [{ hex: '#ec008c', position: 0 }, { hex: '#fc6767', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Purple Love', css: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)', colors: [{ hex: '#cc2b5e', position: 0 }, { hex: '#753a88', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Selenium', css: 'linear-gradient(135deg, #3c3b3f 0%, #605c3c 100%)', colors: [{ hex: '#3c3b3f', position: 0 }, { hex: '#605c3c', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Delicate', css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', colors: [{ hex: '#d299c2', position: 0 }, { hex: '#fef9d7', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Ohhappiness', css: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', colors: [{ hex: '#00b09b', position: 0 }, { hex: '#96c93d', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Lawrencium', css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', colors: [{ hex: '#0f0c29', position: 0 }, { hex: '#302b63', position: 50 }, { hex: '#24243e', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Relaxing Red', css: 'linear-gradient(135deg, #fffbd5 0%, #b20a2c 100%)', colors: [{ hex: '#fffbd5', position: 0 }, { hex: '#b20a2c', position: 100 }], type: 'linear', angle: 135 },
                { name: 'Sublime Light', css: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)', colors: [{ hex: '#fc5c7d', position: 0 }, { hex: '#6a82fb', position: 100 }], type: 'linear', angle: 135 }
            ]
        };
    }

    setGradientType(type) {
        this.state.type = type;
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${type}Btn`).classList.add('active');

        document.getElementById('linearControls').classList.toggle('hidden', type !== 'linear');
        document.getElementById('radialControls').classList.toggle('hidden', type !== 'radial');

        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
    }

    setAngle(angle) {
        this.state.angle = parseInt(angle);
        document.getElementById('angleSlider').value = angle;
        document.getElementById('angleInput').value = angle;
        document.getElementById('gradientAngle').textContent = `${angle}°`;
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
    }

    setRadialPosition(position) {
        this.state.position = position;
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
    }

    initializeColorStops() {
        this.renderColorStops();
    }

    renderColorStops() {
        const container = document.getElementById('colorStops');
        container.innerHTML = '';

        this.state.colors.forEach((color, index) => {
            const stopElement = this.createColorStopElement(color, index);
            container.appendChild(stopElement);
        });
    }

    createColorStopElement(color, index) {
        const stop = document.createElement('div');
        stop.className = 'color-stop';
        stop.innerHTML = `
            <div class="color-input-wrapper">
                <input type="color" class="color-picker" value="${color.hex}" data-index="${index}">
            </div>
            <input type="text" class="hex-input" value="${color.hex}" data-index="${index}" placeholder="#000000">
            <input type="range" class="position-slider" min="0" max="100" value="${color.position}" data-index="${index}">
            <span class="position-value">${color.position}%</span>
            ${this.state.colors.length > 2 ? `<button class="remove-color-btn" data-index="${index}">×</button>` : ''}
        `;

        // Bind events for this color stop
        const colorPicker = stop.querySelector('.color-picker');
        const hexInput = stop.querySelector('.hex-input');
        const positionSlider = stop.querySelector('.position-slider');
        const removeBtn = stop.querySelector('.remove-color-btn');

        colorPicker.addEventListener('change', (e) => this.updateColor(index, e.target.value));
        hexInput.addEventListener('input', (e) => this.updateColor(index, e.target.value));
        positionSlider.addEventListener('input', (e) => this.updateColorPosition(index, e.target.value));

        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.removeColorStop(index));
        }

        return stop;
    }

    updateColor(index, hex) {
        if (this.isValidHex(hex)) {
            this.state.colors[index].hex = hex;
            this.renderColorStops();
            this.updatePreview();
            this.updateCSSOutput();
            this.updateURL();
        }
    }

    updateColorPosition(index, position) {
        this.state.colors[index].position = parseInt(position);
        // Update the position value display
        const stop = document.querySelectorAll('.color-stop')[index];
        if (stop) {
            stop.querySelector('.position-value').textContent = `${position}%`;
        }

        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
    }

    addColorStop() {
        if (this.state.colors.length >= 6) {
            this.showToast('Maximum 6 colors allowed', 'warning');
            return;
        }

        const newPosition = this.findOptimalPosition();
        const newColor = {
            hex: this.generateRandomColor(),
            position: newPosition
        };

        this.state.colors.push(newColor);
        this.state.colors.sort((a, b) => a.position - b.position);

        this.renderColorStops();
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
        this.showToast('Color added successfully', 'success');
    }

    removeColorStop(index) {
        if (this.state.colors.length <= 2) {
            this.showToast('Minimum 2 colors required', 'warning');
            return;
        }

        this.state.colors.splice(index, 1);
        this.renderColorStops();
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
    }

    swapColors() {
        if (this.state.colors.length >= 2) {
            const temp = { ...this.state.colors[0] };
            this.state.colors[0] = { ...this.state.colors[1] };
            this.state.colors[1] = temp;

            this.renderColorStops();
            this.updatePreview();
            this.updateCSSOutput();
            this.updateURL();
        }
    }

    findOptimalPosition() {
        if (this.state.colors.length <= 1) return 50;

        const sortedPositions = this.state.colors.map(c => c.position).sort((a, b) => a - b);
        let maxGap = 0;
        let optimalPosition = 50;

        for (let i = 0; i < sortedPositions.length - 1; i++) {
            const gap = sortedPositions[i + 1] - sortedPositions[i];
            if (gap > maxGap) {
                maxGap = gap;
                optimalPosition = sortedPositions[i] + Math.floor(gap / 2);
            }
        }

        return Math.max(0, Math.min(100, optimalPosition));
    }

    updatePreview() {
        const preview = document.getElementById('gradientPreview');
        const css = this.generateCSS();
        preview.style.background = css;

        // Update preview info
        document.getElementById('gradientType').textContent = this.state.type === 'linear' ? 'Linear' : 'Radial';
        document.getElementById('gradientAngle').textContent = this.state.type === 'linear' ? `${this.state.angle}°` : this.state.position;
    }

    generateCSS(format = 'standard') {
        let css = '';
        const colorStops = this.state.colors
            .sort((a, b) => a.position - b.position)
            .map(color => `${color.hex} ${color.position}%`)
            .join(', ');

        if (this.state.type === 'linear') {
            css = `linear-gradient(${this.state.angle}deg, ${colorStops})`;
        } else {
            css = `radial-gradient(circle at ${this.state.position}, ${colorStops})`;
        }

        switch (format) {
            case 'formatted':
                return this.formatCSSFormatted(css);
            case 'variables':
                return this.formatCSSVariables();
            case 'scss':
                return this.formatSCSS();
            default:
                return css;
        }
    }

    formatCSSFormatted(css) {
        return `background: ${css};\n\n/* Fallback for older browsers */\nbackground: -webkit-${css};\nbackground: -moz-${css};\nbackground: -o-${css};`;
    }

    formatCSSVariables() {
        let variables = this.state.colors
            .map((color, index) => `--gradient-color-${index + 1}: ${color.hex};`)
            .join('\n');

        variables += `\n--gradient-angle: ${this.state.angle}deg;`;
        variables += `\n--gradient: ${this.generateCSS()};`;
        variables += '\n\n/* Usage */\nbackground: var(--gradient);';

        return variables;
    }

    formatSCSS() {
        let scss = '$gradient-colors: (\n';
        scss += this.state.colors
            .map((color, index) => `  ${index + 1}: ${color.hex}`)
            .join(',\n');
        scss += '\n);\n\n';
        scss += `$gradient-angle: ${this.state.angle}deg;\n\n`;
        scss += `@mixin gradient-background {\n  background: ${this.generateCSS()};\n}`;

        return scss;
    }

    updateCSSOutput() {
        const output = document.getElementById('cssOutput');
        const css = this.generateCSS('formatted');
        output.value = css;
    }

    copyCss(format = 'standard') {
        const css = this.generateCSS(format);
        this.copyToClipboard(css);

        const formatNames = {
            standard: 'CSS',
            formatted: 'Formatted CSS',
            variables: 'CSS Variables',
            scss: 'SCSS'
        };

        this.showToast(`${formatNames[format]} copied to clipboard!`, 'success');
    }

    async downloadPNG() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 800;
            canvas.height = 600;

            // Create gradient
            let gradient;
            if (this.state.type === 'linear') {
                const angle = (this.state.angle * Math.PI) / 180;
                const x1 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2;
                const y1 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2;
                const x2 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2;
                const y2 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2;
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            } else {
                gradient = ctx.createRadialGradient(
                    canvas.width / 2, canvas.height / 2, 0,
                    canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2
                );
            }

            this.state.colors
                .sort((a, b) => a.position - b.position)
                .forEach(color => {
                    gradient.addColorStop(color.position / 100, color.hex);
                });

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Download
            const link = document.createElement('a');
            link.download = `gradient-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();

            this.showToast('PNG downloaded successfully!', 'success');
        } catch (error) {
            this.showToast('Error downloading PNG', 'error');
            console.error('Download error:', error);
        }
    }

    randomizeGradient() {
        const types = ['linear', 'radial'];
        const colorCount = Math.floor(Math.random() * 3) + 2; // 2-4 colors

        this.state.type = types[Math.floor(Math.random() * types.length)];
        this.state.angle = Math.floor(Math.random() * 361);
        this.state.colors = [];

        for (let i = 0; i < colorCount; i++) {
            this.state.colors.push({
                hex: this.generateRandomColor(),
                position: Math.floor((100 / (colorCount - 1)) * i)
            });
        }

        this.setGradientType(this.state.type);
        this.setAngle(this.state.angle);
        this.renderColorStops();
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();
        this.showToast('Random gradient generated!', 'success');
    }

    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
        const lightness = Math.floor(Math.random() * 40) + 30;  // 30-70%

        return this.hslToHex(hue, saturation, lightness);
    }

    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    shareGradient() {
        if (navigator.share) {
            navigator.share({
                title: 'Beautiful CSS Gradient',
                text: 'Check out this gradient I created!',
                url: window.location.href
            });
        } else {
            this.copyToClipboard(window.location.href);
            this.showToast('Gradient URL copied to clipboard!', 'success');
        }
    }

    updateURL() {
        const params = new URLSearchParams();
        params.set('type', this.state.type);
        params.set('angle', this.state.angle);
        params.set('position', this.state.position);
        params.set('colors', JSON.stringify(this.state.colors));

        const newURL = `${window.location.pathname}#${params.toString()}`;
        history.replaceState(null, '', newURL);
    }

    loadFromURL() {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        try {
            const params = new URLSearchParams(hash);
            if (params.has('colors')) {
                this.state.type = params.get('type') || 'linear';
                this.state.angle = parseInt(params.get('angle')) || 90;
                this.state.position = params.get('position') || 'center';
                this.state.colors = JSON.parse(params.get('colors'));

                this.setGradientType(this.state.type);
                this.setAngle(this.state.angle);
                this.setRadialPosition(this.state.position);
                this.renderColorStops();
                this.updatePreview();
                this.updateCSSOutput();
            }
        } catch (error) {
            console.error('Error loading from URL:', error);
        }
    }

    saveFavorite() {
        const name = prompt('Enter a name for this gradient:');
        if (!name) return;

        const favorite = {
            name,
            type: this.state.type,
            angle: this.state.angle,
            position: this.state.position,
            colors: [...this.state.colors],
            css: this.generateCSS(),
            timestamp: Date.now()
        };

        this.state.favorites.push(favorite);
        this.saveFavorites();
        this.renderPresets('favorites');
        this.showToast('Gradient saved to favorites!', 'success');
    }

    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('gradient-favorites')) || [];
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('gradient-favorites', JSON.stringify(this.state.favorites));
    }

    loadRecent() {
        try {
            return JSON.parse(localStorage.getItem('gradient-recent')) || [];
        } catch {
            return [];
        }
    }

    saveRecent(gradient) {
        this.state.recent.unshift(gradient);
        this.state.recent = this.state.recent.slice(0, 20); // Keep only 20 recent
        localStorage.setItem('gradient-recent', JSON.stringify(this.state.recent));
    }

    exportPresets() {
        const data = {
            favorites: this.state.favorites,
            recent: this.state.recent,
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradient-presets-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Presets exported successfully!', 'success');
    }

    importPresets(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.favorites) {
                    this.state.favorites = [...this.state.favorites, ...data.favorites];
                    this.saveFavorites();
                }
                if (data.recent) {
                    this.state.recent = [...data.recent, ...this.state.recent].slice(0, 20);
                    localStorage.setItem('gradient-recent', JSON.stringify(this.state.recent));
                }
                this.renderPresets('favorites');
                this.showToast('Presets imported successfully!', 'success');
            } catch (error) {
                this.showToast('Error importing presets', 'error');
            }
        };
        reader.readAsText(file);
    }

    switchPresetTab(tab) {
        document.querySelectorAll('.preset-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.renderPresets(tab);
    }

    renderPresets(tab) {
        const grid = document.getElementById('presetsGrid');
        let presets = [];

        switch (tab) {
            case 'popular':
                presets = this.presets.popular;
                break;
            case 'favorites':
                presets = this.state.favorites;
                break;
            case 'recent':
                presets = this.state.recent;
                break;
        }

        grid.innerHTML = '';

        if (presets.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No presets available</div>';
            return;
        }

        presets.forEach((preset, index) => {
            const card = document.createElement('div');
            card.className = 'preset-card';
            card.style.background = preset.css;
            card.innerHTML = `
                <div class="preset-info">
                    <div>${preset.name}</div>
                </div>
                <button class="preset-favorite ${this.isFavorited(preset) ? 'favorited' : ''}" 
                        data-preset-index="${index}" data-tab="${tab}">
                    ${this.isFavorited(preset) ? '★' : '☆'}
                </button>
            `;

            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('preset-favorite')) {
                    this.applyPreset(preset);
                }
            });

            const favoriteBtn = card.querySelector('.preset-favorite');
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(preset, tab);
            });

            grid.appendChild(card);
        });
    }

    applyPreset(preset) {
        this.state.type = preset.type || 'linear';
        this.state.angle = preset.angle || 90;
        this.state.position = preset.position || 'center';
        this.state.colors = preset.colors || [
            { hex: '#ff7a18', position: 0 },
            { hex: '#319197', position: 100 }
        ];

        this.setGradientType(this.state.type);
        this.setAngle(this.state.angle);
        this.setRadialPosition(this.state.position);
        this.renderColorStops();
        this.updatePreview();
        this.updateCSSOutput();
        this.updateURL();

        // Add to recent
        this.saveRecent({
            name: preset.name,
            type: this.state.type,
            angle: this.state.angle,
            position: this.state.position,
            colors: [...this.state.colors],
            css: this.generateCSS(),
            timestamp: Date.now()
        });

        this.showToast(`Applied "${preset.name}" gradient!`, 'success');
    }

    isFavorited(preset) {
        return this.state.favorites.some(fav => fav.css === preset.css);
    }

    toggleFavorite(preset, currentTab) {
        const existingIndex = this.state.favorites.findIndex(fav => fav.css === preset.css);

        if (existingIndex >= 0) {
            this.state.favorites.splice(existingIndex, 1);
            this.showToast('Removed from favorites', 'success');
        } else {
            const favorite = {
                name: preset.name,
                type: preset.type || 'linear',
                angle: preset.angle || 90,
                position: preset.position || 'center',
                colors: preset.colors || [
                    { hex: '#ff7a18', position: 0 },
                    { hex: '#319197', position: 100 }
                ],
                css: preset.css,
                timestamp: Date.now()
            };
            this.state.favorites.push(favorite);
            this.showToast('Added to favorites', 'success');
        }

        this.saveFavorites();
        this.renderPresets(currentTab);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    handleKeyboard(event) {
        // Ctrl/Cmd + C: Copy CSS
        if ((event.ctrlKey || event.metaKey) && event.key === 'c' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            this.copyCss();
        }

        // Ctrl/Cmd + R: Randomize
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            this.randomizeGradient();
        }

        // Ctrl/Cmd + S: Save to favorites
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.saveFavorite();
        }

        // Ctrl/Cmd + D: Download PNG
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            this.downloadPNG();
        }

        // Space: Randomize when not in input
        if (event.key === ' ' && !event.target.matches('input, textarea, button')) {
            event.preventDefault();
            this.randomizeGradient();
        }

        // Arrow keys: Adjust angle
        if (this.state.type === 'linear' && !event.target.matches('input, textarea')) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                this.setAngle(Math.max(0, this.state.angle - 5));
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                this.setAngle(Math.min(360, this.state.angle + 5));
            }
        }
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Utility methods
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // Cleanup method
    destroy() {
        if (this.updateFrame) {
            cancelAnimationFrame(this.updateFrame);
        }
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('hashchange', this.loadFromURL);
    }
}

// Initialize the gradient generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gradientGenerator = new GradientGenerator();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradientGenerator;
}
