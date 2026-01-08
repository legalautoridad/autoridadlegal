# Autoridad Legal

Autoridad Legal es una plataforma diseñada para gestionar casos legales, conectar abogados con clientes y administrar transacciones financieras relacionadas con servicios jurídicos.

## Características

- **Gestión de Casos**: Administración completa del ciclo de vida de los casos legales.
- **Dashboard de Abogados**: Interfaz dedicada para que los abogados gestionen sus casos y finanzas.
- **Sistema Financiero**: Monedero prepago, historial de transacciones y asignación automática de casos basada en saldo.
- **Integración con IA**: Uso de Google Vertex AI para análisis de casos y generación de resúmenes.

## Tecnologías

- **Framework**: [Next.js](https://nextjs.org)
- **Base de Datos**: [Supabase](https://supabase.com) (PostgreSQL)
- **Estilos**: Tailwind CSS
- **IA**: Google Vertex AI (Gemini)
- **Pagos**: Integración con Stripe (prevista/en desarrollo)

## Configuración del Entorno

Para ejecutar este proyecto localmente, necesitarás configurar las variables de entorno. 
Copia el archivo `.env.local.example` a `.env.local` y rellena los valores necesarios:

```bash
cp .env.local.example .env.local
```

### Variables Requeridas

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Google Vertex AI**: Credenciales y configuración del proyecto.
- **Otros**: `NEXT_PUBLIC_APP_URL`

## Desarrollo Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

Este proyecto está optimizado para ser desplegado en [Vercel](https://vercel.com).

1. Importa el proyecto en Vercel.
2. Configura las variables de entorno en el panel de Vercel (mismas que en `.env.local`).
3. Despliega.

---
© 2026 Autoridad Legal. Todos los derechos reservados.
