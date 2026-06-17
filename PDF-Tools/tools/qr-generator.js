import { loadScript, createNotice, downloadBlob } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label for="qrInput">Text or URL</label>
            <input id="qrInput" class="tool-input" type="text" placeholder="https://example.com">
        </div>
        <div class="tool-field">
            <label for="qrSize">Size</label>
            <input id="qrSize" class="tool-input" type="number" min="120" max="640" value="240">
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="generate">Generate QR</button>
            <button class="btn btn-ghost" type="button" data-action="download">Download PNG</button>
        </div>
        <div class="tool-field">
            <canvas id="qrCanvas" style="width:240px; height:240px; border:1px solid var(--premium-border);"></canvas>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var input = panel.querySelector('#qrInput');
    var sizeInput = panel.querySelector('#qrSize');
    var canvas = panel.querySelector('#qrCanvas');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function generate() {
        if (!window.QRCode) {
            updateStatus('QR engine is loading...', 'error');
            return;
        }
        var value = input.value.trim();
        if (!value) {
            updateStatus('Enter text to generate a QR code.', 'error');
            return;
        }
        var size = parseInt(sizeInput.value, 10) || 240;
        canvas.width = size;
        canvas.height = size;
        window.QRCode.toCanvas(canvas, value, { width: size, margin: 2 }, function (error) {
            if (error) {
                updateStatus('Unable to generate QR code.', 'error');
                return;
            }
            updateStatus('QR code ready.', 'success');
        });
    }

    panel.querySelector('[data-action="generate"]').addEventListener('click', generate);

    panel.querySelector('[data-action="download"]').addEventListener('click', function () {
        canvas.toBlob(function (blob) {
            if (!blob) {
                updateStatus('Generate a QR code first.', 'error');
                return;
            }
            downloadBlob(blob, 'qr-code.png');
        });
    });

    loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js')
        .then(function () {
            updateStatus('QR engine ready.', 'success');
        })
        .catch(function () {
            updateStatus('Unable to load QR engine.', 'error');
        });
}
