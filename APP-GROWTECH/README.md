# GrowTech app

## Backend connection

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the reachable base URL of the API (for example, `http://192.168.x.x:3000` on the same Wi-Fi). Restart Expo after changing the environment file.

Users can register or sign in in the app. On iOS and Android, the session token is stored with Expo SecureStore; in the browser it is kept in memory and is cleared on reload. Do not place the sensor `API_KEY` or the backend `JWT_SECRET` in the app; only the sensor device uses the API key.
