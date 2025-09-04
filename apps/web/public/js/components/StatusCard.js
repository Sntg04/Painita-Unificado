// Componente para mostrar información organizada de cada estado
export function StatusCard({ 
  title, 
  subtitle, 
  status, 
  details = [], 
  actions = [], 
  breakdown = null,
  icon = null 
}) {
  const card = document.createElement('div');
  card.className = 'status-card';
  
  // Header con ícono y título
  const header = document.createElement('div');
  header.className = 'status-header';
  
  if (icon) {
    const iconEl = document.createElement('div');
    iconEl.className = 'status-icon';
    iconEl.innerHTML = icon;
    header.appendChild(iconEl);
  }
  
  const titleWrap = document.createElement('div');
  titleWrap.className = 'status-title-wrap';
  
  const titleEl = document.createElement('h2');
  titleEl.className = 'status-title';
  titleEl.textContent = title;
  titleWrap.appendChild(titleEl);
  
  if (subtitle) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'status-subtitle';
    subtitleEl.textContent = subtitle;
    titleWrap.appendChild(subtitleEl);
  }
  
  header.appendChild(titleWrap);
  card.appendChild(header);
  
  // Status badge si se proporciona
  if (status) {
    const statusEl = document.createElement('div');
    statusEl.className = `status-badge status-badge--${status.type}`;
    statusEl.textContent = status.text;
    card.appendChild(statusEl);
  }
  
  // Detalles organizados
  if (details.length > 0) {
    const detailsWrap = document.createElement('div');
    detailsWrap.className = 'status-details';
    
    details.forEach(detail => {
      const detailEl = document.createElement('div');
      detailEl.className = 'status-detail';
      
      if (detail.type === 'info') {
        detailEl.className += ' status-detail--info';
        detailEl.innerHTML = `
          <div class="status-detail-content">
            <span class="status-detail-text">${detail.text}</span>
          </div>
        `;
      } else if (detail.type === 'summary') {
        detailEl.className += ' status-detail--summary';
        detailEl.innerHTML = `
          <h3 class="status-detail-title">${detail.title}</h3>
          <div class="status-summary-grid">
            ${detail.items.map(item => `
              <div class="status-summary-row">
                <span class="status-summary-label">${item.label}</span>
                <span class="status-summary-value">${item.value}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
      
      detailsWrap.appendChild(detailEl);
    });
    
    card.appendChild(detailsWrap);
  }
  
  // Desglose financiero
  if (breakdown) {
    const breakdownWrap = document.createElement('div');
    breakdownWrap.className = 'status-breakdown';
    breakdownWrap.appendChild(breakdown);
    card.appendChild(breakdownWrap);
  }
  
  // Acciones
  if (actions.length > 0) {
    const actionsWrap = document.createElement('div');
    actionsWrap.className = 'status-actions';
    
    actions.forEach(action => {
      const actionEl = document.createElement('button');
      actionEl.className = `btn btn--${action.type}`;
      actionEl.textContent = action.text;
      if (action.onClick) {
        actionEl.addEventListener('click', action.onClick);
      }
      if (action.disabled) {
        actionEl.disabled = true;
      }
      actionsWrap.appendChild(actionEl);
    });
    
    card.appendChild(actionsWrap);
  }
  
  return card;
}
