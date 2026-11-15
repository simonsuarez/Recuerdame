# Recuérdame

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

## Desarrollo local con Docker

Necesitas Docker Desktop con Docker Compose, VS Code con la extensión **Dev Containers** y un navegador. El SDK de .NET 8, PostgreSQL y Nginx se ejecutan en contenedores. Visual Studio Code instala C# Dev Kit dentro del Dev Container.

### Primera vez

1. Desde la raíz del repositorio, crea un archivo `.env` junto a `compose.yml`:

   ```dotenv
   POSTGRES_USER='recuerdame_local'
   POSTGRES_PASSWORD='cambia-este-valor'
   ```

   Usa una contraseña propia. Git ignora `.env`. PostgreSQL usa estas credenciales al inicializar un volumen vacío.

2. Valida la configuración y levanta PostgreSQL:

   ```bash
   docker compose config --quiet
   docker compose up -d db-recuerdame
   docker compose logs -f db-recuerdame
   ```

   Cuando PostgreSQL esté listo para aceptar conexiones y siga corriendo, pulsa **Ctrl+C** para salir de los logs.

3. Aplica las migraciones desde un contenedor temporal. Usa este mismo comando cuando haya migraciones pendientes:

   ```bash
   docker compose run --rm backend sh -c \
     'dotnet tool install dotnet-ef --version 8.0.8 --tool-path /tmp/ef &&
      /tmp/ef/dotnet-ef database update --project backend.csproj'
   ```

   Cuando termine con `Done.`, puedes arrancar la aplicación en cualquiera de los modos siguientes.

### Usar la aplicación sin depurar

Desde la raíz, ejecuta `docker compose up -d` y abre [el frontend](http://localhost:5500/). Compose levanta los tres servicios y el backend inicia la [API](http://localhost:5175/api/recordatorios) automáticamente. Para detenerlos y conservar la base de datos, usa `docker compose stop`.

### Depurar C# en VS Code

1. Abre la raíz del repositorio en VS Code. En la paleta de comandos, ejecuta **Dev Containers: Reopen in Container**. Dev Containers combina `compose.yml` y `.devcontainer/compose.debug.yml`. El contenedor del backend queda activo con `sleep infinity`, listo para iniciar la API desde el editor.
2. Pon un breakpoint en `Program.cs`. En **Debug: Select and Start Debugging**, elige el perfil **Docker Debug**. Una vez seleccionado, usa **F5** para compilar y arrancar la API dentro del contenedor. Escucha en el puerto `8080` del contenedor y se accede desde el Mac por `localhost:5175`.
3. Para probar cambios en C#, guarda y usa **Shift+F5 → F5**. Si al abrir Dev Containers se reutilizó el backend que Compose ya había arrancado con `dotnet run`, ejecuta **Dev Containers: Rebuild Container** antes de depurar.

Para volver al modo sin depurador, detén la sesión con **Shift+F5**, ejecuta **Dev Containers: Reopen Folder Locally** y levanta la aplicación con `docker compose up -d` desde la raíz.

### Editar y depurar el frontend

Abre la raíz del repo en una ventana local de VS Code para editar `frontend/`. Nginx sirve los archivos montados desde esa carpeta, así que basta con guardar y recargar [la página de recordatorios](http://localhost:5500/recordatorios.html). Si el navegador reutiliza una copia en caché, en Chrome puedes usar **Command+Shift+R**.

En Chrome DevTools, usa **Sources → app.js** para poner breakpoints y **Network → Fetch/XHR** para revisar el estado HTTP y la respuesta de la API.
