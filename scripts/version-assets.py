"""Refresh static asset URLs after changing CSS or JavaScript (no build required)."""
from hashlib import sha256
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
versions = {
    name: sha256((root / name).read_bytes()).hexdigest()[:12]
    for name in ('styles.css', 'hero-typing.js', 'site-nav.js', 'books-data.js', 'books.js')
}
for page in [*root.glob('*.html'), *(root / 'projects').glob('*.html')]:
    text = page.read_text()
    for name, version in versions.items():
        pattern = r'((?:href|src)="(?:\.\./)?' + re.escape(name) + r')(?:\?[^"\s]*)?(")'
        text = re.sub(pattern, lambda m: f'{m[1]}?v={version}{m[2]}', text)
    page.write_text(text)
print('Updated asset versions:', ', '.join(versions))
