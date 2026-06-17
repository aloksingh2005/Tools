import { createNotice } from './core.js';

function decodeSection(section) {
    var padded = section.replace(/-/g, '+').replace(/_/g, '/');
    var padLength = 4 - (padded.length % 4 || 4);
    var base64 = padded + '='.repeat(padLength % 4);
    var decoded = atob(base64);
    return JSON.parse(decoded);
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="jwtInput">JWT token</label>
            <textarea id="jwtInput" class="tool-textarea" placeholder="Paste a JWT token"></textarea>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="decode">Decode</button>
            <button class="btn btn-ghost" type="button" data-action="clear">Clear</button>
        </div>
        <div class="tool-field">
            <label>Header</label>
            <textarea id="jwtHeader" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field">
            <label>Payload</label>
            <textarea id="jwtPayload" class="tool-textarea" readonly></textarea>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#jwtInput');
    var headerOut = panel.querySelector('#jwtHeader');
    var payloadOut = panel.querySelector('#jwtPayload');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    panel.querySelector('[data-action="decode"]').addEventListener('click', function () {
        var token = input.value.trim();
        if (!token) {
            updateStatus('Paste a JWT token first.', 'error');
            return;
        }
        var parts = token.split('.');
        if (parts.length < 2) {
            updateStatus('Invalid JWT format.', 'error');
            return;
        }
        try {
            var header = decodeSection(parts[0]);
            var payload = decodeSection(parts[1]);
            headerOut.value = JSON.stringify(header, null, 2);
            payloadOut.value = JSON.stringify(payload, null, 2);
            updateStatus('Decoded locally. Signature not verified.', 'success');
        } catch (error) {
            updateStatus('Unable to decode token.', 'error');
        }
    });

    panel.querySelector('[data-action="clear"]').addEventListener('click', function () {
        input.value = '';
        headerOut.value = '';
        payloadOut.value = '';
        status.innerHTML = '';
    });
}
