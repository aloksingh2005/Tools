(function () {
    var storageKey = 'pdfToolsTheme';
    var docEl = document.documentElement;

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function resolve(value) {
        if (value === 'light' || value === 'dark') return value;
        return getSystemTheme();
    }

    var stored = null;
    try { stored = localStorage.getItem(storageKey); } catch (e) {}

    var theme = resolve(stored);
    docEl.setAttribute('data-theme', theme);
    docEl.style.colorScheme = theme;

    try {
        var media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (media && typeof media.addEventListener === 'function') {
            media.addEventListener('change', function () {
                var s = null;
                try { s = localStorage.getItem(storageKey); } catch (e) {}
                if (!s) {
                    docEl.setAttribute('data-theme', getSystemTheme());
                    docEl.style.colorScheme = getSystemTheme();
                }
            });
        }
    } catch (e) {}
})();
