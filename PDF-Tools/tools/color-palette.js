import { createDropzone, createNotice, readFileAsDataUrl } from './core.js';

function extractColors(image) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(image, 0, 0, size, size);
    var data = ctx.getImageData(0, 0, size, size).data;
    var buckets = {};
    for (var i = 0; i < data.length; i += 40) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        var key = (r >> 4) + '-' + (g >> 4) + '-' + (b >> 4);
        buckets[key] = (buckets[key] || 0) + 1;
    }
    var sorted = Object.keys(buckets).sort(function (a, b) {
        return buckets[b] - buckets[a];
    }).slice(0, 6);
    return sorted.map(function (key) {
        var parts = key.split('-').map(function (value) {
            return parseInt(value, 10) * 16;
        });
        return 'rgb(' + parts[0] + ', ' + parts[1] + ', ' + parts[2] + ')';
    });
}

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field" data-zone></div>
        <div class="tool-field">
            <label>Palette</label>
            <div id="paletteSwatches" style="display:flex; gap:10px; flex-wrap:wrap;"></div>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var zoneContainer = panel.querySelector('[data-zone]');
    var swatches = panel.querySelector('#paletteSwatches');
    var status = panel.querySelector('[data-status]');
    var image = new Image();

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function renderPalette(colors) {
        swatches.innerHTML = colors.map(function (color) {
            return '<div style="width:48px; height:48px; border-radius:12px; background:' + color + '; border:1px solid var(--premium-border);"></div>' +
                '<span style="font-size:0.8rem; color:var(--premium-muted);">' + color + '</span>';
        }).join('');
    }

    var dropzone = createDropzone({
        title: 'Drop an image to extract colors',
        subtitle: 'PNG, JPEG, or WebP supported',
        accept: 'image/*',
        multiple: false,
        onFiles: function (files) {
            var file = files[0];
            if (!file) {
                return;
            }
            readFileAsDataUrl(file)
                .then(function (dataUrl) {
                    image.onload = function () {
                        var colors = extractColors(image);
                        renderPalette(colors);
                        updateStatus('Palette extracted.', 'success');
                    };
                    image.src = dataUrl;
                })
                .catch(function () {
                    updateStatus('Unable to load image.', 'error');
                });
        }
    });

    zoneContainer.appendChild(dropzone);
}
