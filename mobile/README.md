# GDI Alquileres V8 — Expo / React Native

Esta versión es el primer proyecto móvil ejecutable del concepto GDI Alquileres.

## Qué ya funciona
- Branding y logo GDI dentro de la app.
- Navegación móvil.
- Dashboard.
- Alta y persistencia local de propiedades con AsyncStorage.
- Estado de cuenta.
- Cálculo de mora.
- Flujo de Mercado Pago simulado con referencia única.
- Separación entre app móvil y backend para proteger credenciales.

## Ejecutar
1. Instalar Node.js LTS.
2. En esta carpeta:
   npm install
3. Luego:
   npx expo start
4. Abrir con Expo Go o simulador iOS/Android.

## Mercado Pago
La integración productiva no debe poner el access token privado en la app.
El flujo correcto es:

App -> Backend GDI -> API Mercado Pago
Mercado Pago -> Webhook firmado -> Backend GDI -> Base de datos -> App

El archivo `src/services/api.js` contiene el punto de integración simulado.

## Próximos módulos
- Login y roles reales.
- Inquilinos.
- Garantes y documentación.
- Contratos y generación PDF.
- Backend y PostgreSQL reales.
- Mercado Pago productivo.
- Recibos PDF.
- Notificaciones push.
- Ajustes por índice.


## V9
- Nuevo logo GDI incorporado.
- Login inicial.
- Pantalla Inquilino/Garante.
- Pantalla Contrato.
- Estructura backend preparada para la próxima etapa.
