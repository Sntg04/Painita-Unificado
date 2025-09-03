export function InstitutionalSection() {
  const s = document.createElement('section');
  s.className = 'inst-section';
  s.innerHTML = `
    <div class="inst__inner">
      <h3>¿Quiénes somos?</h3>
      <p>Somos una plataforma de crédito inspirada en la <strong>Painita</strong>, una gema extraordinariamente valiosa y poco común. Como esa piedra, buscamos ser sinónimos de <strong>valor, transparencia y fortaleza</strong>: costos claros desde el inicio, decisiones rápidas y un acompañamiento cercano para que cada peso cuente. Aquí no hay letras pequeñas; hay información sencilla y una calculadora que muestra tu crédito en tiempo real.</p>
      <div class="inst__cards">
        <div class="inst__card"><h4>Nuestra misión</h4><p>Hacer que el crédito sea <strong>accesible, claro y responsable</strong> para más personas. Combinamos tecnología simple con una experiencia humana para que puedas <strong>solicitar, entender y pagar</strong> tu crédito sin fricciones, en minutos y con total claridad de costos.</p></div>
        <div class="inst__card"><h4>Nuestra visión</h4><p>Que cada crédito se sienta como una <strong>oportunidad valiosa</strong>: transparente, justa y que te impulsa a avanzar. Queremos ser la plataforma de confianza a la que los clientes regresan porque encuentran <strong>equilibrio</strong> entre rapidez, precio y acompañamiento.</p></div>
      </div>
    </div>`;
  return s;
}
