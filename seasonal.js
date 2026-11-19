/**
 * SCUOLA DEI SOGNI — Motore Effetti Stagionali & Eventi
 * Particelle leggere in puro CSS/DOM, zero-interferenza (pointer-events: none)
 */
(function() {
  const THEME_DEFS = {
    none: { mode: 'none', count: 0, items: [] },
    autumn: {
      mode: 'fall',
      count: 16,
      opacity: [0.45, 0.75],
      duration: [9, 16],
      sway: [60, 140],
      items: ['🍂', '🍁', '🍃', '🍂', '🍁']
    },
    halloween: {
      mode: 'fall',
      count: 15,
      opacity: [0.5, 0.8],
      duration: [9, 15],
      sway: [70, 150],
      items: ['🎃', '🍂', '✨', '🦇', '🍁', '🎃']
    },
    winter: {
      mode: 'fall',
      count: 22,
      opacity: [0.4, 0.75],
      duration: [7, 13],
      sway: [40, 110],
      items: ['❄️', '❅', 'snow-soft', '❄️', 'snow-soft']
    },
    christmas: {
      mode: 'fall',
      count: 18,
      opacity: [0.5, 0.85],
      duration: [8, 14],
      sway: [50, 120],
      items: ['❄️', '✨', '⭐', '🎄', '🔔', '❅']
    },
    carnival: {
      mode: 'fall',
      count: 20,
      opacity: [0.5, 0.8],
      duration: [6, 12],
      sway: [70, 160],
      items: ['🎉', '🎊', '🎈', '✨', '🎭']
    },
    spring: {
      mode: 'fall',
      count: 16,
      opacity: [0.5, 0.8],
      duration: [8, 15],
      sway: [60, 130],
      items: ['🌸', '🌺', '🦋', '🍃', '🌸']
    },
    summer: {
      mode: 'rise',
      count: 15,
      opacity: [0.5, 0.75],
      duration: [10, 17],
      sway: [-50, 50],
      items: ['bubble', 'bubble', '🫧', '☀️', '🌻']
    },
    openday: {
      mode: 'rise',
      count: 14,
      opacity: [0.5, 0.8],
      duration: [11, 18],
      sway: [-40, 40],
      items: ['🎈', '✨', '⭐', '🎨', '🎈']
    },
    magic: {
      mode: 'sparkle',
      count: 18,
      opacity: [0.35, 0.85],
      duration: [4, 8],
      sway: [-30, 30],
      items: ['⭐', '✨', '💫', '🌟', '✨']
    }
  };

  const getCalendarAutoTheme = () => {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();

    // Ottobre
    if (month === 9) {
      return day >= 15 ? 'halloween' : 'autumn';
    }
    // Novembre
    if (month === 10) return 'autumn';
    // Dicembre
    if (month === 11) return 'christmas';
    // Gennaio
    if (month === 0) return day <= 6 ? 'christmas' : 'winter';
    // Febbraio
    if (month === 1) return 'carnival';
    // Marzo, Aprile, Maggio
    if (month >= 2 && month <= 4) return 'spring';
    // Giugno, Luglio, Agosto
    if (month >= 5 && month <= 7) return 'summer';
    // Settembre
    if (month === 8) return 'openday';

    return 'autumn';
  };

  let activeContainer = null;
  let activeBanner = null;

  const clearParticles = () => {
    if (activeContainer) {
      activeContainer.innerHTML = '';
    }
  };

  const randomRange = (min, max) => Math.random() * (max - min) + min;

  const renderParticles = (themeKey) => {
    clearParticles();
    const resolvedKey = themeKey === 'auto' ? getCalendarAutoTheme() : themeKey;
    const def = THEME_DEFS[resolvedKey];
    if (!def || def.mode === 'none' || def.count <= 0) return;

    if (!activeContainer) {
      activeContainer = document.createElement('div');
      activeContainer.id = 'seasonalEffectsContainer';
      activeContainer.className = 'seasonal-container';
      activeContainer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(activeContainer);
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < def.count; i++) {
      const el = document.createElement('div');
      const item = def.items[i % def.items.length];
      const duration = randomRange(def.duration[0], def.duration[1]);
      // Delay negativo: avvia ogni particella già distribuita dolcemente lungo lo schermo fin dal primo istante (zero accumuli all'inizio!)
      const delay = -randomRange(0, duration);
      const startX = randomRange(2, 96);
      const sway = (Math.random() > 0.5 ? 1 : -1) * randomRange(def.sway[0], def.sway[1]);
      const rotEnd = (Math.random() > 0.5 ? 1 : -1) * randomRange(180, 540);
      const opacity = randomRange(def.opacity[0], def.opacity[1]);
      const sizePx = Math.round(randomRange(16, 26));

      el.className = `seasonal-particle mode-${def.mode}`;
      el.style.setProperty('--sway-x', `${sway}px`);
      el.style.setProperty('--fall-duration', `${duration}s`);
      el.style.setProperty('--particle-opacity', opacity);
      el.style.setProperty('--rot-end', `${rotEnd}deg`);
      el.style.animationDelay = `${delay.toFixed(2)}s`;
      el.style.left = `${startX}vw`;
      el.style.fontSize = `${sizePx}px`;

      if (def.mode === 'sparkle') {
        const startY = randomRange(5, 90);
        const swayY = (Math.random() > 0.5 ? 1 : -1) * randomRange(20, 50);
        el.style.top = `${startY}vh`;
        el.style.setProperty('--sway-y', `${swayY}px`);
      }

      if (item === 'bubble') {
        el.classList.add('bubble-particle');
        el.style.width = `${sizePx + 4}px`;
        el.style.height = `${sizePx + 4}px`;
      } else if (item === 'snow-soft') {
        el.classList.add('snow-soft');
        el.style.width = `${Math.round(sizePx * 0.7)}px`;
        el.style.height = `${Math.round(sizePx * 0.7)}px`;
      } else {
        el.textContent = item;
      }

      fragment.appendChild(el);
    }

    activeContainer.appendChild(fragment);
  };

  const renderBanner = (config, resolvedTheme) => {
    if (activeBanner) {
      activeBanner.remove();
      activeBanner = null;
    }

    if (!config || !config.bannerEnabled) return;
    if (sessionStorage.getItem('scuola_sogni_banner_dismissed') === 'true') return;

    const isEn = document.documentElement.lang === 'en';
    const text = isEn ? (config.bannerTextEn || config.bannerTextIt) : (config.bannerTextIt || config.bannerTextEn);
    const btnLabel = isEn ? (config.bannerButtonEn || config.bannerButtonIt || 'More info') : (config.bannerButtonIt || config.bannerButtonEn || 'Scopri di più');
    const link = config.bannerLink || '#contatti';

    if (!text) return;

    activeBanner = document.createElement('aside');
    activeBanner.className = `seasonal-banner-bar theme-${resolvedTheme || 'autumn'}`;
    activeBanner.setAttribute('role', 'complementary');
    activeBanner.innerHTML = `
      <div class="seasonal-banner-content">
        <span class="seasonal-banner-text">${text}</span>
        ${link ? `<a href="${link}" class="seasonal-banner-btn">${btnLabel} →</a>` : ''}
      </div>
      <button type="button" class="seasonal-banner-close" aria-label="${isEn ? 'Close notice' : 'Chiudi avviso'}">✕</button>
    `;

    activeBanner.querySelector('.seasonal-banner-close').addEventListener('click', () => {
      sessionStorage.setItem('scuola_sogni_banner_dismissed', 'true');
      activeBanner.style.opacity = '0';
      activeBanner.style.transform = 'translateY(-100%)';
      setTimeout(() => {
        if (activeBanner) activeBanner.remove();
        activeBanner = null;
      }, 300);
    });

    document.body.insertBefore(activeBanner, document.body.firstChild);
  };

  const init = async () => {
    // 1. Controlla eventuale preview in tempo reale (da pannello admin)
    const previewTheme = sessionStorage.getItem('scuola_sogni_theme_preview');
    if (previewTheme) {
      renderParticles(previewTheme);
      return;
    }

    // 2. Lettura cache istantanea
    let config = null;
    try {
      const cached = localStorage.getItem('scuola_sogni_theme_cache');
      if (cached) {
        config = JSON.parse(cached);
        if (config && config.activeTheme) {
          const resolved = config.activeTheme === 'auto' ? getCalendarAutoTheme() : config.activeTheme;
          renderParticles(resolved);
          renderBanner(config, resolved);
        }
      }
    } catch (e) {}

    // 3. Fetch asincrono da data/theme.json
    try {
      const res = await fetch(`data/theme.json?v=${Date.now()}`);
      if (res.ok) {
        const liveConfig = await res.json();
        localStorage.setItem('scuola_sogni_theme_cache', JSON.stringify(liveConfig));
        const resolved = liveConfig.activeTheme === 'auto' ? getCalendarAutoTheme() : liveConfig.activeTheme;
        renderParticles(resolved);
        renderBanner(liveConfig, resolved);
      }
    } catch (err) {
      console.warn('Seasonal theme fetch error:', err);
      if (!config) {
        renderParticles('auto');
      }
    }
  };

  // Espone API globale per interazione dinamica (es. dall'admin)
  window.SeasonalEngine = {
    applyTheme: (themeKey) => renderParticles(themeKey),
    clear: clearParticles,
    getAutoTheme: getCalendarAutoTheme,
    previewBanner: (config) => {
      const resolved = config.activeTheme === 'auto' ? getCalendarAutoTheme() : config.activeTheme;
      renderBanner(config, resolved);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
