export function PageLayout(children) {
  const root = document.createElement('div');
  root.className = 'layout-root';
  // Top bar simple
  const top = document.createElement('div');
  top.className = 'topbar';
  top.innerHTML = `
    <a class="topbar__brand" href="/">Painita</a>
    <button class="topbar__login" type="button" onclick="window.location.href='/mi-solicitud'">Iniciar sesión</button>
  `;
  root.appendChild(top);
  // Content
  const main = document.createElement('main');
  main.className = 'layout-main';
  if (Array.isArray(children)) children.forEach(c => main.appendChild(c)); else if (children) main.appendChild(children);
  root.appendChild(main);
  // Decorative SVG
  const deco = document.createElement('div');
  deco.className = 'layout-deco';
  deco.innerHTML = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="140" cy="140" r="40" fill="#B00020" fill-opacity="0.08" /><circle cx="100" cy="160" r="20" fill="#B00020" fill-opacity="0.12" /></svg>`;
  root.appendChild(deco);
  // If any child uses center-screen, tighten root to remove bottom padding to prevent tiny scrollbars
  const hasCenter = Array.isArray(children) && children.some(el => el?.classList?.contains?.('center-screen'));
  if (hasCenter) root.classList.add('tight');
  return root;
}
