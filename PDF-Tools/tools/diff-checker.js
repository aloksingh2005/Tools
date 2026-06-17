import { loadScript } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="diffLeft">Original</label>
            <textarea id="diffLeft" class="tool-textarea" placeholder="Paste original text"></textarea>
        </div>
        <div class="tool-field">
            <label for="diffRight">Updated</label>
            <textarea id="diffRight" class="tool-textarea" placeholder="Paste updated text"></textarea>
        </div>
        <div class="tool-field">
            <label>Diff output</label>
            <div id="diffOutput" class="tool-textarea" style="min-height:160px; white-space:pre-wrap;"></div>
        </div>
    `;

    var left = panel.querySelector('#diffLeft');
    var right = panel.querySelector('#diffRight');
    var output = panel.querySelector('#diffOutput');

    function renderDiff() {
        if (!window.Diff) {
            output.textContent = 'Loading diff engine...';
            return;
        }
        var diff = window.Diff.diffLines(left.value || '', right.value || '');
        var html = diff.map(function (part) {
            var className = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
            return '<span class="' + className + '">' + part.value.replace(/</g, '&lt;') + '</span>';
        }).join('');
        output.innerHTML = html || 'No differences found.';
    }

    function handleInput() {
        renderDiff();
    }

    [left, right].forEach(function (el) {
        el.addEventListener('input', handleInput);
    });

    loadScript('https://cdn.jsdelivr.net/npm/diff@5.2.0/dist/diff.min.js')
        .then(renderDiff)
        .catch(function () {
            output.textContent = 'Unable to load diff engine.';
        });
}
