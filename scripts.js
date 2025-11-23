/*******************************
 scripts.js
 - loads notes.json and renders a collapsible tree
 - adds hero floating keywords parallax
 - small avatar hover interaction
*******************************/

/* ---------- NOTES JSON loader & tree renderer ---------- */
/* Root element that will contain the tree */
const root = document.getElementById('tree-root');

/* Small SVG folder icon used in folder titles */
function makeFolderIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l2 3h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"></path></svg>`;
}

/* Recursively create nodes (folders or leaf links) */
function createNode(node) {
  // Wrapper for folder or single item
  const wrapper = document.createElement('div');
  wrapper.className = 'folder';

  // Title area (folder label)
  const title = document.createElement('div');
  title.className = 'folder-title';
  // node.name for folders, node.title for leaf items
  title.innerHTML = `${makeFolderIcon()}<strong style="color:var(--text)">${node.name || node.title}</strong>`;
  wrapper.appendChild(title);

  // Children container
  const childrenWrap = document.createElement('div');
  childrenWrap.className = 'children';

  // If this node itself is a leaf with href, render it as link
  if (node.href) {
    const a = document.createElement('a');
    a.className = 'note';
    a.href = node.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = node.title || node.name;
    childrenWrap.appendChild(a);
  }

  // If node has children array, iterate recursively
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(ch => {
      // If child has its own children -> nested folder
      if (ch.children) {
        const childFolder = createNode(ch);
        childrenWrap.appendChild(childFolder);
      } else {
        // Leaf link
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

  // Start collapsed
  childrenWrap.style.display = 'none';
  // Toggle on click
  title.addEventListener('click', () => {
    const isHidden = childrenWrap.style.display === 'none';
    childrenWrap.style.display = isHidden ? 'block' : 'none';
    const svg = title.querySelector('svg');
    if (svg) svg.style.transform = isHidden ? 'rotate(20deg)' : 'rotate(0deg)';
  });

  return wrapper;
}

/* Fetch notes.json (no-cache) and render tree */
async function loadNotesJson() {
  try {
    const res = await fetch('notes.json', { cache: "no-store" });
    if (!res.ok) throw new Error('notes.json fetch failed');
    const notes = await res.json();
    root.innerHTML = ''; // clear previous
    notes.forEach(n => {
      const nodeEl = createNode(n);
      root.appendChild(nodeEl);
    });
  } catch (err) {
    console.error('Could not load notes.json', err);
    root.innerHTML = '<p class="muted">No notes available. Please upload notes.json</p>';
  }
}

/* Initialize notes on load */
loadNotesJson();

/* ---------- HERO INTERACTIONS: floating keywords parallax ---------- */
(function heroParallax(){
  const hero = document.querySelector('.hero-bleed');
  if(!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // move each keyword a bit for depth
    document.querySelectorAll('.floating-keywords .kw').forEach((k, i) => {
      const tx = x * (10 + i * 6);
      const ty = y * (8 + i * 4);
      k.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });

  // reset on leave
  hero.addEventListener('mouseleave', () => {
    document.querySelectorAll('.floating-keywords .kw').forEach(k => k.style.transform = '');
  });
})();

/* ---------- SMALL: avatar tilt on mousemove inside circle ---------- */
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
