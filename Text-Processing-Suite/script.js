// Global variables
let currentTheme = 'light';

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('textProcessorTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon();
    }

    // Initial stats update
    updateStats();

    // Add fade-in animation
    document.querySelector('.container').classList.add('fade-in');
});

/**
 * Updates all text statistics in real-time
 */
function updateStats() {
    const text = document.getElementById('textInput').value;

    // Word count (split by whitespace, filter empty strings)
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/).filter(word => word.length > 0);
    document.getElementById('wordCount').textContent = words.length;

    // Character count
    document.getElementById('charCount').textContent = text.length;

    // Character count without spaces
    document.getElementById('charCountNoSpaces').textContent = text.replace(/\s/g, '').length;

    // Sentence count (split by sentence endings)
    const sentences = text.trim() === '' ? [] : text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    document.getElementById('sentenceCount').textContent = sentences.length;

    // Paragraph count (split by double line breaks or more)
    const paragraphs = text.trim() === '' ? [] : text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    document.getElementById('paragraphCount').textContent = paragraphs.length;

    // Reading time calculation (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words.length / 200);
    const readingTimeText = readingTimeMinutes === 1 ? '1 min' : `${readingTimeMinutes} min`;
    document.getElementById('readingTime').textContent = readingTimeText;
}

/**
 * Converts text case based on the specified type
 * @param {string} caseType - Type of case conversion (upper, lower, title, sentence)
 */
function convertCase(caseType) {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;

    if (text.trim() === '') {
        showNotification('Please enter some text first!', 'warning');
        return;
    }

    let convertedText = '';

    switch (caseType) {
        case 'upper':
            convertedText = text.toUpperCase();
            break;
        case 'lower':
            convertedText = text.toLowerCase();
            break;
        case 'title':
            convertedText = text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
            break;
        case 'sentence':
            convertedText = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            break;
        default:
            return;
    }

    textArea.value = convertedText;
    updateStats();
    showNotification(`Text converted to ${caseType} case!`, 'success');
}

/**
 * Removes extra spaces, tabs, and multiple line breaks
 */
function removeExtraSpaces() {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;

    if (text.trim() === '') {
        showNotification('Please enter some text first!', 'warning');
        return;
    }

    // Remove extra spaces and tabs, normalize line breaks
    const cleanedText = text
        .replace(/[ \t]+/g, ' ')           // Replace multiple spaces/tabs with single space
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple line breaks with double line breaks
        .trim();                           // Remove leading/trailing whitespace

    textArea.value = cleanedText;
    updateStats();
    showNotification('Extra spaces removed!', 'success');
}

/**
 * Removes duplicate lines from the text
 */
function removeDuplicateLines() {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;

    if (text.trim() === '') {
        showNotification('Please enter some text first!', 'warning');
        return;
    }

    const lines = text.split('\n');
    const uniqueLines = [...new Set(lines)]; // Use Set to remove duplicates
    const cleanedText = uniqueLines.join('\n');

    textArea.value = cleanedText;
    updateStats();

    const removedCount = lines.length - uniqueLines.length;
    showNotification(`Removed ${removedCount} duplicate line(s)!`, 'success');
}

/**
 * Reverses text in different ways
 * @param {string} type - Type of reversal (letters, words, lines)
 */
function reverseText(type) {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;

    if (text.trim() === '') {
        showNotification('Please enter some text first!', 'warning');
        return;
    }

    let reversedText = '';

    switch (type) {
        case 'letters':
            reversedText = text.split('').reverse().join('');
            break;
        case 'words':
            reversedText = text.split(' ').reverse().join(' ');
            break;
        case 'lines':
            reversedText = text.split('\n').reverse().join('\n');
            break;
        default:
            return;
    }

    textArea.value = reversedText;
    updateStats();
    showNotification(`Text reversed by ${type}!`, 'success');
}

/**
 * Sorts text lines alphabetically
 * @param {string} order - Sort order (asc or desc)
 */
function sortText(order) {
    const textArea = document.getElementById('textInput');
    const text = textArea.value;

    if (text.trim() === '') {
        showNotification('Please enter some text first!', 'warning');
        return;
    }

    const lines = text.split('\n');
    const sortedLines = lines.sort((a, b) => {
        if (order === 'asc') {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    textArea.value = sortedLines.join('\n');
    updateStats();
    showNotification(`Text sorted ${order === 'asc' ? 'A→Z' : 'Z→A'}!`, 'success');
}

/**
 * Copies text to clipboard
 */
async function copyToClipboard() {
    const text = document.getElementById('textInput').value;

    if (text.trim() === '') {
        showNotification('No text to copy!', 'warning');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showNotification('Text copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.getElementById('textInput');
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showNotification('Text copied to clipboard!', 'success');
    }
}

/**
 * Downloads text as a .txt file
 */
function downloadText() {
    const text = document.getElementById('textInput').value;

    if (text.trim() === '') {
        showNotification('No text to download!', 'warning');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Generate filename with current date
    const now = new Date();
    const filename = `text_processed_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.txt`;

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Text file downloaded!', 'success');
}

/**
 * Clears all text from the textarea
 */
function clearText() {
    if (confirm('Are you sure you want to clear all text?')) {
        document.getElementById('textInput').value = '';
        updateStats();
        showNotification('Text cleared!', 'success');
    }
}

/**
 * Toggles between light and dark theme
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('textProcessorTheme', currentTheme);
    updateThemeIcon();
    showNotification(`Switched to ${currentTheme} mode!`, 'success');
}

/**
 * Updates the theme toggle button icon
 */
function updateThemeIcon() {
    const themeButton = document.querySelector('.theme-toggle');
    themeButton.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    themeButton.title = `Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`;
}

/**
 * Shows a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - Type of notification (success, warning, error)
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show`;

    // Change background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'var(--success-color)';
            break;
        case 'warning':
            notification.style.background = 'var(--warning-color)';
            break;
        case 'error':
            notification.style.background = 'var(--danger-color)';
            break;
        default:
            notification.style.background = 'var(--success-color)';
    }

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + Enter to copy text
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyToClipboard();
    }

    // Ctrl/Cmd + D to download text
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadText();
    }

    // Ctrl/Cmd + Shift + C to clear text
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearText();
    }
});

// Auto-save text to localStorage (optional feature)
let saveTimeout;
document.getElementById('textInput').addEventListener('input', function () {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('textProcessorContent', this.value);
    }, 1000); // Save after 1 second of no typing
});

// Load saved text on page load
window.addEventListener('load', function () {
    const savedText = localStorage.getItem('textProcessorContent');
    if (savedText) {
        document.getElementById('textInput').value = savedText;
        updateStats();
    }
});