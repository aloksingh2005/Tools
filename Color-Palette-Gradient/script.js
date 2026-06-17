// Color Palette & Gradient Generator
class ColorPaletteGenerator {
    constructor() {
        this.colors = [];
        this.gradientColors = [
            { color: '#667eea', position: 0 },
            { color: '#764ba2', position: 100 }
        ];
        this.gradientType = 'linear';
        this.gradientDirection = 'to right';
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedPalettes();
        this.generateRandomPalette();
        this.updateGradient();
        this.updateContrastChecker();
        this.updateColorblindSimulation();
        this.setupKeyboardShortcuts();
        
        // Initialize with some colors
        this.addColorToPalette('#667eea');
        this.addColorToPalette('#764ba2');
        this.addColorToPalette('#f093fb');
    }
    
    setupEventListeners() {
        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Palette controls
        document.getElementById('generatePalette').addEventListener('click', () => {
            this.generatePalette();
        });
        
        document.getElementById('addColor').addEventListener('click', () => {
            this.addColorToPalette();
        });
        
        document.getElementById('savePalette').addEventListener('click', () => {
            this.savePalette();
        });
        
        document.getElementById('loadPalette').addEventListener('click', () => {
            this.toggleSavedPalettes();
        });
        
        document.getElementById('exportPalette').addEventListener('click', () => {
            this.exportPalette();
        });
        
        document.getElementById('extractFromImage').addEventListener('click', () => {
            document.getElementById('imageUpload').click();
        });
        
        document.getElementById('imageUpload').addEventListener('change', (e) => {
            this.extractColorsFromImage(e.target.files[0]);
        });
        
        // Gradient controls
        document.getElementById('gradientType').addEventListener('change', (e) => {
            this.gradientType = e.target.value;
            this.updateGradient();
        });
        
        document.getElementById('gradientDirection').addEventListener('change', (e) => {
            this.gradientDirection = e.target.value;
            this.updateGradient();
        });
        
        document.getElementById('animateGradient').addEventListener('click', () => {
            this.animateGradient();
        });
        
        document.getElementById('copyGradientCSS').addEventListener('click', () => {
            this.copyToClipboard(document.getElementById('gradientCSS').value, 'Gradient CSS copied!');
        });
        
        // History controls
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });
        
        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });
        
        // Contrast checker
        document.getElementById('contrastFg').addEventListener('input', () => {
            this.updateContrastChecker();
        });
        
        document.getElementById('contrastBg').addEventListener('input', () => {
            this.updateContrastChecker();
        });
        
        // Colorblind simulator
        document.getElementById('colorblindType').addEventListener('change', () => {
            this.updateColorblindSimulation();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 'g':
                        e.preventDefault();
                        this.generatePalette();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.toggleDarkMode();
                        break;
                }
            }
        });
    }
    
    saveState() {
        const state = {
            colors: [...this.colors],
            gradientColors: [...this.gradientColors],
            gradientType: this.gradientType,
            gradientDirection: this.gradientDirection
        };
        
        // Remove future history if we're not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateHistoryButtons();
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }
    
    restoreState(state) {
        this.colors = [...state.colors];
        this.gradientColors = [...state.gradientColors];
        this.gradientType = state.gradientType;
        this.gradientDirection = state.gradientDirection;
        
        document.getElementById('gradientType').value = this.gradientType;
        document.getElementById('gradientDirection').value = this.gradientDirection;
        
        this.renderPalette();
        this.updateGradient();
        this.updateHistoryButtons();
    }
    
    updateHistoryButtons() {
        document.getElementById('undoBtn').disabled = this.historyIndex <= 0;
        document.getElementById('redoBtn').disabled = this.historyIndex >= this.history.length - 1;
    }
    
    toggleDarkMode() {
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        
        const icon = document.querySelector('.dark-mode-icon');
        icon.textContent = isDark ? '🌙' : '☀️';
        
        localStorage.setItem('darkMode', isDark ? 'light' : 'dark');
        this.showToast(`${isDark ? 'Light' : 'Dark'} mode activated`);
    }
    
    generatePalette() {
        const harmonyType = document.getElementById('harmonyType').value;
        
        this.saveState();
        this.colors = [];
        
        switch (harmonyType) {
            case 'monochromatic':
                this.generateMonochromaticPalette();
                break;
            case 'complementary':
                this.generateComplementaryPalette();
                break;
            case 'triadic':
                this.generateTriadicPalette();
                break;
            case 'analogous':
                this.generateAnalogousPalette();
                break;
            case 'splitComplementary':
                this.generateSplitComplementaryPalette();
                break;
            default:
                this.generateRandomPalette();
        }
        
        this.renderPalette();
        this.updateColorblindSimulation();
    }
    
    generateRandomPalette() {
        const colorCount = Math.floor(Math.random() * 4) + 3; // 3-6 colors
        for (let i = 0; i < colorCount; i++) {
            this.colors.push(this.generateRandomColor());
        }
    }
    
    generateMonochromaticPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const colorCount = 5;
        
        for (let i = 0; i < colorCount; i++) {
            const saturation = 60 + (i * 8);
            const lightness = 20 + (i * 15);
            this.colors.push(this.hslToHex(baseHue, saturation, lightness));
        }
    }
    
    generateComplementaryPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const complementaryHue = (baseHue + 180) % 360;
        
        this.colors.push(this.hslToHex(baseHue, 70, 50));
        this.colors.push(this.hslToHex(complementaryHue, 70, 50));
        this.colors.push(this.hslToHex(baseHue, 50, 30));
        this.colors.push(this.hslToHex(complementaryHue, 50, 70));
    }
    
    generateTriadicPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const hue2 = (baseHue + 120) % 360;
        const hue3 = (baseHue + 240) % 360;
        
        this.colors.push(this.hslToHex(baseHue, 70, 50));
        this.colors.push(this.hslToHex(hue2, 70, 50));
        this.colors.push(this.hslToHex(hue3, 70, 50));
    }
    
    generateAnalogousPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        
        for (let i = 0; i < 5; i++) {
            const hue = (baseHue + (i * 30)) % 360;
            const saturation = 60 + Math.random() * 20;
            const lightness = 40 + Math.random() * 30;
            this.colors.push(this.hslToHex(hue, saturation, lightness));
        }
    }
    
    generateSplitComplementaryPalette() {
        const baseHue = Math.floor(Math.random() * 360);
        const splitHue1 = (baseHue + 150) % 360;
        const splitHue2 = (baseHue + 210) % 360;
        
        this.colors.push(this.hslToHex(baseHue, 70, 50));
        this.colors.push(this.hslToHex(splitHue1, 70, 50));
        this.colors.push(this.hslToHex(splitHue2, 70, 50));
        this.colors.push(this.hslToHex(baseHue, 40, 70));
    }
    
    generateRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 50) + 40; // 40-90%
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
    
    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
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
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }
    
    addColorToPalette(color = null) {
        if (this.colors.length >= 10) {
            this.showToast('Maximum 10 colors allowed', 'warning');
            return;
        }
        
        this.saveState();
        const newColor = color || this.generateRandomColor();
        this.colors.push(newColor);
        this.renderPalette();
        this.updateColorblindSimulation();
    }
    
    removeColorFromPalette(index) {
        if (this.colors.length <= 2) {
            this.showToast('Minimum 2 colors required', 'warning');
            return;
        }
        
        this.saveState();
        this.colors.splice(index, 1);
        this.renderPalette();
        this.updateColorblindSimulation();
    }
    
    renderPalette() {
        const paletteContainer = document.getElementById('colorPalette');
        paletteContainer.innerHTML = '';
        
        this.colors.forEach((color, index) => {
            const colorCard = this.createColorCard(color, index);
            paletteContainer.appendChild(colorCard);
        });
        
        // Make palette sortable
        this.makeSortable(paletteContainer);
    }
    
    createColorCard(color, index) {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.draggable = true;
        card.dataset.index = index;
        
        const rgb = this.hexToRgb(color);
        const hsl = this.hexToHsl(color);
        
        card.innerHTML = `
            <div class="color-preview" style="background-color: ${color}" onclick="colorGenerator.copyToClipboard('${color}', 'Color ${color} copied!')">
                ${this.colors.length > 2 ? `<button class="remove-color" onclick="event.stopPropagation(); colorGenerator.removeColorFromPalette(${index})">&times;</button>` : ''}
            </div>
            <div class="color-info">
                <div class="color-codes">
                    <div class="color-code">
                        <span>HEX: ${color}</span>
                        <button class="copy-code-btn" onclick="colorGenerator.copyToClipboard('${color}', 'HEX copied!')">📋</button>
                    </div>
                    <div class="color-code">
                        <span>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</span>
                        <button class="copy-code-btn" onclick="colorGenerator.copyToClipboard('rgb(${rgb.r}, ${rgb.g}, ${rgb.b})', 'RGB copied!')">📋</button>
                    </div>
                    <div class="color-code">
                        <span>HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%</span>
                        <button class="copy-code-btn" onclick="colorGenerator.copyToClipboard('hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)', 'HSL copied!')">📋</button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    makeSortable(container) {
        let draggedElement = null;
        let draggedIndex = null;
        
        container.addEventListener('dragstart', (e) => {
            draggedElement = e.target.closest('.color-card');
            draggedIndex = parseInt(draggedElement.dataset.index);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetCard = e.target.closest('.color-card');
            if (targetCard && targetCard !== draggedElement) {
                const targetIndex = parseInt(targetCard.dataset.index);
                this.reorderColors(draggedIndex, targetIndex);
            }
        });
    }
    
    reorderColors(fromIndex, toIndex) {
        this.saveState();
        const [movedColor] = this.colors.splice(fromIndex, 1);
        this.colors.splice(toIndex, 0, movedColor);
        this.renderPalette();
    }
    
    // Gradient functions
    updateGradient() {
        const canvas = document.getElementById('gradientCanvas');
        const cssOutput = document.getElementById('gradientCSS');
        
        let gradientCSS = this.generateGradientCSS();
        canvas.style.background = gradientCSS;
        cssOutput.value = `background: ${gradientCSS};`;
        
        this.renderGradientColors();
    }
    
    generateGradientCSS() {
        const colorStops = this.gradientColors
            .sort((a, b) => a.position - b.position)
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(', ');
        
        switch (this.gradientType) {
            case 'linear':
                return `linear-gradient(${this.gradientDirection}, ${colorStops})`;
            case 'radial':
                return `radial-gradient(circle, ${colorStops})`;
            case 'conic':
                return `conic-gradient(from 0deg, ${colorStops})`;
            default:
                return `linear-gradient(${this.gradientDirection}, ${colorStops})`;
        }
    }
    
    renderGradientColors() {
        const container = document.getElementById('gradientColors');
        container.innerHTML = '';
        
        this.gradientColors.forEach((stop, index) => {
            const stopElement = this.createGradientColorStop(stop, index);
            container.appendChild(stopElement);
        });
        
        // Add color button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-secondary';
        addBtn.innerHTML = '+ Add Color';
        addBtn.onclick = () => this.addGradientColor();
        container.appendChild(addBtn);
    }
    
    createGradientColorStop(stop, index) {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'gradient-color-stop';
        
        stopDiv.innerHTML = `
            <input type="color" class="gradient-color-input" value="${stop.color}" 
                   onchange="colorGenerator.updateGradientColor(${index}, this.value)">
            <input type="number" class="gradient-position" value="${stop.position}" 
                   min="0" max="100" onchange="colorGenerator.updateGradientPosition(${index}, this.value)">
            <label>%</label>
            ${this.gradientColors.length > 2 ? 
                `<button class="remove-gradient-color" onclick="colorGenerator.removeGradientColor(${index})">&times;</button>` 
                : ''}
        `;
        
        return stopDiv;
    }
    
    addGradientColor() {
        const newPosition = Math.round(Math.random() * 100);
        const newColor = this.generateRandomColor();
        
        this.gradientColors.push({ color: newColor, position: newPosition });
        this.updateGradient();
    }
    
    removeGradientColor(index) {
        if (this.gradientColors.length > 2) {
            this.gradientColors.splice(index, 1);
            this.updateGradient();
        }
    }
    
    updateGradientColor(index, color) {
        this.gradientColors[index].color = color;
        this.updateGradient();
    }
    
    updateGradientPosition(index, position) {
        this.gradientColors[index].position = Math.max(0, Math.min(100, parseInt(position)));
        this.updateGradient();
    }
    
    animateGradient() {
        const canvas = document.getElementById('gradientCanvas');
        canvas.classList.toggle('gradient-animated');
        
        setTimeout(() => {
            canvas.classList.remove('gradient-animated');
        }, 3000);
    }
    
    // Accessibility functions
    updateContrastChecker() {
        const fgColor = document.getElementById('contrastFg').value;
        const bgColor = document.getElementById('contrastBg').value;
        
        const preview = document.getElementById('contrastPreview');
        const scores = document.getElementById('contrastScores');
        
        preview.style.color = fgColor;
        preview.style.backgroundColor = bgColor;
        preview.textContent = 'Sample Text - The quick brown fox jumps over the lazy dog';
        
        const ratio = this.calculateContrastRatio(fgColor, bgColor);
        
        scores.innerHTML = `
            <div class="contrast-score ${ratio >= 4.5 ? 'pass' : 'fail'}">
                <div>AA Normal</div>
                <div>${ratio >= 4.5 ? 'PASS' : 'FAIL'}</div>
                <div>${ratio.toFixed(2)}:1</div>
            </div>
            <div class="contrast-score ${ratio >= 7 ? 'pass' : 'fail'}">
                <div>AAA Normal</div>
                <div>${ratio >= 7 ? 'PASS' : 'FAIL'}</div>
                <div>${ratio.toFixed(2)}:1</div>
            </div>
            <div class="contrast-score ${ratio >= 3 ? 'pass' : 'fail'}">
                <div>AA Large</div>
                <div>${ratio >= 3 ? 'PASS' : 'FAIL'}</div>
                <div>${ratio.toFixed(2)}:1</div>
            </div>
        `;
    }
    
    calculateContrastRatio(color1, color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        
        const lightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (lightest + 0.05) / (darkest + 0.05);
    }
    
    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    
    updateColorblindSimulation() {
        const type = document.getElementById('colorblindType').value;
        const preview = document.getElementById('colorblindPreview');
        
        preview.innerHTML = '';
        
        this.colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'colorblind-color';
            colorDiv.style.backgroundColor = this.simulateColorblindness(color, type);
            colorDiv.title = `Original: ${color}, Simulated: ${this.simulateColorblindness(color, type)}`;
            preview.appendChild(colorDiv);
        });
    }
    
    simulateColorblindness(hex, type) {
        if (type === 'normal') return hex;
        
        const rgb = this.hexToRgb(hex);
        let { r, g, b } = rgb;
        
        // Simplified colorblindness simulation
        switch (type) {
            case 'protanopia': // Red-blind
                r = r * 0.567 + g * 0.433;
                g = g * 0.558 + b * 0.442;
                break;
            case 'deuteranopia': // Green-blind
                r = r * 0.625 + g * 0.375;
                g = g * 0.7 + b * 0.3;
                break;
            case 'tritanopia': // Blue-blind
                g = g * 0.95 + b * 0.05;
                b = b * 0.433 + r * 0.567;
                break;
        }
        
        r = Math.round(Math.max(0, Math.min(255, r)));
        g = Math.round(Math.max(0, Math.min(255, g)));
        b = Math.round(Math.max(0, Math.min(255, b)));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Image color extraction
    extractColorsFromImage(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const colors = this.extractDominantColors(ctx, canvas.width, canvas.height);
                
                this.saveState();
                this.colors = colors;
                this.renderPalette();
                this.showToast(`Extracted ${colors.length} colors from image!`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    extractDominantColors(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const colorCounts = {};
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a < 128) continue; // Skip transparent pixels
            
            // Reduce color precision for grouping
            const key = `${Math.floor(r/32)*32},${Math.floor(g/32)*32},${Math.floor(b/32)*32}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        
        // Sort by frequency and take top colors
        const sortedColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return this.rgbToHex(r, g, b);
            });
        
        return sortedColors;
    }
    
    rgbToHex(r, g, b) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Save/Load functions
    savePalette() {
        const palettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
        const newPalette = {
            id: Date.now(),
            colors: [...this.colors],
            name: `Palette ${palettes.length + 1}`,
            created: new Date().toISOString()
        };
        
        palettes.unshift(newPalette);
        localStorage.setItem('colorPalettes', JSON.stringify(palettes));
        
        this.showToast('Palette saved successfully!');
        this.loadSavedPalettes();
    }
    
    loadSavedPalettes() {
        const palettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
        const container = document.getElementById('savedPalettesGrid');
        
        container.innerHTML = '';
        
        palettes.forEach(palette => {
            const paletteElement = document.createElement('div');
            paletteElement.className = 'saved-palette-item';
            
            const colorsHtml = palette.colors.map(color => 
                `<div class="saved-palette-color" style="background-color: ${color}"></div>`
            ).join('');
            
            paletteElement.innerHTML = `
                <div class="saved-palette-colors">${colorsHtml}</div>
                <div class="saved-palette-info">
                    <strong>${palette.name}</strong>
                    <small>${new Date(palette.created).toLocaleDateString()}</small>
                </div>
            `;
            
            paletteElement.addEventListener('click', () => {
                this.saveState();
                this.colors = [...palette.colors];
                this.renderPalette();
                this.showToast('Palette loaded!');
            });
            
            container.appendChild(paletteElement);
        });
    }
    
    toggleSavedPalettes() {
        const savedPalettes = document.getElementById('savedPalettes');
        const isVisible = savedPalettes.style.display !== 'none';
        savedPalettes.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.loadSavedPalettes();
        }
    }
    
    exportPalette() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const colorWidth = 100;
        const colorHeight = 100;
        
        canvas.width = colorWidth * this.colors.length;
        canvas.height = colorHeight;
        
        this.colors.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(index * colorWidth, 0, colorWidth, colorHeight);
        });
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `color-palette-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('Palette exported as PNG!');
        });
    }
    
    // Utility functions
    copyToClipboard(text, message = 'Copied to clipboard!') {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(message);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast(message);
        });
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application
let colorGenerator;

document.addEventListener('DOMContentLoaded', () => {
    colorGenerator = new ColorPaletteGenerator();
    
    // Load dark mode preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const icon = document.querySelector('.dark-mode-icon');
        icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but app still works
        });
    });
}
