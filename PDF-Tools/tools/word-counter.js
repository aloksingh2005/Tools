import { debounce } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="wordInput">Text</label>
            <textarea id="wordInput" class="tool-textarea" placeholder="Paste or write text"></textarea>
        </div>
        <div class="tool-actions" style="flex-wrap:wrap;">
            <span class="tool-chip" data-count="words">0 words</span>
            <span class="tool-chip" data-count="chars">0 characters</span>
            <span class="tool-chip" data-count="sentences">0 sentences</span>
            <span class="tool-chip" data-count="reading">0 min read</span>
        </div>
    `;

    var input = panel.querySelector('#wordInput');
    var wordsChip = panel.querySelector('[data-count="words"]');
    var charsChip = panel.querySelector('[data-count="chars"]');
    var sentenceChip = panel.querySelector('[data-count="sentences"]');
    var readingChip = panel.querySelector('[data-count="reading"]');

    function updateCounts() {
        var text = input.value || '';
        var words = text.trim().length ? text.trim().split(/\s+/).length : 0;
        var chars = text.length;
        var sentences = text.trim().length ? text.split(/[.!?]+/).filter(Boolean).length : 0;
        var reading = Math.max(1, Math.round(words / 200));

        wordsChip.textContent = words + ' words';
        charsChip.textContent = chars + ' characters';
        sentenceChip.textContent = sentences + ' sentences';
        readingChip.textContent = reading + ' min read';
    }

    var debounced = debounce(updateCounts, 150);
    input.addEventListener('input', debounced);
    updateCounts();
}
