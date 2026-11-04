(() => {
  const books = Array.isArray(window.ALISA_BOOKS) ? window.ALISA_BOOKS : [];
  const reading = books.filter(book => book.status === 'reading');
  const finished = books.filter(book => book.status === 'read');
  const unassigned = books.filter(book => book.status !== 'reading' && book.status !== 'read');
  const dialog = document.querySelector('.book-dialog');
  const palette = ['#d5dfec', '#e9cfcb', '#e6dfb9', '#ccddd2', '#ded5eb', '#edcfb0'];

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
    button.className = 'library-book' + (face ? ' book-face' : '');
    button.style.setProperty('--book-colour', palette[index % palette.length]);
    button.setAttribute('aria-label', book.title + (book.author ? ' by ' + book.author : '') + ' — view details');
    if (face && book.cover) {
      const image = document.createElement('img');
      image.src = book.cover;
      image.alt = '';
      image.loading = 'lazy';
      button.append(image);
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
    const row = document.createElement('div');
    row.className = 'shelf-books';
    const plank = document.createElement('div');
    plank.className = 'shelf-plank';
    plank.setAttribute('aria-hidden', 'true');
    shelf.append(row, plank);
    return { shelf, row };
  };
  if (books.length) {
    document.querySelector('#library-total').textContent = books.length + (books.length === 1 ? ' book on my shelf' : ' books on my shelves');
    document.querySelector('#reading-count').textContent = String(reading.length);
    document.querySelector('#finished-count').textContent = String(finished.length);
  }
  if (reading.length) {
    const row = document.querySelector('#reading-books');
    row.replaceChildren(...reading.map((book, index) => makeBook(book, index, true)));
  }
  const renderShelves = (container, entries) => {
    container.replaceChildren();
    const capacity = window.matchMedia('(max-width: 600px)').matches ? 4 : 10;
    for (let i = 0; i < entries.length; i += capacity) {
      const { shelf, row } = makeShelf();
      entries.slice(i, i + capacity).forEach((book, j) => row.append(makeBook(book, i + j, false)));
      container.append(shelf);
    }
  };
  const renderCollections = () => {
    if (finished.length) renderShelves(document.querySelector('#finished-shelves'), finished);
    if (unassigned.length) renderShelves(document.querySelector('#unsorted-shelves'), unassigned);
  };
  if (books.length) {
    document.querySelector('#reading-title').closest('section').hidden = !reading.length;
    document.querySelector('#finished-title').closest('section').hidden = !finished.length;
    document.querySelector('#unsorted-section').hidden = !unassigned.length;
    document.querySelector('#unsorted-count').textContent = String(unassigned.length);
  }
  renderCollections();
  window.matchMedia('(max-width: 600px)').addEventListener('change', renderCollections);
  dialog.querySelector('.book-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
