export function PageLayout(children, { userPhone = '', showLogout = false } = {}) {
  const root = document.createElement('div');
  root.className = 'layout-root';
  
  // Top bar with conditional button
  const top = document.createElement('div');
  top.className = 'topbar';
  
  // Determine what button to show
  const isLoggedIn = showLogout || !!userPhone;
  
  if (isLoggedIn) {
    // User is logged in - show logout button and phone
    const phoneDisplay = userPhone ? `(${userPhone})` : '';
    top.innerHTML = `
      <a class="topbar__brand" href="/">Painita</a>
      <div class="topbar__user">
        <span class="topbar__phone">${phoneDisplay}</span>
        <button class="topbar__logout" type="button">Cerrar sesión</button>
      </div>
    `;
    
    // Add logout functionality
    const logoutBtn = top.querySelector('.topbar__logout');
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Logout button clicked');
      
      // Clear all session data
      try {
        localStorage.removeItem('painita_form_id');
        localStorage.removeItem('painita_form_step');
        localStorage.removeItem('painita_login_success');
        sessionStorage.clear();
      } catch (e) {
        console.error('Error clearing storage:', e);
      }
      
      // Redirect to home page
      window.location.href = '/';
    });
  } else {
    // User is not logged in - show login button
    top.innerHTML = `
      <a class="topbar__brand" href="/">Painita</a>
      <button class="topbar__login" type="button">Iniciar sesión</button>
    `;
    
    // Add login functionality
    const loginBtn = top.querySelector('.topbar__login');
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Login button clicked, redirecting to /login-we');
      window.location.assign('/login-we');
    });
  }
  
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
