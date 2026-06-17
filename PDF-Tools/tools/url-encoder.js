import { copyToClipboard, createNotice } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="urlInput">Input</label>
            <textarea id="urlInput" class="tool-textarea" placeholder="Paste a URL or query string"></textarea>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="encode">Encode</button>
            <button class="btn btn-ghost" type="button" data-action="decode">Decode</button>
            <button class="btn btn-ghost" type="button" data-action="copy">Copy output</button>
        </div>
        <div class="tool-field">
            <label for="urlOutput">Output</label>
            <textarea id="urlOutput" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#urlInput');
    var output = panel.querySelector('#urlOutput');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    panel.querySelector('[data-action="encode"]').addEventListener('click', function () {
        if (!input.value.trim()) {
            updateStatus('Add text to encode.', 'error');
            return;
        }
        output.value = encodeURIComponent(input.value.trim());
        updateStatus('Encoded successfully.', 'success');
    });

    panel.querySelector('[data-action="decode"]').addEventListener('click', function () {
        if (!input.value.trim()) {
            updateStatus('Add text to decode.', 'error');
            return;
        }
        try {
            output.value = decodeURIComponent(input.value.trim());
            updateStatus('Decoded successfully.', 'success');
        } catch (error) {
            updateStatus('Invalid encoded value.', 'error');
        }
    });

    panel.querySelector('[data-action="copy"]').addEventListener('click', function () {
        if (!output.value) {
            updateStatus('Nothing to copy yet.', 'error');
            return;
        }
        copyToClipboard(output.value)
            .then(function () {
                updateStatus('Copied to clipboard.', 'success');
            })
            .catch(function () {
                updateStatus('Clipboard access denied.', 'error');
            });
    });
}
