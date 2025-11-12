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
  // 1. Definición de Seguridad (JWT)
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT (ey...)'
      },
    },
    // 2. Definición de Schemas (DTOs)
    schemas: {
      CreateProductDto: {
        type: 'object',
        required: ['name', 'price', 'stock', 'barcode'],
        properties: {
          name: { type: 'string' },
          price: { type: 'number', format: 'float' },
          stock: { type: 'integer' },
          barcode: { type: 'string' },
          category: { type: 'string' },
        },
      },
      UpdateProductDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: { type: 'number', format: 'float' },
          stock: { type: 'integer' },
          barcode: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  },
  // 3. Definición de Tags (Categorías)
  tags: [
    { name: 'Auth', description: 'Autenticación y registro' },
    { name: 'Profile', description: 'Gestión del perfil del usuario' },
    { name: 'Products', description: 'Gestión de productos' },
  ],
  // 4. Definición de Paths (Endpoints)
  paths: {
    // --- AUTH ---
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registra un nuevo usuario',
        security: [], // Endpoint público
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } } },
        },
        responses: {
          '201': { description: 'Usuario creado' },
          '400': { description: 'Error de validación' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Inicia sesión y obtiene un token JWT',
        security: [], // Endpoint público
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } } },
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
        security: [{ bearerAuth: [] }], // Endpoint protegido
        responses: {
          '200': { description: 'Perfil del usuario' },
          '401': { description: 'No autorizado' },
        },
      },
      put: {
        tags: ['Profile'],
        summary: 'Actualiza el perfil del usuario autenticado',
        security: [{ bearerAuth: [] }], // Endpoint protegido
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } },
        },
        responses: {
          '200': { description: 'Perfil actualizado' },
          '401': { description: 'No autorizado' },
        },
      },
    },
    // --- PRODUCTS ---
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Lista todos los productos (con filtros)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer' } },
          { in: 'query', name: 'limit', schema: { type: 'integer' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Lista de productos' } },
      },
      post: {
        tags: ['Products'],
        summary: 'Crea un nuevo producto',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProductDto' } } },
        },
        responses: {
          '201': { description: 'Producto creado' },
          '400': { description: 'Error de validación' },
        },
      },
    },
    '/products/upload-catalog': {
      post: {
        tags: ['Products'],
        summary: 'Carga un catálogo de productos .xlsx',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } },
        },
        responses: {
          '200': { description: 'Resumen de la carga' },
          '400': { description: 'Archivo no válido' },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Obtiene un producto por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Detalles del producto' }, '404': { description: 'Producto no encontrado' } },
      },
      put: {
        tags: ['Products'],
        summary: 'Actualiza un producto por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProductDto' } } },
        },
        responses: { '200': { description: 'Producto actualizado' }, '404': { description: 'Producto no encontrado' } },
      },
      delete: {
        tags: ['Products'],
        summary: 'Elimina un producto por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Producto eliminado' }, '404': { description: 'Producto no encontrado' } },
      },
    },
  },
};