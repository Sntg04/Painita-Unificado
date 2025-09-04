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
          <li>
            <a href="https://wa.me/573108586620" target="_blank" rel="noopener" title="WhatsApp">
              <span class="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/></svg>
              </span>
              <span class="label">WhatsApp</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;
  return s;
}
