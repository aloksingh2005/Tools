// Application State
let currentTheme = 'light';
let isValidJSON = false;
let jsonData = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedTheme = localStorage.getItem('jsonToolTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme();
    }

    // Load saved JSON if available
    const savedJSON = localStorage.getItem('jsonToolContent');
    if (savedJSON) {
        document.getElementById('jsonEditor').value = savedJSON;
        validateJSON();
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Initial validation
    validateJSON();
});

/**
 * Validates JSON input and updates UI accordingly
 */
function validateJSON() {
    const editor = document.getElementById('jsonEditor');
    const text = editor.value.trim();
    const errorDisplay = document.getElementById('errorDisplay');
    const successDisplay = document.getElementById('successDisplay');

    // Save content to localStorage
    localStorage.setItem('jsonToolContent', text);

    // Update statistics
    updateStatistics(text);

    if (!text) {
        // Empty input
        editor.className = 'json-editor';
        errorDisplay.classList.remove('show');
        successDisplay.classList.remove('show');
        document.getElementById('jsonStatus').textContent = 'Ready';
        isValidJSON = false;
        jsonData = null;
        return;
    }

    try {
        // Attempt to parse JSON
        jsonData = JSON.parse(text);
        isValidJSON = true;

        // Show success state
        editor.className = 'json-editor success';
        errorDisplay.classList.remove('show');
        successDisplay.textContent = '✅ Valid JSON';
        successDisplay.classList.add('show');
        document.getElementById('jsonStatus').textContent = 'Valid';

        // Update detailed statistics
        updateJSONStatistics(jsonData);

    } catch (error) {
        // Invalid JSON
        isValidJSON = false;
        jsonData = null;

        // Show error state
        editor.className = 'json-editor error';
        successDisplay.classList.remove('show');

        // Format error message
        let errorMessage = error.message;
        const lineMatch = errorMessage.match(/line (\d+)/i);
        const posMatch = errorMessage.match(/position (\d+)/i);

        if (lineMatch || posMatch) {
            errorMessage = `❌ Syntax Error: ${errorMessage}`;
        } else {
            errorMessage = `❌ Invalid JSON: ${errorMessage}`;
        }

        errorDisplay.textContent = errorMessage;
        errorDisplay.classList.add('show');
        document.getElementById('jsonStatus').textContent = 'Invalid';
    }
}

/**
 * Updates basic text statistics
 */
function updateStatistics(text) {
    const size = new Blob([text]).size;
    const lines = text ? text.split('\n').length : 0;

    document.getElementById('jsonSize').textContent = formatFileSize(size);
    document.getElementById('jsonLines').textContent = lines.toLocaleString();
}

/**
 * Updates detailed JSON object statistics
 */
function updateJSONStatistics(data) {
    const stats = analyzeJSON(data);
    document.getElementById('jsonObjects').textContent = stats.objects.toLocaleString();
    document.getElementById('jsonArrays').textContent = stats.arrays.toLocaleString();
}

/**
 * Analyzes JSON structure to count objects and arrays
 */
function analyzeJSON(data) {
    let objects = 0;
    let arrays = 0;

    function traverse(obj) {
        if (Array.isArray(obj)) {
            arrays++;
            obj.forEach(traverse);
        } else if (obj !== null && typeof obj === 'object') {
            objects++;
            Object.values(obj).forEach(traverse);
        }
    }

    traverse(data);
    return { objects, arrays };
}

/**
 * Formats JSON with proper indentation
 */
function formatJSON() {
    if (!isValidJSON || !jsonData) {
        showNotification('Please enter valid JSON first!', 'error');
        return;
    }

    try {
        const formatted = JSON.stringify(jsonData, null, 2);
        document.getElementById('jsonEditor').value = formatted;
        validateJSON();
        showNotification('JSON formatted successfully!');
    } catch (error) {
        showNotification('Error formatting JSON: ' + error.message, 'error');
    }
}

/**
 * Minifies JSON by removing all unnecessary whitespace
 */
function minifyJSON() {
    if (!isValidJSON || !jsonData) {
        showNotification('Please enter valid JSON first!', 'error');
        return;
    }

    try {
        const minified = JSON.stringify(jsonData);
        document.getElementById('jsonEditor').value = minified;
        validateJSON();
        showNotification('JSON minified successfully!');
    } catch (error) {
        showNotification('Error minifying JSON: ' + error.message, 'error');
    }
}

/**
 * Compresses JSON by removing extra whitespace (alternative to minify)
 */
function compressJSON() {
    const text = document.getElementById('jsonEditor').value.trim();
    if (!text) {
        showNotification('Please enter some JSON first!', 'error');
        return;
    }

    // Remove extra whitespace while preserving structure
    const compressed = text
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}[\],:])\s*/g, '$1')
        .trim();

    document.getElementById('jsonEditor').value = compressed;
    validateJSON();
    showNotification('Whitespace removed successfully!');
}

/**
 * Copies JSON content to clipboard
 */
async function copyToClipboard() {
    const text = document.getElementById('jsonEditor').value;

    if (!text.trim()) {
        showNotification('No JSON to copy!', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        showNotification('JSON copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const editor = document.getElementById('jsonEditor');
        editor.select();
        editor.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            showNotification('JSON copied to clipboard!');
        } catch (fallbackErr) {
            showNotification('Failed to copy. Please try manually.', 'error');
        }
    }
}

/**
 * Downloads JSON as a .json file
 */
function downloadJSON() {
    const text = document.getElementById('jsonEditor').value.trim();

    if (!text) {
        showNotification('No JSON to download!', 'error');
        return;
    }

    // Create blob with JSON content
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;

    // Generate filename with timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[:.]/g, '-');
    link.download = `json-data-${timestamp}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    showNotification('JSON file downloaded successfully!');
}

/**
 * Clears the editor
 */
function clearEditor() {
    const editor = document.getElementById('jsonEditor');

    if (!editor.value.trim()) {
        showNotification('Editor is already empty!', 'error');
        return;
    }

    if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
        editor.value = '';
        localStorage.removeItem('jsonToolContent');
        validateJSON();
        editor.focus();
        showNotification('Editor cleared!');
    }
}

/**
 * Loads a sample JSON for testing
 */
function loadSampleJSON() {
    const sampleJSON = {
        "name": "John Doe",
        "age": 30,
        "email": "john.doe@example.com",
        "address": {
            "street": "123 Main St",
            "city": "New York",
            "zipCode": "10001",
            "country": "USA"
        },
        "hobbies": ["reading", "coding", "traveling", "photography"],
        "isActive": true,
        "skills": [
            {
                "name": "JavaScript",
                "level": "Advanced"
            },
            {
                "name": "Python",
                "level": "Intermediate"
            },
            {
                "name": "React",
                "level": "Advanced"
            }
        ],
        "socialMedia": {
            "twitter": "@johndoe",
            "linkedin": "linkedin.com/in/johndoe",
            "github": "github.com/johndoe"
        }
    };

    document.getElementById('jsonEditor').value = JSON.stringify(sampleJSON, null, 2);
    validateJSON();
    showNotification('Sample JSON loaded!');
}

/**
 * Validates JSON and shows detailed information
 */
function validateAndShowDetails() {
    validateJSON();

    if (isValidJSON) {
        const stats = analyzeJSON(jsonData);
        const message = `✅ JSON is valid!\n\nDetails:\n• Objects: ${stats.objects}\n• Arrays: ${stats.arrays}\n• Size: ${document.getElementById('jsonSize').textContent}`;
        alert(message);
    } else {
        showNotification('Please fix JSON errors first!', 'error');
    }
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('jsonToolTheme', currentTheme);
    showNotification(`Switched to ${currentTheme} mode!`);
}

/**
 * Applies the current theme
 */
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeIcon = document.getElementById('theme-icon');
    const prismDarkTheme = document.getElementById('prism-dark-theme');

    if (currentTheme === 'dark') {
        themeIcon.textContent = '☀️';
        prismDarkTheme.disabled = false;
    } else {
        themeIcon.textContent = '🌙';
        prismDarkTheme.disabled = true;
    }
}

/**
 * Shows notification to user
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
 * Formats file size in human readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Sets up keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter: Format JSON
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            formatJSON();
        }

        // Ctrl/Cmd + M: Minify JSON
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            minifyJSON();
        }

        // Ctrl/Cmd + S: Download JSON
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadJSON();
        }

        // Ctrl/Cmd + Shift + C: Copy to clipboard
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyToClipboard();
        }

        // Ctrl/Cmd + D: Toggle theme
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// Auto-save with debouncing
let saveTimeout;
document.getElementById('jsonEditor').addEventListener('input', function () {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('jsonToolContent', this.value);
    }, 1000);
});

// Focus editor on page load
window.addEventListener('load', function () {
    document.getElementById('jsonEditor').focus();
});