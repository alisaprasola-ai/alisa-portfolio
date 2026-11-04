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
