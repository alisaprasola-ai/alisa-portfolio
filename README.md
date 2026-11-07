# Alisa Prasol — Portfolio

Responsive UI/UX and product design portfolio built with HTML, CSS, and vanilla JavaScript. Includes seven project pages, locally hosted fonts, descriptive project summaries, and a personal About section.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 3000
```

Open `http://localhost:3000`. No dependency installation or build step is needed. The site can also be deployed to any static hosting service.

## Content

- `index.html`: homepage, projects, About, experience, and contact links.
- `projects/`: individual project pages and related-project navigation.
- `books.html`, `books-data.js`, `books.js`: personal bookshelf, confirmed book entries, and book-details interactions.
- `styles.css`: responsive layouts, colours, and animations.
- `hero-typing.js`: one-time typing animation and heading colour effects; respects reduced motion.
- `assets/`: referenced images, sticker sheet, fonts, and font licence.

All seven project cases use descriptive titles, text-only cards, and no project screenshots or identifying live links. Original artwork and earlier case drafts are kept outside the public site. A separate agency website case remains hidden.


After changing CSS or JavaScript, run `python3 scripts/version-assets.py` before committing. This refreshes the asset URLs so returning visitors load the matching styles and scripts. SVG navigation icons also declare their own dimensions as a fallback.
