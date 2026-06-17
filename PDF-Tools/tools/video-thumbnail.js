import { createDropzone, createNotice, downloadBlob } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field" data-zone></div>
        <div class="tool-field">
            <video id="videoPreview" controls style="width:100%; border-radius:12px; border:1px solid var(--premium-border);"></video>
        </div>
        <div class="tool-field">
            <label for="videoTime">Timestamp (seconds)</label>
            <input id="videoTime" class="tool-input" type="range" min="0" max="0" value="0" step="0.1">
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="capture">Capture thumbnail</button>
            <button class="btn btn-ghost" type="button" data-action="download">Download PNG</button>
        </div>
        <div class="tool-field">
            <canvas id="thumbnailCanvas" style="width:100%; border-radius:12px; border:1px solid var(--premium-border);"></canvas>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var zoneContainer = panel.querySelector('[data-zone]');
    var video = panel.querySelector('#videoPreview');
    var timeInput = panel.querySelector('#videoTime');
    var canvas = panel.querySelector('#thumbnailCanvas');
    var status = panel.querySelector('[data-status]');
    var outputBlob = null;

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function loadVideo(file) {
        var url = URL.createObjectURL(file);
        video.src = url;
        video.onloadedmetadata = function () {
            timeInput.max = Math.floor(video.duration).toString();
            timeInput.value = '0';
            updateStatus('Video loaded. Duration ' + Math.round(video.duration) + 's.', 'success');
        };
    }

    var dropzone = createDropzone({
        title: 'Drop a video file',
        subtitle: 'MP4, WebM, or MOV supported',
        accept: 'video/*',
        multiple: false,
        onFiles: function (files) {
            if (files[0]) {
                loadVideo(files[0]);
            }
        }
    });
    zoneContainer.appendChild(dropzone);

    timeInput.addEventListener('input', function () {
        if (!video.duration) {
            return;
        }
        video.currentTime = parseFloat(timeInput.value);
    });

    panel.querySelector('[data-action="capture"]').addEventListener('click', function () {
        if (!video.videoWidth) {
            updateStatus('Load a video first.', 'error');
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function (blob) {
            outputBlob = blob;
            updateStatus('Thumbnail captured.', 'success');
        });
    });

    panel.querySelector('[data-action="download"]').addEventListener('click', function () {
        if (!outputBlob) {
            updateStatus('Capture a thumbnail first.', 'error');
            return;
        }
        downloadBlob(outputBlob, 'thumbnail.png');
    });
}
