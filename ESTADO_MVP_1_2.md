# GDI Alquileres MVP 1.2 — App conectada al backend

## Cambio principal

La app móvil ya no depende solamente de datos locales para las funciones centrales.

Quedan conectados por API:
- Registro de usuario.
- Login.
- Sesión con token JWT.
- Perfil del usuario.
- Alta/listado de propiedades.
- Alta/listado de inquilinos.
- Alta de contratos (API disponible).
- Alta/listado de garantes (API disponible).
- Estado de cuenta (API disponible).
- Pago manual (API disponible).
- Creación de orden Mercado Pago desde backend.
- SUPERADMIN y panel administrador.

## Para probar en una red local

1. Levantar backend con Docker o Uvicorn.
2. Averiguar la IP local de la computadora, por ejemplo `192.168.1.20`.
3. En `mobile/.env`:
   `EXPO_PUBLIC_API_URL=http://192.168.1.20:8000`
4. Ejecutar Expo.
5. El teléfono y la computadora deben estar en la misma red Wi‑Fi.

## Para usarla desde cualquier lugar

Desplegar el backend con HTTPS y PostgreSQL.
Luego usar una URL real:
`EXPO_PUBLIC_API_URL=https://api.TU-DOMINIO`

## Lo que todavía impide publicar como versión final

- Webhook de Mercado Pago con validación criptográfica real y consulta del pago al proveedor.
- Documentos/archivos en almacenamiento seguro.
- PDFs de contrato y recibo.
- Notificaciones push.
- Recuperación de contraseña.
- Términos / privacidad.
- QA en dispositivos.
- Firma y publicación en tiendas.
