(() => {
  const books = Array.isArray(window.ALISA_BOOKS) ? window.ALISA_BOOKS : [];
  const reading = books.filter(book => book.status === 'reading');
  const finished = books.filter(book => book.status === 'read');
  const unassigned = books.filter(book => book.status !== 'reading' && book.status !== 'read');
  const dialog = document.querySelector('.book-dialog');
  const palette = ['#d5dfec', '#e9cfcb', '#e6dfb9', '#ccddd2', '#ded5eb', '#edcfb0'];
  const sizes = [
    [182, 39, 120], [196, 43, 126], [170, 35, 110], [188, 38, 121],
    [160, 32, 108], [178, 42, 116], [202, 37, 130], [174, 44, 114],
    [193, 40, 125], [185, 36, 119], [198, 41, 128]
  ];

  const spineInk = colour => {
    const rgb = colour.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255);
    const linear = rgb.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    const luminance = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
    const inkLuminance = .00694; // The site's #071522 ink.
    const darkContrast = (luminance + .05) / (inkLuminance + .05);
    const lightContrast = 1.05 / (luminance + .05);
    if (darkContrast < 4.5 && lightContrast < 4.5) return '#000000';
    return darkContrast >= lightContrast ? '#071522' : '#ffffff';
  };

  const showBook = book => {
    dialog.querySelector('h2').textContent = book.title;
    dialog.querySelector('.book-dialog-author').textContent = book.author || '';
    dialog.querySelector('.book-dialog-status').textContent = ({ reading: 'Currently reading', read: 'Read' })[book.status] || 'On my shelf';
    const note = dialog.querySelector('.book-dialog-note');
    note.textContent = book.note || '';
    note.hidden = !book.note;
    dialog.showModal();
  };
  const makeBook = (book, index, face) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'library-book' + (face || book.cover ? ' book-face' : '') + (book.cover ? ' book-original-cover' : '');
    const [height, spineWidth, coverWidth] = sizes[index % sizes.length];
    button.style.setProperty('--book-height', height + 'px');
    button.style.setProperty('--book-width', spineWidth + 'px');
    button.style.setProperty('--book-cover-width', coverWidth + 'px');
    const colour = book.spineColor || palette[index % palette.length];
    button.style.setProperty('--book-colour', colour);
    button.style.setProperty('--book-ink', spineInk(colour));
    const lean = [-3, .8, 0, 4, -1.5, .5, 0, -1, 2, .4, -2.5, 1][index % 12];
    button.style.setProperty('--book-lean-start', (lean - .65) + 'deg');
    button.style.setProperty('--book-lean-end', (lean + .65) + 'deg');
    button.style.setProperty('--book-sway-duration', (6.2 + index % 5 * .65) + 's');
    button.style.setProperty('--book-sway-delay', (-index * 1.17) + 's');
    button.setAttribute('aria-label', book.title + (book.author ? ' by ' + book.author : '') + ' — view details');
    if (book.cover) {
      const volume = document.createElement('span');
      volume.className = 'book-volume';
      volume.setAttribute('aria-hidden', 'true');
      const spine = document.createElement('span');
      spine.className = 'book-spine';
      const title = document.createElement('span');
      title.className = 'book-spine-title';
      title.textContent = book.title;
      spine.append(title);
      const front = document.createElement('span');
      front.className = 'book-front';
      const image = document.createElement('img');
      image.src = book.cover;
      image.alt = '';
      image.decoding = 'async';
      image.addEventListener('load', () => {
        button.style.setProperty('--book-cover-width', (height * image.naturalWidth / image.naturalHeight) + 'px');
      }, { once: true });
      image.addEventListener('error', () => {
        volume.remove();
        button.classList.remove('book-original-cover');
        button.append(title);
      }, { once: true });
      front.append(image);
      volume.append(spine, front);
      button.append(volume);
    } else {
      const title = document.createElement('span');
      title.className = 'book-spine-title';
      title.textContent = book.title;
      button.append(title);
    }
    button.addEventListener('click', () => showBook(book));
    return button;
  };
  const makeShelf = () => {
    const shelf = document.createElement('div');
    shelf.className = 'book-shelf';
    shelf.tabIndex = 0;
    shelf.setAttribute('role', 'region');
    shelf.setAttribute('aria-label', 'Bookshelf — scroll horizontally to explore the books');
    const track = document.createElement('div');
    track.className = 'shelf-track';
    const row = document.createElement('div');
    row.className = 'shelf-books';
    const plank = document.createElement('div');
    plank.className = 'shelf-plank';
    plank.setAttribute('aria-hidden', 'true');
    track.append(row, plank);
    shelf.append(track);
    return { shelf, row };
  };
  if (books.length) {
    document.querySelector('#reading-count').textContent = String(reading.length);
  }
  if (reading.length) {
    const row = document.querySelector('#reading-books');
    row.replaceChildren(...reading.map((book, index) => makeBook(book, index, true)));
  }
  const renderShelves = (container, entries) => {
    container.replaceChildren();
    if (!entries.length) return;
    const { shelf, row } = makeShelf();
    const primaryIndex = Math.floor(entries.length * .55);
    const secondaryIndex = Math.floor(entries.length * .2);
    entries.forEach((book, index) => {
      const button = makeBook(book, index, false);
      if (book.cover && index === primaryIndex) button.classList.add('book-cycle-a');
      else if (book.cover && index === secondaryIndex) button.classList.add('book-cycle-b');
      row.append(button);
    });
    container.append(shelf);
  };
  const renderCollections = () => {
    if (finished.length) renderShelves(document.querySelector('#finished-shelves'), finished);
    if (unassigned.length) renderShelves(document.querySelector('#unsorted-shelves'), unassigned);
  };
  if (books.length) {
    document.querySelector('#reading-title').closest('section').hidden = !reading.length;
    document.querySelector('#finished-section').hidden = !finished.length;
    document.querySelector('#unsorted-section').hidden = !unassigned.length;
    document.querySelector('#unsorted-count').textContent = String(unassigned.length);
  }
  renderCollections();
  dialog.querySelector('.book-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
