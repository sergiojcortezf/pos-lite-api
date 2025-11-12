import swaggerUi from 'swagger-ui-express';

export const swaggerSpec: swaggerUi.JsonObject = {
  openapi: '3.0.0',
  info: {
    title: 'API POS-Lite',
    version: '1.0.0',
    description: 'Documentación de la API para el sistema POS-Lite, creada para la prueba técnica.',
    contact: {
      name: 'Sergio Cortez',
      email: 'sergiojcortezf@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor Local',
    },
    {
      url: 'https://pos-lite-api.onrender.com/api',
      description: 'Servidor de Producción (Render)',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT (ey...)'
      },
    },
    schemas: {
      CreateProductDto: {
        type: 'object',
        required: ['name', 'price', 'stock', 'barcode'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 255, example: 'Gansito' },
          price: { type: 'number', format: 'float', minimum: 0, maximum: 9999, example: 25.50 },
          stock: { type: 'integer', minimum: 0, maximum: 1000, example: 100 },
          barcode: { type: 'string', minLength: 8, maxLength: 50, example: '7501000100018' },
          category: { type: 'string', minLength: 3, maxLength: 100, example: 'Pastelitos' },
        },
      },
      UpdateProductDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 255, example: 'Gansito Marinela' },
          price: { type: 'number', format: 'float', minimum: 0, maximum: 9999, example: 26.00 },
          stock: { type: 'integer', minimum: 0, maximum: 1000, example: 150 },
          barcode: { type: 'string', minLength: 8, maxLength: 50, example: '7501000100018' },
          category: { type: 'string', minLength: 3, maxLength: 100, example: 'Postres' },
        },
      },
      RegisterUserDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 30, example: 'Sergio Cajero' },
          email: { type: 'string', format: 'email', maxLength: 40, example: 'cajero@test.com' },
          password: { type: 'string', minLength: 6, maxLength: 100, example: 'password123' },
        },
      },
      LoginUserDto: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', maxLength: 40, example: 'cajero@test.com' },
          password: { type: 'string', minLength: 6, maxLength: 100, example: 'password123' },
        },
      },
      UpdateProfileDto: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 30, example: 'Sergio Cortez F.' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Autenticación y registro' },
    { name: 'Profile', description: 'Gestión del perfil del usuario' },
    { name: 'Products', description: 'Gestión de productos' },
  ],
  paths: {
    // --- AUTH ---
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra un nuevo usuario (rol: CASHIER)',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'Sergio Cajero' }, email: { type: 'string', example: 'cajero@test.com' }, password: { type: 'string', example: 'password123' } } } } },
        },
        responses: {
          '201': { description: 'Usuario creado' },
          '400': { description: 'Error de validación o email ya en uso' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Inicia sesión y obtiene un token JWT',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'cajero@test.com' }, password: { type: 'string', example: 'password123' } } } } },
        },
        responses: {
          '200': { description: 'Login exitoso' },
          '401': { description: 'Credenciales inválidas' },
        },
      },
    },
    // --- PROFILE ---
    '/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Obtiene el perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Perfil del usuario' },
          '401': { description: 'No autorizado (token inválido o no provisto)' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
      put: {
        tags: ['Profile'],
        summary: 'Actualiza el perfil del usuario autenticado',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'Sergio Cortez F.' } } } } },
        },
        responses: {
          '200': { description: 'Perfil actualizado' },
          '400': { description: 'Error de validación (ej. nombre muy corto)' },
          '401': { description: 'No autorizado' },
          '404': { description: 'Usuario no encontrado' },
        },
      },
    },
    // --- PRODUCTS ---
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Lista todos los productos (permiso: TODOS)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
        ],
        responses: { 
          '200': { description: 'Lista de productos' },
          '401': { description: 'No autorizado' },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Crea un nuevo producto (permiso: ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductDto' } } },
        },
        responses: {
          '201': { description: 'Producto creado' },
          '400': { description: 'Error de validación (ej. barcode duplicado o < 8 caracteres)' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado (no eres ADMIN)' },
        },
      },
    },
    '/products/upload-catalog': {
      post: {
        tags: ['Products'],
        summary: 'Carga un catálogo de productos .xlsx (permiso: ADMIN)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } },
        },
        responses: {
          '200': { description: 'Resumen de la carga' },
          '400': { description: 'Archivo no válido (solo .xlsx) o datos incorrectos' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado (no eres ADMIN)' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtiene un producto por ID (permiso: TODOS)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 
          '200': { description: 'Detalles del producto' },
          '400': { description: 'ID con formato inválido' },
          '401': { description: 'No autorizado' },
          '404': { description: 'Producto no encontrado' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Actualiza un producto por ID (permiso: ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProductDto' } } },
        },
        responses: { 
          '200': { description: 'Producto actualizado' },
          '400': { description: 'ID con formato inválido o error de validación' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado (no eres ADMIN)' },
          '404': { description: 'Producto no encontrado' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Elimina un producto por ID (permiso: ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 
          '200': { description: 'Producto eliminado' },
          '400': { description: 'ID con formato inválido' },
          '401': { description: 'No autorizado' },
          '403': { description: 'Acceso denegado (no eres ADMIN)' },
          '404': { description: 'Producto no encontrado' },
        },
      },
    },
  },
};