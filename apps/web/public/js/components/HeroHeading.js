export function HeroHeading() {
  const box = document.createElement('section');
  box.className = 'hero';
  box.innerHTML = `
    <h1 class="hero__title">Painita, una ayuda financiera</h1>
    <h2 class="hero__subtitle">tan valiosa como una gema.</h2>
    <div class="hero__bar"></div>
  `;
  return box;
}
