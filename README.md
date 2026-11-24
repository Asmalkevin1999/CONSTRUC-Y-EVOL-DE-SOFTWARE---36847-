# Sistema Bibliotecario

Implementación del taller «Modelo de datos al primer CRUD REST»: esquema relacional preliminar, PostgreSQL 17 en Docker y API NestJS para administrar personas.

## Ramas

- `master`: commit inicial del repositorio.
- `pruebas`: rama creada para las actividades de pruebas.
- `desarrollo`: implementación del esquema, la base de datos y el CRUD de Persona.

## Requisitos

- Git
- Node.js LTS y npm
- Docker Desktop con el motor Linux activo

## Iniciar PostgreSQL

Desde la raíz del repositorio, crea tu archivo local de variables y levanta la base:

```powershell
Copy-Item .env.example .env
docker compose up -d
docker compose ps
```

La primera inicialización del volumen ejecuta `database/01_schema.sql`, que crea `persona`, `usuario`, `rol` y `usuario_rol`. Para cargar el esquema en un volumen PostgreSQL existente:

```powershell
Get-Content .\database\01_schema.sql | docker compose exec -T postgres psql -U biblioteca -d biblioteca_db
```

No subas `.env` al repositorio. Cambia `POSTGRES_PASSWORD` antes de usar el entorno fuera de una práctica local.

## Iniciar la API

```powershell
Set-Location .\backend
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000`; PostgreSQL se publica en el puerto `5434`. La configuración de TypeORM mantiene `synchronize` desactivado para que el esquema versionado sea la fuente de verdad.

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

El API valida los campos y devuelve `400` ante datos inválidos, `404` ante UUID inexistentes y `409` si la identificación ya está registrada.

## Validación local

Desde `backend`:

```powershell
npm run build
npm test -- --runInBand
```
