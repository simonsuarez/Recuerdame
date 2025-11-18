# Recuérdame — API Backend

Backend del proyecto **Recuérdame**, una aplicación simple para gestionar recordatorios.  
Construida con **.NET (Minimal APIs)**, **PostgreSQL** y **Entity Framework Core**.  
Desarrollado y estructurado en **VS Code**, separado del frontend.

---

## 🚀 Tecnologías utilizadas
- .NET (Minimal APIs)
- Entity Framework Core
- PostgreSQL + Npgsql
- C#
- VS Code

---

## 📌 Funcionalidades del Backend
- Endpoint de sanity para verificar estado:  
  `GET /` → *"API Recuerdame OK"*
- CRUD completo de recordatorios:
  - **GET /api/recordatorios** → lista de recordatorios  
  - **GET /api/recordatorios/{id}** → obtener uno  
  - **POST /api/recordatorios** → crear  
  - **PUT /api/recordatorios/{id}** → actualizar  
  - **DELETE /api/recordatorios/{id}** → eliminar  
- CORS habilitado para que el frontend pueda consumir la API sin restricciones.

---

## 📂 Estructura simple del proyecto

--backend
--frontend