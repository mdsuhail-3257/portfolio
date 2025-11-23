// scripts.js - notes loader + hero interactions

// --- NOTES JSON loader & tree renderer ---
const root = document.getElementById('tree-root');

function makeFolderIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l2 3h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"></path></svg>`;
}

function createNode(node) {
  // node may have children (folder) or href (leaf) or both
  const wrapper = document.createElement('div');
  wrapper.className = 'folder';

  const title = document.createElement('div');
  title.className = 'folder-title';
  title.innerHTML = `${makeFolderIcon()}<strong style="color:#e6eef8">${node.name || node.title}</strong>`;
  wrapper.appendChild(title);

  const childrenWrap = document.createElement('div');
  childrenWrap.className = 'children';

  // If node has direct href (leaf), render as link
  if (node.href) {
    const a = document.createElement('a');
    a.className = 'note';
    a.href = node.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = node.title || node.name;
    childrenWrap.appendChild(a);
  }

  // If node has children, iterate
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(ch => {
      if (ch.children) {
        // nested folder
        const childFolder = createNode(ch);
        childrenWrap.appendChild(childFolder);
      } else {
        const a = document.createElement('a');
        a.className = 'note';
        a.href = ch.href;
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.textContent = ch.title;
        childrenWrap.appendChild(a);
      }
    });
  }

  wrapper.appendChild(childrenWrap);

  // start collapsed
  childrenWrap.style.display = 'none';
  title.addEventListener('click', () => {
    const isHidden = childrenWrap.style.display === 'none';
    childrenWrap.style.display = isHidden ? 'block' : 'none';
    const svg = title.querySelector('svg');
    if (svg) svg.style.transform = isHidden ? 'rotate(20deg)' : 'rotate(0deg)';
  });

  return wrapper;
}

async function loadNotesJson() {
  try {
    const res = await fetch('notes.json', {cache: "no-store"});
    if (!res.ok) throw new Error('notes.json fetch failed');
    const notes = await res.json();
    root.innerHTML = ''; // clear
    notes.forEach(n => {
      const nodeEl = createNode(n);
      root.appendChild(nodeEl);
    });
  } catch (err) {
    console.error('Could not load notes.json', err);
    root.innerHTML = '<p class="muted">No notes available. Please upload notes.json</p>';
  }
}
loadNotesJson();

// --- HERO INTERACTIONS (parallax + avatar hover) ---
(function heroParallax(){
  const hero = document.querySelector('.hero-bleed');
  if(!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const kws = document.querySelectorAll('.kw'); // unused but kept if needed
    // floating logos
    document.querySelectorAll('.floating-logos .logo').forEach((k, i) => {
      const mult = 12 + i*4;
      const tx = x * mult;
      const ty = y * (12 + i*3);
      k.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
})();
