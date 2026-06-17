import { createNotice, downloadBlob } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="start">Start recording</button>
            <button class="btn btn-ghost" type="button" data-action="stop">Stop</button>
            <button class="btn btn-ghost" type="button" data-action="download">Download</button>
        </div>
        <div class="tool-field">
            <audio id="audioPlayback" controls style="width:100%;"></audio>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var startBtn = panel.querySelector('[data-action="start"]');
    var stopBtn = panel.querySelector('[data-action="stop"]');
    var downloadBtn = panel.querySelector('[data-action="download"]');
    var playback = panel.querySelector('#audioPlayback');
    var status = panel.querySelector('[data-status]');

    var recorder = null;
    var chunks = [];
    var outputBlob = null;

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    startBtn.addEventListener('click', function () {
        if (recorder && recorder.state === 'recording') {
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                chunks = [];
                recorder = new MediaRecorder(stream);
                recorder.ondataavailable = function (event) {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };
                recorder.onstop = function () {
                    outputBlob = new Blob(chunks, { type: 'audio/webm' });
                    playback.src = URL.createObjectURL(outputBlob);
                    updateStatus('Recording ready.', 'success');
                };
                recorder.start();
                updateStatus('Recording...', 'success');
            })
            .catch(function () {
                updateStatus('Microphone access denied.', 'error');
            });
    });

    stopBtn.addEventListener('click', function () {
        if (recorder && recorder.state === 'recording') {
            recorder.stop();
            recorder.stream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
    });

    downloadBtn.addEventListener('click', function () {
        if (!outputBlob) {
            updateStatus('Record audio first.', 'error');
            return;
        }
        downloadBlob(outputBlob, 'recording.webm');
    });
}
