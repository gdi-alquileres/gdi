# GDI Alquileres — MVP 1.0

Este proyecto ya separa tres piezas reales:

1. `mobile/` — app Expo / React Native.
2. `backend/` — API FastAPI con autenticación, base de datos, propiedades, inquilinos, contratos, cargos, pagos, Mercado Pago y recibos.
3. `/admin` — Panel Administrador GDI servido por el backend.

## Probar el backend en una PC

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python create_superadmin.py
uvicorn app.main:app --reload
```

Luego abrir:
- API: `http://127.0.0.1:8000/docs`
- Panel GDI: `http://127.0.0.1:8000/admin`

## Estado actual

Ya hay código funcional para:
- Registro y login.
- JWT y roles.
- SUPERADMIN GDI.
- Alta/listado de propiedades.
- Alta/listado de inquilinos.
- Alta de contratos.
- Generación de cargos.
- Estado de cuenta.
- Registro de pago manual.
- Generación de número de recibo.
- Creación de orden de Mercado Pago en modo scaffold.
- Webhook de Mercado Pago en modo scaffold.
- Panel administrador con estadísticas.
- SQLite para desarrollo y compatibilidad con PostgreSQL para producción.

## Qué falta antes de publicarla de verdad

- Contratar/crear infraestructura productiva.
- Usar PostgreSQL alojado.
- Almacenamiento seguro de documentos.
- Conectar Mercado Pago con credenciales productivas y validar firmas reales.
- Conectar la app móvil a la URL real del backend.
- Generar PDFs de contrato y recibo.
- Notificaciones push.
- Pruebas y endurecimiento de seguridad.
- Política de privacidad / términos.
- Cuentas oficiales de Apple Developer y Google Play Console.
- Compilar y firmar iOS/Android.
