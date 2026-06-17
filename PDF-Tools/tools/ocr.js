import { createDropzone, createNotice, loadScript } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field" data-zone></div>
        <div class="tool-field">
            <label>Recognized text</label>
            <textarea id="ocrOutput" class="tool-textarea" placeholder="OCR output will appear here" readonly></textarea>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var zoneContainer = panel.querySelector('[data-zone]');
    var output = panel.querySelector('#ocrOutput');
    var status = panel.querySelector('[data-status]');

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function runOcr(file) {
        if (!window.Tesseract) {
            updateStatus('OCR engine is loading...', 'error');
            return;
        }
        updateStatus('Running OCR...', 'success');
        window.Tesseract.recognize(file, 'eng', {
            logger: function (info) {
                if (info.status) {
                    updateStatus(info.status + ' ' + Math.round((info.progress || 0) * 100) + '%', 'success');
                }
            }
        }).then(function (result) {
            output.value = result.data.text || '';
            updateStatus('OCR complete.', 'success');
        }).catch(function () {
            updateStatus('OCR failed.', 'error');
        });
    }

    var dropzone = createDropzone({
        title: 'Drop an image for OCR',
        subtitle: 'Text stays on-device',
        accept: 'image/*',
        multiple: false,
        onFiles: function (files) {
            if (files[0]) {
                runOcr(files[0]);
            }
        }
    });
    zoneContainer.appendChild(dropzone);

    loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.0.4/dist/tesseract.min.js')
        .then(function () {
            updateStatus('OCR engine ready.', 'success');
        })
        .catch(function () {
            updateStatus('Unable to load OCR engine.', 'error');
        });
}
