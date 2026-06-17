import { createDropzone, createNotice, readFileAsDataUrl, formatBytes, downloadBlob } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field" data-zone></div>
        <div class="tool-field">
            <label for="maxWidth">Max width (px)</label>
            <input id="maxWidth" class="tool-input" type="number" value="1600" min="200" max="6000">
        </div>
        <div class="tool-field">
            <label for="imageFormat">Output format</label>
            <select id="imageFormat" class="tool-select">
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
                <option value="image/png">PNG</option>
            </select>
        </div>
        <div class="tool-field">
            <label for="imageQuality">Quality (JPEG/WebP)</label>
            <input id="imageQuality" class="tool-input" type="number" value="0.85" min="0.5" max="1" step="0.05">
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="process">Optimize</button>
            <button class="btn btn-ghost" type="button" data-action="download">Download</button>
        </div>
        <div class="tool-field">
            <label>Preview</label>
            <img id="imagePreview" style="max-width:100%; border-radius:12px; border:1px solid var(--premium-border);" alt="Preview">
        </div>
        <div class="tool-field" data-info></div>
    `;

    var zoneContainer = panel.querySelector('[data-zone]');
    var maxWidthInput = panel.querySelector('#maxWidth');
    var formatSelect = panel.querySelector('#imageFormat');
    var qualityInput = panel.querySelector('#imageQuality');
    var preview = panel.querySelector('#imagePreview');
    var info = panel.querySelector('[data-info]');
    var outputBlob = null;
    var sourceImage = new Image();
    var originalFile = null;

    function updateInfo(message, type) {
        info.innerHTML = '';
        info.appendChild(createNotice(message, type));
    }

    function loadImage(file) {
        originalFile = file;
        readFileAsDataUrl(file)
            .then(function (dataUrl) {
                sourceImage.onload = function () {
                    preview.src = dataUrl;
                    updateInfo('Loaded ' + file.name + ' (' + formatBytes(file.size) + ')', 'success');
                };
                sourceImage.src = dataUrl;
            })
            .catch(function () {
                updateInfo('Unable to load image.', 'error');
            });
    }

    var dropzone = createDropzone({
        title: 'Drop an image or click to upload',
        subtitle: 'JPEG, PNG, or WebP supported',
        accept: 'image/*',
        multiple: false,
        onFiles: function (files) {
            if (files[0]) {
                loadImage(files[0]);
            }
        }
    });
    zoneContainer.appendChild(dropzone);

    panel.querySelector('[data-action="process"]').addEventListener('click', function () {
        if (!sourceImage.src) {
            updateInfo('Select an image first.', 'error');
            return;
        }
        var maxWidth = parseInt(maxWidthInput.value, 10) || sourceImage.width;
        var scale = Math.min(1, maxWidth / sourceImage.width);
        var width = Math.round(sourceImage.width * scale);
        var height = Math.round(sourceImage.height * scale);
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(sourceImage, 0, 0, width, height);

        var format = formatSelect.value;
        var quality = parseFloat(qualityInput.value || '0.85');
        canvas.toBlob(function (blob) {
            if (!blob) {
                updateInfo('Unable to process image.', 'error');
                return;
            }
            outputBlob = blob;
            preview.src = URL.createObjectURL(blob);
            updateInfo('Optimized size: ' + formatBytes(blob.size), 'success');
        }, format, quality);
    });

    panel.querySelector('[data-action="download"]').addEventListener('click', function () {
        if (!outputBlob) {
            updateInfo('Run optimize first.', 'error');
            return;
        }
        var extension = formatSelect.value.split('/')[1];
        var name = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '') : 'image';
        downloadBlob(outputBlob, name + '_optimized.' + extension);
    });
}
