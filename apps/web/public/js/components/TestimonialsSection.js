// Testimonios provistos por el cliente
const testimonials = [
  { text: 'Me salvó en un momento crítico. La cuota fue un poco alta, pero necesitaba el dinero urgente para pagar una urgencia médica. No me gusta pagar tanto, pero prefiero eso a quedarme sin opciones. Gracias a la app, resolví todo en menos de una hora.', stars: 4 },
  { text: 'Sí, cobran más que un banco… pero ningún banco te presta en 5 minutos. En mi caso, era eso o perder una oportunidad de trabajo. La app fue rápida y cumplió. Recomiendo usarla con responsabilidad.', stars: 4 },
  { text: 'Los intereses son elevados, pero cuando uno está en apuros, lo último que quiere es esperar papeles. Esta app me prestó cuando nadie más lo hacía. Vale la pena tenerla instalada. Uno nunca sabe cuándo la va a necesitar.', stars: 4 },
  { text: 'No es la opción más barata, pero sí es la más rápida. Me gustó que no me pidieron tanto papeleo. Solo hay que tener claro que es un préstamo de emergencia, no para cualquier gasto.', stars: 4 },
  { text: 'Lo importante es pagar a tiempo. Si uno se organiza, la app es útil. Los costos son altos, sí, pero cuando me quedé sin plata para el arriendo, fue lo único que me respondió. Ahora estoy al día y puedo volver a usarla si lo necesito.', stars: 4 },
  { text: 'Me pareció costoso al principio, pero después entendí que la rapidez tiene su precio. Me ayudó a salir de una deuda más grave. Ojalá bajen un poco las tarifas con el tiempo, pero mientras tanto, es mejor tener esta app que depender de favores.', stars: 3 },
];

export function TestimonialsSection() {
  const s = document.createElement('section');
  s.className = 'testi-section';
  s.innerHTML = `
    <div class="testi__inner">
      <h3>Opiniones de nuestros clientes</h3>
      <div class="testi__grid"></div>
    </div>`;
  const grid = s.querySelector('.testi__grid');
  const renderStars = (n=5) => '★'.repeat(Math.max(0, Math.min(5, n))) + '☆'.repeat(Math.max(0, 5-n));
  testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testi__card';
    const stars = renderStars(t.stars);
    card.innerHTML = `<div class="testi__stars" aria-label="${t.stars} de 5">${stars}</div><p>“${t.text}”</p>`;
    grid.appendChild(card);
  });
  return s;
}
