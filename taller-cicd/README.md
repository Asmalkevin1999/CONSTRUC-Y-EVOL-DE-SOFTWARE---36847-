# Taller CI/CD - Sistema Bibliotecario

Proyecto del taller enfocado en el modelo de datos, PostgreSQL y el primer CRUD REST de Persona. Todo el proyecto está dentro de esta carpeta.

## Requisitos

- Git
- Node.js LTS y npm
- Docker Desktop con el motor Linux activo

## Base de datos

La base de datos se llama `biblioteca_db` y contiene el esquema PostgreSQL `biblioteca`, con las tablas `persona`, `usuario`, `rol` y `usuario_rol`.

Desde esta carpeta:

```powershell
Copy-Item .env.example .env
docker compose up -d
docker compose ps
```

En un volumen ya inicializado, carga el esquema versionado con:

```powershell
Get-Content .\database\01_schema.sql | docker compose exec -T postgres psql -U biblioteca -d biblioteca_db
```

PostgreSQL se publica en el puerto `5434`. No subas `.env` al repositorio y cambia `POSTGRES_PASSWORD` antes de usar el entorno fuera de una práctica local.

## Backend NestJS

```powershell
Set-Location .\backend
npm install
npm run start:dev
```

La configuración carga las variables de `taller-cicd/.env`. TypeORM usa el esquema `biblioteca` y mantiene `synchronize` desactivado; la definición SQL versionada es la fuente de verdad.

## CRUD de Persona

| Método | Ruta | Acción |
| --- | --- | --- |
| `POST` | `/persona` | Crear persona |
| `GET` | `/persona` | Listar personas |
| `GET` | `/persona/:id` | Consultar por UUID |
| `PATCH` | `/persona/:id` | Actualizar campos |
| `DELETE` | `/persona/:id` | Eliminar persona |

Ejemplo PowerShell:

```powershell
$persona = @{
  nombres = "Ana"
  apellidos = "Perez"
  identificacion = "PRUEBA-001"
  correo = "ana.prueba@example.com"
  telefono = "0991234567"
} | ConvertTo-Json

$creada = Invoke-RestMethod -Uri "http://localhost:3000/persona" -Method Post -ContentType "application/json" -Body $persona
Invoke-RestMethod -Uri "http://localhost:3000/persona" -Method Get

$cambio = @{ telefono = "0987654321" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/persona/$($creada.id_persona)" -Method Patch -ContentType "application/json" -Body $cambio
Invoke-RestMethod -Uri "http://localhost:3000/persona/$($creada.id_persona)" -Method Delete
```

La API devuelve `400` ante datos inválidos, `404` ante UUID inexistentes y `409` si la identificación ya está registrada.
