# API POS-Lite (Prueba Técnica)

API RESTful desarrollada en Node.js y TypeScript como solución a la prueba técnica de "Backend Developer". El proyecto implementa un sistema de autenticación JWT y un CRUD completo para la gestión de productos, incluyendo la carga masiva de catálogos mediante archivos Excel.

La API está desplegada, documentada con Swagger y probada con Jest.

---

## 🚀 Demo en Vivo (Desplegado en Render)

Puedes probar la API en vivo ahora mismo:

- **URL Base:** `https://pos-lite-api.onrender.com`
- **Documentación Swagger (UI):** **`https://pos-lite-api.onrender.com/api-docs`**

### Credenciales de Prueba

Para probar los endpoints protegidos, primero regístrate o usa las siguientes credenciales de prueba en el endpoint `POST /api/auth/login`:

- **Usuario:** `sergio.test.prod@correo.com`
- **Password:** `password123`

_(Puedes usar el botón "Authorize" en la UI de Swagger para pegar el token que obtengas)._

---

## 🛠️ Stack Tecnológico

- **Backend:** Node.js, Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT (JSON Web Tokens)
- **Validación:** `class-validator`, `class-transformer`
- **Manejo de Archivos:** `multer` (para la subida), `exceljs` (para leer .xlsx)
- **Pruebas:** Jest
- **Contenedores:** Docker
- **Documentación:** Swagger (con `swagger-ui-express`)
- **Despliegue:** Render

---

## 🖥️ Cómo Correr el Proyecto Localmente

### 1. Pre-requisitos

- Node.js (v18 o superior)
- npm
- Una base de datos PostgreSQL corriendo (localmente o en la nube)

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
    Crea un archivo `.env` en la raíz del proyecto y copia el contenido de `.env.example` (o usa este). **Debes llenar estos valores con tu propia base de datos y un secreto JWT.**

    ```env
    # APP
    PORT=3000

    # DATABASE (PostgreSQL)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=tu_password_de_postgres
    DB_NAME=pos_lite_db

    # JWT
    JWT_SECRET=un_secreto_muy_largo_y_dificil_de_adivinar
    ```

---

## ⚙️ Comandos Disponibles

- **Correr en modo desarrollo (con hot-reload):**

  ```bash
  npm run dev
  ```

  (La API estará disponible en `http://localhost:3000`)

- **Correr pruebas unitarias:**

  ```bash
  npm test
  ```

- **Compilar para producción:**

  ```bash
  npm run build
  ```

- **Correr en modo producción:**
  ```bash
  npm run start
  ```

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
