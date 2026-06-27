// Application State
let currentTheme = 'light';
let lastWordCount = 0;
let lastCharCount = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedTheme = localStorage.getItem('wordCounterTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme();
    }

    // Load saved text if available
    const savedText = localStorage.getItem('wordCounterText');
    if (savedText) {
        document.getElementById('textInput').value = savedText;
        updateStats();
    }

    // Add keyboard shortcuts
    setupKeyboardShortcuts();

    // Initial stats update
    updateStats();
});

/**
 * Updates all statistics in real-time as user types
 */
function updateStats() {
    const text = document.getElementById('textInput').value;

    // Save text to localStorage for persistence
    localStorage.setItem('wordCounterText', text);

    // Calculate statistics
    const stats = calculateTextStats(text);

    // Update UI with animations for changed values
    updateStatValue('wordCount', stats.words, lastWordCount);
    updateStatValue('charCount', stats.characters, lastCharCount);
    updateStatValue('charCountNoSpaces', stats.charactersNoSpaces);
    updateStatValue('sentenceCount', stats.sentences);
    updateStatValue('paragraphCount', stats.paragraphs);
    updateStatValue('readingTime', stats.readingTime);

    // Store last values for comparison
    lastWordCount = stats.words;
    lastCharCount = stats.characters;
}

/**
 * Calculates comprehensive text statistics
 * @param {string} text - The input text to analyze
 * @returns {Object} Statistics object
 */
function calculateTextStats(text) {
    if (!text || text.trim() === '') {
        return {
            words: 0,
            characters: 0,
            charactersNoSpaces: 0,
            sentences: 0,
            paragraphs: 0,
            readingTime: '0 min'
        };
    }

    // Word count - split by whitespace and filter empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Character count
    const characterCount = text.length;
    const characterCountNoSpaces = text.replace(/\s/g, '').length;

    // Sentence count - split by sentence endings
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;

    // Paragraph count - split by double line breaks
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = paragraphs.length || (text.trim() ? 1 : 0);

    // Reading time calculation (200 words per minute)
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    let readingTime;
    if (readingTimeMinutes < 1) {
        readingTime = '< 1 min';
    } else if (readingTimeMinutes === 1) {
        readingTime = '1 min';
    } else {
        readingTime = `${readingTimeMinutes} min`;
    }

    return {
        words: wordCount,
        characters: characterCount,
        charactersNoSpaces: characterCountNoSpaces,
        sentences: sentenceCount,
        paragraphs: paragraphCount,
        readingTime: readingTime
    };
}

/**
 * Updates a stat value with highlighting animation
 * @param {string} elementId - The ID of the element to update
 * @param {number|string} newValue - The new value to display
 * @param {number} oldValue - The previous value for comparison
 */
function updateStatValue(elementId, newValue, oldValue = null) {
    const element = document.getElementById(elementId);
    element.textContent = newValue;

    // Add highlight animation if value changed
    if (oldValue !== null && newValue !== oldValue) {
        element.classList.add('highlight');
        setTimeout(() => {
            element.classList.remove('highlight');
        }, 2000);
    }
}

/**
 * Copies text content to clipboard
 */
async function copyToClipboard() {
    const text = document.getElementById('textInput').value;

    if (!text.trim()) {
        showNotification('No text to copy!', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showNotification('Text copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.getElementById('textInput');
        textArea.select();
        textArea.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            showNotification('Text copied to clipboard!');
        } catch (fallbackErr) {
            showNotification('Failed to copy text. Please try manually.', 'error');
        }
    }
}

/**
 * Downloads the text content as a .txt file
 */
function downloadText() {
    const text = document.getElementById('textInput').value;

    if (!text.trim()) {
        showNotification('No text to download!', 'error');
        return;
    }

    // Create blob with text content
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;

    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
    link.download = `word-counter-text-${timestamp}.txt`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    showNotification('Text file downloaded successfully!');
}

/**
 * Clears all text from the textarea
 */
function clearText() {
    const textArea = document.getElementById('textInput');

    if (!textArea.value.trim()) {
        showNotification('Text area is already empty!', 'error');
        return;
    }

    if (confirm('Are you sure you want to clear all text? This action cannot be undone.')) {
        textArea.value = '';
        localStorage.removeItem('wordCounterText');
        updateStats();
        textArea.focus();
        showNotification('Text cleared successfully!');
    }
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('wordCounterTheme', currentTheme);
    showNotification(`Switched to ${currentTheme} mode!`);
}

/**
 * Applies the current theme to the document
 */
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

/**
 * Shows a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success' or 'error')
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Sets up keyboard shortcuts for common actions
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter: Copy to clipboard
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            copyToClipboard();
        }

        // Ctrl/Cmd + S: Download text
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadText();
        }

        // Ctrl/Cmd + Shift + Delete: Clear text
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Delete') {
            e.preventDefault();
            clearText();
        }

        // Ctrl/Cmd + D: Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Auto-save functionality with debouncing
let saveTimeout;
document.getElementById('textInput').addEventListener('input', function () {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('wordCounterText', this.value);
    }, 1000);
});

// Focus textarea on page load for better UX
window.addEventListener('load', function () {
    document.getElementById('textInput').focus();
});