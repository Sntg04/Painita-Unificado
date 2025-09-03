export function PhoneVerification({ onVerified }) {
  const wrap = document.createElement('div');
  wrap.className = 'card card-center phone-card';
  wrap.innerHTML = `
    <div class="pv-top">
      <h3 class="card__title">Ingresa tu número de celular</h3>
      <input class="input" placeholder="Celular" maxlength="10" />
      <button class="btn btn-primary send">Enviar código</button>
  <div class="signin-hint">¿Ya tienes cuenta? <a class="signin-link" href="/mi-solicitud">Inicia sesión</a></div>
    </div>
    <div class="hint"></div>
    <div class="pv-otp hidden">
      <h3 class="card__title">Ingresa el código OTP</h3>
      <input class="input otp" placeholder="Código de 6 dígitos" maxlength="6" inputmode="numeric" />
      <button class="btn btn-primary verify">Validar</button>
      <ul class="otp-list">
        <li><span class="label">Número</span><span class="value otp-phone"></span></li>
        <li><span class="label">¿Deseas corregirlo?</span><a href="#" class="otp-edit">Cambiar número</a></li>
      </ul>
    </div>
    <div class="error"></div>
  `;
  const phoneEl = wrap.querySelector('input');
  const hint = wrap.querySelector('.hint');
  const err = wrap.querySelector('.error');
  const pvTop = wrap.querySelector('.pv-top');
  const pvOtp = wrap.querySelector('.pv-otp');
  const sendBtn = wrap.querySelector('.send');
  const otpEl = wrap.querySelector('.otp');
  const otpPhone = wrap.querySelector('.otp-phone');
  const otpEdit = wrap.querySelector('.otp-edit');
  // In this demo, we don't have separate OTP endpoints; keep UX and defer actual create to password step.
  sendBtn.addEventListener('click', async () => {
    const val = (phoneEl.value || '').replace(/\D/g, '').slice(0,10);
    phoneEl.value = val;
    if (val.length !== 10) { err.textContent = 'Ingresa un número válido de 10 dígitos'; return; }
    err.textContent = '';
    hint.textContent = '';
    try {
      // Bloquear botón para evitar múltiples envíos
      if (sendBtn.disabled) return;
      sendBtn.disabled = true;
      const originalText = sendBtn.textContent;
      sendBtn.textContent = 'Enviando…';
      // Check if phone already exists
      const chk = await fetch(`/phone/exists?phone=${encodeURIComponent(val)}`);
      const dchk = await chk.json().catch(()=>({}));
      if (chk.ok && dchk.exists) {
        err.innerHTML = "Ya tienes una cuenta, Panita. ¿Deseas iniciar sesión? <a href='/mi-solicitud'>Ir a iniciar sesión</a>";
        sendBtn.disabled = true; // bloquear OTP
        sendBtn.textContent = originalText;
        return;
      }
      hint.textContent = 'Enviando código...';
  const controller = new AbortController();
  const tm = setTimeout(() => controller.abort(), 10000);
  const r = await fetch('/otp/send', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ phone: val }), signal: controller.signal });
  clearTimeout(tm);
      if (!r.ok) {
        const d = await r.json().catch(()=>({}));
        const msg = d.message || d.error || 'No se pudo enviar el código';
        err.textContent = msg;
        try { alert(msg); } catch {}
        hint.textContent = '';
        sendBtn.disabled = false; // permitir reintento
        sendBtn.textContent = originalText;
        return;
      }
      hint.textContent = '';
      // Mostrar panel OTP y ocultar panel del número
  pvTop.classList.add('hidden');
  pvOtp.classList.remove('hidden');
  otpPhone.textContent = val;
      otpEl.focus();
      sendBtn.textContent = originalText;
    } catch (e) {
  err.textContent = e?.name === 'AbortError' ? 'Tiempo de espera agotado. Intenta de nuevo.' : 'Error de red al enviar el código';
      try { alert('Error de red al enviar el código'); } catch {}
      hint.textContent = '';
      sendBtn.disabled = false; // permitir reintento en error
      try { sendBtn.textContent = 'Enviar código'; } catch {}
    }
  });
  // Permitir corregir el número: volver al panel anterior
  otpEdit.addEventListener('click', (e) => {
    e.preventDefault();
    err.textContent = '';
    hint.textContent = '';
    pvOtp.classList.add('hidden');
    pvTop.classList.remove('hidden');
    phoneEl.focus();
  sendBtn.disabled = false; // re-habilitar para permitir nuevo envío tras editar número
  });
  wrap.querySelector('.verify').addEventListener('click', async () => {
    const code = (otpEl.value || '').replace(/\D/g, '').slice(0,6);
    otpEl.value = code;
    if (code.length !== 6) { err.textContent = 'Ingresa un código válido de 6 dígitos'; return; }
    err.textContent = '';
    try {
      const r = await fetch('/otp/verify', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ phone: phoneEl.value, code }) });
      const d = await r.json().catch(()=>({}));
      if (!r.ok || !d.ok) {
        err.textContent = d.message || (d.reason === 'expired' ? 'El código expiró, solicita uno nuevo' : 'Código incorrecto');
        return;
      }
      // Pass both phone and the validated OTP code upstream
      onVerified?.(phoneEl.value, code);
    } catch (e) {
      err.textContent = 'Error de red al verificar el código';
    }
  });
  return wrap;
}
