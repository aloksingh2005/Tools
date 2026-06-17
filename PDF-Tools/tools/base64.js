import { copyToClipboard, createNotice, readFileAsArrayBuffer } from './core.js';

function arrayBufferToBase64(buffer) {
    var bytes = new Uint8Array(buffer);
    var binary = '';
    for (var i = 0; i < bytes.byteLength; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64) {
    var binary = atob(base64);
    var len = binary.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="base64Input">Input</label>
            <textarea id="base64Input" class="tool-textarea" placeholder="Paste text or Base64 data"></textarea>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="encode">Encode</button>
            <button class="btn btn-ghost" type="button" data-action="decode">Decode</button>
            <button class="btn btn-ghost" type="button" data-action="swap">Swap</button>
            <button class="btn btn-ghost" type="button" data-action="copy">Copy output</button>
        </div>
        <div class="tool-field">
            <label for="base64Output">Output</label>
            <textarea id="base64Output" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field">
            <label>File to Base64</label>
            <input id="base64File" class="tool-input" type="file">
        </div>
        <div class="tool-actions">
            <button class="btn btn-ghost" type="button" data-action="download">Download decoded file</button>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#base64Input');
    var output = panel.querySelector('#base64Output');
    var fileInput = panel.querySelector('#base64File');
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
        output.value = btoa(unescape(encodeURIComponent(input.value)));
        updateStatus('Encoded to Base64.', 'success');
    });

    panel.querySelector('[data-action="decode"]').addEventListener('click', function () {
        if (!input.value.trim()) {
            updateStatus('Add Base64 to decode.', 'error');
            return;
        }
        try {
            output.value = decodeURIComponent(escape(atob(input.value.trim())));
            updateStatus('Decoded successfully.', 'success');
        } catch (error) {
            updateStatus('Invalid Base64 input.', 'error');
        }
    });

    panel.querySelector('[data-action="swap"]').addEventListener('click', function () {
        var temp = input.value;
        input.value = output.value;
        output.value = temp;
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

    panel.querySelector('[data-action="download"]').addEventListener('click', function () {
        if (!input.value.trim()) {
            updateStatus('Add Base64 data to decode.', 'error');
            return;
        }
        try {
            var buffer = base64ToArrayBuffer(input.value.trim());
            var blob = new Blob([buffer]);
            var url = URL.createObjectURL(blob);
            var anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'decoded.bin';
            anchor.click();
            URL.revokeObjectURL(url);
            updateStatus('Downloaded decoded file.', 'success');
        } catch (error) {
            updateStatus('Invalid Base64 input.', 'error');
        }
    });

    fileInput.addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (!file) {
            return;
        }
        readFileAsArrayBuffer(file)
            .then(function (buffer) {
                output.value = arrayBufferToBase64(buffer);
                updateStatus('Encoded file: ' + file.name, 'success');
            })
            .catch(function () {
                updateStatus('Unable to read file.', 'error');
            });
    });
}
