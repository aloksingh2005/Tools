(function () {
    const themeToggle = document.getElementById('theme-toggle');
    const patternInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testString = document.getElementById('test-string');
    const replacement = document.getElementById('replacement');
    const matchBtn = document.getElementById('action-match');
    const replaceBtn = document.getElementById('action-replace');
    const splitBtn = document.getElementById('action-split');
    const resultsStats = document.getElementById('results-stats');
    const highlightedText = document.getElementById('highlighted-text');
    const matchesList = document.getElementById('matches-list');

    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('tools-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    function getRegex() {
        const pattern = patternInput.value.trim();
        const flags = flagsInput.value.trim();
        if (!pattern) return null;
        try {
            return new RegExp(pattern, flags);
        } catch (e) {
            resultsStats.textContent = 'Error: ' + e.message;
            highlightedText.innerHTML = '';
            matchesList.innerHTML = '';
            return null;
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function doMatch() {
        const regex = getRegex();
        if (!regex) return;
        const text = testString.value || '';
        const matches = [];
        const global = regex.global;
        let match;
        let matchIndex = 0;

        if (global) {
            const gRegex = new RegExp(regex.source, regex.flags);
            while ((match = gRegex.exec(text)) !== null) {
                matches.push({ index: match.index, 0: match[0], groups: match.slice(1), namedGroups: match.groups });
                if (match.index === gRegex.lastIndex) gRegex.lastIndex++;
                matchIndex++;
            }
        } else {
            match = regex.exec(text);
            if (match) {
                matches.push({ index: match.index, 0: match[0], groups: match.slice(1), namedGroups: match.groups });
            }
        }

        resultsStats.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`;

        // Highlighted text
        if (matches.length === 0) {
            highlightedText.innerHTML = escapeHtml(text);
            matchesList.innerHTML = '<div class="match-item" style="color:var(--text-secondary)">No matches found</div>';
            return;
        }

        let html = '';
        let lastIndex = 0;
        for (const m of matches) {
            if (m.index > lastIndex) {
                html += escapeHtml(text.slice(lastIndex, m.index));
            }
            html += `<span class="match-highlight">${escapeHtml(m[0])}</span>`;
            lastIndex = m.index + m[0].length;
        }
        if (lastIndex < text.length) {
            html += escapeHtml(text.slice(lastIndex));
        }
        highlightedText.innerHTML = html;

        // Match list
        let listHtml = '';
        matches.forEach((m, i) => {
            listHtml += `<div class="match-item"><span class="match-index">#${i + 1}</span> "${escapeHtml(m[0])}" at index ${m.index}`;
            if (m.groups && m.groups.length > 0) {
                listHtml += '<div class="match-groups">';
                m.groups.forEach((g, gi) => {
                    if (g !== undefined) {
                        const name = m.namedGroups && Object.keys(m.namedGroups).find(k => m.namedGroups[k] === g);
                        listHtml += `<span>Group ${name ? name : gi + 1}: "${escapeHtml(String(g))}"</span>`;
                    }
                });
                listHtml += '</div>';
            }
            listHtml += '</div>';
        });
        matchesList.innerHTML = listHtml;
    }

    function doReplace() {
        const regex = getRegex();
        if (!regex) return;
        const text = testString.value || '';
        const replace = replacement.value || '';

        let result;
        try {
            const gRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
            result = text.replace(gRegex, replace);
        } catch (e) {
            resultsStats.textContent = 'Replace error: ' + e.message;
            return;
        }

        const count = (text.match(new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g')) || []).length;
        resultsStats.textContent = `${count} occurrence${count !== 1 ? 's' : ''} replaced`;

        // Show diff highlighting
        let html = '';
        let lastIndex = 0;
        const gRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        let m;
        while ((m = gRegex.exec(text)) !== null) {
            if (m.index > lastIndex) {
                html += escapeHtml(text.slice(lastIndex, m.index));
            }
            html += `<span class="match-highlight" style="text-decoration:line-through;">${escapeHtml(m[0])}</span>`;
            lastIndex = m.index + m[0].length;
            if (m.index === gRegex.lastIndex) gRegex.lastIndex++;
        }
        if (lastIndex < text.length) {
            html += escapeHtml(text.slice(lastIndex));
        }
        html += '<br><br><strong style="color:var(--primary-color)">Result:</strong><br>';
        html += escapeHtml(result);
        highlightedText.innerHTML = html;
        matchesList.innerHTML = '';
    }

    function doSplit() {
        const regex = getRegex();
        if (!regex) return;
        const text = testString.value || '';
        let parts;
        try {
            parts = text.split(regex);
        } catch (e) {
            resultsStats.textContent = 'Split error: ' + e.message;
            return;
        }

        resultsStats.textContent = `${parts.length} part${parts.length !== 1 ? 's' : ''}`;

        let html = '';
        const gRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        let lastIndex = 0;
        let m;
        const splitPositions = [];
        while ((m = gRegex.exec(text)) !== null) {
            splitPositions.push(m.index);
            lastIndex = m.index + m[0].length;
            if (m.index === gRegex.lastIndex) gRegex.lastIndex++;
        }

        let remaining = text;
        let idx = 0;
        html = escapeHtml(text);
        highlightedText.innerHTML = html;

        let listHtml = '';
        parts.forEach((part, i) => {
            listHtml += `<div class="match-item"><span class="match-index">Part ${i + 1}</span> "${escapeHtml(part)}" (${part.length} chars)</div>`;
        });
        matchesList.innerHTML = listHtml;
    }

    matchBtn.addEventListener('click', doMatch);
    replaceBtn.addEventListener('click', doReplace);
    splitBtn.addEventListener('click', doSplit);

    [patternInput, flagsInput, testString].forEach(el => {
        el.addEventListener('input', doMatch);
    });

    doMatch();
})();
