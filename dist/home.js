const TALK_URL = 'https://talk.naver.com/ct/wc9606';
let initialized = false;

function currentHashTarget() {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  let id;
  try { id = decodeURIComponent(hash); } catch { return null; }
  return document.getElementById(id);
}

function scrollToTarget(target, { focus = false, immediate = false } = {}) {
  if (!target) return;
  const header = document.querySelector('.site-header');
  const offset = -((header?.getBoundingClientRect().height || 72) + (target.id === 'home' ? 0 : 16));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof window.natureScrollTo === 'function') {
    window.natureScrollTo(target, { offset, immediate: immediate || reduced, duration: 1.1 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior: immediate || reduced ? 'instant' : 'smooth' });
  }
  if (focus) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

function scrollToHash(immediate = true) {
  const target = currentHashTarget();
  if (target instanceof HTMLDetailsElement) target.open = true;
  scrollToTarget(target, { immediate });
}

function consultationText(form) {
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim();
  const area = value('area');
  const unit = value('unit');
  const areaText = area ? `${area}${unit ? ` ${unit}` : ' (단위 미정)'}` : '미정';
  const lines = [
    '자연수정벌 상담 준비',
    '',
    `작물: ${value('crop') || '미정'}`,
    `재배 지역: ${value('region') || '미정'}`,
    `재배 면적: ${areaText}`,
    `재배 환경: ${value('environment') || '미정'}`,
    `희망 투입일: ${value('date') || '미정'}`,
    `희망 수량: ${value('quantity') || '상담 필요'}`,
    `필요한 서류: ${value('documents') || '미정'}`,
    '',
    '함께 전할 내용:',
    value('note') || '상담하면서 함께 확인하고 싶습니다.',
  ];
  return lines.join('\n');
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browser contexts deny clipboard access; retain a selectable summary.
    }
  }
  const temporary = document.createElement('textarea');
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.setAttribute('aria-hidden', 'true');
  temporary.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
  document.body.append(temporary);
  temporary.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  temporary.remove();
  return copied;
}

function prepareConsultation(form) {
  const summary = form.querySelector('[data-consultation-summary]');
  if (!summary) return;
  const text = consultationText(form);
  const title = document.createElement('h3');
  title.textContent = '상담에 사용할 내용';
  const explanation = document.createElement('p');
  explanation.textContent = '작성한 내용이 이 화면에 정리되었습니다. 자동으로 전송되지 않습니다. 내용을 복사한 뒤 네이버 톡톡에서 직접 보내주세요.';
  const prepared = document.createElement('pre');
  prepared.className = 'consultation-text';
  prepared.textContent = text;
  const controls = document.createElement('div');
  controls.className = 'button-row';
  const copy = document.createElement('button');
  copy.className = 'btn btn-outline';
  copy.type = 'button';
  copy.textContent = '내용 복사하기';
  const talk = document.createElement('a');
  talk.className = 'btn btn-primary';
  talk.href = TALK_URL;
  talk.target = '_blank';
  talk.rel = 'noopener noreferrer';
  talk.dataset.brandLink = 'talk';
  talk.textContent = '네이버 톡톡 열기 ↗';
  talk.setAttribute('aria-label', '네이버 톡톡 열기 (새 창)');
  const status = document.createElement('p');
  status.className = 'small-note';
  status.setAttribute('aria-live', 'polite');
  status.textContent = '네이버 로그인 후 상담할 수 있습니다.';
  copy.addEventListener('click', async () => {
    copy.disabled = true;
    const copied = await copyText(text);
    status.textContent = copied
      ? '내용을 복사했습니다. 톡톡 창에 붙여넣어 직접 보내주세요.'
      : '자동 복사를 사용할 수 없습니다. 위 내용을 선택해 복사한 뒤 톡톡에 직접 보내주세요.';
    copy.disabled = false;
    copy.focus({ preventScroll: true });
  });
  controls.append(copy, talk);
  summary.replaceChildren(title, explanation, prepared, controls, status);
  summary.hidden = false;
  summary.setAttribute('tabindex', '-1');
  scrollToTarget(summary, { focus: true });
}

/** Bind the common header, purchase dialog and locally prepared consultation UI. */
export function initSiteUI() {
  if (initialized) return;
  initialized = true;
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('site-navigation');
  const dialog = document.getElementById('order-dialog');
  const journey = document.getElementById('journey');
  let orderTrigger = null;
  let introFramePending = false;

  const syncScrollLock = () => {
    const locked = document.body.classList.contains('menu-open') || Boolean(dialog?.open);
    document.documentElement.classList.toggle('site-scroll-locked', locked);
    if (typeof window.natureScrollLock === 'function') {
      window.natureScrollLock(locked);
    }
  };
  const updateIntroBoundary = () => {
    introFramePending = false;
    if (!journey) {
      document.body.classList.add('past-intro');
      return;
    }
    const top = journey.getBoundingClientRect().top + window.scrollY;
    const threshold = Math.max(0, top + journey.offsetHeight - 88);
    document.body.classList.toggle('past-intro', window.scrollY >= threshold);
  };
  const scheduleIntroBoundary = () => {
    if (introFramePending) return;
    introFramePending = true;
    requestAnimationFrame(updateIntroBoundary);
  };
  const setMenu = open => {
    const enabled = Boolean(open && menuToggle && navigation);
    document.body.classList.toggle('menu-open', enabled);
    menuToggle?.setAttribute('aria-expanded', String(enabled));
    menuToggle?.setAttribute('aria-label', enabled ? '메뉴 닫기' : '메뉴 열기');
    syncScrollLock();
  };
  const closeDialog = () => {
    if (!dialog?.open) return;
    if (typeof dialog.close === 'function') dialog.close();
    else {
      dialog.removeAttribute('open');
      syncScrollLock();
      orderTrigger?.focus({ preventScroll: true });
    }
  };
  const openDialog = trigger => {
    if (!dialog) return;
    setMenu(false);
    orderTrigger = trigger;
    if (!dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }
    syncScrollLock();
    dialog.querySelector('.dialog-close')?.focus({ preventScroll: true });
  };

  menuToggle?.setAttribute('aria-expanded', 'false');
  dialog?.addEventListener('close', () => {
    syncScrollLock();
    orderTrigger?.focus({ preventScroll: true });
  });
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog();
  });

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest('.menu-toggle')) {
      setMenu(!document.body.classList.contains('menu-open'));
      return;
    }
    const purchase = event.target.closest('[data-order]');
    if (purchase) {
      event.preventDefault();
      openDialog(purchase);
      return;
    }
    if (event.target.closest('#order-dialog .dialog-close')) {
      event.preventDefault();
      closeDialog();
      return;
    }
    const link = event.target.closest('a[href]');
    if (!link) return;
    setMenu(false);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
    let url;
    try { url = new URL(link.href, window.location.href); } catch { return; }
    const current = window.location;
    if (url.origin !== current.origin || url.pathname !== current.pathname || url.search !== current.search || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    if (target instanceof HTMLDetailsElement) target.open = true;
    history.pushState(null, '', url.hash);
    scrollToTarget(target, { focus: true });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (document.body.classList.contains('menu-open')) {
      setMenu(false);
      menuToggle?.focus({ preventScroll: true });
    }
    // Native dialog Escape handling fires its close event and restores scroll.
  });
  document.addEventListener('submit', event => {
    if (!(event.target instanceof HTMLFormElement) || !event.target.matches('[data-consultation-form]')) return;
    event.preventDefault();
    prepareConsultation(event.target);
  });
  window.addEventListener('hashchange', () => scrollToHash(false));
  window.addEventListener('scroll', scheduleIntroBoundary, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && document.body.classList.contains('menu-open')) setMenu(false);
    scheduleIntroBoundary();
  }, { passive: true });
  if (journey && 'ResizeObserver' in window) new ResizeObserver(scheduleIntroBoundary).observe(journey);
  updateIntroBoundary();

  const revealElements = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revealElements.forEach(element => observer.observe(element));
    document.body.classList.add('js-reveals');
  }
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(true)));
}

if (!document.body.dataset.page) initSiteUI();
