import { copyToClipboard, createNotice } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="jsonInput">JSON input</label>
            <textarea id="jsonInput" class="tool-textarea" placeholder='{"status":"ok"}'></textarea>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="format">Format</button>
            <button class="btn btn-ghost" type="button" data-action="minify">Minify</button>
            <button class="btn btn-ghost" type="button" data-action="copy">Copy output</button>
            <button class="btn btn-ghost" type="button" data-action="clear">Clear</button>
        </div>
        <div class="tool-field">
            <label for="jsonOutput">Output</label>
            <textarea id="jsonOutput" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#jsonInput');
    var output = panel.querySelector('#jsonOutput');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function parseJson() {
        var value = input.value.trim();
        if (!value) {
            updateStatus('Add JSON to format.', 'error');
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (error) {
            updateStatus('Invalid JSON: ' + error.message, 'error');
            return null;
        }
    }

    panel.querySelector('[data-action="format"]').addEventListener('click', function () {
        var parsed = parseJson();
        if (!parsed) {
            return;
        }
        output.value = JSON.stringify(parsed, null, 2);
        updateStatus('Formatted successfully.', 'success');
    });

    panel.querySelector('[data-action="minify"]').addEventListener('click', function () {
        var parsed = parseJson();
        if (!parsed) {
            return;
        }
        output.value = JSON.stringify(parsed);
        updateStatus('Minified successfully.', 'success');
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

    panel.querySelector('[data-action="clear"]').addEventListener('click', function () {
        input.value = '';
        output.value = '';
        status.innerHTML = '';
    });
}
