// updated notes tree data (edit hrefs to your real note links)
const notes = [
  {
    name: 'PostgreSQL',
    children: [
      { title: 'Replication Concepts', href: 'https://github.com/mdsuhail-3257/notes/blob/main/PostgreSQL/Replication.md' },
      { title: 'Query Tuning Basics', href: 'https://github.com/mdsuhail-3257/notes/blob/main/PostgreSQL/QueryTuning.md' },
      { title: 'VACUUM & Analyze', href: 'https://github.com/mdsuhail-3257/notes/blob/main/PostgreSQL/Vacuum.md' }
    ]
  },
  {
    name: 'AWS',
    children: [
      { title: 'EC2 Basics', href: 'https://github.com/mdsuhail-3257/notes/blob/main/AWS/EC2.md' },
      { title: 'RDS & Aurora Notes', href: 'https://github.com/mdsuhail-3257/notes/blob/main/AWS/RDS_Aurora.md' }
    ]
  },
  {
    name: 'Career',
    children: [
      { title: 'Resume Framework', href: 'https://github.com/mdsuhail-3257/notes/blob/main/Career/Resume.md' }
    ]
  }
];

const root = document.getElementById('tree-root');

function makeSVG() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h4l2 3h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"></path></svg>`;
}

function createFolder(node) {
  const folder = document.createElement('div');
  folder.className = 'folder';

  const title = document.createElement('div');
  title.className = 'folder-title';
  title.innerHTML = `${makeSVG()}<strong style="color:#e6eef8">${node.name}</strong>`;
  folder.appendChild(title);

  const children = document.createElement('div');
  children.className = 'children';
  node.children.forEach(ch => {
    const a = document.createElement('a');
    a.className = 'note';
    a.href = ch.href;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.textContent = ch.title;
    children.appendChild(a);
  });
  folder.appendChild(children);

  // collapsed initially
  children.style.display = 'none';
  title.addEventListener('click', () => {
    const isHidden = children.style.display === 'none';
    children.style.display = isHidden ? 'block' : 'none';
    const svg = title.querySelector('svg');
    if (svg) svg.style.transform = isHidden ? 'rotate(20deg)' : 'rotate(0deg)';
  });

  return folder;
}

notes.forEach(n => {
  const f = createFolder(n);
  root.appendChild(f);
});

// simple parallax on mouse move for hero background keywords
(function heroParallax(){
  const hero = document.querySelector('.hero-bleed');
  if(!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const kws = document.querySelectorAll('.kw');
    kws.forEach((k, i) => {
      const tx = x * (30 + i*6);
      const ty = y * (20 + i*6);
      k.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  });
})();
