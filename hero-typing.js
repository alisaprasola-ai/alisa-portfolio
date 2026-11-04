(() => {
  const heading = document.querySelector('#hero-title');
  if (!heading) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  const fullText = heading.innerText.replace(/\s+/g, ' ').trim();
  const fragment = document.createDocumentFragment();
  const characters = [];

  // Keep every letter in its final position so wrapping and height never change.
  for (const node of heading.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      fragment.append(node.cloneNode(true));
      continue;
    }
    for (const letter of Array.from(node.textContent)) {
      const span = document.createElement('span');
      span.className = 'type-char';
      span.style.setProperty('--char-index', characters.length);
      span.textContent = letter;
      span.setAttribute('aria-hidden', 'true');
      fragment.append(span);
      characters.push(span);
    }
  }

  heading.setAttribute('aria-label', fullText);
  heading.replaceChildren(fragment);
  heading.classList.add('typing-title');
  heading.dataset.typingState = 'typing';

  let index = 0;
  let timer;
  let previous;

  const finish = () => {
    window.clearTimeout(timer);
    characters.forEach(character => {
      character.classList.add('is-visible');
      character.classList.remove('is-current');
    });
    heading.dataset.typingState = 'complete';
  };

  const typeNext = () => {
    if (motion.matches) return finish();
    previous?.classList.remove('is-current');
    const character = characters[index++];
    if (!character) return finish();
    character.classList.add('is-visible', 'is-current');
    previous = character;
    timer = window.setTimeout(typeNext, character.textContent === ' ' ? 25 : 45);
  };

  motion.addEventListener('change', event => {
    if (event.matches) finish();
  });
  timer = window.setTimeout(typeNext, 200);
})();
