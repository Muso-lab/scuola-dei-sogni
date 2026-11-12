/* ========================================================
   Scuola dei Sogni - Modern & Accessible Interactive Logic
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle via CSS Class (No inline style bugs)
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mainNav');
    navLinks.id = 'mainNav';

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.innerHTML = isOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      }
    });
  }

  // 3. Smooth Anchor Scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 85;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains('is-open')) {
            navLinks.classList.remove('is-open');
            if (menuToggle) {
              menuToggle.setAttribute('aria-expanded', 'false');
              menuToggle.innerHTML = '☰';
            }
          }
        }
      }
    });
  });

  // 4. Contact Form Handling (Accessible Inline Success State)
  const contactForm = document.getElementById('contactForm');
  const successCard = document.getElementById('formSuccessCard');

  if (contactForm && successCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const privacy = document.getElementById('privacyConsent');

      if (!name || !email || !phone) {
        return;
      }

      if (privacy && !privacy.checked) {
        alert('È necessario acconsentire al trattamento dei dati personali per inviare la richiesta.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Invio in corso...</span>';

      setTimeout(() => {
        contactForm.style.display = 'none';
        successCard.style.display = 'block';
        const successName = document.getElementById('successUserName');
        if (successName) {
          successName.textContent = name;
        }
      }, 700);
    });
  }

  // 5. Privacy Policy Modal Handling
  const privacyModal = document.getElementById('privacyModal');
  const closePrivacyBtns = document.querySelectorAll('.close-privacy-btn');
  const openPrivacyBtns = document.querySelectorAll('.open-privacy');

  if (privacyModal) {
    const openModal = (e) => {
      if (e) e.preventDefault();
      privacyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      privacyModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    openPrivacyBtns.forEach(btn => btn.addEventListener('click', openModal));
    closePrivacyBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Close on backdrop click
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) {
        closeModal();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

      // 6. Dynamic News Loader (Zero-Glitch Stale-While-Revalidate, Carousel & Multi-Photo Lightbox)
  const newsContainer = document.querySelector('.news-grid');
  if (newsContainer) {
    const isEnglish = document.documentElement.lang === 'en';

    const validImgMap = {
      'assets/images/parco-giochi-ulivo.png': 'assets/images/parco-giochi-scivolo.png',
      'assets/images/giardino-giochi-scuola.png': 'assets/images/parco-giochi-scivolo.png',
      'assets/images/parco-alberato-viale.png': 'assets/images/viale-giardino-ulivo.png',
      'assets/images/scuola-ingresso-cancello.png': 'assets/images/cancello-targa-ingresso.png'
    };

    const resolveImg = (raw) => validImgMap[raw] || raw || 'assets/images/parco-giochi-scivolo.png';
    const isVideoPath = (src) => /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src || '');

    // Inject News Detail & Gallery Modal once
    let modalOverlay = document.getElementById('newsDetailModal');
    if (!modalOverlay) {
      modalOverlay = document.createElement('div');
      modalOverlay.id = 'newsDetailModal';
      modalOverlay.className = 'news-modal-overlay';
      modalOverlay.setAttribute('role', 'dialog');
      modalOverlay.setAttribute('aria-modal', 'true');
      modalOverlay.innerHTML = `
        <div class="news-modal-card">
          <button type="button" class="news-modal-close" aria-label="${isEnglish ? 'Close' : 'Chiudi'}">✕</button>
          <div class="news-modal-gallery">
            <div class="news-modal-stage">
              <button type="button" class="news-gallery-arrow prev" aria-label="${isEnglish ? 'Previous photo' : 'Media precedente'}">‹</button>
              <img id="newsModalMainImg" src="" alt="News Photo">
              <video id="newsModalMainVideo" controls playsinline preload="metadata" style="display: none;"></video>
              <button type="button" class="news-gallery-arrow next" aria-label="${isEnglish ? 'Next photo' : 'Media successivo'}">›</button>
              <div class="news-gallery-counter" id="newsModalCounter">1 / 1</div>
            </div>
            <div class="news-gallery-thumbs" id="newsModalThumbs"></div>
          </div>
          <div class="news-modal-body">
            <div class="news-modal-meta">
              <span class="news-modal-cat" id="newsModalCat"></span>
              <span class="news-modal-date" id="newsModalDate"></span>
            </div>
            <h3 class="news-modal-title" id="newsModalTitle"></h3>
            <div class="news-modal-text" id="newsModalText"></div>
            <div id="newsModalActions" style="display: flex; gap: 12px; flex-wrap: wrap;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);
    }

    let modalPhotos = [];
    let modalPhotoIdx = 0;

    const updateModalPhoto = (idx) => {
      if (!modalPhotos.length) return;
      modalPhotoIdx = (idx + modalPhotos.length) % modalPhotos.length;
      const mainImg = document.getElementById('newsModalMainImg');
      const mainVideo = document.getElementById('newsModalMainVideo');
      const counter = document.getElementById('newsModalCounter');
      const thumbsWrap = document.getElementById('newsModalThumbs');
      const prevArrow = modalOverlay.querySelector('.news-gallery-arrow.prev');
      const nextArrow = modalOverlay.querySelector('.news-gallery-arrow.next');
      const currentSrc = modalPhotos[modalPhotoIdx];

      if (mainVideo) {
        mainVideo.pause();
      }

      if (isVideoPath(currentSrc) && mainVideo) {
        mainImg.style.display = 'none';
        mainVideo.style.display = 'block';
        if (mainVideo.getAttribute('src') !== currentSrc) {
          mainVideo.src = currentSrc;
        }
      } else {
        if (mainVideo) {
          mainVideo.style.display = 'none';
          mainVideo.removeAttribute('src');
        }
        mainImg.style.display = 'block';
        mainImg.src = currentSrc;
        mainImg.onerror = () => { mainImg.onerror = null; mainImg.src = 'assets/images/parco-giochi-scivolo.png'; };
      }

      if (modalPhotos.length > 1) {
        counter.style.display = 'block';
        counter.textContent = `${modalPhotoIdx + 1} / ${modalPhotos.length}`;
        prevArrow.style.display = 'flex';
        nextArrow.style.display = 'flex';
        thumbsWrap.style.display = 'flex';
        thumbsWrap.querySelectorAll('.news-gallery-thumb').forEach((t, i) => {
          t.classList.toggle('active', i === modalPhotoIdx);
        });
      } else {
        counter.style.display = 'none';
        prevArrow.style.display = 'none';
        nextArrow.style.display = 'none';
        thumbsWrap.style.display = 'none';
      }
    };

    const closeNewsModal = () => {
      const mainVideo = document.getElementById('newsModalMainVideo');
      if (mainVideo) {
        mainVideo.pause();
        mainVideo.removeAttribute('src');
      }
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    const openNewsModal = (item) => {
      const category = isEnglish ? (item.category_en || item.category_it) : (item.category_it || item.category_en);
      const title = isEnglish ? (item.title_en || item.title_it) : (item.title_it || item.title_en);
      const text = isEnglish ? (item.excerpt_en || item.excerpt_it) : (item.excerpt_it || item.excerpt_en);

      const rawGallery = Array.isArray(item.gallery) && item.gallery.length > 0
        ? item.gallery
        : [item.image || 'assets/images/parco-giochi-scivolo.png'];
      modalPhotos = rawGallery.map(resolveImg);

      document.getElementById('newsModalCat').textContent = category || 'News';
      document.getElementById('newsModalDate').textContent = item.date ? `📅 ${item.date}` : '';
      document.getElementById('newsModalTitle').textContent = title || '';
      document.getElementById('newsModalText').textContent = text || '';

      const thumbsWrap = document.getElementById('newsModalThumbs');
      thumbsWrap.innerHTML = modalPhotos.map((src, i) => {
        if (isVideoPath(src)) {
          return `<video src="${src}#t=0.5" muted playsinline preload="metadata" class="news-gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" title="Video ${i + 1}"></video>`;
        }
        return `<img src="${src}" class="news-gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" alt="Foto ${i + 1}" onerror="this.onerror=null;this.src='assets/images/parco-giochi-scivolo.png';">`;
      }).join('');
      thumbsWrap.querySelectorAll('.news-gallery-thumb').forEach(imgEl => {
        imgEl.addEventListener('click', () => updateModalPhoto(parseInt(imgEl.dataset.idx, 10)));
      });

      const actionsWrap = document.getElementById('newsModalActions');
      actionsWrap.innerHTML = item.instagram_url
        ? `<a href="${item.instagram_url}" target="_blank" rel="noopener" class="btn btn-secondary">📸 ${isEnglish ? 'View on Instagram' : 'Vedi su Instagram'}</a>`
        : '';

      updateModalPhoto(0);
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    modalOverlay.querySelector('.news-modal-close').addEventListener('click', closeNewsModal);
    modalOverlay.querySelector('.news-gallery-arrow.prev').addEventListener('click', () => updateModalPhoto(modalPhotoIdx - 1));
    modalOverlay.querySelector('.news-gallery-arrow.next').addEventListener('click', () => updateModalPhoto(modalPhotoIdx + 1));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeNewsModal();
    });
    document.addEventListener('keydown', (e) => {
      if (!modalOverlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeNewsModal();
      if (e.key === 'ArrowLeft' && modalPhotos.length > 1) updateModalPhoto(modalPhotoIdx - 1);
      if (e.key === 'ArrowRight' && modalPhotos.length > 1) updateModalPhoto(modalPhotoIdx + 1);
    });

    const renderNews = (newsItems) => {
      if (!Array.isArray(newsItems) || newsItems.length === 0) {
        newsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 32px; font-style: italic;">
          ${isEnglish ? 'No current news at the moment.' : 'Nessuna novità pubblicata al momento.'}
        </p>`;
        const oldNav = document.querySelector('.news-carousel-nav');
        if (oldNav) oldNav.remove();
        return;
      }

      let html = '';
      newsItems.forEach((item, idx) => {
        const category = isEnglish ? (item.category_en || item.category_it) : (item.category_it || item.category_en);
        const title = isEnglish ? (item.title_en || item.title_it) : (item.title_it || item.title_en);
        const excerpt = isEnglish ? (item.excerpt_en || item.excerpt_it) : (item.excerpt_it || item.excerpt_en);
        const galleryCount = Array.isArray(item.gallery) && item.gallery.length > 1 ? item.gallery.length : 0;
        const img = resolveImg(item.image || (galleryCount ? item.gallery[0] : ''));
        const hasVideo = isVideoPath(img) || (Array.isArray(item.gallery) && item.gallery.some(isVideoPath));
        const igBadge = item.instagram_url ? `<a href="${item.instagram_url}" target="_blank" rel="noopener" class="news-ig-badge" title="Instagram Post">📸 Instagram</a>` : '';
        const mediaBadge = hasVideo && !galleryCount
          ? `<span class="news-photo-count">🎬 Video</span>`
          : (galleryCount ? `<span class="news-photo-count">${hasVideo ? '🎬' : '🖼️'} ${galleryCount} ${isEnglish ? 'media' : 'contenuti'}</span>` : '');
        const readMoreLabel = hasVideo && !galleryCount
          ? (isEnglish ? 'Watch video & read more →' : 'Guarda il video e leggi tutto →')
          : (galleryCount
            ? (isEnglish ? `Read more & view ${galleryCount} items →` : `Leggi tutto e vedi ${galleryCount} foto →`)
            : (isEnglish ? 'Read more →' : 'Leggi tutto →'));

        const thumbHtml = isVideoPath(img)
          ? `<video src="${img}#t=0.5" muted playsinline preload="metadata"></video>`
          : `<img src="${img}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/parco-giochi-scivolo.png';">`;

        html += `
          <article class="news-card" data-idx="${idx}" data-id="${item.id || ''}">
            <div class="news-thumb">
              ${thumbHtml}
              ${igBadge}
              ${mediaBadge}
            </div>
            <div class="news-body">
              <div class="news-meta">${category}${item.date ? ' • ' + item.date : ''}</div>
              <h3 class="news-title">${title}</h3>
              <p class="news-excerpt">${excerpt}</p>
              <span class="news-read-more">${readMoreLabel}</span>
            </div>
          </article>
        `;
      });

      newsContainer.innerHTML = html;

      // Bind click to open detail modal
      newsContainer.querySelectorAll('.news-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.news-ig-badge')) return; // Let Instagram link open directly
          const i = parseInt(card.dataset.idx, 10);
          if (!isNaN(i) && newsItems[i]) {
            openNewsModal(newsItems[i]);
          }
        });
      });

      // Se ci sono più di 3 news, attiva il carosello a scorrimento con controlli
      let carouselNav = document.querySelector('.news-carousel-nav');
      if (newsItems.length > 3) {
        newsContainer.classList.add('is-carousel');
        if (!carouselNav) {
          carouselNav = document.createElement('div');
          carouselNav.className = 'news-carousel-nav';
          carouselNav.innerHTML = `
            <button class="news-nav-btn prev" aria-label="${isEnglish ? 'Previous news' : 'News precedente'}">‹</button>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--muted);">${newsItems.length} ${isEnglish ? 'total updates' : 'novità totali'}</span>
            <button class="news-nav-btn next" aria-label="${isEnglish ? 'Next news' : 'News successiva'}">›</button>
          `;
          newsContainer.parentNode.insertBefore(carouselNav, newsContainer.nextSibling);

          const prevBtn = carouselNav.querySelector('.prev');
          const nextBtn = carouselNav.querySelector('.next');
          const getScrollStep = () => {
            const firstCard = newsContainer.querySelector('.news-card');
            return firstCard ? firstCard.offsetWidth + 24 : 330;
          };

          prevBtn.addEventListener('click', () => {
            newsContainer.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
          });
          nextBtn.addEventListener('click', () => {
            newsContainer.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
          });
        }
      } else {
        newsContainer.classList.remove('is-carousel');
        if (carouselNav) carouselNav.remove();
      }
    };

    // Stale-While-Revalidate: render immediato da cache per 0ms di latenza (elimina il glitch)
    const cachedData = localStorage.getItem('scuola_sogni_news_cache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          renderNews(parsed);
        }
      } catch (err) {}
    }

    // Caricamento asincrono da data/news.json sempre aggiornato
    fetch(`data/news.json?v=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(newsItems => {
        if (Array.isArray(newsItems)) {
          localStorage.setItem('scuola_sogni_news_cache', JSON.stringify(newsItems));
          renderNews(newsItems);
        }
      })
      .catch(err => {
        console.warn('Network news fetch fallback', err);
      });
  }

});
