export function formatBytes(bytes) {
    if (!bytes && bytes !== 0) {
        return '0 B';
    }
    var units = ['B', 'KB', 'MB', 'GB'];
    var size = bytes;
    var unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }
    return size.toFixed(1) + ' ' + units[unitIndex];
}

export function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

export function readFileAsText(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result || '');
        };
        reader.onerror = function () {
            reject(reader.error || new Error('Failed to read file.'));
        };
        reader.readAsText(file);
    });
}

export function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result || '');
        };
        reader.onerror = function () {
            reject(reader.error || new Error('Failed to read file.'));
        };
        reader.readAsDataURL(file);
    });
}

export function readFileAsArrayBuffer(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function () {
            reject(reader.error || new Error('Failed to read file.'));
        };
        reader.readAsArrayBuffer(file);
    });
}

export function copyToClipboard(text) {
    if (!navigator.clipboard) {
        return Promise.reject(new Error('Clipboard access is not available.'));
    }
    return navigator.clipboard.writeText(text);
}

export function debounce(callback, delay) {
    var timer;
    return function () {
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(null, args);
        }, delay || 250);
    };
}

export function loadScript(src) {
    return new Promise(function (resolve, reject) {
        if (document.querySelector('script[data-src="' + src + '"]')) {
            resolve();
            return;
        }
        var script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.dataset.src = src;
        script.onload = function () {
            resolve();
        };
        script.onerror = function () {
            reject(new Error('Failed to load ' + src));
        };
        document.head.appendChild(script);
    });
}

export function createNotice(message, type) {
    var notice = document.createElement('div');
    notice.className = 'tool-chip';
    notice.textContent = message;
    notice.setAttribute('role', type === 'error' ? 'alert' : 'status');
    if (type === 'error') {
        notice.classList.add('tool-chip--error');
    }
    if (type === 'success') {
        notice.classList.add('tool-chip--success');
    }
    return notice;
}

export function createDropzone(options) {
    var zone = document.createElement('div');
    zone.className = 'tool-dropzone';
    zone.innerHTML = '<strong>' + options.title + '</strong><br><span>' + options.subtitle + '</span>';
    zone.tabIndex = 0;
    zone.setAttribute('role', 'button');
    zone.setAttribute('aria-label', options.ariaLabel || options.title || 'Upload files');
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || '*/*';
    input.multiple = !!options.multiple;
    input.style.display = 'none';

    zone.addEventListener('click', function () {
        input.click();
    });

    zone.addEventListener('keydown', function (event) {
        var key = event.key;
        if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
            event.preventDefault();
            input.click();
        }
    });

    zone.addEventListener('dragover', function (event) {
        event.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', function () {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', function (event) {
        event.preventDefault();
        zone.classList.remove('dragover');
        var files = Array.from(event.dataTransfer.files || []);
        if (files.length && options.onFiles) {
            options.onFiles(files);
        }
    });

    input.addEventListener('change', function (event) {
        var files = Array.from(event.target.files || []);
        if (files.length && options.onFiles) {
            options.onFiles(files);
        }
    });

    zone.appendChild(input);
    zone.fileInput = input;
    return zone;
}
