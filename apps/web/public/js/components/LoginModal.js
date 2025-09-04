export function LoginModal({ onLogin, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Iniciar sesión</h3>
        <button class="modal-close" type="button">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input class="input phone-input" type="text" placeholder="Número de celular" maxlength="10" />
        </div>
        <div class="form-group">
          <input class="input password-input" type="password" placeholder="Contraseña" />
        </div>
        <div class="error-message"></div>
        <button class="btn btn-primary login-submit">Iniciar sesión</button>
      </div>
    </div>
  `;

  // Styling
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .modal-header h3 {
      margin: 0;
      color: #333;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .modal-close:hover {
      color: #333;
    }
    .modal-body {
      padding: 20px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .error-message {
      color: #b00020;
      font-size: 0.9rem;
      margin-bottom: 16px;
      min-height: 20px;
    }
  `;
  document.head.appendChild(style);

  const phoneInput = modal.querySelector('.phone-input');
  const passwordInput = modal.querySelector('.password-input');
  const errorDiv = modal.querySelector('.error-message');
  const submitBtn = modal.querySelector('.login-submit');
  const closeBtn = modal.querySelector('.modal-close');

  // Close modal handlers
  closeBtn.addEventListener('click', () => {
    document.head.removeChild(style);
    onClose?.();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.head.removeChild(style);
      onClose?.();
    }
  });

  // Login form handler
  submitBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    const password = passwordInput.value;

    if (!phone || phone.length !== 10) {
      errorDiv.textContent = 'Ingresa un número de celular válido';
      return;
    }

    if (!password) {
      errorDiv.textContent = 'Ingresa tu contraseña';
      return;
    }

    errorDiv.textContent = '';
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';

    try {
      const response = await fetch('/clientes/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          errorDiv.textContent = 'Contraseña incorrecta';
        } else if (response.status === 404) {
          errorDiv.textContent = 'Usuario no encontrado';
        } else {
          errorDiv.textContent = data?.error || 'Error al iniciar sesión';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      // Successful login
      const form = data?.formulario || null;
      document.head.removeChild(style);
      onLogin?.(phone, form);

    } catch (error) {
      errorDiv.textContent = 'Error de conexión';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Enter key handler
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  return modal;
}
