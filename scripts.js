/********************************************************
 scripts.js
 - loads notes.json and renders a collapsible tree
 - floating keywords parallax animation
 - small avatar tilt on hover
********************************************************/

/* ---------------------------
  NOTES JSON loader & renderer
   - root element = #tree-root
   - notes.json structure: array of objects with "name" and "children"
----------------------------*/
const root = document.getElementById('tree-root');

function makeFolderIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l2 3h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"></path></svg>`;
}

function createNode(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'folder';

  const title = document.createElement('div');
  title.className = 'folder-title';
  title.innerHTML = `${makeFolderIcon()}<strong style="color:var(--text)">${node.name || node.title}</strong>`;
  wrapper.appendChild(title);

  const childrenWrap = document.createElement('div');
  childrenWrap.className = 'children';

  // if node itself is a link
  if (node.href) {
    const a = document.createElement('a');
    a.className = 'note';
    a.href = node.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = node.title || node.name;
    childrenWrap.appendChild(a);
  }

  // children array (nested)
  if (Array.isArray(node.children)) {
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
  // collapsed by default
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
    const res = await fetch('notes.json', { cache: "no-store" });
    if (!res.ok) throw new Error('notes.json fetch failed');
    const notes = await res.json();
    root.innerHTML = ''; // clear
    notes.forEach(n => {
      const el = createNode(n);
      root.appendChild(el);
    });
  } catch (err) {
    console.error('Could not load notes.json', err);
    if (root) root.innerHTML = '<p class="muted">No notes available — upload notes.json in repo root.</p>';
  }
}
loadNotesJson();

/* ---------------------------
  HERO floating keywords parallax
  - moves .kw elements slightly based on mouse position
----------------------------*/
(function heroParallax(){
  const hero = document.querySelector('.hero-bleed');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    document.querySelectorAll('.floating-keywords .kw').forEach((k, i) => {
      const tx = x * (12 + i * 6);
      const ty = y * (8 + i * 4);
      k.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    document.querySelectorAll('.floating-keywords .kw').forEach(k => k.style.transform = '');
  });
})();

/* ---------------------------
  Avatar tilt micro-interaction
----------------------------*/
(function avatarTilt(){
  const wrap = document.querySelector('.profile-circle');
  const img = document.querySelector('.profile-circle img');
  if(!wrap || !img) return;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `translate(${x * 8}px, ${y * 6}px) scale(1.02)`;
  });
  wrap.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
})();
