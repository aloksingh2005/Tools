(function () {
    let qrCodeInstance = null;
    let currentQrDataUrl = '';

    const themeToggle = document.getElementById('theme-toggle');
    const generateBtn = document.getElementById('generate-btn');
    const qrDisplay = document.getElementById('qr-display');
    const typeBtns = document.querySelectorAll('.type-btn');
    const downloadPng = document.getElementById('download-png');
    const downloadSvg = document.getElementById('download-svg');
    const sizeSelect = document.getElementById('qr-size');
    const fgPicker = document.getElementById('qr-fg');
    const bgPicker = document.getElementById('qr-bg');

    function toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('tools-theme', isDark ? 'light' : 'dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', toggleTheme);
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    function switchType(type) {
        typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === type));
        document.getElementById('input-text').classList.toggle('hidden', type !== 'text');
        document.getElementById('input-wifi').classList.toggle('hidden', type !== 'wifi');
        document.getElementById('input-vcard').classList.toggle('hidden', type !== 'vcard');
    }

    typeBtns.forEach(btn => btn.addEventListener('click', () => switchType(btn.dataset.type)));

    function getQRContent() {
        const activeType = document.querySelector('.type-btn.active').dataset.type;
        if (activeType === 'text') return document.getElementById('qr-text').value.trim();
        if (activeType === 'wifi') {
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const pass = document.getElementById('wifi-password').value.trim();
            const enc = document.getElementById('wifi-encryption').value;
            if (!ssid) return '';
            if (enc) return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
            return `WIFI:S:${ssid};T:nopass;;`;
        }
        if (activeType === 'vcard') {
            const name = document.getElementById('vcard-name').value.trim();
            const phone = document.getElementById('vcard-phone').value.trim();
            const email = document.getElementById('vcard-email').value.trim();
            const org = document.getElementById('vcard-org').value.trim();
            if (!name && !phone && !email) return '';
            let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (name) vcard += `FN:${name}\nN:${name};;;\n`;
            if (phone) vcard += `TEL:${phone}\n`;
            if (email) vcard += `EMAIL:${email}\n`;
            if (org) vcard += `ORG:${org}\n`;
            vcard += 'END:VCARD';
            return vcard;
        }
        return '';
    }

    function generateQR() {
        const content = getQRContent();
        if (!content) { qrDisplay.innerHTML = '<p style="color:var(--text-secondary)">Enter content to generate a QR code</p>'; currentQrDataUrl = ''; return; }

        const size = parseInt(sizeSelect.value, 10);
        const fg = fgPicker.value;
        const bg = bgPicker.value;

        qrDisplay.innerHTML = '';
        qrCodeInstance = new QRCode(qrDisplay, {
            text: content,
            width: size,
            height: size,
            colorDark: fg,
            colorLight: bg,
            correctLevel: QRCode.CorrectLevel.H
        });

        setTimeout(() => {
            const canvas = qrDisplay.querySelector('canvas');
            if (canvas) currentQrDataUrl = canvas.toDataURL('image/png');
        }, 200);
    }

    generateBtn.addEventListener('click', generateQR);

    downloadPng.addEventListener('click', () => {
        if (!currentQrDataUrl) { generateQR(); setTimeout(() => downloadPng.click(), 300); return; }
        const a = document.createElement('a');
        a.href = currentQrDataUrl;
        a.download = 'qrcode.png';
        a.click();
    });

    downloadSvg.addEventListener('click', () => {
        const content = getQRContent();
        if (!content) return;
        const size = parseInt(sizeSelect.value, 10);
        const fg = fgPicker.value;
        const bg = bgPicker.value;
        const svg = generateSvgQR(content, size, fg, bg);
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        a.click();
        URL.revokeObjectURL(url);
    });

    function generateSvgQR(text, size, fg, bg) {
        const qr = new QRCode(-1, QRCode.CorrectLevel.H);
        qr.addData(text);
        qr.make();
        const moduleCount = qr.getModuleCount();
        const cellSize = size / moduleCount;
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        svg += `<rect width="${size}" height="${size}" fill="${bg}"/>`;
        for (let r = 0; r < moduleCount; r++) {
            for (let c = 0; c < moduleCount; c++) {
                if (qr.isDark(r, c)) {
                    svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fg}"/>`;
                }
            }
        }
        svg += '</svg>';
        return svg;
    }

    generateQR();
})();
