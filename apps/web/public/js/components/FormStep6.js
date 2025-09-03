export function FormStep6() {
  const wrap = document.createElement('div'); wrap.className='form-grid';
  function group(labelText, el) { const g=document.createElement('label'); g.className='form-group'; const l=document.createElement('div'); l.className='form-label'; l.textContent=labelText; g.append(l,el); return g; }
  function input(placeholder, cls, attrs={}) { const el=document.createElement('input'); el.className='input '+(cls||''); if (placeholder) el.placeholder=placeholder; Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; }

  // Utilidades para procesar imágenes
  function fileToDataUrl(file, maxW = 1280, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL('image/jpeg', quality)); }
        catch(e) { reject(e); }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  function createCaptureField(label, clsKey) {
    const container = document.createElement('div');
    container.style.display = 'grid'; container.style.gap = '8px';

    const hidden = input('', clsKey, { type: 'hidden' });
    const preview = document.createElement('img'); preview.alt = label; preview.style.maxWidth = '100%'; preview.style.borderRadius = '6px'; preview.style.display = 'none'; preview.className = 'preview-'+clsKey;
    // Permitir subir desde el dispositivo
    const file = document.createElement('input'); file.type='file'; file.accept='image/*'; file.setAttribute('capture','environment'); file.dataset.aux = '1'; file.className='input file';
  // Acciones pequeñas que aparecen cuando ya hay foto
  const smallActions = document.createElement('div');
  smallActions.style.display = 'none';
  smallActions.style.gap = '12px';
  smallActions.style.alignItems = 'center';
  smallActions.style.justifyContent = 'flex-start';
  smallActions.style.fontSize = '0.9rem';
  smallActions.style.color = 'var(--primary, #c00)';
  smallActions.style.userSelect = 'none';
  smallActions.style.display = 'none';
  smallActions.style.marginTop = '4px';
  smallActions.style.marginBottom = '4px';
  smallActions.style.display = 'none';
  const retakeLink = document.createElement('button');
  retakeLink.type = 'button';
  retakeLink.textContent = 'Tomar foto nuevamente';
  retakeLink.style.background = 'transparent';
  retakeLink.style.border = 'none';
  retakeLink.style.padding = '0';
  retakeLink.style.color = 'var(--primary, #c00)';
  retakeLink.style.textDecoration = 'underline';
  retakeLink.style.cursor = 'pointer';
  const uploadLink = document.createElement('button');
  uploadLink.type = 'button';
  uploadLink.textContent = 'Subir';
  uploadLink.style.background = 'transparent';
  uploadLink.style.border = 'none';
  uploadLink.style.padding = '0';
  uploadLink.style.color = 'var(--primary, #c00)';
  uploadLink.style.textDecoration = 'underline';
  uploadLink.style.cursor = 'pointer';
  smallActions.append(retakeLink, uploadLink);
  file.addEventListener('change', async () => {
      const f = file.files && file.files[0]; if (!f) return;
      try {
        // Contador de reintentos
        const key = `painita_id_retake_count_${clsKey}`;
        let count = 0; try { count = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch {}
        if (hidden.value) { count += 1; try { localStorage.setItem(key, String(count)); } catch {} }
        const dataUrl = await fileToDataUrl(f);
        hidden.value = dataUrl; preview.src = dataUrl; preview.style.display = '';
    if (count >= 3) { /* opcional: limitar acciones */ }
    updateUI();
      } catch {}
    });

    const cameraBtn = document.createElement('button'); cameraBtn.type='button'; cameraBtn.textContent='Tomar foto'; cameraBtn.className='btn'; cameraBtn.dataset.aux='1';
    const overlay = document.createElement('div'); overlay.style.position='relative';
    overlay.style.display='none'; overlay.style.border='1px solid #ddd'; overlay.style.borderRadius='6px'; overlay.style.padding='8px';
    const video = document.createElement('video'); video.autoplay=true; video.playsInline=true; video.style.width='100%'; video.style.borderRadius='6px';
    const actions = document.createElement('div'); actions.style.display='flex'; actions.style.gap='8px'; actions.style.marginTop='8px'; actions.style.justifyContent='center';
    const captureBtn = document.createElement('button'); captureBtn.type='button'; captureBtn.textContent='Capturar'; captureBtn.className='btn btn-primary'; captureBtn.dataset.aux='1';
    const cancelBtn = document.createElement('button'); cancelBtn.type='button'; cancelBtn.textContent='Cancelar'; cancelBtn.className='btn'; cancelBtn.dataset.aux='1';
    actions.append(captureBtn, cancelBtn);
    overlay.append(video, actions);

    let stream = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream; overlay.style.display='';
      } catch {
        alert('No se pudo acceder a la cámara');
      }
    }
    function stopCamera() { if (stream) { stream.getTracks().forEach(t=>t.stop()); stream = null; } overlay.style.display='none'; }

    cameraBtn.addEventListener('click', startCamera);
    retakeLink.addEventListener('click', () => {
      // usar misma lógica del botón grande de cámara
      startCamera();
    });
    uploadLink.addEventListener('click', () => {
      // disparar selector de archivo oculto
      file.click();
    });
    cancelBtn.addEventListener('click', stopCamera);
    captureBtn.addEventListener('click', () => {
      const w = video.videoWidth, h = video.videoHeight; if (!w || !h) return;
      const maxW = 1280; const scale = Math.min(1, maxW / w);
      const cw = Math.round(w * scale), ch = Math.round(h * scale);
      const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0, cw, ch);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      // Contador de reintentos por lado usando localStorage
      const key = `painita_id_retake_count_${clsKey}`;
      let count = 0;
      try { count = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch {}
      if (hidden.value) { // ya existía foto, esto es un reintento
        count += 1;
        try { localStorage.setItem(key, String(count)); } catch {}
      }
      hidden.value = dataUrl; preview.src = dataUrl; preview.style.display='';
      stopCamera();
      // Si llega a 3 reintentos, deshabilitar botón de cámara
  if (count >= 3) { cameraBtn.disabled = true; }
      updateUI();
    });

    // Refresca preview si ya viene con datos (hidratación)
    setTimeout(() => { if (hidden.value) { preview.src = hidden.value; preview.style.display=''; } updateUI(); }, 0);

  function updateUI() {
      const hasPhoto = !!hidden.value;
      preview.style.display = hasPhoto ? '' : 'none';
      // Mostrar controles chicos si hay foto; ocultar botones grandes
      smallActions.style.display = hasPhoto ? 'flex' : 'none';
      file.style.display = hasPhoto ? 'none' : '';
      cameraBtn.style.display = hasPhoto ? 'none' : '';
      // Respetar límite de reintentos para cámara
      let count = 0; try { count = parseInt(localStorage.getItem(`painita_id_retake_count_${clsKey}`) || '0', 10) || 0; } catch {}
      const limit = count >= 3;
      cameraBtn.disabled = limit;
      retakeLink.disabled = limit;
      retakeLink.style.opacity = limit ? '0.5' : '1';
      retakeLink.style.cursor = limit ? 'not-allowed' : 'pointer';
    }

  container.append(preview, smallActions, file, cameraBtn, overlay, hidden);
    return group(label, container);
  }

  wrap.append(
    createCaptureField('Documento (frontal)', 'id_front'),
    createCaptureField('Documento (trasera)', 'id_back'),
  );
  // Listen for a global event to reset retake counters after a successful save
  try {
    window.addEventListener('painita:step6:saved', () => {
      try { localStorage.removeItem('painita_id_retake_count_id_front'); } catch {}
      try { localStorage.removeItem('painita_id_retake_count_id_back'); } catch {}
    });
  } catch {}
  return wrap;
}
