(() => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('#header-menu');
  if (!toggle || !nav) return;

  const setOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  const openExperience = () => {
    const section = document.querySelector('details#experience');
    if (section) section.open = true;
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.getAttribute('href') === '#experience') openExperience();
    setOpen(false);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', () => setOpen(false));
  if (window.location.hash === '#experience') openExperience();
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#experience') openExperience();
  });
})();

(() => {
  document.querySelectorAll('.button').forEach(button => {
    // Leave buttons with icons or other structured content intact.
    if (button.children.length) return;
    const text = button.textContent;
    if (!text.trim()) return;
    const label = document.createElement('span');
    label.className = 'button-flip-label';
    label.setAttribute('aria-hidden', 'true');
    Array.from(text).forEach((character, index) => {
      const letter = document.createElement('span');
      letter.className = 'button-flip-letter';
      letter.style.setProperty('--letter-delay', `${Math.min(index * 18, 300)}ms`);
      for (const face of ['front', 'back']) {
        const span = document.createElement('span');
        span.className = `button-flip-${face}`;
        span.textContent = character === ' ' ? '\u00a0' : character;
        letter.append(span);
      }
      label.append(letter);
    });
    const accessibleLabel = document.createElement('span');
    accessibleLabel.className = 'button-flip-accessible';
    accessibleLabel.textContent = text;
    button.replaceChildren(accessibleLabel, label);
    button.classList.add('button-flip');
  });
})();

(() => {
  const selector = '.header-nav a, .footer a, .case-sidebar a, .case-back, .case-return, .case-external';
  const links = [...document.querySelectorAll(selector)].filter(link => !link.matches('.button'));
  if (!links.length) return;
  links.forEach(link => {
    link.classList.add('secondary-link');
    link.parentElement.classList.add('secondary-link-group');
  });
  const ring = document.createElement('span');
  ring.className = 'secondary-cursor';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hide = () => ring.classList.remove('is-visible');
  links.forEach(link => {
    link.addEventListener('pointermove', event => {
      if (!hover.matches || reduced.matches || event.pointerType === 'touch') return;
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      ring.classList.add('is-visible');
    });
    link.addEventListener('pointerleave', hide);
    link.addEventListener('blur', hide);
  });
  window.addEventListener('blur', hide);
  window.addEventListener('scroll', hide, { passive: true });
  hover.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
})();
