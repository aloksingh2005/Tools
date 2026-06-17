import { createNotice, readFileAsArrayBuffer } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="hashInput">Text input</label>
            <textarea id="hashInput" class="tool-textarea" placeholder="Paste text to hash"></textarea>
        </div>
        <div class="tool-field">
            <label for="hashFile">Or choose a file</label>
            <input id="hashFile" class="tool-input" type="file">
        </div>
        <div class="tool-field">
            <label for="hashAlgorithm">Algorithm</label>
            <select id="hashAlgorithm" class="tool-select">
                <option value="SHA-256" selected>SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
                <option value="SHA-1">SHA-1 (legacy)</option>
            </select>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="generate">Generate hash</button>
        </div>
        <div class="tool-field">
            <label for="hashOutput">Hash output</label>
            <textarea id="hashOutput" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#hashInput');
    var fileInput = panel.querySelector('#hashFile');
    var algorithm = panel.querySelector('#hashAlgorithm');
    var output = panel.querySelector('#hashOutput');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function digest(buffer) {
        return crypto.subtle.digest(algorithm.value, buffer).then(function (hashBuffer) {
            var bytes = Array.from(new Uint8Array(hashBuffer));
            return bytes.map(function (b) {
                return b.toString(16).padStart(2, '0');
            }).join('');
        });
    }

    panel.querySelector('[data-action="generate"]').addEventListener('click', function () {
        var file = fileInput.files[0];
        if (file) {
            readFileAsArrayBuffer(file)
                .then(function (buffer) {
                    return digest(buffer);
                })
                .then(function (hash) {
                    output.value = hash;
                    updateStatus('Hashed file: ' + file.name, 'success');
                })
                .catch(function () {
                    updateStatus('Unable to hash file.', 'error');
                });
            return;
        }

        if (!input.value.trim()) {
            updateStatus('Add text or select a file.', 'error');
            return;
        }
        var encoder = new TextEncoder();
        digest(encoder.encode(input.value.trim()))
            .then(function (hash) {
                output.value = hash;
                updateStatus('Hash generated.', 'success');
            })
            .catch(function () {
                updateStatus('Unable to hash input.', 'error');
            });
    });
}
