# API POS-Lite (Prueba Técnica)

API RESTful desarrollada en Node.js y TypeScript como solución a la prueba técnica de "Backend Developer". El proyecto implementa un sistema de autenticación JWT, un CRUD completo para productos (con carga masiva desde Excel) y un sistema de Control de Acceso Basado en Roles (RBAC).

La arquitectura sigue los principios SOLID (como el Principio de Responsabilidad Única) y DRY, utilizando un manejador de errores global y middlewares de validación. La API está desplegada, documentada con Swagger y probada con Jest (cubriendo caminos felices e infelices).

---

## 🚀 Demo en Vivo (Desplegado en Render)

Puedes probar la API en vivo ahora mismo:

- **URL Base:** `https://pos-lite-api.onrender.com`
- **Documentación Swagger (UI):** **`https://pos-lite-api.onrender.com/api-docs`**

**Nota sobre el archivo de prueba:**
Para probar el endpoint `POST /products/upload-catalog`, puedes usar el archivo de ejemplo incluido en el repositorio en la ruta: `/test_files/catalogo.xlsx`.

---

## 🔑 Credenciales de Prueba

La API tiene dos roles: `ADMIN` (puede hacer todo) y `CASHIER` (solo puede leer).

### Usuario Administrador (ADMIN)

Este usuario se crea mediante el script de "seed" y tiene todos los permisos (crear, actualizar, borrar, cargar catálogos).

- **Usuario:** `admin@poslite.com` (o el que hayas puesto en tu `.env`)
- **Password:** `supersecretpassword123` (o el que hayas puesto en tu `.env`)

### Usuario Cajero (CASHIER)

Cualquier usuario nuevo registrado a través de la API `POST /api/auth/register` recibirá automáticamente el rol `CASHIER`. Este usuario solo puede _leer_ datos (ej. `GET /products`), pero recibirá un error `403 Forbidden` si intenta crear o borrar.

- **Usuario de ejemplo:** `cajero@test.com`
- **Password:** `password123`

---

## 🛠️ Stack Tecnológico

- **Backend:** Node.js, Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** `class-validator`, `class-transformer` (usados en un middleware genérico)
- **Manejo de Archivos:** `multer`, `exceljs`
- **Pruebas:** Jest
- **Contenedores:** Docker
- **Documentación:** Swagger (con `swagger-ui-express`)
- **Despliegue:** Render

---

## 🖥️ Cómo Correr el Proyecto Localmente

### 1. Pre-requisitos

- Node.js (v18 o superior)
- npm
- Una base de datos PostgreSQL corriendo

### 2. Pasos de Instalación

1.  **Clonar el repositorio:**

    ```bash
    git clone [https://github.com/tu-usuario/pos-lite-api.git](https://github.com/tu-usuario/pos-lite-api.git)
    cd pos-lite-api
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz y llénalo con tus valores. (Usa `.env.example` como plantilla). **Debes** incluir las credenciales para tu base de datos y el `ADMIN`.

    ```env
    # APP
    PORT=3000

    # DATABASE (PostgreSQL)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=tu_password
    DB_NAME=pos_lite_db

    # JWT
    JWT_SECRET=un_secreto_muy_largo_y_dificil

    # ADMIN SEED
    ADMIN_EMAIL=admin@poslite.com
    ADMIN_PASSWORD=supersecretpassword123
    ```

4.  **Correr el "Seed" (Sembrado) de la BBDD:**
    Este comando creará tu usuario `ADMIN` en la base de datos. **Ejecútalo una sola vez.**

    ```bash
    npm run seed
    ```

5.  **Iniciar el servidor:**
    ```bash
    npm run dev
    ```

---

## ⚙️ Comandos Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo (con hot-reload).
- `npm run seed`: Ejecuta el script de sembrado para crear el usuario ADMIN.
- `npm test`: Corre todas las pruebas unitarias con Jest.
- `npm run build`: Compila el proyecto de TypeScript a JavaScript (`dist/`).
- `npm run start`: Inicia el servidor en modo producción (desde `dist/`).

---

## 🐳 Usando Docker

El proyecto incluye un `Dockerfile` optimizado (multi-etapa) para producción.

1.  **Construir la imagen:**

    ```bash
    docker build -t pos-lite-api .
    ```

2.  **Correr el contenedor:**
    (Asegúrate de pasar tu archivo `.env` para que el contenedor tenga las variables)
    ```bash
    docker run -p 3000:3000 --env-file .env pos-lite-api
    ```

---

## 💡 Mejoras Futuras y Casos Límite Identificados

Si bien la API es completamente funcional y cumple con los requisitos, durante las pruebas de casos límite se identificó una mejora de arquitectura clave:

- **Validación de Carga Masiva:** Actualmente, el endpoint `POST /products/upload-catalog` usa una validación de servicio simple. Una mejora futura sería refactorizar este endpoint para que valide cada fila del Excel contra el `CreateProductDto` usando `class-validator`. Esto centralizaría todas las reglas de negocio (ej. `@MaxLength`, `@Max`) y manejaría automáticamente casos como "stock flotante" o "barcodes demasiado cortos".
