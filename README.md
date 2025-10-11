## Portal de la Secretaría General – Gestión de Títulos

Aplicación web construida con [Next.js](https://nextjs.org), TypeScript y Tailwind CSS para centralizar la gestión de solicitudes de títulos universitarios y trámites de egresados. La interfaz replica la estructura institucional descrita en `Context/copy.md`.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo con Turbopack.
- `npm run build`: genera el build de producción.
- `npm run start`: sirve el build de producción.
- `npm run lint`: ejecuta ESLint con la configuración de Next.js.

## Requisitos previos

- Node.js 18 o superior.
- npm (incluido con Node.js).

## Variables de entorno

- `NEXTAUTH_SECRET`: clave secreta utilizada para firmar y cifrar los tokens de sesión. Para desarrollo puedes definir un valor cualquiera en `.env.local`, por ejemplo:
  ```bash
  NEXTAUTH_SECRET=development-secret
  ```
  En entornos productivos genera un valor seguro (por ejemplo con `openssl rand -hex 32`).

## Cómo ejecutar el proyecto

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Estructura relevante

- `src/app/page.tsx`: vista principal del portal.
- `src/app/layout.tsx`: metadata y layout raíz.
- `src/app/globals.css`: estilos globales y variables de color.

## Próximos pasos sugeridos

- Integrar autenticación real (por ejemplo, NextAuth o proveedor institucional SSO).
- Conectar los componentes con APIs de gestión de títulos y egresados.
- Incorporar pruebas unitarias y de integración.

