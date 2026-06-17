import { createNotice, debounce } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="regexPattern">Pattern</label>
            <input id="regexPattern" class="tool-input" type="text" placeholder="e.g. \\b\\w+@\\w+\\.\\w+\\b">
        </div>
        <div class="tool-field">
            <label for="regexFlags">Flags</label>
            <input id="regexFlags" class="tool-input" type="text" placeholder="g i m">
        </div>
        <div class="tool-field">
            <label for="regexInput">Test text</label>
            <textarea id="regexInput" class="tool-textarea" placeholder="Paste text to test"></textarea>
        </div>
        <div class="tool-field" data-status></div>
        <div class="tool-field">
            <label>Matches</label>
            <div id="regexResults" class="tool-textarea" style="min-height:120px; white-space:pre-wrap;"></div>
        </div>
    `;

    var pattern = panel.querySelector('#regexPattern');
    var flags = panel.querySelector('#regexFlags');
    var input = panel.querySelector('#regexInput');
    var results = panel.querySelector('#regexResults');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    var runTest = debounce(function () {
        var value = input.value;
        if (!pattern.value.trim()) {
            results.textContent = '';
            status.innerHTML = '';
            return;
        }
        try {
            var regex = new RegExp(pattern.value, flags.value.replace(/\s+/g, ''));
            var matches = Array.from(value.matchAll(regex));
            if (!matches.length) {
                results.textContent = 'No matches found.';
                updateStatus('Pattern compiled. No matches yet.', 'success');
                return;
            }
            var output = matches.map(function (match, index) {
                return (index + 1) + '. ' + match[0] + ' (index ' + match.index + ')';
            }).join('\n');
            results.textContent = output;
            updateStatus(matches.length + ' matches found.', 'success');
        } catch (error) {
            results.textContent = '';
            updateStatus('Invalid regex: ' + error.message, 'error');
        }
    }, 200);

    [pattern, flags, input].forEach(function (el) {
        el.addEventListener('input', runTest);
    });
}
