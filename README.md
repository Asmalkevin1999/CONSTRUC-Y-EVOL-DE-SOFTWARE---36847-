# Taller CI/CD - Sistema Bibliotecario

Proyecto del taller enfocado en el modelo de datos y PostgreSQL. Este repositorio contiene el esquema SQL y la configuración de Docker; no incluye el backend.

## Ramas

- `master`: commit inicial del repositorio.
- `pruebas`: rama para actividades de pruebas.
- `desarrollo`: esquema de datos y configuración de PostgreSQL.

## Requisitos

- Git
- Docker Desktop con el motor Linux activo

## Base de datos

La base de datos se llama `biblioteca_db` y contiene el esquema PostgreSQL `biblioteca`, con estas tablas:

- `persona`
- `usuario`
- `rol`
- `usuario_rol`

`database/01_schema.sql` contiene únicamente la definición del esquema y las tablas, sin datos de ejemplo.

Desde la raíz del repositorio:

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

La carpeta `taller-cicd/` contiene una copia de los archivos del taller, sin backend ni metadatos Git.
