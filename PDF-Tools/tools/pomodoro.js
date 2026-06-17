import { createNotice } from './core.js';

export function render(panel) {
    panel.innerHTML = `
        <div class="tool-field">
            <label>Focus minutes</label>
            <input id="focusMinutes" class="tool-input" type="number" min="5" max="90" value="25">
        </div>
        <div class="tool-field">
            <label>Break minutes</label>
            <input id="breakMinutes" class="tool-input" type="number" min="3" max="30" value="5">
        </div>
        <div class="tool-field">
            <label>Long break minutes</label>
            <input id="longBreakMinutes" class="tool-input" type="number" min="10" max="45" value="15">
        </div>
        <div class="tool-field">
            <label>Sessions before long break</label>
            <input id="sessionsBeforeLong" class="tool-input" type="number" min="2" max="6" value="4">
        </div>
        <div class="tool-field">
            <label>Timer</label>
            <div id="pomodoroDisplay" class="tool-textarea" style="min-height:60px; text-align:center; font-size:1.6rem;">25:00</div>
        </div>
        <div class="tool-actions">
            <button class="btn btn-primary" type="button" data-action="start">Start</button>
            <button class="btn btn-ghost" type="button" data-action="pause">Pause</button>
            <button class="btn btn-ghost" type="button" data-action="reset">Reset</button>
        </div>
        <div class="tool-field" data-status></div>
    `;

    var focusInput = panel.querySelector('#focusMinutes');
    var breakInput = panel.querySelector('#breakMinutes');
    var longBreakInput = panel.querySelector('#longBreakMinutes');
    var sessionsInput = panel.querySelector('#sessionsBeforeLong');
    var display = panel.querySelector('#pomodoroDisplay');
    var status = panel.querySelector('[data-status]');

    var timerId = null;
    var mode = 'focus';
    var remaining = parseInt(focusInput.value, 10) * 60;
    var sessionCount = 0;

    function updateStatus(message, type) {
        status.innerHTML = '';
        status.appendChild(createNotice(message, type));
    }

    function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    function updateDisplay() {
        display.textContent = formatTime(remaining);
    }

    function nextPhase() {
        if (mode === 'focus') {
            sessionCount += 1;
            var longBreakEvery = parseInt(sessionsInput.value, 10) || 4;
            if (sessionCount % longBreakEvery === 0) {
                mode = 'long-break';
                remaining = parseInt(longBreakInput.value, 10) * 60;
                updateStatus('Long break time.', 'success');
            } else {
                mode = 'break';
                remaining = parseInt(breakInput.value, 10) * 60;
                updateStatus('Take a short break.', 'success');
            }
        } else {
            mode = 'focus';
            remaining = parseInt(focusInput.value, 10) * 60;
            updateStatus('Back to focus.', 'success');
        }
        updateDisplay();
    }

    function tick() {
        if (remaining <= 0) {
            nextPhase();
            return;
        }
        remaining -= 1;
        updateDisplay();
    }

    panel.querySelector('[data-action="start"]').addEventListener('click', function () {
        if (timerId) {
            return;
        }
        updateStatus('Timer running in ' + mode.replace('-', ' ') + ' mode.', 'success');
        timerId = setInterval(tick, 1000);
    });

    panel.querySelector('[data-action="pause"]').addEventListener('click', function () {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            updateStatus('Timer paused.', 'error');
        }
    });

    panel.querySelector('[data-action="reset"]').addEventListener('click', function () {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        mode = 'focus';
        sessionCount = 0;
        remaining = parseInt(focusInput.value, 10) * 60;
        updateDisplay();
        updateStatus('Timer reset.', 'success');
    });

    updateDisplay();
}
