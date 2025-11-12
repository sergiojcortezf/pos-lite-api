# Prueba Técnica Backend: Definición del Caso "API POS-Lite"

**Candidato:** Sergio Cortez
**Problemática Elegida:** Digitalización de Inventarios para Misceláneas Locales

---

## 1. Problemática

En México, una gran mayoría de las misceláneas (tiendas de abarrotes locales) operan su inventario y contabilidad de forma manual, a menudo utilizando una simple libreta. Este método tradicional presenta deficiencias críticas:

- **Pérdida de Información:** Es imposible rastrear mermas, productos caducados o "fugas de dinero" (robos menores), impactando directamente la rentabilidad.
- **Ineficiencia Operativa:** El proceso de cobro es lento, ya que los precios no están estandarizados y deben buscarse manualmente.
- **Nulo Control de Inventario:** El dueño no sabe con certeza qué productos tiene, cuáles se venden más, o cuándo es necesario reponer.
- **Actualización Manual:** Cuando los proveedores (ej. Coca-Cola, Sabritas) entregan mercancía y actualizan precios, el dueño debe pasar horas ajustando manualmente su libreta.

Esta falta de digitalización representa un cuello de botella significativo para la rentabilidad y escalabilidad de estos pequeños negocios.

## 2. Objetivo

**Objetivo General:**
Desarrollar la API RESTful (backend) que sirva como el motor central para un sistema "POS-Lite" (Punto de Venta Ligero). Esta API centralizará la gestión de productos, controlará el acceso de usuarios y, crucialmente, automatizará la actualización del inventario mediante la carga masiva de catálogos de proveedores.

**Objetivos Específicos:**

1.  Implementar un sistema de autenticación seguro basado en JWT para proteger los datos del negocio y gestionar los perfiles de los usuarios (ej. Dueño, Cajero).
2.  Proveer los endpoints CRUD (Crear, Leer, Actualizar, Borrar) para el recurso principal del sistema: **Productos**.
3.  Desarrollar una funcionalidad de análisis de archivos que permita al usuario "Dueño" subir un catálogo de proveedor (en formato Excel) para crear o actualizar productos en la base de datos de forma masiva.
4.  Asegurar que la API esté documentada (Swagger/OpenAPI), probada (unittests) y lista para su despliegue (Docker / Serverless).

## 3. Requerimientos Funcionales (RF)

### Autenticación y Perfil (RF-01)

- `POST /auth/register`: Registro de un nuevo usuario (Dueño o Cajero).
- `POST /auth/login`: Login de usuario. Devuelve un `accessToken` (JWT).
- `GET /profile`: (Ruta Protegida) Obtiene los datos del usuario autenticado.
- `PUT /profile`: (Ruta Protegida) Actualiza los datos del usuario autenticado.

### Recurso Principal: Productos (RF-02)

- **Modelo `Product`:** `id`, `name`, `price` (precio), `stock` (existencias), `barcode` (código de barras/SKU), `category` (categoría).
- `POST /products`: (Protegido) Crea un nuevo producto.
- `GET /products`: (Protegido) Lista todos los productos. Incluye:
  - **Paginación:** `?page=1&limit=20`
  - **Filtro:** `?category=Bebidas`
  - **Búsqueda:** `?search=Gansito` (busca por `name` o `barcode`).
- `GET /products/{id}`: (Protegido) Obtiene un producto por su ID.
- `PUT /products/{id}`: (Protegido) Actualiza un producto por su ID.
- `DELETE /products/{id}`: (Protegido) Elimina un producto por su ID.

### Análisis de Archivos (RF-03)

- `POST /products/upload-catalog`: (Ruta Protegida, idealmente solo para rol "Dueño").
- Recibe un archivo `.xlsx` (Excel).
- Valida que el tipo de archivo sea correcto.
- Lee el Excel, esperando columnas como `barcode`, `name`, `price`, `stock`.
- **Lógica de Negocio:**
  1.  Itera sobre cada fila del archivo.
  2.  Busca en la BBDD si existe un producto con ese `barcode`.
  3.  **Si existe:** Actualiza el `price` y `stock` del producto.
  4.  **Si NO existe:** Crea el nuevo producto en la BBDD.
- **Dato Específico a Devolver:** La API debe devolver un resumen del proceso, ej: `{ processed: 100, created: 40, updated: 60, errors: 0 }`.

## 4. Requerimientos No Funcionales (RNF)

- **RNF-01 (Stack):** Desarrollado en **Node.js + TypeScript** (cumpliendo la preferencia de lenguaje tipado).
- **RNF-02 (Framework):** Express.js.
- **RNF-03 (Base de Datos):** SQL (PostgreSQL) con un ORM (TypeORM o Sequelize).
- **RNF-04 (Contenedores):** Inclusión de un `Dockerfile` funcional para correr la aplicación.
- **RNF-05 (Documentación):** Documentación de API generada y accesible vía **Swagger (OpenAPI)**.
- **RNF-06 (Pruebas):** Pruebas unitarias (con Jest) para los flujos críticos: (1) Autenticación (`/login`) y (2) Lógica del servicio de Análisis de Archivos.
- **RNF-07 (Errores):** Manejo de errores centralizado y consistente.
- **RNF-08 (Configuración):** Uso de variables de entorno (`.env`) para la configuración (BBDD, Secret JWT, etc.).

## 5. Criterios de Éxito

1.  Un usuario no autenticado recibe un error `401 Unauthorized` al intentar acceder a `GET /products`.
2.  Un usuario puede registrarse, iniciar sesión y recibir un token JWT válido.
3.  Un usuario autenticado (usando el Bearer Token) puede crear (`POST /products`) y leer (`GET /products`) productos exitosamente.
4.  El endpoint `POST /products/upload-catalog` recibe un archivo Excel, lo procesa, y los cambios (nuevos productos/actualizaciones) se reflejan correctamente en la base de datos.
5.  La API completa está desplegada en una URL pública (Render, Railway, etc.) y es funcional.
6.  El repositorio de Git contiene el código, el `README.md`, el `Dockerfile` y el documento de `DOCUMENTATION.md`.

## 6. Alcance y Limitaciones (MVP)

- **Alcance:** La API cubre la lógica de _backend_ para la autenticación de usuarios y la gestión de inventario (Productos).
- **Limitaciones (Fuera de Alcance):**
  - No se implementará un Frontend (UI).
  - No se implementarán los endpoints de "Ventas" (el acto de "cobrar" o registrar una transacción POS), solo la gestión del inventario.
- El sistema de roles (`ADMIN` vs `CASHIER`) se mencionará, pero la implementación del middleware de roles es opcional si el tiempo no lo permite (el middleware de autenticación es obligatorio).

---

## 7. Mejoras de Arquitectura y Refactorización

Además de cumplir con los requisitos básicos, se implementaron varias mejoras de arquitectura para asegurar la calidad, mantenibilidad y escalabilidad del código, siguiendo los principios **SOLID** y **DRY**.

### 1. Manejo de Errores Centralizado (DRY)

- **Problema:** La lógica `try...catch` estaba duplicada en todos los métodos de los controladores.
- **Solución:** Se implementó un **Middleware de Manejo de Errores Global** (`globalErrorHandler`) y una clase `AppError` personalizada.
- **Resultado:** Los controladores ahora están limpios de `try...catch`. Los servicios lanzan errores (`throw new AppError('...', 404)`) y el middleware global los atrapa y formatea la respuesta HTTP correcta (400, 401, 403, 404, 500) de forma consistente.

### 2. Middleware de Validación de DTOs (DRY y SRP)

- **Problema:** La lógica de validación (`await validate(dto)`) estaba duplicada en los controladores.
- **Solución:** Se creó un **Middleware de Validación** genérico (`validationMiddleware`).
- **Resultado:** Las rutas (ej. `products.routes.ts`) ahora declaran qué DTO usan, y el controlador recibe un `req.body` ya validado y transformado. Esto limpia los controladores y respeta el Principio de Responsabilidad Única.

### 3. Control de Acceso Basado en Roles (RBAC) Profesional

- **Problema:** La API necesitaba diferenciar entre `ADMIN` (permiso total) y `CASHIER` (solo lectura).
- **Solución:** En lugar de un atajo (ej. "el primer usuario es admin"), se implementó una solución profesional:
  1.  **Script de "Seed" (`seed.ts`):** Un comando `npm run seed` separado que crea el usuario `ADMIN` inicial basándose en variables de entorno seguras (`ADMIN_EMAIL`).
  2.  **Middleware `checkRole`:** Un "guardia" que verifica si el usuario autenticado tiene el rol requerido (ej. `['ADMIN']`).
- **Resultado:** La ruta de registro `POST /register` está limpia y solo crea `CASHIERs`. Las rutas sensibles (como `DELETE /products`) están protegidas y solo responden al `ADMIN`.

### 4. Cobertura de Pruebas Robusta

- **Problema:** Las pruebas iniciales solo cubrían el "camino feliz".
- **Solución:** Se expandieron las pruebas unitarias (Jest) para todos los servicios para incluir los **"caminos infelices"**.
- **Resultado:** Ahora hay pruebas que verifican explícitamente que el sistema falla como se espera (ej. login con contraseña incorrecta, creación de producto con barcode duplicado, búsqueda de usuario inexistente).

## 8. Resultado Final (Despliegue y Pruebas)

La API fue completada, refactorizada y desplegada exitosamente, cumpliendo con todos los criterios de éxito y mejoras de arquitectura.

La aplicación está en vivo y disponible para pruebas:

- **URL Pública de la API:** `https://pos-lite-api.onrender.com`
- **Documentación Swagger (UI):** **`https://pos-lite-api.onrender.com/api-docs`**

### Credenciales de Prueba

Se ha implementado un sistema de Roles (RBAC) con dos niveles de acceso. Se recomienda probar ambos para verificar la seguridad de los endpoints:

#### 1. Usuario Administrador (ADMIN)

Este usuario fue creado usando el script de "seed" (`npm run seed`) y tiene acceso completo a todos los endpoints (incluyendo `POST /products`, `DELETE /products`, etc.).

- **Usuario:** `admin@poslite.com` (o el definido en `ADMIN_EMAIL`)
- **Password:** `supersecretpassword123` (o el definido en `ADMIN_PASSWORD`)

#### 2. Usuario Cajero (CASHIER)

Este usuario se puede crear a través del endpoint público `POST /api/auth/register`. De acuerdo a la lógica de negocio, recibirá automáticamente el rol `CASHIER`.

- **Prueba de Acceso:** Este usuario _puede_ leer datos (`GET /products`) pero recibirá un error `403 Forbidden` si intenta crear o borrar productos, demostrando que el `checkRole.middleware.ts` funciona.
- **Usuario de ejemplo:** `cajero@test.com`
- **Password:** `password123`
