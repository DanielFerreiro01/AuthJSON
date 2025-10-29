# 🧩 AuthJSON

**AuthJSON** es una herramienta inspirada en [`json-server`] que permite generar una API REST completa a partir de un archivo `db.json`.  
Además de simular un backend real para desarrollo frontend, incluye funcionalidades avanzadas como:

- Autenticación mediante JWT.
- Manejo de usuarios y roles.
- Control de acceso a rutas mediante permisos.
- Paginación de resultados.

El objetivo es ofrecer una solución simple para desarrollar aplicaciones con backend simulado o para proyectos pequeños/MVPs.

---

## 🚀 Características principales

- 📦 **Generación automática de endpoints** según las colecciones definidas en `db.json`.
- 🔒 **Rutas protegidas por roles** (`admin`, `user`, etc.).
- 👤 **Gestión de usuarios** con registro e inicio de sesión.
- 📃 **Soporte para paginación** en todas las colecciones.
- ⚙️ **Configuración flexible** mediante código.
- 🗂️ **Diseño inspirado en arquitectura limpia**.

---

## 🗂️ Estructura de `db.json`

El archivo `db.json` define las colecciones, los datos iniciales y los permisos de cada colección.  
Ejemplo de estructura:

```json
{
  "collections": {
    "users": {
      "data": [
        {
          "id": "1761430895867",
          "email": "user@example.com",
          "password": "$2b$10$hash1",
          "role": "admin"
        },
        {
          "id": "1761430943316",
          "email": "user2@example.com",
          "password": "$2b$10$hash2",
          "role": "user"
        }
      ],
      "permissions": {
        "GET": ["admin"],
        "POST": ["admin"],
        "PUT": ["admin"],
        "DELETE": ["admin"]
      }
    },
    "products": {
      "data": [
        { "id": "101", "name": "Remera básica", "price": 12000, "stock": 30 },
        { "id": "102", "name": "Campera deportiva", "price": 45000, "stock": 10 }
      ],
      "permissions": {
        "GET": ["user", "admin"],
        "POST": ["admin"],
        "PUT": ["admin"],
        "DELETE": ["admin"]
      }
    }
  }
}
