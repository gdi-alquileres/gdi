# GDI Alquileres — Especificación técnica MVP V6

## Objetivo
Aplicación móvil para propietarios y administradores de inmuebles en Argentina.
Permite gestionar propiedades, inquilinos, garantes, contratos, documentación,
cobranzas, expensas/servicios, mora, recibos, ajustes e integración con Mercado Pago.

## Perfiles
- Propietario
- Administrador / inmobiliaria
- Inquilino
- Garante

## Módulos MVP
1. Autenticación
   - registro, login, recuperación de contraseña
   - verificación de email/teléfono
2. Propiedades
   - alta/edición/baja lógica
   - tipo: casa, departamento, local, galpón, campo, otro
3. Inquilinos
   - datos personales y de contacto
   - documentación
4. Garantes
   - datos, documentación y estado de revisión
5. Contratos
   - plantillas, variables, PDF, historial de versiones
6. Documentos
   - contrato, DNI, garantías, recibos, servicios, expensas
7. Cobranza
   - alquiler + expensas + servicios + otros conceptos
   - estados: pendiente, informado, en revisión, confirmado, rechazado, vencido
8. Mora
   - fecha vencimiento
   - días de gracia
   - tasa configurable según contrato
   - cálculo diario/mensual/anual
9. Recibos
   - numeración
   - PDF
   - detalle de conceptos
10. Ajustes
   - mecanismo/índice elegido en contrato
   - historial de valores y fechas
11. Mercado Pago
   - referencia única por deuda
   - webhook de actualización
   - conciliación de estado
12. Calculadora pública
   - cálculo de actualización con monto, período e índice
   - mostrar fuente y fecha de datos

## Modelo de datos
User
- id
- role
- name
- email
- phone
- password_hash
- created_at

Property
- id
- owner_user_id
- type
- name
- address
- city
- status

Tenant
- id
- user_id nullable
- name
- dni
- cuil
- email
- phone

Guarantor
- id
- lease_id
- name
- dni
- cuil
- guarantee_type
- review_status

Lease
- id
- property_id
- tenant_id
- start_date
- end_date
- base_rent
- due_day
- adjustment_method
- adjustment_frequency
- late_fee_type
- late_fee_rate
- grace_days
- status

Charge
- id
- lease_id
- period
- concept
- amount
- due_date
- status

Payment
- id
- lease_id
- amount
- paid_at
- method
- external_reference
- provider
- provider_payment_id
- provider_status
- verification_status

Receipt
- id
- payment_id
- number
- issued_at
- pdf_path

Document
- id
- entity_type
- entity_id
- document_type
- storage_path
- uploaded_at

Adjustment
- id
- lease_id
- effective_date
- method
- source
- previous_rent
- new_rent

MaintenanceTicket
- id
- property_id
- reported_by
- category
- description
- status
- created_at

## Flujo de cobranza
1. Se genera estado de cuenta mensual.
2. Se suman alquiler, expensas, servicios y otros conceptos.
3. Si vence sin pago, se calcula mora según contrato.
4. Se genera una referencia única para Mercado Pago.
5. Mercado Pago informa el estado por webhook.
6. Si el pago queda aprobado:
   - se valida el importe
   - se concilia con el período
   - se marca como confirmado
   - se genera recibo
   - se actualiza el estado de cuenta
7. Si el pago es manual:
   - el propietario registra y confirma
   - queda auditoría de usuario/fecha

## Seguridad mínima
- HTTPS
- contraseñas con hash fuerte
- JWT/OAuth2 o sesión segura
- cifrado de documentos sensibles en reposo
- permisos por rol
- registro de auditoría
- backups
- eliminación lógica
- política de privacidad y términos
- revisión legal de contratos y tratamiento de datos personales

## Arquitectura recomendada
- App móvil: Flutter o React Native
- Backend: Node.js/NestJS o FastAPI
- Base de datos: PostgreSQL
- Archivos: almacenamiento tipo S3
- Autenticación: proveedor gestionado o backend propio
- Notificaciones: Firebase Cloud Messaging + Apple Push Notification Service
- Mercado Pago: API oficial + Webhooks
- PDFs: generación server-side

## Prioridad de desarrollo
Sprint 1: login + usuarios + propiedades
Sprint 2: inquilino + garante + documentos
Sprint 3: contrato + estado de cuenta
Sprint 4: pagos + mora + recibos
Sprint 5: Mercado Pago + webhooks
Sprint 6: ajustes + calculadora
Sprint 7: notificaciones + QA + publicación
