(() => {
  const standaloneQuery = window.matchMedia('(display-mode: standalone)');

  const isStandalone = () =>
    standaloneQuery.matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith('android-app://');

  const setAppMode = () => {
    document.body.classList.toggle('installed-app', isStandalone());
    document.body.classList.add('app-ready');
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js');

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        if (!worker) return;

        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            document.body.classList.add('update-ready');
          }
        });
      });
    } catch (error) {
      console.warn('Service worker registration failed', error);
    }
  };

  const createInstallButton = () => {
    const target = document.querySelector('.nav-right');
    if (!target || document.getElementById('installApp')) return null;

    const button = document.createElement('button');
    button.id = 'installApp';
    button.className = 'btn-icon install-app-button';
    button.type = 'button';
    button.hidden = true;
    button.setAttribute('aria-label', 'Install TimeBook');
    button.setAttribute('title', 'Install TimeBook');
    button.innerHTML = '<i class="fas fa-download" aria-hidden="true"></i><span>Install</span>';
    target.prepend(button);
    return button;
  };

  const setupInstallPrompt = () => {
    const installButton = createInstallButton();
    let deferredPrompt = null;

    if (isStandalone()) {
      if (installButton) installButton.hidden = true;
      return;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;
      if (installButton) installButton.hidden = false;
    });

    installButton?.addEventListener('click', async () => {
      if (!deferredPrompt) return;

      installButton.hidden = true;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      if (installButton) installButton.hidden = true;
      document.body.classList.add('installed-app');
    });
  };

  const syncConnectivity = () => {
    document.body.classList.toggle('is-offline', !navigator.onLine);
  };

  setAppMode();
  setupInstallPrompt();
  syncConnectivity();
  window.addEventListener('online', syncConnectivity);
  window.addEventListener('offline', syncConnectivity);
  if (standaloneQuery.addEventListener) {
    standaloneQuery.addEventListener('change', setAppMode);
  } else if (standaloneQuery.addListener) {
    standaloneQuery.addListener(setAppMode);
  }
  registerServiceWorker();
})();
