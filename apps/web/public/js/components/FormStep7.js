export function FormStep7() {
  const wrap = document.createElement('div');
  wrap.className = 'form-grid';

  function group(labelText, el) { const g=document.createElement('label'); g.className='form-group'; const l=document.createElement('div'); l.className='form-label'; l.textContent=labelText; g.append(l,el); return g; }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); if (placeholder) el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }

  const container = document.createElement('div'); container.style.display='grid'; container.style.gap='8px';
  const hidden = input('', 'selfie', { type: 'hidden' });
  const preview = document.createElement('img'); preview.alt = 'Validación de identidad'; preview.style.maxWidth='100%'; preview.style.borderRadius='6px'; preview.style.display='none';
  const cameraBtn = document.createElement('button'); cameraBtn.type='button'; cameraBtn.textContent='Tomar foto'; cameraBtn.className='btn'; cameraBtn.dataset.aux='1';

  const overlay = document.createElement('div'); overlay.style.position='relative'; overlay.style.display='none'; overlay.style.border='1px solid #ddd'; overlay.style.borderRadius='6px'; overlay.style.padding='8px';
  const video = document.createElement('video'); video.autoplay=true; video.playsInline=true; video.style.width='100%'; video.style.borderRadius='6px';
  const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='8px'; actions.style.marginTop='8px'; actions.style.justifyContent='center';
  const captureBtn = document.createElement('button'); captureBtn.type='button'; captureBtn.textContent='Capturar'; captureBtn.className='btn btn-primary'; captureBtn.dataset.aux='1';
  const cancelBtn = document.createElement('button'); cancelBtn.type='button'; cancelBtn.textContent='Cancelar'; cancelBtn.className='btn'; cancelBtn.dataset.aux='1';
  actions.append(captureBtn, cancelBtn);
  overlay.append(video, actions);

  let stream = null;
  async function startCamera() {
    try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }); video.srcObject = stream; overlay.style.display=''; }
    catch { alert('No se pudo acceder a la cámara'); }
  }
  function stopCamera() { if (stream) { stream.getTracks().forEach(t=>t.stop()); stream = null; } overlay.style.display='none'; }

  cameraBtn.addEventListener('click', startCamera);
  cancelBtn.addEventListener('click', stopCamera);
  captureBtn.addEventListener('click', () => {
    const w = video.videoWidth, h = video.videoHeight; if (!w || !h) return;
    const maxW = 1280; const scale = Math.min(1, maxW / w);
    const cw = Math.round(w * scale), ch = Math.round(h * scale);
    const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0, cw, ch);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const key = 'painita_selfie_retake_count';
    let count = 0; try { count = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch {}
    if (hidden.value) { count += 1; try { localStorage.setItem(key, String(count)); } catch {} }
    hidden.value = dataUrl; preview.src = dataUrl; preview.style.display='';
    stopCamera();
    if (count >= 3) {
      cameraBtn.disabled = true;
      // Notificar al shell para auto-guardar y redirigir
      const ev = new CustomEvent('painita:selfie:autoSubmit', { detail: { count, value: dataUrl } });
      window.dispatchEvent(ev);
    }
  });

  // Si ya existe valor (hidratación), mostrar preview
  setTimeout(() => { if (hidden.value) { preview.src = hidden.value; preview.style.display = ''; } }, 0);

  container.append(preview, cameraBtn, overlay, hidden);
  wrap.append(group('Validación de identidad (toma una foto)', container));
  return wrap;
}
