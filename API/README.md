# GrowTech API

## Configuración

1. Copia `.env.example` como `.env`.
2. Configura `MONGODB_URI` y genera valores aleatorios independientes de al menos 32 caracteres para `API_KEY` y `JWT_SECRET`.
3. Instala las dependencias con `npm install` y ejecuta `npm start`.

El dispositivo sensor usa `POST /api/sensors` con `x-api-key`. La app crea o inicia sesión en `POST /api/auth/register` o `/api/auth/login`, guarda el token de sesión en almacenamiento seguro y consulta `GET /api/sensors/current` con un token Bearer. Las contraseñas se almacenan con bcrypt; los tokens de sesión vencen en una hora.

No publiques `.env` ni incluyas `API_KEY` o `JWT_SECRET` en la app móvil. Rota la clave que antes estaba incluida en el código de la app y configura el nuevo valor en el dispositivo sensor y en el servidor.
