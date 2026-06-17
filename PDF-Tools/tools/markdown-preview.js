import { debounce, loadScript } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="markdownInput">Markdown</label>
            <textarea id="markdownInput" class="tool-textarea" placeholder="# Heading\nWrite Markdown here."></textarea>
        </div>
        <div class="tool-field">
            <label>Preview</label>
            <div id="markdownPreview" class="tool-textarea" style="min-height:220px;"></div>
        </div>
    `;

    var input = panel.querySelector('#markdownInput');
    var preview = panel.querySelector('#markdownPreview');

    function renderMarkdown() {
        if (!window.marked) {
            preview.textContent = 'Loading preview engine...';
            return;
        }
        preview.innerHTML = window.marked.parse(input.value || '');
    }

    var update = debounce(renderMarkdown, 200);
    input.addEventListener('input', update);

    loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
        .then(renderMarkdown)
        .catch(function () {
            preview.textContent = 'Unable to load Markdown engine.';
        });
}
