# GDI Alquileres — despliegue real en Render + build Expo

## 1. Crear repositorio Git
Subir la carpeta completa de este proyecto a un repositorio privado. El archivo `render.yaml` está en la raíz.

## 2. Crear cuenta en Render
Crear un Blueprint a partir del repositorio. Render detectará `render.yaml` y propondrá:
- `gdi-alquileres-api`
- `gdi-alquileres-db`

Antes de confirmar, cargar como secretos:
- `MP_ACCESS_TOKEN` (se puede dejar vacío hasta integrar Mercado Pago)
- `MP_WEBHOOK_SECRET` (se puede dejar vacío hasta integrar Mercado Pago)
- `BOOTSTRAP_ADMIN_SECRET` (crear una clave aleatoria larga)

## 3. Verificar API
Cuando termine el deploy, abrir:
- `https://<tu-servicio>.onrender.com/health`
- `https://<tu-servicio>.onrender.com/docs`
- `https://<tu-servicio>.onrender.com/admin`

## 4. Crear el primer SUPERADMIN
Hacer una sola petición POST a:
`/bootstrap/superadmin`

Body JSON:
```json
{
  "name": "Administrador GDI",
  "email": "TU_EMAIL",
  "password": "TU_PASSWORD_SEGURA"
}
```

Header:
`x-bootstrap-secret: EL_SECRETO_QUE_CARGASTE_EN_RENDER`

Después de crear el SUPERADMIN, cambiar/eliminar `BOOTSTRAP_ADMIN_SECRET` en Render para cerrar esa puerta de bootstrap.

## 5. Conectar la app móvil
En `mobile/eas.json`, reemplazar `https://TU-DOMINIO-API` por la URL HTTPS real de Render.

## 6. Generar build de prueba
Desde `mobile/`:
```bash
npm install
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

Android generará un APK instalable para pruebas internas.
iOS requiere credenciales Apple y registro de dispositivos para distribución ad hoc.

## 7. Publicación
Después de probar:
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

Luego se envían a Google Play Console y App Store Connect.
