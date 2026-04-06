/* ============================================================
   GJR PORTFOLIO 2026 — scripts.js FINAL
   Gildemeister Julca Ramos · Educación Tecnológica · UNIFSLB
============================================================ */

/* ── CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function animCursor(){
  rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
  if(dot){dot.style.left=mx+'px';dot.style.top=my+'px';}
  if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
  requestAnimationFrame(animCursor);
})();
function attachCursorHover(elements){
  elements.forEach(el=>{
    if(!el || el.dataset.cursorBound==='1') return;
    el.dataset.cursorBound='1';
    el.addEventListener('mouseenter',()=>{if(!ring)return;ring.style.width='48px';ring.style.height='48px';ring.style.borderColor='rgba(0,255,231,0.8)';});
    el.addEventListener('mouseleave',()=>{if(!ring)return;ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(0,255,231,0.5)';});
  });
}
attachCursorHover(document.querySelectorAll('a,button,.gallery-card-coverflow,.sacred-design-card,.sacred-main-disc'));

/* ── NAVBAR ── */
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open');}
document.getElementById('navLinks').querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open'));
});

/* ── PARTÍCULAS HERO ── */
const container=document.getElementById('particles');
if(container){
  for(let i=0;i<35;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(Math.random()*8+5)+'s';
    p.style.animationDelay='-'+(Math.random()*12)+'s';
    p.style.width=p.style.height=(Math.random()*2+1)+'px';
    p.style.opacity=Math.random()*0.6+0.2;
    container.appendChild(p);
  }
}

/* ── GALERÍA COVERFLOW SWIPER ── */
const galleryItems=[
  {
    src:'assets/imagenes/campus-universitario.jpg',
    emoji:'🏫',
    title:'Campus Universitario',
    subtitle:'UNIFSLB Bagua · entorno de formación',
    desc:'Vista principal del contexto donde se desarrolla la experiencia académica y tecnológica.',
    kicker:'entorno de formación',
    meta:['Entorno','Registro','2026'],
    featured:true
  },
  {
    src:'assets/imagenes/concurso-baile.jpg',
    emoji:'💃',
    title:'Concurso de baile tradicional',
    subtitle:'Actividad cultural · presencia escénica',
    desc:'Registro de participación cultural e identidad escénica dentro del proceso universitario.',
    kicker:'actividad cultural',
    meta:['Cultura','Escena','Participación']
  },
  {
    src:'assets/imagenes/dia-presentacion.jpg',
    emoji:'🎓',
    title:'Día de presentación',
    subtitle:'Inicio de proceso académico',
    desc:'Evidencia del momento de presentación y exposición académica.',
    kicker:'presentación académica',
    meta:['Aula','Presentación','Proceso']
  },
  {
    src:'assets/imagenes/ensayo-nungkui.jpg',
    emoji:'🌿',
    title:'Ensayo Nungkui',
    subtitle:'Exploración intercultural · 2026',
    desc:'Pieza vinculada a identidad, territorio y simbología amazónica.',
    kicker:'exploración intercultural',
    meta:['Nungkui','Identidad','Intercultural']
  },
  {
    src:'assets/imagenes/espacio-trabajo.jpg',
    emoji:'🧑‍💻',
    title:'Espacio de trabajo',
    subtitle:'Diseño y producción digital',
    desc:'Entorno desde donde se desarrollan prototipos y material digital.',
    kicker:'producción digital',
    meta:['Setup','Producción','Diseño']
  },
  {
    src:'assets/imagenes/visita-tutumberos.jpg',
    emoji:'🤝',
    title:'Visita a Tutumberos',
    subtitle:'Trabajo de campo · comunidad',
    desc:'Acercamiento territorial y experiencia de campo vinculada al contexto real.',
    kicker:'trabajo de campo',
    meta:['Campo','Comunidad','Vínculo']
  }
];

let swiperInstance=null;

function buildGallerySwiper(){
  const wrapper=document.getElementById('swiperWrapper');
  if(!wrapper)return;
  wrapper.innerHTML='';
  galleryItems.forEach(item=>{
    const slide=document.createElement('div'); slide.className='swiper-slide';
    const card=document.createElement('div');  card.className='gallery-card-coverflow';
    const imgW=document.createElement('div');  imgW.className='gallery-img-wrapper-coverflow';
    const imgC=document.createElement('div');
    imgC.style.cssText='position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a1628,#0d1f3d)';
    const img=document.createElement('img');
    img.src=item.src; img.alt=item.title; img.className='gallery-img-coverflow';
    img.loading='lazy'; img.style.opacity='0'; img.style.transition='opacity .5s ease';
    img.onload=()=>{img.style.opacity='1';};
    img.onerror=()=>{
      img.style.display='none';
      const fb=document.createElement('div');
      fb.style.cssText='display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;';
      fb.innerHTML=`<div style="font-size:3rem;margin-bottom:.4rem;">${item.emoji}</div><div style="font-size:.8rem;color:var(--neon-cyan);font-family:var(--font-mono);">${item.title}</div>`;
      imgC.appendChild(fb);
    };
    imgC.appendChild(img);
    const overlay=document.createElement('div'); overlay.className='gallery-overlay-coverflow'; overlay.textContent='🔍';
    imgW.appendChild(imgC); imgW.appendChild(overlay);
    const info=document.createElement('div'); info.className='gallery-info-coverflow';
    info.innerHTML=`<h4>${item.title}</h4><p>${item.subtitle}</p>`;
    card.appendChild(imgW); card.appendChild(info);
    card.addEventListener('click',()=>openLightbox(item));
    slide.appendChild(card); wrapper.appendChild(slide);
  });
  setTimeout(()=>{
    if(swiperInstance)swiperInstance.destroy(true,true);
    swiperInstance=new Swiper('#gallerySwiper',{
      effect:'coverflow',grabCursor:true,centeredSlides:true,slidesPerView:'auto',
      coverflowEffect:{rotate:45,stretch:0,depth:120,modifier:1.2,slideShadows:true},
      pagination:{el:'.swiper-pagination',clickable:true},
      navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev'},
      loop:true,autoplay:{delay:4500,disableOnInteraction:false},
      breakpoints:{320:{slidesPerView:1},640:{slidesPerView:1.2},900:{slidesPerView:'auto'}}
    });
  },200);
}
buildGallerySwiper();
let academicGallery3dSwiper = null;

function updateAcademicGallery3D(index=0){
  const item = galleryItems[index] || galleryItems[0];
  const current = document.getElementById('academicGalleryCurrent');
  const kicker = document.getElementById('academicGalleryKicker');
  const title = document.getElementById('academicGalleryTitle');
  const desc = document.getElementById('academicGalleryDesc');
  const chips = document.getElementById('academicGalleryChips');
  const currentNum = document.getElementById('academicGalleryCurrentNum');
  const totalNum = document.getElementById('academicGalleryTotalNum');
  if(!current || !item) return;

  current.innerHTML = `
    <button type="button" class="academic-gallery-3d-current-btn" aria-label="Abrir ${item.title}">
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <span class="academic-gallery-3d-current-badge">pieza activa</span>
      <div class="academic-gallery-3d-current-overlay">
        <span class="academic-gallery-3d-current-kicker">${item.kicker || item.subtitle}</span>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    </button>`;

  const currentBtn = current.querySelector('.academic-gallery-3d-current-btn');
  if(currentBtn) currentBtn.addEventListener('click',()=>openLightbox(item));

  if(kicker) kicker.textContent = item.subtitle || item.kicker || 'actividad académica';
  if(title) title.textContent = item.title;
  if(desc) desc.textContent = item.desc;
  if(currentNum) currentNum.textContent = String(index + 1).padStart(2,'0');
  if(totalNum) totalNum.textContent = String(galleryItems.length).padStart(2,'0');

  if(chips){
    chips.innerHTML = '';
    (item.meta || []).slice(0,3).forEach(tag=>{
      const span = document.createElement('span');
      span.className = 'academic-gallery-chip';
      span.textContent = tag;
      chips.appendChild(span);
    });
  }
}

function renderAcademicGallery3D(){
  const prevBtn = document.getElementById('academicGalleryPrevBtn');
  const nextBtn = document.getElementById('academicGalleryNextBtn');
  const total   = galleryItems.length;
  let currentIndex = 0;

  function go(index){
    currentIndex = (index + total) % total;
    updateAcademicGallery3D(currentIndex);
  }

  if(prevBtn) prevBtn.onclick = () => go(currentIndex - 1);
  if(nextBtn) nextBtn.onclick = () => go(currentIndex + 1);

  // Keyboard navigation when gallery is in view
  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft')  go(currentIndex - 1);
    if(e.key === 'ArrowRight') go(currentIndex + 1);
  });

  go(0);
}
renderAcademicGallery3D();


/* ── GALERÍA CIRCULAR 3D ── */
let circularIndex=0;
let circularTimer=null;

function getCircularData(offset=0){
  const len=galleryItems.length;
  return galleryItems[(circularIndex+offset+len)%len];
}

function renderCircularGallery(){
  const title=document.getElementById('circularTitle');
  const subtitle=document.getElementById('circularSubtitle');
  const desc=document.getElementById('circularDescription');
  const meta=document.getElementById('circularMeta');
  const bg=document.getElementById('circularBg');
  const focus=document.getElementById('circularFocusImg');
  const orbit=document.getElementById('circularOrbit');
  const thumbs=document.getElementById('circularThumbs');
  const focusBtn=document.getElementById('circularFocus');
  if(!title||!subtitle||!desc||!meta||!bg||!focus||!orbit||!thumbs) return;

  const active=getCircularData();
  title.textContent=active.title;
  subtitle.textContent=active.subtitle;
  desc.textContent=active.desc;
  meta.innerHTML=active.meta.map(item=>`<span>${item}</span>`).join('');
  bg.src=active.src;
  bg.alt=active.title;
  focus.src=active.src;
  focus.alt=active.title;
  if(focusBtn) focusBtn.onclick=()=>openLightbox(active);

  orbit.innerHTML='';
  const total=galleryItems.length;
  const centerX=50, centerY=50, radius=32;
  galleryItems.forEach((item,index)=>{
    const relative=(index-circularIndex+total)%total;
    const angle=((relative/total)*Math.PI*2)-(Math.PI/2);
    const x=centerX + Math.cos(angle)*radius;
    const y=centerY + Math.sin(angle)*radius;
    const btn=document.createElement('button');
    btn.className='circular-node';
    if(index===circularIndex) btn.classList.add('is-active');
    if(relative===3 || relative===4) btn.classList.add('is-far');
    btn.style.left=`${x}%`;
    btn.style.top=`${y}%`;
    btn.innerHTML=`<img src="${item.src}" alt="${item.title}" loading="lazy">`;
    btn.addEventListener('click',()=>{ circularIndex=index; renderCircularGallery(); restartCircularAutoplay(); });
    orbit.appendChild(btn);
  });

  thumbs.innerHTML='';
  galleryItems.forEach((item,index)=>{
    const btn=document.createElement('button');
    btn.className='circular-thumb';
    if(index===circularIndex) btn.classList.add('active');
    btn.innerHTML=`<div class="circular-thumb-frame"><img src="${item.src}" alt="${item.title}" loading="lazy"></div><span>${item.title}</span>`;
    btn.addEventListener('click',()=>{ circularIndex=index; renderCircularGallery(); restartCircularAutoplay(); });
    thumbs.appendChild(btn);
  });
}

function moveCircularGallery(step){
  circularIndex=(circularIndex+step+galleryItems.length)%galleryItems.length;
  renderCircularGallery();
}

function restartCircularAutoplay(){
  if(circularTimer) clearInterval(circularTimer);
  if(!document.getElementById('circularGallery')) return;
  circularTimer=setInterval(()=>moveCircularGallery(1), 5000);
}

(function initCircularGallery(){
  const gallery=document.getElementById('circularGallery');
  if(!gallery) return;
  const prev=document.getElementById('circularPrev');
  const next=document.getElementById('circularNext');
  if(prev) prev.addEventListener('click',()=>{ moveCircularGallery(-1); restartCircularAutoplay(); });
  if(next) next.addEventListener('click',()=>{ moveCircularGallery(1); restartCircularAutoplay(); });
  gallery.addEventListener('mouseenter',()=>{ if(circularTimer) clearInterval(circularTimer); });
  gallery.addEventListener('mouseleave',restartCircularAutoplay);
  renderCircularGallery();
  restartCircularAutoplay();
})();

/* ── LIGHTBOX ── */
function openLightbox(item){
  document.getElementById('lightboxImg').src=item.src;
  document.getElementById('lightboxCaption').textContent=item.title+' · '+item.subtitle;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}

/* ══════════════════════════════════════════════════════════
   GALERÍA SAGRADA — DATOS & LÓGICA
══════════════════════════════════════════════════════════ */
const disenosAwajun=[
  {
    file:'assets/disenos/awajun_ceramica.html',
    title:'Mandala circular tradicional',
    sub:'Cerámica sagrada · Núgkui',
    desc:'Composición centrada en anillos, triángulos y puntos pulsantes. Toma como eje la cerámica awajún y su dimensión espiritual dentro de la cosmovisión amazónica.',
    tags:['Cerámica','Núgkui','Cosmovisión','Centro ritual'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.page',
    previewPadding:0.045,
    modalPadding:0.055,
    heroFrameRatio:'1 / 1.12',
    heroPreviewPadding:0.14,
    heroPreviewZoom:0.76,
    theme:{name:'ceramica',accent:'#ba2d24',accentSoft:'rgba(186,45,36,.16)',panelAccent:'#2fe6da',shellTop:'#fcf8f2',shellBottom:'#efe7dc',stageTop:'#fffaf4',stageBottom:'#ece3d7',panelFrom:'#111317',panelTo:'#171b22',ink:'#161311'}
  },
  {
    file:'assets/disenos/awajun_v4_fixed.html',
    title:'Flip card · geometría dual',
    sub:'Diamantes concéntricos · dualidad',
    desc:'Tarjeta interactiva con frente geométrico y dorso informativo. Funciona como pieza puente entre diseño digital, simbología y lectura de identidad.',
    tags:['Dualidad','Diamantes','Interfaz','Identidad'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.flip-wrap',
    previewPadding:0.035,
    modalPadding:0.045,
    theme:{name:'dualidad',accent:'#8f4fd6',accentSoft:'rgba(143,79,214,.18)',panelAccent:'#f4bf7e',shellTop:'#f6f2fb',shellBottom:'#ebe4f5',stageTop:'#faf7ff',stageBottom:'#e7deef',panelFrom:'#14111c',panelTo:'#1d1629',ink:'#140f1b'}
  },
  {
    file:'assets/disenos/awajun_variant2_1.html',
    title:'Hero mandala vertical',
    sub:'Mandala central · alfarería',
    desc:'Propuesta vertical con panel informativo y composición ceremonial. Ordena mejor el contenido y mejora la lectura del proyecto cultural.',
    tags:['Hero','Mandala','Arcilla','Composición'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.flip-wrap',
    previewPadding:0.04,
    modalPadding:0.055,
    theme:{name:'alfareria',accent:'#d85c3a',accentSoft:'rgba(216,92,58,.16)',panelAccent:'#ffdb9d',shellTop:'#fbf3ec',shellBottom:'#efe3d7',stageTop:'#fff9f2',stageBottom:'#eadccf',panelFrom:'#181310',panelTo:'#261a14',ink:'#1c120d'}
  },
  {
    file:'assets/disenos/awajun-ui.html',
    title:'Card · corona radiante',
    sub:'Iconografía solar · efecto 3D',
    desc:'Diseño con sensación inmersiva y estructura de núcleo. La pieza potencia el tono impactante que pediste para la sección.',
    tags:['Solar','3D','Núcleo','Interacción'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.card',
    previewPadding:0.03,
    modalPadding:0.04,
    theme:{name:'solar',accent:'#ff7a18',accentSoft:'rgba(255,122,24,.17)',panelAccent:'#ffe07d',shellTop:'#fff7ed',shellBottom:'#f2e5d1',stageTop:'#fffaf2',stageBottom:'#ead9bd',panelFrom:'#19120d',panelTo:'#271b12',ink:'#1f140c'}
  },
  {
    file:'assets/disenos/index-jsfiddle-be4r2739-1.html',
    title:'Premium · zigzag neón',
    sub:'Ríos amazónicos · tradición tech',
    desc:'Fusión de bordes zigzag, hover inmersivo y narrativa neon. Es una pieza más agresiva visualmente y funciona bien como contraste dentro del portafolio.',
    tags:['Zigzag','Neón','Ríos','Fusión'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.card-ultra-pro',
    previewPadding:0.03,
    modalPadding:0.04,
    theme:{name:'rios',accent:'#cc2929',accentSoft:'rgba(204,41,41,.16)',panelAccent:'#24d8d8',shellTop:'#f5f5f7',shellBottom:'#e7e6e9',stageTop:'#fbfbfc',stageBottom:'#e1e0e4',panelFrom:'#0f1420',panelTo:'#142234',ink:'#12151d'}
  },
  {
    file:'assets/disenos/awajun_tarjeta_neon.html',
    title:'Tarjeta neón ceremonial',
    sub:'Reloj simbólico · energía roja',
    desc:'Modelo integrado desde tus referencias externas. Su composición horizontal y su glow rojo elevan la sensación premium de la sección.',
    tags:['Neón','Rojo','Panel','Impacto'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.card',
    previewPadding:0.03,
    modalPadding:0.04,
    theme:{name:'neon-red',accent:'#f04d43',accentSoft:'rgba(240,77,67,.18)',panelAccent:'#ffb7a0',shellTop:'#fff3f1',shellBottom:'#efe2dd',stageTop:'#fff8f7',stageBottom:'#e8d7d1',panelFrom:'#1b1111',panelTo:'#2a1618',ink:'#211110'}
  },
  {
    file:'assets/disenos/awajun_tarjeta_azul.html',
    title:'Tarjeta azul · espíritu del río',
    sub:'Geometría fluvial · contraste frío',
    desc:'Modelo integrado para diversificar la paleta y evitar que toda la sección se vea igual. Aporta contraste, profundidad y limpieza.',
    tags:['Azul','Río','Contraste','Profundidad'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.card',
    previewPadding:0.03,
    modalPadding:0.04,
    theme:{name:'azul-rio',accent:'#2d84ff',accentSoft:'rgba(45,132,255,.18)',panelAccent:'#58e1ff',shellTop:'#eff5ff',shellBottom:'#dde7f5',stageTop:'#f7fbff',stageBottom:'#d9e6f1',panelFrom:'#0d1624',panelTo:'#11263b',ink:'#0f1825'}
  },
  {
    file:'assets/disenos/reloj_awajun_cosmico.html',
    title:'Reloj awajún cósmico',
    sub:'Portal temporal · capas orbitales',
    desc:'Diseño con capas giratorias y lectura cósmica. Refuerza el carácter experimental del portafolio y amplía la variedad de interfaces.',
    tags:['Cósmico','Tiempo','Órbitas','Glow'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.scene',
    previewPadding:0.03,
    modalPadding:0.045,
    theme:{name:'cosmico',accent:'#6658ff',accentSoft:'rgba(102,88,255,.18)',panelAccent:'#bba7ff',shellTop:'#f2f0ff',shellBottom:'#e4e0f6',stageTop:'#fbfaff',stageBottom:'#dfdaf2',panelFrom:'#101129',panelTo:'#171b3a',ink:'#11142b'}
  },
  {
    file:'assets/disenos/tarjeta_awajun_quantica.html',
    title:'Tarjeta cuántica awajún',
    sub:'Núcleo ritual · profundidad 3D',
    desc:'Modelo integrado con fuerte presencia visual. Sirve para cerrar la serie con una propuesta más futurista, pero coherente con la línea general.',
    tags:['Cuántica','3D','Núcleo','Futuro'],
    previewFitMode:'content',
    modalFitMode:'full',
    fitSelector:'.escena, .tarjeta',
    previewPadding:0.03,
    modalPadding:0.04,
    theme:{name:'cuantica',accent:'#8c5dff',accentSoft:'rgba(140,93,255,.18)',panelAccent:'#2fe6da',shellTop:'#f5f2ff',shellBottom:'#e8e3f6',stageTop:'#fbf8ff',stageBottom:'#e1d9f2',panelFrom:'#0f1327',panelTo:'#111d31',ink:'#121627'}
  }
];

let sacredActiveIdx=0;
let sacredModalIdx=0;
let sacredModalZoom=1;
const SACRED_MODAL_MIN_ZOOM=0.72;
const SACRED_MODAL_MAX_ZOOM=3.2;



function buildSacredDots(){
  const wrap=document.getElementById('heroDots');
  if(!wrap) return;
  wrap.innerHTML='';
  disenosAwajun.forEach((item, idx)=>{
    const dot=document.createElement('button');
    dot.className='sacred-tech-dot';
    dot.type='button';
    dot.setAttribute('aria-label', `Ir al diseño ${String(idx+1).padStart(2,'0')}: ${item.title}`);
    dot.addEventListener('click', ()=>activateSacredCard(idx));
    wrap.appendChild(dot);
  });
}

const SACRED_LOOKBACK_VISIBLE_RANGE=3.35;
const SACRED_LOOKBACK_DRAG_FACTOR=235;
const SACRED_LOOKBACK_EASE=.12;
let sacredLookbackPosition=0;
let sacredLookbackTarget=0;
let sacredLookbackRAF=0;
let sacredLookbackIsDragging=false;


function normalizeSacredLoopOffset(target, base=0, total=disenosAwajun.length){
  const max=Math.max(1, Number(total) || 1);
  let delta=(Number(target) || 0) - (Number(base) || 0);
  delta=((delta + max / 2) % max + max) % max - max / 2;
  if(delta===-max/2) delta=max/2;
  return delta;
}

function buildSacredLookback(){
  const rail=document.getElementById('sacredLookbackRail');
  if(!rail) return;
  rail.innerHTML='';
  disenosAwajun.forEach((model, index)=>{
    const card=document.createElement('button');
    card.type='button';
    card.className='lookback-awajun-card';
    card.dataset.index=String(index);
    card.setAttribute('aria-label', `Ver ${model.title}`);
    card.innerHTML=`
      <span class="lookback-awajun-card-frame">
        <span class="lookback-awajun-media"></span>
      </span>
      <span class="lookback-awajun-meta">
        <strong>${String(index + 1).padStart(2,'0')}</strong>
        <small>${model.sub}</small>
      </span>
    `;
    card.addEventListener('click', ()=>{
      if(sacredLookbackIsDragging) return;
      const cardIndex=Number(card.dataset.index || index);
      if(cardIndex===sacredActiveIdx) openSacredModal(cardIndex);
      else activateSacredCard(cardIndex);
    });
    card.addEventListener('keydown', evt=>{
      const cardIndex=Number(card.dataset.index || index);
      if(evt.key==='Enter' || evt.key===' '){
        evt.preventDefault();
        if(cardIndex===sacredActiveIdx) openSacredModal(cardIndex);
        else activateSacredCard(cardIndex);
      }
      if(evt.key==='ArrowLeft'){
        evt.preventDefault();
        activateSacredCard((sacredActiveIdx - 1 + disenosAwajun.length) % disenosAwajun.length);
      }
      if(evt.key==='ArrowRight'){
        evt.preventDefault();
        activateSacredCard((sacredActiveIdx + 1) % disenosAwajun.length);
      }
      if(evt.key==='Home'){
        evt.preventDefault();
        activateSacredCard(0);
      }
      if(evt.key==='End'){
        evt.preventDefault();
        activateSacredCard(disenosAwajun.length - 1);
      }
    });
    rail.appendChild(card);
  });
}

function ensureLookbackIframe(card, model){
  if(!card || !model) return;
  const media=card.querySelector('.lookback-awajun-media') || card.querySelector('.lookback-awajun-card-frame');
  if(!media) return;
  let iframe=card.querySelector('.lookback-awajun-iframe');
  if(!iframe){
    iframe=document.createElement('iframe');
    iframe.className='lookback-awajun-iframe';
    iframe.loading='lazy';
    iframe.setAttribute('scrolling','no');
    iframe.setAttribute('tabindex','-1');
    media.appendChild(iframe);
  }
  applySacredIframePreset(iframe, model.previewFitMode || 'content', '1', {
    fitSelector:model.fitSelector,
    fitPadding:model.previewPadding
  });
  if(iframe.getAttribute('src') !== model.file){
    iframe.setAttribute('src', model.file);
    iframe.setAttribute('title', model.title);
  }else{
    fitIframeToBox(iframe);
  }
}

function releaseLookbackIframe(card){
  if(!card) return;
  const iframe=card.querySelector('.lookback-awajun-iframe');
  if(iframe) iframe.style.pointerEvents='none';
}

function wrapSacredLoopValue(value, total=disenosAwajun.length){
  const max=Number(total) || 1;
  let next=Number(value) || 0;
  next=((next % max) + max) % max;
  return next;
}

function getNearestSacredIndex(position=sacredLookbackPosition){
  const total=disenosAwajun.length;
  let bestIndex=0;
  let bestDistance=Infinity;
  for(let index=0; index<total; index++){
    const distance=Math.abs(normalizeSacredLoopOffset(index, position, total));
    if(distance < bestDistance){
      bestDistance=distance;
      bestIndex=index;
    }
  }
  return bestIndex;
}

function applySacredContextTheme(model){
  const shell=document.querySelector('.sacred-lookback-shell');
  if(!shell || !model) return;
  const theme=model.theme || {};
  shell.style.setProperty('--lb-shell-top', theme.shellTop || '#fcfcfb');
  shell.style.setProperty('--lb-shell-bottom', theme.shellBottom || '#f3f2ee');
  shell.style.setProperty('--lb-stage-top', theme.stageTop || '#ffffff');
  shell.style.setProperty('--lb-stage-bottom', theme.stageBottom || '#eceae5');
  shell.style.setProperty('--lb-panel-from', theme.panelFrom || '#0d0f15');
  shell.style.setProperty('--lb-panel-to', theme.panelTo || '#12141d');
  shell.style.setProperty('--lb-accent', theme.accent || '#ba2d24');
  shell.style.setProperty('--lb-accent-soft', theme.accentSoft || 'rgba(186,45,36,.14)');
  shell.style.setProperty('--lb-panel-accent', theme.panelAccent || 'var(--neon-cyan)');
  shell.style.setProperty('--lb-ink', theme.ink || '#111318');
  shell.dataset.theme=model.theme?.name || '';
}

function syncSacredInterface(idx){
  sacredActiveIdx=idx;
  const current=disenosAwajun[idx];
  const n=String(idx+1).padStart(2,'0');
  const byId=id=>document.getElementById(id);
  if(byId('heroBigNum')) byId('heroBigNum').textContent=n;
  if(byId('heroCounterCurrent')) byId('heroCounterCurrent').textContent=n;
  if(byId('heroCounterTotal')) byId('heroCounterTotal').textContent=String(disenosAwajun.length).padStart(2,'0');
  if(byId('heroTitle')) byId('heroTitle').textContent=current.title;
  if(byId('heroDesc')) byId('heroDesc').textContent=compactSacredText(current.desc);
  if(byId('heroSub')) byId('heroSub').textContent=current.sub;
  if(byId('heroEyebrow')) byId('heroEyebrow').textContent=`// geometría sagrada · diseño ${n} de ${String(disenosAwajun.length).padStart(2,'0')}`;
  if(byId('heroTags')) byId('heroTags').innerHTML=current.tags.slice(0,3).map(tag=>`<span>${tag}</span>`).join('');
  document.querySelectorAll('#heroDots .sacred-tech-dot').forEach((dot, dotIdx)=>{
    dot.classList.toggle('is-active', dotIdx===idx);
    dot.setAttribute('aria-current', dotIdx===idx ? 'true' : 'false');
  });
  const prevIdx=(idx - 1 + disenosAwajun.length) % disenosAwajun.length;
  const nextIdx=(idx + 1) % disenosAwajun.length;
  const prevBtn=document.getElementById('sacredPrev');
  const nextBtn=document.getElementById('sacredNext');
  if(prevBtn){
    prevBtn.setAttribute('aria-label', `Ver diseño anterior: ${disenosAwajun[prevIdx].title}`);
    prevBtn.title=`Anterior: ${disenosAwajun[prevIdx].title}`;
  }
  if(nextBtn){
    nextBtn.setAttribute('aria-label', `Ver diseño siguiente: ${disenosAwajun[nextIdx].title}`);
    nextBtn.title=`Siguiente: ${disenosAwajun[nextIdx].title}`;
  }
  applySacredContextTheme(current);
  syncAwajunImmersiveHero(idx);
}

function syncAwajunImmersiveHero(idx = sacredActiveIdx){
  const item=disenosAwajun[idx];
  if(!item) return;

  const hero=document.getElementById('awajunImmersiveHero');
  const preview=document.getElementById('awajunImmersivePreview');
  const previewShell=document.getElementById('awajunImmersivePreviewShell');
  const title=document.getElementById('awajunFloatingTitle');
  const sub=document.getElementById('awajunFloatingSub');
  const desc=document.getElementById('awajunImmersiveDesc');
  const kicker=document.getElementById('awajunImmersiveKicker');
  const progress=document.getElementById('awajunImmersiveProgressBar');
  const num=document.querySelector('.awajun-floating-num');
  const meta=document.getElementById('awajunImmersiveMeta');
  const overlayTitle=document.getElementById('awajunPreviewOverlayTitle');
  const overlaySub=document.getElementById('awajunPreviewOverlaySub');
  const hint=document.getElementById('awajunImmersiveHint');
  const prevBtn=document.getElementById('awajunHeroPrev');
  const nextBtn=document.getElementById('awajunHeroNext');

  if(hero && item.theme?.accent){
    hero.style.setProperty('--awajun-accent', item.theme.accent);
  }

  if(preview){
    const heroPadding = item.heroPreviewPadding ?? Math.max((item.previewPadding || 0.03) + 0.09, 0.11);
    const heroZoom = item.heroPreviewZoom ?? 0.82;
    applySacredIframePreset(preview, item.previewFitMode || 'content', String(heroZoom), {
      fitSelector:item.fitSelector,
      fitPadding:heroPadding
    });

    if(preview.getAttribute('src') !== item.file){
      preview.setAttribute('src', item.file);
      preview.setAttribute('title', item.title);
      setTimeout(()=>fitIframeToBox(preview), 40);
      setTimeout(()=>fitIframeToBox(preview), 180);
      setTimeout(()=>fitIframeToBox(preview), 420);
    } else {
      fitIframeToBox(preview);
    }
  }

  if(previewShell){
    previewShell.setAttribute('aria-label', `Abrir diseño ${item.title}`);
    previewShell.style.setProperty('--awajun-hero-ratio', item.heroFrameRatio || '1 / 1.02');
  }

  if(title) title.textContent=item.title;
  if(sub) sub.textContent=item.sub;
  if(desc) desc.textContent=item.desc;
  if(overlayTitle) overlayTitle.textContent=item.title;
  if(overlaySub) overlaySub.textContent=`Haz clic para ver ${item.sub.toLowerCase()}`;
  if(hint) hint.textContent='Haz clic en la vista previa para abrir el diseño activo. Usa las flechas, el teclado o arrastra para recorrer la colección.';

  if(kicker){
    kicker.textContent=`// archivo visual · diseño ${String(idx + 1).padStart(2,'0')} de ${String(disenosAwajun.length).padStart(2,'0')}`;
  }

  if(num){
    num.textContent=String(idx + 1).padStart(2,'0');
  }

  if(progress){
    const pct=((idx + 1) / disenosAwajun.length) * 100;
    progress.style.width=`${pct}%`;
  }

  if(meta){
    const metaItems=[`${String(disenosAwajun.length).padStart(2,'0')} diseños`, item.sub, item.tags.slice(0,2).join(' · ')];
    meta.innerHTML=metaItems.map(label=>`<span>${label}</span>`).join('');
  }

  if(prevBtn && nextBtn){
    const prevItem=disenosAwajun[(idx - 1 + disenosAwajun.length) % disenosAwajun.length];
    const nextItem=disenosAwajun[(idx + 1) % disenosAwajun.length];
    prevBtn.setAttribute('title', `Anterior: ${prevItem.title}`);
    prevBtn.setAttribute('aria-label', `Ver diseño anterior: ${prevItem.title}`);
    nextBtn.setAttribute('title', `Siguiente: ${nextItem.title}`);
    nextBtn.setAttribute('aria-label', `Ver diseño siguiente: ${nextItem.title}`);
  }
}

function initAwajunImmersiveHero(){
  const hero=document.getElementById('awajunImmersiveHero');
  const enterBtn=document.getElementById('awajunEnterCollection');
  const openBtn=document.getElementById('awajunOpenActiveFromHero');
  const previewShell=document.getElementById('awajunImmersivePreviewShell');
  const prevBtn=document.getElementById('awajunHeroPrev');
  const nextBtn=document.getElementById('awajunHeroNext');

  if(!hero || !previewShell) return;

  let heroScrollProgress=0;

  const applyPreviewDepth=(pointerX=.5, pointerY=.5)=>{
    if(window.innerWidth <= 980) return;
    const rotateY=(-11 + (heroScrollProgress * 7)) + ((pointerX - .5) * 8);
    const rotateX=(5 - (heroScrollProgress * 3)) + ((.5 - pointerY) * 7);
    const scale=0.9 + (heroScrollProgress * 0.1);
    previewShell.style.transform=`rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
  };

  const resetPreviewDepth=()=>{
    previewShell.classList.remove('is-hovered');
    applyPreviewDepth(.5, .5);
  };

  const updateHeroState=()=>{
    const rect=hero.getBoundingClientRect();
    const inView=rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
    hero.classList.toggle('is-active', inView);
    heroScrollProgress=Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
    applyPreviewDepth(.5, .5);
  };

  const shiftHeroPiece=(dir, triggerBtn=null)=>{
    if(triggerBtn){
      triggerBtn.classList.add('is-pressed');
      setTimeout(()=>triggerBtn.classList.remove('is-pressed'), 180);
    }
    const nextIndex=(sacredActiveIdx + dir + disenosAwajun.length) % disenosAwajun.length;
    activateSacredCard(nextIndex);
    setTimeout(()=>{
      syncAwajunImmersiveHero(nextIndex);
      resetPreviewDepth();
    }, 20);
  };

  window.addEventListener('scroll', updateHeroState, { passive:true });
  window.addEventListener('resize', updateHeroState);
  updateHeroState();

  let heroSwipeMoved=false;
  previewShell.addEventListener('click', evt=>{
    if(heroSwipeMoved){
      evt.preventDefault();
      evt.stopPropagation();
      heroSwipeMoved=false;
      return;
    }
    openSacredModal(sacredActiveIdx);
  });
  previewShell.addEventListener('keydown', evt=>{
    if(evt.key === 'Enter' || evt.key === ' '){
      evt.preventDefault();
      openSacredModal(sacredActiveIdx);
    }
    if(evt.key === 'ArrowLeft'){
      evt.preventDefault();
      shiftHeroPiece(-1);
    }
    if(evt.key === 'ArrowRight'){
      evt.preventDefault();
      shiftHeroPiece(1);
    }
  });
  previewShell.addEventListener('mouseenter', ()=>previewShell.classList.add('is-hovered'));
  previewShell.addEventListener('mouseleave', resetPreviewDepth);
  previewShell.addEventListener('focus', ()=>previewShell.classList.add('is-hovered'));
  previewShell.addEventListener('blur', resetPreviewDepth);
  previewShell.addEventListener('pointermove', evt=>{
    if(window.innerWidth <= 980) return;
    const rect=previewShell.getBoundingClientRect();
    const x=(evt.clientX - rect.left) / Math.max(rect.width, 1);
    const y=(evt.clientY - rect.top) / Math.max(rect.height, 1);
    previewShell.classList.add('is-hovered');
    applyPreviewDepth(Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1));
  });

  let swipeStartX=0;
  let swipeDeltaX=0;
  previewShell.addEventListener('pointerdown', evt=>{
    swipeStartX=evt.clientX;
    swipeDeltaX=0;
    heroSwipeMoved=false;
  });
  previewShell.addEventListener('pointerup', evt=>{
    swipeDeltaX=evt.clientX - swipeStartX;
    if(Math.abs(swipeDeltaX) > 60){
      heroSwipeMoved=true;
      shiftHeroPiece(swipeDeltaX > 0 ? -1 : 1);
      setTimeout(()=>{ heroSwipeMoved=false; }, 220);
    }
  });

  if(enterBtn){
    enterBtn.addEventListener('click', ()=>{
      const gallery=document.querySelector('.sacred-gallery-section');
      if(gallery){
        gallery.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  }

  if(openBtn){
    openBtn.addEventListener('click', ()=>openSacredModal(sacredActiveIdx));
  }

  if(prevBtn){
    prevBtn.addEventListener('click', evt=>{
      evt.preventDefault();
      evt.stopPropagation();
      shiftHeroPiece(-1, prevBtn);
    });
  }

  if(nextBtn){
    nextBtn.addEventListener('click', evt=>{
      evt.preventDefault();
      evt.stopPropagation();
      shiftHeroPiece(1, nextBtn);
    });
  }

  syncAwajunImmersiveHero(sacredActiveIdx);
}

function renderSacredLookback(position=sacredLookbackPosition){
  const rail=document.getElementById('sacredLookbackRail');
  if(!rail) return;
  const cards=[...rail.querySelectorAll('.lookback-awajun-card')];
  cards.forEach((card,index)=>{
    const model=disenosAwajun[index];
    const offset=normalizeSacredLoopOffset(index, position, disenosAwajun.length);
    const abs=Math.abs(offset);
    const visible=abs<=SACRED_LOOKBACK_VISIBLE_RANGE;
    const direction=offset===0 ? 0 : (offset>0 ? 1 : -1);
    const tx=offset * 172 + direction * abs * 32;
    const tz=Math.max(-30, 215 - abs * 92);
    const ty=-18 + Math.min(abs * 16, 56);
    const rotateY=-offset * 28;
    const rotateZ=-offset * 1.4;
    const scale=Math.max(.56, 1.16 - abs * .12);
    const opacity=visible ? Math.max(.08, 1 - abs * .24) : 0;
    const blur=Math.max(0, abs - .55) * .85;

    card.classList.toggle('is-active', abs < .34);
    card.classList.toggle('is-hidden', !visible);
    const baseTransform=`translate(-50%,-50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
    card.dataset.baseTransform=baseTransform;
    card.style.transform=baseTransform;
    card.style.opacity=String(opacity);
    card.style.filter=`blur(${blur}px)`;
    card.style.zIndex=String(Math.max(1, 100-Math.round(abs*10)));
    card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    card.tabIndex=visible ? 0 : -1;
    card.setAttribute('aria-label', `${abs < .34 ? 'Abrir' : 'Llevar al centro'} ${model.title}`);

    if(visible) ensureLookbackIframe(card, model);
    else releaseLookbackIframe(card);
  });
}

function stopSacredLookbackAnimation(){
  if(!sacredLookbackRAF) return;
  cancelAnimationFrame(sacredLookbackRAF);
  sacredLookbackRAF=0;
}

function animateSacredLookback(){
  stopSacredLookbackAnimation();
  const tick=()=>{
    const delta=normalizeSacredLoopOffset(sacredLookbackTarget, sacredLookbackPosition, disenosAwajun.length);
    sacredLookbackPosition=wrapSacredLoopValue(sacredLookbackPosition + delta * SACRED_LOOKBACK_EASE);
    renderSacredLookback();
    const nearest=getNearestSacredIndex();
    if(nearest !== sacredActiveIdx) syncSacredInterface(nearest);
    if(Math.abs(delta) < .002){
      sacredLookbackPosition=wrapSacredLoopValue(sacredLookbackTarget);
      renderSacredLookback();
      const exact=getNearestSacredIndex();
      if(exact !== sacredActiveIdx) syncSacredInterface(exact);
      sacredLookbackRAF=0;
      setTimeout(fitSacredIframes, 60);
      return;
    }
    sacredLookbackRAF=requestAnimationFrame(tick);
  };
  sacredLookbackRAF=requestAnimationFrame(tick);
}

function updateSacredLookback(){
  sacredLookbackTarget=wrapSacredLoopValue(sacredActiveIdx);
  animateSacredLookback();
}

function initSacredLookbackInteractions(){
  const stage=document.getElementById('sacredLookbackStage');
  const prevBtn=document.getElementById('sacredPrev');
  const nextBtn=document.getElementById('sacredNext');
  if(!stage || stage.dataset.dragBound==='1') return;
  stage.dataset.dragBound='1';
  stage.tabIndex=0;
  stage.style.touchAction='pan-y';

  let pointerId=null;
  let startX=0;
  let startY=0;
  let startPosition=0;
  let dragged=false;
  let horizontalLock=false;
  let wheelLocked=false;

  const commitToNearest=()=>{
    const nextIndex=getNearestSacredIndex();
    syncSacredInterface(nextIndex);
    sacredLookbackTarget=nextIndex;
    animateSacredLookback();
  };

  const finishDrag=()=>{
    if(!sacredLookbackIsDragging) return;
    sacredLookbackIsDragging=false;
    stage.classList.remove('is-dragging');
    stage.classList.remove('is-live');
    horizontalLock=false;
    commitToNearest();
  };

  const goStep=(dir)=>activateSacredCard((sacredActiveIdx + dir + disenosAwajun.length) % disenosAwajun.length);

  stage.addEventListener('pointerdown', evt=>{
    if(evt.button !== undefined && evt.button !== 0) return;
    pointerId=evt.pointerId;
    sacredLookbackIsDragging=true;
    dragged=false;
    horizontalLock=false;
    startX=evt.clientX;
    startY=evt.clientY;
    startPosition=sacredLookbackPosition;
    stopSacredLookbackAnimation();
    stage.classList.add('is-live');
    if(stage.setPointerCapture && evt.pointerId !== undefined){
      try{ stage.setPointerCapture(evt.pointerId); }catch(err){}
    }
  });

  stage.addEventListener('pointermove', evt=>{
    if(!sacredLookbackIsDragging) return;
    if(pointerId !== null && evt.pointerId !== pointerId) return;
    const dx=evt.clientX-startX;
    const dy=evt.clientY-startY;
    if(!horizontalLock){
      if(Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.15){
        horizontalLock=true;
        stage.classList.add('is-dragging');
      }else if(Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)){
        finishDrag();
        return;
      }
    }
    if(!horizontalLock) return;
    if(Math.abs(dx) > 6) dragged=true;
    sacredLookbackPosition=wrapSacredLoopValue(startPosition - (dx / SACRED_LOOKBACK_DRAG_FACTOR));
    sacredLookbackTarget=sacredLookbackPosition;
    renderSacredLookback();
    const nearest=getNearestSacredIndex();
    if(nearest !== sacredActiveIdx) syncSacredInterface(nearest);
    if(evt.cancelable) evt.preventDefault();
  }, {passive:false});

  stage.addEventListener('pointerup', ()=>finishDrag());
  stage.addEventListener('pointercancel', ()=>finishDrag());
  stage.addEventListener('lostpointercapture', ()=>finishDrag());
  stage.addEventListener('mouseleave', evt=>{
    if(sacredLookbackIsDragging && evt.buttons===0) finishDrag();
  });

  stage.addEventListener('click', evt=>{
    if(dragged){
      evt.preventDefault();
      evt.stopPropagation();
      dragged=false;
    }
  }, true);

  stage.addEventListener('keydown', evt=>{
    if(evt.key==='ArrowLeft'){
      evt.preventDefault();
      goStep(-1);
    }
    if(evt.key==='ArrowRight'){
      evt.preventDefault();
      goStep(1);
    }
    if(evt.key==='Home'){
      evt.preventDefault();
      activateSacredCard(0);
    }
    if(evt.key==='End'){
      evt.preventDefault();
      activateSacredCard(disenosAwajun.length - 1);
    }
  });

  stage.addEventListener('wheel', evt=>{
    const delta=Math.abs(evt.deltaX) > Math.abs(evt.deltaY) ? evt.deltaX : evt.deltaY;
    if(Math.abs(delta) < 22 || wheelLocked) return;
    wheelLocked=true;
    goStep(delta > 0 ? 1 : -1);
    setTimeout(()=>{ wheelLocked=false; }, 260);
    if(Math.abs(evt.deltaX) > Math.abs(evt.deltaY) && evt.cancelable) evt.preventDefault();
  }, {passive:false});

  const navWrap=stage.parentElement?.parentElement?.querySelector('.sacred-lookback-buttons');
  if(navWrap){
    navWrap.classList.remove('is-hidden');
    navWrap.removeAttribute('aria-hidden');
  }
  if(prevBtn){
    prevBtn.addEventListener('click', ()=>goStep(-1));
  }
  if(nextBtn){
    nextBtn.addEventListener('click', ()=>goStep(1));
  }
}


let museumSuppressClick=false;

function getIframeFullBounds(doc){
  const root=doc.documentElement;
  const body=doc.body;
  const width=Math.max(root?.scrollWidth || 0, body?.scrollWidth || 0, root?.clientWidth || 0, body?.clientWidth || 0, 320);
  const height=Math.max(root?.scrollHeight || 0, body?.scrollHeight || 0, root?.clientHeight || 0, body?.clientHeight || 0, 220);
  return {left:0, top:0, width, height};
}


function isSaneFitRect(rect){
  return !!rect && Number.isFinite(rect.left) && Number.isFinite(rect.top) && Number.isFinite(rect.right) && Number.isFinite(rect.bottom) && Number.isFinite(rect.width) && Number.isFinite(rect.height) && rect.width >= 40 && rect.height >= 40;
}

function elementCanBeFit(doc, el, viewportW=1, viewportH=1){
  if(!doc || !el || !el.tagName) return false;
  const style=doc.defaultView.getComputedStyle(el);
  if(style.display==='none' || style.visibility==='hidden' || Number(style.opacity || '1')===0) return false;
  if(style.position==='fixed') return false;
  const rect=el.getBoundingClientRect();
  if(!isSaneFitRect(rect)) return false;
  if(rect.width < 80 || rect.height < 80) return false;
  const area=rect.width * rect.height;
  const areaRatio=area / Math.max(viewportW * viewportH, 1);
  if(areaRatio > 1.25) return false;
  return true;
}

function getPreferredFitElement(doc, selector=''){
  const body=doc.body;
  const root=doc.documentElement;
  if(!body || !root) return null;

  const viewportW=Math.max(root.clientWidth || 0, body.clientWidth || 0, 1);
  const viewportH=Math.max(root.clientHeight || 0, body.clientHeight || 0, 1);

  if(selector){
    const selectors=String(selector).split(',').map(s=>s.trim()).filter(Boolean);
    for(const sel of selectors){
      const el=doc.querySelector(sel);
      if(elementCanBeFit(doc, el, viewportW, viewportH)) return el;
    }
  }

  const centerX=viewportW / 2;
  const centerY=viewportH / 2;
  const preferredSelectors=[
    '[data-fit-root]',
    '.page',
    '.scene',
    '.flip-wrap',
    '.card',
    '.tarjeta',
    '.card-ultra-pro',
    '.mandala-card',
    '.clock-wrap',
    'main',
    'section'
  ];

  const candidates=[];
  preferredSelectors.forEach(selector=>{
    doc.querySelectorAll(selector).forEach(el=> candidates.push(el));
  });
  if(!candidates.length){
    Array.from(body.children).forEach(el=> candidates.push(el));
  }

  let best=null;
  let bestScore=-Infinity;
  candidates.forEach(el=>{
    if(!elementCanBeFit(doc, el, viewportW, viewportH)) return;
    const rect=el.getBoundingClientRect();
    const area=rect.width * rect.height;
    const areaRatio=area / (viewportW * viewportH);
    if(areaRatio > 0.985) return;

    const dx=Math.abs((rect.left + rect.right) / 2 - centerX) / viewportW;
    const dy=Math.abs((rect.top + rect.bottom) / 2 - centerY) / viewportH;
    const centerPenalty=(dx + dy) * 1200;
    const fullscreenPenalty=areaRatio > 0.92 ? 800 : 0;
    const wideBonus=rect.width > rect.height ? 80 : 0;
    const score=area - centerPenalty - fullscreenPenalty + wideBonus;
    if(score > bestScore){
      best=el;
      bestScore=score;
    }
  });

  return best;
}

function getIframeContentBounds(doc, selector='', paddingFactor){
  const root=doc.documentElement;
  const body=doc.body;
  if(!root || !body) return {left:0, top:0, width:800, height:600};

  const viewportW=Math.max(root.clientWidth || 0, body.clientWidth || 0, root.scrollWidth || 0, body.scrollWidth || 0, 1);
  const viewportH=Math.max(root.clientHeight || 0, body.clientHeight || 0, root.scrollHeight || 0, body.scrollHeight || 0, 1);
  const target=getPreferredFitElement(doc, selector);

  if(target){
    const rect=target.getBoundingClientRect();
    const validRect = Number.isFinite(rect.left) && Number.isFinite(rect.top) && Number.isFinite(rect.width) && Number.isFinite(rect.height) && rect.width > 40 && rect.height > 40;
    if(validRect){
      const factor = Number.isFinite(Number(paddingFactor)) ? Number(paddingFactor) : 0.05;
      const pad=Math.max(12, Math.round(Math.min(rect.width, rect.height) * factor));
      const rawLeft=Math.max(0, rect.left - pad);
      const rawTop=Math.max(0, rect.top - pad);
      const rawRight=Math.min(viewportW, rect.right + pad);
      const rawBottom=Math.min(viewportH, rect.bottom + pad);
      const width=Math.max(80, rawRight - rawLeft);
      const height=Math.max(80, rawBottom - rawTop);
      const withinViewport = rawLeft <= viewportW && rawTop <= viewportH && rawRight >= 0 && rawBottom >= 0;
      if(withinViewport && width > 0 && height > 0){
        return {left:rawLeft, top:rawTop, width, height};
      }
    }
  }

  const all=[body, ...Array.from(body.querySelectorAll('*'))];
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity, found=0;
  all.forEach(el=>{
    if(!el || !el.tagName) return;
    const tag=el.tagName.toUpperCase();
    if(['SCRIPT','STYLE','LINK','META','NOSCRIPT','HEAD','BR'].includes(tag)) return;
    const style=doc.defaultView.getComputedStyle(el);
    if(style.display==='none' || style.visibility==='hidden' || Number(style.opacity || '1')===0) return;
    if(style.position==='fixed') return;
    const rect=el.getBoundingClientRect();
    if(rect.width < 6 || rect.height < 6) return;
    minX=Math.min(minX, rect.left);
    minY=Math.min(minY, rect.top);
    maxX=Math.max(maxX, rect.right);
    maxY=Math.max(maxY, rect.bottom);
    found += 1;
  });

  if(!found || !isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)){
    return {left:0, top:0, width:viewportW, height:viewportH};
  }

  const pad=Math.max(14, Math.round(Math.min(viewportW, viewportH) * 0.028));
  const left=Math.max(0, minX - pad);
  const top=Math.max(0, minY - pad);
  const width=Math.max(80, Math.min(viewportW, maxX + pad) - left);
  const height=Math.max(80, Math.min(viewportH, maxY + pad) - top);
  return {left, top, width, height};
}

function fitIframeToBox(iframe){
  if(!iframe) return;
  const box=iframe.parentElement;
  if(!box) return;

  const applyFit=()=>{
    try{
      const doc=iframe.contentDocument;
      if(!doc) return;
      const root=doc.documentElement;
      const body=doc.body;
      if(!root || !body) return;

      const styleId='oai-iframe-fit-style';
      if(!doc.getElementById(styleId)){
        const style=doc.createElement('style');
        style.id=styleId;
        style.textContent=`
          html, body {
            margin: 0 !important;
            overflow: hidden !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            border: 0 !important;
            outline: none !important;
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
            display: none !important;
          }
        `;
        if(doc.head) doc.head.appendChild(style);
      }

      body.style.margin='0';
      root.style.margin='0';
      body.style.overflow='hidden';
      root.style.overflow='hidden';
      body.style.overflowX='hidden';
      body.style.overflowY='hidden';
      root.style.overflowX='hidden';
      root.style.overflowY='hidden';
      root.style.scrollbarWidth='none';
      body.style.scrollbarWidth='none';
      iframe.setAttribute('scrolling','no');
      iframe.style.position='absolute';
      iframe.style.display='block';
      try{ doc.defaultView.scrollTo(0,0); }catch(e){}

      const fitMode=(iframe.dataset.fitMode || 'content').toLowerCase();
      const fitSelector=iframe.dataset.fitSelector || '';
      const fitPadding=parseFloat(iframe.dataset.fitPadding || '');
      let bounds=(fitMode === 'content' || fitMode === 'crop')
        ? getIframeContentBounds(doc, fitSelector, fitPadding)
        : getIframeFullBounds(doc);
      if(!bounds || !Number.isFinite(bounds.left) || !Number.isFinite(bounds.top) || !Number.isFinite(bounds.width) || !Number.isFinite(bounds.height) || bounds.width < 40 || bounds.height < 40){
        bounds=getIframeFullBounds(doc);
      }
      const sourceW=Math.max(root.scrollWidth || 0, body.scrollWidth || 0, root.clientWidth || 0, body.clientWidth || 0, Math.ceil(bounds.left + bounds.width + 24), 320);
      const sourceH=Math.max(root.scrollHeight || 0, body.scrollHeight || 0, root.clientHeight || 0, body.clientHeight || 0, Math.ceil(bounds.top + bounds.height + 24), 220);
      const boxW=Math.max(box.clientWidth || 0, 1);
      const boxH=Math.max(box.clientHeight || 0, 1);
      const safePad = fitMode === 'full' || fitMode === 'viewport' || fitMode === 'fullpage'
        ? Math.max(10, Math.min(28, Math.round(Math.min(boxW, boxH) * 0.04)))
        : Math.max(8, Math.min(20, Math.round(Math.min(boxW, boxH) * 0.05)));
      let scale=Math.min((boxW - safePad * 2) / bounds.width, (boxH - safePad * 2) / bounds.height);
      if(!Number.isFinite(scale) || scale <= 0){
        bounds=getIframeFullBounds(doc);
        scale=Math.min((boxW - safePad * 2) / bounds.width, (boxH - safePad * 2) / bounds.height);
      }
      const baseScale=Math.max(scale, 0.01);
      const userZoom=Math.max(0.1, parseFloat(iframe.dataset.userZoom || '1') || 1);
      let fitScale=Math.max(baseScale * userZoom, 0.01);
      let tx=(boxW - bounds.width * fitScale) / 2 - bounds.left * fitScale;
      let ty=(boxH - bounds.height * fitScale) / 2 - bounds.top * fitScale;
      if(!Number.isFinite(tx) || !Number.isFinite(ty) || Math.abs(tx) > sourceW * 4 || Math.abs(ty) > sourceH * 4 || fitScale < 0.02){
        bounds=getIframeFullBounds(doc);
        scale=Math.min((boxW - safePad * 2) / bounds.width, (boxH - safePad * 2) / bounds.height);
        fitScale=Math.max(Math.max(scale, 0.01) * userZoom, 0.01);
        tx=(boxW - bounds.width * fitScale) / 2 - bounds.left * fitScale;
        ty=(boxH - bounds.height * fitScale) / 2 - bounds.top * fitScale;
      }

      iframe.style.left='0';
      iframe.style.top='0';
      iframe.style.width=sourceW + 'px';
      iframe.style.height=sourceH + 'px';
      iframe.style.transformOrigin='top left';
      iframe.style.transform=`translate(${tx}px, ${ty}px) scale(${fitScale})`;
      iframe.style.border='0';
      iframe.style.outline='none';
      iframe.style.boxShadow='none';
      iframe.dataset.baseScale=String(baseScale);
    }catch(err){
      // mismo origen local; si falla, no interrumpir
    }
  };

  const bindDocWatchers=()=>{
    try{
      const doc=iframe.contentDocument;
      if(!doc || !doc.documentElement || doc.documentElement.dataset.oaiFitWatchers==='1') return;
      doc.documentElement.dataset.oaiFitWatchers='1';
      let raf=0;
      const requestFit=()=>{
        if(raf) cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{ raf=0; applyFit(); });
      };
      ['click','input','change','transitionend','animationend','pointerup','mouseup'].forEach(evt=>{
        doc.addEventListener(evt, ()=>setTimeout(requestFit, 60), true);
      });
      if(doc.defaultView){
        doc.defaultView.addEventListener('resize', requestFit);
      }
      if(window.MutationObserver && doc.body){
        const mo=new MutationObserver(()=>requestFit());
        mo.observe(doc.body, {attributes:true, childList:true, subtree:true});
      }
      setTimeout(requestFit, 60);
      setTimeout(requestFit, 220);
      setTimeout(requestFit, 520);
    }catch(err){}
  };

  if(iframe.dataset.fitBound==='1'){
    bindDocWatchers();
    return applyFit();
  }
  iframe.dataset.fitBound='1';
  iframe.addEventListener('load', ()=>{
    bindDocWatchers();
    setTimeout(applyFit, 40);
    setTimeout(applyFit, 160);
    setTimeout(applyFit, 420);
    setTimeout(applyFit, 900);
  });
  if(window.ResizeObserver){
    const ro=new ResizeObserver(()=>applyFit());
    ro.observe(box);
  }
  setTimeout(()=>{ bindDocWatchers(); applyFit(); }, 120);
}

function applyMuseumDragTransform(dx, dy){
  const configs=[
    ['museumSlotLeftFar', {perspective:1400, rotateY:34, z:-60, tx:.18, ty:.06, rz:-.05}],
    ['museumSlotLeftNear', {perspective:1400, rotateY:24, z:-18, tx:.24, ty:.08, rz:-.07}],
    ['museumSlotCenter', {perspective:1600, rotateY:0, z:40, tx:.08, ty:.04, rz:-.025, center:true}],
    ['museumSlotRightNear', {perspective:1400, rotateY:-24, z:-18, tx:.24, ty:.08, rz:-.07}],
    ['museumSlotRightFar', {perspective:1400, rotateY:-34, z:-60, tx:.18, ty:.06, rz:-.05}],
  ];
  configs.forEach(([id, cfg])=>{
    const el=document.getElementById(id);
    if(!el) return;
    const shiftX=dx * cfg.tx;
    const shiftY=Math.max(-10, Math.min(14, dy * cfg.ty));
    const rotateAdjust=dx * (cfg.center ? .05 : .08);
    const rotateZ=dx * cfg.rz;
    if(cfg.center){
      el.style.transform=`translate(-50%,-54%) translate3d(${shiftX}px, ${shiftY}px, ${cfg.z}px) rotateY(${rotateAdjust}deg) rotateX(${Math.max(-6, Math.min(6, -dy * .03))}deg) rotateZ(${rotateZ}deg)`;
    }else{
      el.style.transform=`perspective(${cfg.perspective}px) translate3d(${shiftX}px, ${shiftY}px, ${cfg.z}px) rotateY(${cfg.rotateY + rotateAdjust}deg) rotateZ(${rotateZ}deg)`;
    }
  });
}

function resetMuseumDragTransform(){
  ['museumSlotLeftFar','museumSlotLeftNear','museumSlotCenter','museumSlotRightNear','museumSlotRightFar'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.transform='';
  });
}

function initMuseumDrag(){
  const shell=document.querySelector('.museum-room-shell');
  const room=document.getElementById('sacredMuseumRoom');
  if(!shell || !room || shell.dataset.dragBound==='1') return;
  shell.dataset.dragBound='1';
  let active=false;
  let startX=0;
  let startY=0;
  let lastX=0;
  let lastY=0;

  const point=e=>({x:e.clientX, y:e.clientY});

  const endDrag=(evt)=>{
    if(!active) return;
    active=false;
    shell.classList.remove('is-dragging');
    room.classList.remove('is-dragging');
    const dx=lastX-startX;
    const dy=lastY-startY;
    resetMuseumDragTransform();
    if(Math.abs(dx) > 16 || Math.abs(dy) > 12){
      museumSuppressClick=true;
      setTimeout(()=>{museumSuppressClick=false;}, 180);
    }
    if(Math.abs(dx) > 72){
      const dir=dx < 0 ? 1 : -1;
      activateSacredCard((sacredActiveIdx + dir + disenosAwajun.length) % disenosAwajun.length);
    }else{
      updateSacredMuseum();
      setTimeout(fitSacredIframes, 60);
    }
    if(shell.releasePointerCapture && evt && evt.pointerId !== undefined){
      try{ shell.releasePointerCapture(evt.pointerId); }catch(err){}
    }
  };

  shell.addEventListener('pointerdown', (evt)=>{
    if(evt.button !== undefined && evt.button !== 0) return;
    active=true;
    const p=point(evt);
    startX=lastX=p.x;
    startY=lastY=p.y;
    shell.classList.add('is-dragging');
    room.classList.add('is-dragging');
    if(shell.setPointerCapture && evt.pointerId !== undefined){
      try{ shell.setPointerCapture(evt.pointerId); }catch(err){}
    }
  });

  shell.addEventListener('pointermove', (evt)=>{
    if(!active) return;
    const p=point(evt);
    lastX=p.x;
    lastY=p.y;
    const dx=Math.max(-180, Math.min(180, p.x - startX));
    const dy=Math.max(-90, Math.min(90, p.y - startY));
    applyMuseumDragTransform(dx, dy);
    if(evt.cancelable) evt.preventDefault();
  }, {passive:false});

  shell.addEventListener('pointerup', endDrag);
  shell.addEventListener('pointercancel', endDrag);
  shell.addEventListener('pointerleave', (evt)=>{
    if(active && Math.abs(lastX-startX) > 8) endDrag(evt);
  });
}

function fitSacredIframes(){
  document.querySelectorAll('#sacredHeroIframe, .museum-frame-iframe, .lookback-awajun-iframe, #sacredModalIframe').forEach(fitIframeToBox);
}

function getSacredMuseumWindow(offset){
  const total=disenosAwajun.length;
  return disenosAwajun[(sacredActiveIdx + offset + total) % total];
}

function buildSacredMuseum(){
  const slotMap=[
    ['museumSlotLeftFar', -2],
    ['museumSlotLeftNear', -1],
    ['museumSlotCenter', 0],
    ['museumSlotRightNear', 1],
    ['museumSlotRightFar', 2]
  ];
  slotMap.forEach(([id, offset])=>{
    const slot=document.getElementById(id);
    if(!slot) return;
    slot.dataset.offset=String(offset);
    slot.addEventListener('click', (evt)=>{
      if(museumSuppressClick){ evt.preventDefault(); evt.stopPropagation(); return; }
      if(offset===0){
        openSacredModal(sacredActiveIdx);
      }else{
        const next=(sacredActiveIdx + offset + disenosAwajun.length) % disenosAwajun.length;
        activateSacredCard(next);
      }
    });
  });
  updateSacredMuseum();
  fitSacredIframes();
}

function updateSacredMuseum(){
  const slots=[
    {id:'museumSlotLeftFar', offset:-2},
    {id:'museumSlotLeftNear', offset:-1},
    {id:'museumSlotCenter', offset:0},
    {id:'museumSlotRightNear', offset:1},
    {id:'museumSlotRightFar', offset:2}
  ];
  slots.forEach(({id, offset})=>{
    const slot=document.getElementById(id);
    if(!slot) return;
    const index=(sacredActiveIdx + offset + disenosAwajun.length) % disenosAwajun.length;
    const model=disenosAwajun[index];
    slot.dataset.index=String(index);
    slot.classList.toggle('is-active', offset===0);
    slot.setAttribute('aria-label', `${offset===0 ? 'Abrir' : 'Llevar al centro'} ${model.title}`);
    const iframe=slot.querySelector('iframe');
    if(iframe) applySacredIframePreset(iframe, model.previewFitMode || 'content', '1', { fitSelector:model.fitSelector, fitPadding:model.previewPadding });
    if(iframe && iframe.getAttribute('src') !== model.file){
      iframe.setAttribute('src', model.file);
      iframe.setAttribute('title', model.title);
      fitIframeToBox(iframe);
    }
    const strong=slot.querySelector('.museum-art-meta strong');
    const small=slot.querySelector('.museum-art-meta small');
    if(strong) strong.textContent=String(index+1).padStart(2,'0');
    if(small) small.textContent=offset===0 ? 'pieza central' : model.sub;
  });
}



function applySacredIframePreset(iframe, mode='content', userZoom='1', options={}){
  if(!iframe) return;
  iframe.dataset.fitMode=(mode || 'content').toLowerCase();
  iframe.dataset.userZoom=String(userZoom || '1');
  iframe.dataset.fitSelector=options.fitSelector || '';
  const pad = options.fitPadding;
  iframe.dataset.fitPadding = pad == null ? '' : String(pad);
}


function compactSacredText(text, max=118){
  if(!text) return '';
  const first=text.split('. ')[0].trim();
  if(first.length && first.length <= max) return first.endsWith('.') ? first : first + '.';
  return text.length > max ? text.slice(0, max).trim().replace(/[,:;\-–]+$/,'') + '…' : text;
}

function activateSacredCard(idx){
  sacredLookbackTarget=wrapSacredLoopValue(idx);
  sacredLookbackPosition=wrapSacredLoopValue(sacredLookbackPosition);
  syncSacredInterface(idx);
  updateSacredLookback();
}


function openSacredModal(idx){
  const modal=document.getElementById('sacredModal');
  const iframe=document.getElementById('sacredModalIframe');
  if(!modal || !iframe) return;
  if(idx !== sacredActiveIdx){
    activateSacredCard(idx);
  }else{
    syncSacredInterface(idx);
  }
  sacredModalIdx=idx;
  const d=disenosAwajun[idx];
  const n=String(idx+1).padStart(2,'0');
  const el=id=>document.getElementById(id);
  if(el('modalNum')) el('modalNum').textContent=n;
  if(el('modalTitle')) el('modalTitle').textContent=d.title;
  if(el('modalDesc')) el('modalDesc').textContent=d.desc;
  if(el('modalEyebrow')) el('modalEyebrow').textContent=`// geometría sagrada · diseño ${n} de ${String(disenosAwajun.length).padStart(2,'0')}`;
  if(el('modalTags')) el('modalTags').innerHTML=d.tags.map(t=>`<span>${t}</span>`).join('');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  sacredModalZoom=1;
  updateSacredModalZoomUI();
  applySacredIframePreset(iframe, d.modalFitMode || 'content', '1', { fitSelector:d.fitSelector, fitPadding:d.modalPadding });
  if(iframe.getAttribute('src') !== d.file){
    iframe.src=d.file;
  }
  requestAnimationFrame(()=>{
    fitIframeToBox(iframe);
    setTimeout(()=>fitIframeToBox(iframe), 70);
    setTimeout(()=>fitIframeToBox(iframe), 220);
    setTimeout(()=>fitIframeToBox(iframe), 520);
  });
}

function updateSacredModalZoomUI(){
  const readout=document.getElementById('sacredZoomReset');
  if(!readout) return;
  readout.textContent=sacredModalZoom === 1 ? 'AJUSTAR' : `${Math.round(sacredModalZoom*100)}%`;
}

function setSacredModalZoom(value){
  sacredModalZoom=Math.max(SACRED_MODAL_MIN_ZOOM, Math.min(SACRED_MODAL_MAX_ZOOM, Number(value) || 1));
  const iframe=document.getElementById('sacredModalIframe');
  if(iframe){
    iframe.dataset.userZoom=String(sacredModalZoom);
    fitIframeToBox(iframe);
    setTimeout(()=>fitIframeToBox(iframe), 50);
  }
  updateSacredModalZoomUI();
}

function stepSacredModalZoom(direction){
  const factor=direction > 0 ? 1.18 : 1/1.18;
  setSacredModalZoom(sacredModalZoom * factor);
}

function closeSacredModal(){
  const modal=document.getElementById('sacredModal');
  const iframe=document.getElementById('sacredModalIframe');
  if(!modal) return;
  modal.classList.remove('open');
  if(iframe){ iframe.src=''; iframe.dataset.userZoom='1'; }
  sacredModalZoom=1;
  updateSacredModalZoomUI();
  document.body.style.overflow='';
}

function navSacredModal(dir){
  if(!document.getElementById('sacredModal')) return;
  const next=(sacredModalIdx+dir+disenosAwajun.length)%disenosAwajun.length;
  openSacredModal(next);
}

/* ── VIDEOS ── */
const videosData=[
  {thumbnail:'',title:'Diccionario Cuadrilingüe - Presentación',desc:'Presentación del proyecto de tesis: diccionario interactivo en 4 idiomas (Español, Inglés, Awajún, Wampis).',duration:'08:45',videoId:'dQw4w9WgXcQ',type:'PROYECTO'},
  {thumbnail:'',title:'Aprendemos Jugando - Demo',desc:'Demostración de la plataforma interactiva de matemática gamificada para estudiantes.',duration:'12:30',videoId:'dQw4w9WgXcQ',type:'DEMOSTRACIÓN'},
  {thumbnail:'',title:'Visita de Campo - Comunidad Wampis',desc:'Trabajo de investigación en la comunidad para preservación lingüística y cultural.',duration:'15:20',videoId:'dQw4w9WgXcQ',type:'INVESTIGACIÓN'}
];

function buildVideosGrid(){
  const grid=document.getElementById('videosGrid');
  if(!grid)return;
  grid.innerHTML='';
  const fallback=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='169'%3E%3Crect width='300' height='169' fill='%230a1628'/%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dominant-baseline='middle' fill='%2300ffe7'%3E%F0%9F%8E%A5%3C/text%3E%3C/svg%3E`;
  videosData.forEach(video=>{
    const card=document.createElement('div');
    card.className='video-card reveal';
    card.innerHTML=`
      <div class="video-thumbnail">
        <img src="${video.thumbnail||fallback}" alt="${video.title}" onerror="this.src='${fallback}'">
        <div class="video-overlay"></div>
        <button class="video-play-btn" onclick="openVideoModal('${video.videoId}')" aria-label="Reproducir video">▶</button>
      </div>
      <div class="video-info">
        <span class="video-type">${video.type}</span>
        <h3 class="video-title">${video.title}</h3>
        <p class="video-desc">${video.desc}</p>
        <div class="video-meta"><span>2026</span><span class="video-duration">⏱ ${video.duration}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openVideoModal(videoId){
  document.getElementById('videoModalIframe').src=`https://www.youtube.com/embed/${videoId}?autoplay=1`;
  document.getElementById('video-modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeVideoModal(event){
  if(event&&event.target&&event.target.id!=='video-modal')return;
  document.getElementById('video-modal').classList.remove('open');
  document.getElementById('videoModalIframe').src='';
  document.body.style.overflow='';
}
buildVideosGrid();

/* ── FORMULARIO ── */
const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const nombre  =document.getElementById('formNombre').value.trim();
    const codigo  =document.getElementById('formCodigo').value.trim();
    const email   =document.getElementById('formEmail').value.trim();
    const telefono=document.getElementById('formTelefono').value.trim();
    const mensaje =document.getElementById('formMensaje').value.trim();
    const btnEnviar=document.getElementById('btnEnviar');
    const btnText  =document.getElementById('btnText');
    ['formNombreError','formCodigoError','formEmailError','formMensajeError'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.textContent='';el.style.display='none';}
    });
    let hasErrors=false;
    if(!nombre) {showFieldError('formNombreError','El nombre es requerido');hasErrors=true;}
    if(!codigo) {showFieldError('formCodigoError','El código de estudiante es requerido');hasErrors=true;}
    if(!email)  {showFieldError('formEmailError','El correo institucional es requerido');hasErrors=true;}
    else if(!email.endsWith('.edu.pe')){showFieldError('formEmailError','Solo se aceptan correos institucionales (.edu.pe)');hasErrors=true;}
    if(!mensaje){showFieldError('formMensajeError','El mensaje es requerido');hasErrors=true;}
    if(hasErrors)return;
    btnEnviar.disabled=true;
    btnText.textContent='⏳ Enviando...';
    try{
      const res=await fetch('https://formspree.io/f/xnjgpaoz',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({nombre,codigo,email,telefono:telefono||'No proporcionado',mensaje,_subject:`Nuevo mensaje de: ${nombre}`,_replyto:email})
      });
      if(res.ok){
        showFormMessage('✓ ¡Mensaje enviado exitosamente! Revisa tu correo.','success');
        contactForm.reset();
        showToast('✓ Mensaje enviado con éxito');
      }else{showFormMessage('⚠ Error al enviar. Intenta nuevamente.','error');}
    }catch{
      showFormMessage('❌ Error de conexión. Intenta más tarde.','error');
    }finally{
      btnEnviar.disabled=false;
      btnText.textContent='✓ Enviar Mensaje';
    }
  });
}
function showFieldError(fieldId,msg){
  const el=document.getElementById(fieldId);
  if(!el)return;
  el.textContent=msg;el.style.display='block';
}
function showFormMessage(msg,type){
  const d=document.getElementById('formMessage');
  if(!d)return;
  d.textContent=msg;d.style.display='block';
  d.style.background=type==='success'?'rgba(0,255,128,.1)':'rgba(255,100,100,.1)';
  d.style.borderTop='2px solid '+(type==='success'?'#00ff80':'#ff6464');
  d.style.color=type==='success'?'#00ff80':'#ff6464';
  d.style.padding='.8rem 1rem';d.style.borderRadius='8px';
  setTimeout(()=>{d.style.display='none';},5000);
}

/* ── CONTADOR VISITAS ── */
(function(){
  try{
    let total=parseInt(localStorage.getItem('gjr_visits')||'0')+1;
    localStorage.setItem('gjr_visits',total);
    const te=document.getElementById('totalVisits');
    if(te)te.textContent=total.toLocaleString('es-PE');
    const today=new Date().toDateString();
    const lastDay=localStorage.getItem('gjr_last_day');
    let todayCount=parseInt(localStorage.getItem('gjr_today')||'0');
    if(lastDay!==today){todayCount=0;localStorage.setItem('gjr_last_day',today);}
    todayCount++;
    localStorage.setItem('gjr_today',todayCount);
    const tve=document.getElementById('todayVisits');
    if(tve)tve.textContent=todayCount;
    const one=document.getElementById('onlineNow');
    if(one)one.textContent=Math.floor(Math.random()*3)+1;
  }catch(e){}
})();

/* ── SCROLL TOP & NAVBAR ── */
window.addEventListener('scroll',()=>{
  const btn=document.getElementById('scroll-top');
  if(btn)btn.classList.toggle('visible',window.scrollY>300);
  const nav=document.getElementById('navbar');
  if(nav)nav.style.background=window.scrollY>50?'rgba(3,6,16,.97)':'rgba(3,6,16,.85)';
});

/* ── REVEAL ON SCROLL ── */
(function setupReveal(){
  if(!('IntersectionObserver'in window))return;
  document.body.classList.add('js-ready');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target);}
    });
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();

/* ── TOAST ── */
function showToast(msg){
  const t=document.getElementById('toast');
  if(!t)return;
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3500);
}

/* ── ESCAPE / TECLADO ── */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  closeLightbox();
  closeSacredModal();
  closeVideoModal();
});

/* ══════════════════════════════════════════════
   FLIP CARD CONTACTO – Mandala + Flip logic
   ══════════════════════════════════════════════ */
(function(){
  const wrap   = document.getElementById('cflipWrap');
  const visual = document.getElementById('cflipVisual');
  if(!wrap || !visual) return;

  /* ── FLIP: solo el mandala (izquierda) gira la tarjeta ── */
  visual.addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.toggle('flipped');
    /* ripple */
    const r = visual.getBoundingClientRect();
    [['rgba(0,255,231,.8)', 0], ['rgba(0,150,255,.6)', 0.18]].forEach(([col, delay]) => {
      const el = document.createElement('div');
      el.className = 'cflip-ripple';
      el.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:50px;height:50px;border:2px solid ${col};animation-delay:${delay}s`;
      visual.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    });
  });

  /* ── MANDALA FRONT ── */
  const rg = document.getElementById('cflip-ring-g');
  const dg = document.getElementById('cflip-dots-g');
  const cg = document.getElementById('cflip-center-g');
  const cx = 150, cy = 150;

  if(rg) {
    const N=20, oR=124, iR=88, ha=Math.PI/N*0.7;
    for(let i=0;i<N;i++){
      const a=2*Math.PI*i/N-Math.PI/2;
      const p=document.createElementNS('http://www.w3.org/2000/svg','polygon');
      const x1=cx+oR*Math.cos(a-ha), y1=cy+oR*Math.sin(a-ha);
      const x2=cx+oR*Math.cos(a+ha), y2=cy+oR*Math.sin(a+ha);
      const xt=cx+iR*Math.cos(a),    yt=cy+iR*Math.sin(a);
      p.setAttribute('points',`${x1},${y1} ${x2},${y2} ${xt},${yt}`);
      p.setAttribute('fill','none');
      p.setAttribute('stroke','rgba(0,255,231,0.7)');
      p.setAttribute('stroke-width','1.8');
      p.setAttribute('stroke-linejoin','round');
      rg.appendChild(p);
    }
  }
  if(dg) {
    const dotN=20, dotR=62;
    for(let i=0;i<dotN;i++){
      const a=2*Math.PI*i/dotN-Math.PI/2;
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', cx+dotR*Math.cos(a));
      c.setAttribute('cy', cy+dotR*Math.sin(a));
      c.setAttribute('r','4');
      c.setAttribute('fill','rgba(0,255,231,0.85)');
      dg.appendChild(c);
    }
  }
  if(cg) {
    [{dx:-9,dy:-9,r:3},{dx:0,dy:-9,r:3},{dx:9,dy:-9,r:3},
     {dx:-9,dy:0, r:3},{dx:0,dy:0, r:5},{dx:9,dy:0, r:3},
     {dx:-9,dy:9, r:3},{dx:0,dy:9, r:3},{dx:9,dy:9, r:3},
    ].forEach(d=>{
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',cx+d.dx); c.setAttribute('cy',cy+d.dy); c.setAttribute('r',d.r);
      c.setAttribute('fill', d.r===5 ? 'rgba(0,180,255,0.9)' : 'rgba(0,255,231,0.7)');
      cg.appendChild(c);
    });
  }

  /* ── DECO RING on back ── */
  const drg = document.getElementById('cflip-deco-ring-g');
  if(drg) {
    const dcx=98, dcy=98, dn=16, doR=88, diR=72, dha=Math.PI/dn*0.65;
    for(let i=0;i<dn;i++){
      const a=2*Math.PI*i/dn-Math.PI/2;
      const p=document.createElementNS('http://www.w3.org/2000/svg','polygon');
      const x1=dcx+doR*Math.cos(a-dha), y1=dcy+doR*Math.sin(a-dha);
      const x2=dcx+doR*Math.cos(a+dha), y2=dcy+doR*Math.sin(a+dha);
      const xt=dcx+diR*Math.cos(a),     yt=dcy+diR*Math.sin(a);
      p.setAttribute('points',`${x1},${y1} ${x2},${y2} ${xt},${yt}`);
      p.setAttribute('fill','none');
      p.setAttribute('stroke','rgba(0,255,231,0.4)');
      p.setAttribute('stroke-width','1.2');
      p.setAttribute('stroke-linejoin','round');
      drg.appendChild(p);
    }
    ['rgba(0,10,30,.9)','rgba(0,255,231,0.22)'].forEach((col,i)=>{
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',dcx); c.setAttribute('cy',dcy);
      c.setAttribute('r', i===0?91:68);
      c.setAttribute('fill','none'); c.setAttribute('stroke',col); c.setAttribute('stroke-width','1.5');
      drg.parentElement.insertBefore(c, drg);
    });
  }
})();

/* ══════════════════════════════════════════════
   HERO — GEOMETRÍA AWAJÚN
   ══════════════════════════════════════════════ */
(function(){
  const NS  = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;

  /* ── Helpers ── */
  function polygon(sides, cx, cy, r, rotate=0){
    let pts = [];
    for(let i=0;i<sides;i++){
      const a = TAU*i/sides - Math.PI/2 + rotate;
      pts.push(`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`);
    }
    return pts.join(' ');
  }

  function makeEl(tag, attrs, parent){
    const el = document.createElementNS(NS, tag);
    for(const [k,v] of Object.entries(attrs)) el.setAttribute(k,v);
    if(parent) parent.appendChild(el);
    return el;
  }

  /* ══ HERO SVG PRINCIPAL ══ */
  (function buildHeroGeo(){
    const cx=240, cy=240;
    const outerEl = document.getElementById('hgOuter');
    const midEl   = document.getElementById('hgMid');
    const triG    = document.getElementById('hgTriangles');
    const dotG    = document.getElementById('hgDots');
    const radG    = document.getElementById('hgRadials');
    const zigEl   = document.getElementById('hgZigzag');
    if(!outerEl || !triG) return;

    /* Polígono exterior 24-lados */
    if(outerEl) outerEl.setAttribute('points', polygon(24, cx, cy, 200));
    if(midEl)   midEl.setAttribute('points',   polygon(12, cx, cy, 128, Math.PI/12));

    /* Zigzag Awajún */
    if(zigEl){
      const N=24, oR=200, iR=188;
      let pts = [];
      for(let i=0;i<=N;i++){
        const a = TAU*i/N - Math.PI/2;
        const r = i%2===0 ? oR : iR;
        pts.push(`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`);
      }
      zigEl.setAttribute('points', pts.join(' '));
    }

    /* Triángulos radiales (16) */
    if(triG){
      const N=16, oR=168, iR=118, ha=TAU/N*0.38;
      for(let i=0;i<N;i++){
        const a = TAU*i/N - Math.PI/2;
        const x1 = cx+oR*Math.cos(a-ha), y1 = cy+oR*Math.sin(a-ha);
        const x2 = cx+oR*Math.cos(a+ha), y2 = cy+oR*Math.sin(a+ha);
        const xt = cx+iR*Math.cos(a),    yt = cy+iR*Math.sin(a);
        const col = i%4===0 ? 'rgba(200,146,42,0.55)' : 'rgba(0,255,231,0.40)';
        makeEl('polygon',{
          points:`${x1},${y1} ${x2},${y2} ${xt},${yt}`,
          fill:'none', stroke:col, 'stroke-width':'1.4', 'stroke-linejoin':'round'
        }, triG);
      }
    }

    /* Puntos en cruce anillo interior-exterior */
    if(dotG){
      const N=12, r=104;
      for(let i=0;i<N;i++){
        const a = TAU*i/N - Math.PI/2;
        const col = i%3===0 ? 'rgba(200,146,42,0.85)' : 'rgba(0,255,231,0.65)';
        makeEl('circle',{ cx:cx+r*Math.cos(a), cy:cy+r*Math.sin(a), r:'3.8', fill:col }, dotG);
      }
    }

    /* Líneas radiales finas (24) */
    if(radG){
      for(let i=0;i<24;i++){
        const a = TAU*i/24 - Math.PI/2;
        const op = i%6===0 ? '0.28' : (i%3===0 ? '0.14' : '0.07');
        makeEl('line',{
          x1:cx+66*Math.cos(a), y1:cy+66*Math.sin(a),
          x2:cx+196*Math.cos(a), y2:cy+196*Math.sin(a),
          stroke:'rgba(0,255,231,1)', 'stroke-width':'1', opacity:op
        }, radG);
      }
    }
  })();

  /* ══ FONDO GEOMÉTRICO HERO ══ */
  (function buildBgGeo(){
    const cx=400, cy=400;
    const p1 = document.getElementById('bgPoly1');
    const p2 = document.getElementById('bgPoly2');
    const p3 = document.getElementById('bgPoly3');
    const triG = document.getElementById('bgTriangles');
    const radG = document.getElementById('bgRadials');
    if(!p1) return;

    if(p1) p1.setAttribute('points', polygon(24, cx, cy, 340));
    if(p2) p2.setAttribute('points', polygon(12, cx, cy, 260, Math.PI/12));
    if(p3) p3.setAttribute('points', polygon(6,  cx, cy, 180, 0));

    /* Triángulos radiales bg */
    if(triG){
      const N=24, oR=280, iR=220, ha=TAU/N*0.38;
      for(let i=0;i<N;i++){
        const a = TAU*i/N - Math.PI/2;
        const x1=cx+oR*Math.cos(a-ha), y1=cy+oR*Math.sin(a-ha);
        const x2=cx+oR*Math.cos(a+ha), y2=cy+oR*Math.sin(a+ha);
        const xt=cx+iR*Math.cos(a),    yt=cy+iR*Math.sin(a);
        const col = i%4===0 ? 'rgba(200,146,42,1)' : 'rgba(0,255,231,1)';
        makeEl('polygon',{
          points:`${x1},${y1} ${x2},${y2} ${xt},${yt}`,
          fill:'none', stroke:col, 'stroke-width':'1.2'
        }, triG);
      }
    }

    /* Líneas radiales bg */
    if(radG){
      for(let i=0;i<12;i++){
        const a = TAU*i/12;
        makeEl('line',{
          x1:cx+140*Math.cos(a), y1:cy+140*Math.sin(a),
          x2:cx+338*Math.cos(a), y2:cy+338*Math.sin(a),
          stroke:'rgba(0,255,231,1)', 'stroke-width':'1', opacity:'0.4'
        }, radG);
      }
    }
  })();

})();
