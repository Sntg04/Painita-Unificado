Painita Unificado (POC)

Contenido
- apps/crm: mini CRM (JSON storage) con endpoints y UI admin.
- apps/web: servidor demo con UI para iniciar solicitud, sincronizar pasos y generar link Tumipay.
- packages/calc: calculadora de cuota compartida.
- packages/crm-client: cliente CRM (SDK) para consumir los endpoints.

Cómo correr
1. CRM:
   - PowerShell:
     - cd .\apps\crm
     - npm install --no-audit --no-fund
     - node index.js
   - Abre http://localhost:4001
2. Web demo:
   - PowerShell:
     - cd .\apps\web
     - npm install --no-audit --no-fund
          - Configura credenciales Tumipay (opcional en dev):
          - $env:TUMIPAY_BASE='https://transactions.topup.com.co/production'
          - $env:TUMIPAY_KEY='TU_TOKEN_O_APIKEY'
      - # Para PayIn específico
   - $env:TUMIPAY_AUTH='Bearer TU_TOKEN'  # o el valor exacto requerido
      - $env:TUMIPAY_PAYIN_PATH='/api/v1/payin'
          - # o usuario/clave básicos
          - $env:TUMIPAY_USER='usuario'
          - $env:TUMIPAY_PASS='clave'
             - # Fallback: si la API falla, permitir link mock (solo dev)
             - $env:TUMIPAY_ALLOW_MOCK_ON_FAIL='1'
       - $env:CRM_BASE='http://localhost:4001'; node server.js
   - Abre http://localhost:4000

Usar tus vistas originales como página principal (LEGACY)
- Configura la carpeta base al proyecto existente y arranca el server web:
   - PowerShell:
      - $env:LEGACY_WEB_DIR='C:\\Users\\joanh\\OneDrive\\Documentos\\GitHub\\Painita-Web'
      - $env:LEGACY_INJECT_ADAPTER='1'   # opcional: inyecta window.PainitaFormSync
      - node .\\apps\\web\\server.js
- El servidor autodetecta index.html en subcarpetas comunes (dist, build, client/dist, client/build, public).
- La UI legacy quedará en http://localhost:4000 y seguirá disponible /start, /sync/:id/step, /status/:id, /payment-link/:id.

Prueba rápida E2E
   - cd repo root
   - npm install --no-audit --no-fund
   - node .\scripts\e2e.js

Notas
- Tumipay: si no configuras TUMIPAY_BASE, se usará un link mock local; si configuras TUMIPAY_BASE pero la API falla, verás error de generación de link.
- El CRM usa JSON; migrar a DB real cuando se integre con Painita-CRM.
- Seguridad/autenticación no incluida en este POC.
