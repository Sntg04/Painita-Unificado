export function FooterSection() {
  const s = document.createElement('section');
  s.className = 'footer-section';
  s.innerHTML = `
    <div class="footer__inner">
      <div class="footer__left">
        <div class="footer__title">Redes sociales</div>
        <ul class="footer__list">
          <li>
            <a href="#" aria-label="Facebook" title="Facebook">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.01 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.94Z" fill="#fff"/></svg>
              </span>
              <span class="label">Facebook</span>
            </a>
          </li>
          <li>
            <a href="#" aria-label="Instagram" title="Instagram">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.95.24 2.61.52.7.27 1.3.64 1.88 1.22.58.58.95 1.18 1.22 1.88.28.66.46 1.44.52 2.61.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.24 1.95-.52 2.61-.27.7-.64 1.3-1.22 1.88-.58.58-1.18.95-1.88 1.22-.66.28-1.44.46-2.61.52-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.95-.24-2.61-.52-.7-.27-1.3-.64-1.88-1.22-.58-.58-.95-1.18-1.22-1.88-.28-.66-.46-1.44-.52-2.61C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.06-1.17.24-1.95.52-2.61.27-.7.64-1.3 1.22-1.88.58-.58 1.18-.95 1.88-1.22.66-.28 1.44-.46 2.61-.52C8.42 2.17 8.8 2.16 12 2.16Zm0 1.68c-3.16 0-3.53.01-4.78.07-1.03.05-1.6.22-1.97.37-.5.19-.86.41-1.24.79-.38.38-.6.74-.79 1.24-.15.37-.32.94-.37 1.97-.06 1.25-.07 1.62-.07 4.78s.01 3.53.07 4.78c.05 1.03.22 1.6.37 1.97.19.5.41.86.79 1.24.38.38.74.6 1.24.79.37.15.94.32 1.97.37 1.25.06 1.62.07 4.78.07Z" fill="#fff"/></svg>
              </span>
              <span class="label">Instagram</span>
            </a>
          </li>
          <li>
            <a href="#" aria-label="X" title="X">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 3h4.6l5.05 7.26L17.9 3H21l-7.54 10.15L21.5 21H16.9l-5.5-7.91L7 21H3.5l7.76-10.4L3 3Z" fill="#fff"/></svg>
              </span>
              <span class="label">X</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="footer__right">
        <div class="footer__title">Servicio al cliente</div>
        <ul class="footer__list">
          <li>
            <a href="mailto:serviciopainita@gmail.com" title="Correo">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm-1.4 4.25-6.07 4.2a1 1 0 0 1-1.06 0L5.4 8.25A1 1 0 0 1 6.6 6.7l5.4 3.74L17.4 6.7a1 1 0 1 1 1.2 1.55Z"/></svg>
              </span>
              <span class="label">serviciopainita@gmail.com</span>
            </a>
          </li>
          <li>
            <a href="tel:+573108586620" title="Teléfono">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.25 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1l-2.2 2.22Z"/></svg>
              </span>
              <span class="label">3108586620</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;
  return s;
}
