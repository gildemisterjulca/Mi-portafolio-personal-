(function(){
  const items = window.awajunCollection || [];
  if(!items.length) return;

  const state = {
    index: 0,
    modalOpen: false,
    currentFramescreenEl: null
  };

  const els = {
    root: document.documentElement,
    heroPreview: document.getElementById('heroPreviewFrame'),
    heroProgress: document.getElementById('heroProgressBar'),
    heroIndex: document.getElementById('heroFloatingIndex'),
    heroTitle: document.getElementById('heroFloatingTitle'),
    heroSub: document.getElementById('heroFloatingSub'),
    heroMeta: document.getElementById('heroMeta'),
    heroPanel: document.getElementById('heroPanel'),
    heroShell: document.getElementById('heroPreviewShell'),
    enterCollection: document.getElementById('enterCollectionBtn'),
    backToPortfolioTop: document.getElementById('backPortfolioTop'),
    goViewerBtn: document.getElementById('goViewerBtn'),
    viewerSection: document.getElementById('visor'),
    viewerFrame: document.getElementById('viewerFrame'),
    viewerCount: document.getElementById('viewerCount'),
    viewerTitle: document.getElementById('curatorialTitle'),
    viewerSub: document.getElementById('curatorialSub'),
    viewerDesc: document.getElementById('curatorialDesc'),
    viewerCategory: document.getElementById('curatorialCategory'),
    viewerYear: document.getElementById('curatorialYear'),
    viewerTags: document.getElementById('curatorialTags'),
    thumbList: document.getElementById('thumbList'),
    prevBtns: Array.from(document.querySelectorAll('[data-step="prev"]')),
    nextBtns: Array.from(document.querySelectorAll('[data-step="next"]')),
    openDetailBtns: Array.from(document.querySelectorAll('[data-open-detail]')),
    restartBtns: Array.from(document.querySelectorAll('[data-restart-collection]')),
    modal: document.getElementById('detailModal'),
    modalFrame: document.getElementById('modalFrame'),
    modalTitle: document.getElementById('modalTitle'),
    modalSub: document.getElementById('modalSub'),
    modalPrev: document.getElementById('modalPrev'),
    modalNext: document.getElementById('modalNext'),
    modalClose: document.getElementById('modalClose'),
    modalFullscreen: document.getElementById('modalFullscreen'),
    footerBack: document.getElementById('backToPortfolioFooter')
  };

  function num(i){
    return String(i + 1).padStart(2, '0');
  }

  function wrap(idx){
    return (idx + items.length) % items.length;
  }

  function sanitize(str){
    return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ───────────────────────────────────────────────────
     FIT ENGINE v3 – each design handles its own scaling
     The iframe simply fills its container (width:100% height:100%).
     Scrollbars are injected-away so no scrollbar artifacts show.
     ─────────────────────────────────────────────────── */

  function _injectNoScroll(doc){
    if(!doc || doc.getElementById('_awajun_noscroll')) return;
    const s = doc.createElement('style');
    s.id = '_awajun_noscroll';
    s.textContent =
      'html,body{margin:0!important;padding:0!important;overflow:hidden!important;scrollbar-width:none!important}' +
      '*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}';
    (doc.head || doc.documentElement).appendChild(s);
  }

  function fitIframeToBox(iframe){
    if(!iframe || !iframe.parentElement) return;

    // Each design self-scales via its own script.
    // We only need to fill the box and strip scrollbars.
    Object.assign(iframe.style, {
      position:'absolute', top:'0', left:'0',
      width:'100%', height:'100%', border:'0', transform:'none'
    });

    const tryInject = () => {
      try{ _injectNoScroll(iframe.contentDocument); }catch(e){}
    };

    if(iframe.dataset.fitBound === '1'){ tryInject(); return; }
    iframe.dataset.fitBound = '1';
    iframe.addEventListener('load', tryInject);
    // Also re-trigger the design's own _fit() after inject (resize event)
    iframe.addEventListener('load', () => {
      setTimeout(() => {
        try{
          _injectNoScroll(iframe.contentDocument);
          iframe.contentWindow?.dispatchEvent(new Event('resize'));
        }catch(e){}
      }, 80);
    });
  }


  function applyPreset(iframe, item, _mode){
    if(!iframe || !item) return;
    fitIframeToBox(iframe);
  }



  function setFrameSource(iframe, item, mode='preview'){
    if(!iframe || !item) return;
    applyPreset(iframe, item, mode);
    if(iframe.getAttribute('src') !== item.file){
      iframe.setAttribute('src', item.file);
      iframe.setAttribute('title', item.title);
    }
  }

  function buildThumbs(){
    if(!els.thumbList) return;
    els.thumbList.innerHTML = items.map((item, idx) => `
      <button class="thumb-item" type="button" data-thumb-index="${idx}" aria-label="Ver ${sanitize(item.title)}">
        <span class="thumb-index">${num(idx)}</span>
        <strong>${sanitize(item.title)}</strong>
        <small>${sanitize(item.sub)}</small>
      </button>
    `).join('');

    els.thumbList.querySelectorAll('[data-thumb-index]').forEach(btn => {
      btn.addEventListener('click', () => updateIndex(Number(btn.dataset.thumbIndex), {scrollThumb:true}));
    });
  }

  function updateMetaChips(item){
    if(!els.heroMeta) return;
    els.heroMeta.innerHTML = `
      <span>${String(state.index + 1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}</span>
      <span>${sanitize(item.category)}</span>
      <span>${sanitize(item.tags[0])}</span>
    `;
  }

  function renderCuratorial(item){
    els.viewerTitle.textContent = item.title;
    els.viewerSub.textContent = item.sub;
    els.viewerDesc.textContent = item.desc;
    els.viewerCategory.textContent = item.category;
    els.viewerYear.textContent = item.year;
    els.viewerTags.innerHTML = item.tags.map(tag => `<span class="chip">${sanitize(tag)}</span>`).join('');
  }

  function setAccent(item){
    const accent = item.theme?.accent || '#2d84ff';
    const accentSoft = item.theme?.accentSoft || 'rgba(45,132,255,.16)';
    const glow = item.theme?.glow || 'rgba(45,132,255,.28)';
    els.root.style.setProperty('--accent', accent);
    els.root.style.setProperty('--accent-soft', accentSoft);
    els.root.style.setProperty('--glow', glow);
    if(els.heroShell){
      els.heroShell.style.setProperty('--hero-ratio', item.heroFrameRatio || '1 / .82');
    }
    // Adapt viewer shell to each design's natural proportions
    const viewerShell = document.querySelector('.viewer-main-shell');
    if(viewerShell){
      viewerShell.style.aspectRatio = item.viewerFrameRatio || '1 / 0.65';
    }
  }

  function updateThumbStates(){
    els.thumbList?.querySelectorAll('[data-thumb-index]').forEach((btn, idx) => {
      const active = idx === state.index;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function updateProgress(){
    const percent = ((state.index + 1) / items.length) * 100;
    if(els.heroProgress) els.heroProgress.style.width = `${percent}%`;
    if(els.viewerCount) els.viewerCount.textContent = `${num(state.index)} / ${String(items.length).padStart(2,'0')}`;
  }

  function syncHero(item){
    els.heroIndex.textContent = num(state.index);
    els.heroTitle.textContent = item.title;
    els.heroSub.textContent = item.sub;
    setFrameSource(els.heroPreview, item, 'preview');
    updateMetaChips(item);
  }

  function syncViewer(item){
    setFrameSource(els.viewerFrame, item, 'preview');
    renderCuratorial(item);
  }

  function syncModal(item){
    if(!els.modalOpen && !state.modalOpen) return;
    els.modalTitle.textContent = item.title;
    els.modalSub.textContent = item.sub;
    setFrameSource(els.modalFrame, item, 'detail');
  }


  /* Scroll ONLY the thumbnail strip horizontally — never moves the page vertically */
  function scrollThumbOnly(index){
    const btn  = els.thumbList?.querySelector(`[data-thumb-index="${index}"]`);
    const list = els.thumbList;
    if(!btn || !list) return;
    const target = btn.offsetLeft - (list.clientWidth - btn.clientWidth) / 2;
    list.scrollTo({left: Math.max(0, target), behavior:'smooth'});
  }

  function updateIndex(nextIndex, options={}){
    state.index = wrap(nextIndex);
    const item = items[state.index];
    setAccent(item);
    syncHero(item);
    syncViewer(item);
    updateThumbStates();
    updateProgress();
    syncModal(item);

    if(options.scrollThumb) scrollThumbOnly(state.index);
  }

  function step(dir){
    updateIndex(state.index + dir, {scrollThumb:true});
  }

  function openDetail(){
    state.modalOpen = true;
    els.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // rAF ensures display:grid layout is computed before syncing
    requestAnimationFrame(() => requestAnimationFrame(() => {
      syncModal(items[state.index]);
    }));
  }

  function closeDetail(){
    state.modalOpen = false;
    els.modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if(document.fullscreenElement){
      document.exitFullscreen().catch(()=>{});
    }
  }

  function toggleFullscreen(){
    const target = document.querySelector('.modal-inner');
    if(!target || !document.fullscreenEnabled) return;
    if(document.fullscreenElement){
      document.exitFullscreen().catch(()=>{});
      return;
    }
    target.requestFullscreen?.().catch(()=>{});
  }

  function setupButtons(){
    els.prevBtns.forEach(btn => btn.addEventListener('click', () => step(-1)));
    els.nextBtns.forEach(btn => btn.addEventListener('click', () => step(1)));
    els.openDetailBtns.forEach(btn => btn.addEventListener('click', openDetail));
    els.restartBtns.forEach(btn => btn.addEventListener('click', () => {
      updateIndex(0, {scrollThumb:true});
      window.scrollTo({top:0, behavior:'smooth'});
    }));

    els.enterCollection?.addEventListener('click', () => els.viewerSection?.scrollIntoView({behavior:'smooth', block:'start'}));
    els.goViewerBtn?.addEventListener('click', () => els.viewerSection?.scrollIntoView({behavior:'smooth', block:'start'}));
    els.backToPortfolioTop?.addEventListener('click', () => { window.location.href = 'index.html#ceramica-awajun'; });
    els.footerBack?.addEventListener('click', () => { window.location.href = 'index.html#ceramica-awajun'; });

    els.modalClose?.addEventListener('click', closeDetail);
    els.modal?.addEventListener('click', (evt) => {
      if(evt.target === els.modal) closeDetail();
    });
    els.modalPrev?.addEventListener('click', () => step(-1));
    els.modalNext?.addEventListener('click', () => step(1));
    els.modalFullscreen?.addEventListener('click', toggleFullscreen);
  }

  function setupKeyboard(){
    document.addEventListener('keydown', (evt) => {
      const tag = evt.target?.tagName;
      if(['INPUT','TEXTAREA','SELECT'].includes(tag)) return;
      if(evt.key === 'ArrowRight'){ evt.preventDefault(); step(1); }
      if(evt.key === 'ArrowLeft'){ evt.preventDefault(); step(-1); }
      if(evt.key === 'Enter' && document.activeElement?.hasAttribute('data-open-detail')){ evt.preventDefault(); openDetail(); }
      if(evt.key.toLowerCase() === 'f' && state.modalOpen){ evt.preventDefault(); toggleFullscreen(); }
      if(evt.key === 'Escape' && state.modalOpen){ evt.preventDefault(); closeDetail(); }
    });
  }

  function setupReveal(){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.12});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  function setupHeroParallax(){
    if(!els.heroPanel || !els.heroShell) return;
    let raf = 0;
    const reset = () => { els.heroShell.style.transform = 'perspective(1400px) rotateY(-9deg) rotateX(4deg)'; };
    els.heroPanel.addEventListener('pointermove', (evt) => {
      if(window.innerWidth < 980) return;
      const rect = els.heroPanel.getBoundingClientRect();
      const x = ((evt.clientX - rect.left) / rect.width) - .5;
      const y = ((evt.clientY - rect.top) / rect.height) - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rotY = -9 + x * 8;
        const rotX = 4 - y * 7;
        els.heroShell.style.transform = `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(-2px)`;
      });
    });
    els.heroPanel.addEventListener('pointerleave', reset);
  }

  function setupWheelNavigation(){
    const stage = document.querySelector('.viewer-stage');
    if(!stage) return;
    let last = 0;
    stage.addEventListener('wheel', (evt) => {
      if(Math.abs(evt.deltaY) < 18 && Math.abs(evt.deltaX) < 18) return;
      const now = Date.now();
      if(now - last < 450) return;
      last = now;
      evt.preventDefault();
      const dir = Math.abs(evt.deltaX) > Math.abs(evt.deltaY) ? Math.sign(evt.deltaX) : Math.sign(evt.deltaY);
      step(dir > 0 ? 1 : -1);
    }, {passive:false});
  }


  /* ─────────────────────────────────────────────
     HERO DRAG / SWIPE — arrastra el preview para
     navegar entre modelos. Funciona con mouse y touch.
     ───────────────────────────────────────────── */
  function setupHeroDrag(){
    const zone = document.querySelector('.hero-preview-zone');
    if(!zone) return;

    const THRESHOLD  = 55;   // px mínimos para cambiar pieza
    const RUBBER     = 0.38; // resistencia visual durante el arrastre
    let   startX     = 0;
    let   dragDelta  = 0;
    let   dragging   = false;
    let   rafId      = 0;

    // Cursor visual
    zone.style.cursor = 'grab';

    function onDragStart(x){
      startX   = x;
      dragDelta = 0;
      dragging  = true;
      zone.style.cursor = 'grabbing';
      cancelAnimationFrame(rafId);
    }

    function onDragMove(x){
      if(!dragging) return;
      dragDelta = x - startX;

      // Feedback visual: inclina levemente el shell en la dirección del arrastre
      const tilt = dragDelta * RUBBER;
      const shell = els.heroShell;
      if(shell){
        rafId = requestAnimationFrame(() => {
          shell.style.transform =
            `perspective(1400px) rotateY(${-9 + tilt * 0.08}deg) rotateX(4deg) translateX(${tilt * 0.12}px)`;
        });
      }
    }

    function onDragEnd(){
      if(!dragging) return;
      dragging = false;
      zone.style.cursor = 'grab';

      // Reset shell transform
      const shell = els.heroShell;
      if(shell){
        cancelAnimationFrame(rafId);
        shell.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
        shell.style.transform  = 'perspective(1400px) rotateY(-9deg) rotateX(4deg)';
        setTimeout(() => { if(shell) shell.style.transition = ''; }, 420);
      }

      // Navigate if threshold exceeded
      if(Math.abs(dragDelta) >= THRESHOLD){
        step(dragDelta < 0 ? 1 : -1);
      }
      dragDelta = 0;
    }

    // ── Mouse ──
    zone.addEventListener('mousedown',  e => { e.preventDefault(); onDragStart(e.clientX); });
    window.addEventListener('mousemove', e => { if(dragging) onDragMove(e.clientX); });
    window.addEventListener('mouseup',   ()  => onDragEnd());

    // ── Touch ──
    zone.addEventListener('touchstart', e => {
      onDragStart(e.touches[0].clientX);
    }, {passive:true});
    zone.addEventListener('touchmove',  e => {
      onDragMove(e.touches[0].clientX);
    }, {passive:true});
    zone.addEventListener('touchend',   () => onDragEnd());

    // Hint visual: pequeña animación de swipe hint al cargar
    setTimeout(() => {
      const shell = els.heroShell;
      if(!shell) return;
      shell.style.transition = 'transform .6s ease';
      shell.style.transform  = 'perspective(1400px) rotateY(-13deg) rotateX(4deg) translateX(-12px)';
      setTimeout(() => {
        shell.style.transform = 'perspective(1400px) rotateY(-5deg) rotateX(4deg) translateX(8px)';
        setTimeout(() => {
          shell.style.transform = 'perspective(1400px) rotateY(-9deg) rotateX(4deg)';
          setTimeout(() => { shell.style.transition = ''; }, 600);
        }, 600);
      }, 600);
    }, 1800);
  }


  buildThumbs();
  setupButtons();
  setupKeyboard();
  setupReveal();
  setupHeroParallax();
  setupWheelNavigation();
  setupHeroDrag();
  updateIndex(0);
})();
