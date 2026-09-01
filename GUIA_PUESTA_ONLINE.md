# Puesta online — GDI Alquileres MVP 1.1

Esta versión ya queda preparada para alojarse en un servidor real y usar PostgreSQL.

## Arquitectura

- App móvil: Expo / React Native.
- API: FastAPI.
- Base de datos productiva: PostgreSQL.
- Panel GDI: `/admin`.
- Mercado Pago: credenciales únicamente en backend.
- Contenedores: Docker Compose.

## Probar todo localmente con Docker

1. Copiar `.env.production.example` a `.env`.
2. Cambiar las claves.
3. Ejecutar:

```bash
docker compose up --build
```

La API queda en `http://localhost:8000`.
El panel administrador queda en `http://localhost:8000/admin`.

Para crear el primer SUPERADMIN se puede ejecutar el script `backend/create_superadmin.py`
contra la base configurada.

## Para producción

Se necesita un proveedor que permita:
- ejecutar Docker o un servicio Python;
- PostgreSQL administrado;
- HTTPS;
- dominio propio;
- variables secretas.

La URL pública final de la API debe colocarse en:
`mobile/eas.json` y/o `EXPO_PUBLIC_API_URL`.

## App instalable

Con la API ya online:
1. configurar Expo/EAS;
2. generar un build `preview` para instalar y probar;
3. corregir incidencias;
4. generar build `production`;
5. publicar en Google Play y App Store.

## Estado de Mercado Pago

El backend ya genera `external_reference` única y recibe un webhook.
Antes de producción todavía hay que:
- crear la aplicación oficial de Mercado Pago;
- colocar `MP_ACCESS_TOKEN`;
- configurar la URL pública del webhook;
- validar la firma real del webhook;
- consultar el pago en la API de Mercado Pago antes de acreditarlo;
- probar pagos de prueba y luego productivos.

## Administración

El panel ya permite:
- ver estadísticas;
- ver usuarios;
- ver últimos pagos;
- trabajar con roles `admin` y `superadmin`.

La siguiente expansión es:
- bloquear/desbloquear desde el panel;
- planes y suscripciones;
- documentos;
- plantillas de contrato;
- índices;
- notificaciones;
- soporte/incidencias.
