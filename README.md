# NotaFácil

Sistema web para registrar las notas de un curso, calcular el promedio ponderado y conocer la situación de cada estudiante.

## Cómo ejecutarlo

```bash
cd notafacil
npm install
npm run dev     # aplicación en http://localhost:5173
npm test        # pruebas automatizadas (41)
```

## Metodología de trabajo

Trunk-Based Development: `main` es la rama estable y cada solicitud de cambio se desarrolla en una rama corta (`feature/` o `fix/`) que se integra mediante Pull Request.

## Acceso

Usuario de prueba: `docente` · Contraseña: `NotaFacil2026`

## Versiones

| Versión | Cambio | Tipo |
|---|---|---|
| v1.0.0 | Versión inicial (baseline) | — |
| v1.1.0 | CR-01: reglas académicas y validación centralizadas | MINOR |
| v2.0.0 | CR-02: persistencia desacoplada y pruebas automatizadas | MAJOR |
| v2.1.0 | CR-04: inicio de sesión del docente | MINOR |
| v2.1.1 | Corrección: servicio de autenticación y estilos que faltaron en v2.1.0 | PATCH |
| v2.1.2 | CR-05: validación del formato de código y del rango de notas | PATCH |

## Equipo

| Integrante | Aporte |
|---|---|
| Juan Carlos Marquina Luna (DrawRay) | Coordinación, versión inicial, diagnóstico, plan de mantenimiento y corrección v2.1.1 |
| Edwin Toribio (DarkLuis2099) | Implementación de CR-01, CR-02 y CR-05 (v2.1.2) |
| Lisbeth Bertrán (lisbethbertran) | Pruebas automatizadas de la CR-02 |
| quispeyovera02-eng | CR-04: inicio de sesión (v2.1.0) |
| AlexR11-26 | CR-03: corrección del redondeo (pendiente) |
