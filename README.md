# WebIOT

Sitio web de [IOT in Motion](https://iotinmotion.com.ar) — Next.js 14, Tailwind CSS, TypeScript.

## Requisitos

- Node.js 18+
- npm

## Levantar localmente

1. **Clonar el repositorio**

   ```bash
   git clone <repo-url>
   cd WebIOT
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```env
   MONGODB_URI=

   ADMIN_PASSWORD=

   SMTP_HOST=
   SMTP_PORT=
   SMTP_TLS=
   SMTP_USER=
   SMTP_PASS=
   MAIL_FROM=
   MAIL_TO=
   MAIL_REPLY_TO=

   PUBLIC_BASE_URL=http://localhost:3000
   ```

   Pedirle los valores reales al equipo.

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   El sitio queda disponible en [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el build de producción |
| `npm run lint` | Ejecuta ESLint |

## Producción (server propio)

https://iotinmotion.com.ar

Corre en el server de IOT in Motion (AWS EC2): Next.js en el puerto 3000, bajo PM2 (proceso `web`, en `~/WebIOT`), con nginx adelante para el HTTPS. Las variables de entorno están en `~/WebIOT/.env.local`, solo en el server.

### Deploy

1. Commit y push a `main` (y `dev`, que se mantiene igual).
2. En el server:

   ```bash
   ~/WebIOT/deploy.sh
   ```

El script hace `git pull` y, si cambió algo de la web, corre `npm install` (solo si cambiaron dependencias), compila y reinicia `web`. Al final chequea que el sitio responda. Si cambiaron solo archivos de documentación, no hace nada. Con `--all` recompila y reinicia igual. Si el build falla, no reinicia.

Para reiniciar no usa `pm2 restart` sino `pm2 stop`, mata cualquier `next-server` que haya quedado colgado y después `pm2 start`. Si queda un `next-server` huérfano ocupando el puerto 3000, el proceso nuevo choca con él y entra en un loop de reinicios.

### Si hay que hacerlo a mano

```bash
cd ~/WebIOT && git pull && npm run build && pm2 stop web && pkill -f next-server; pm2 start web
```

Cuidados:

- **`npm install`, nunca `npm ci`**, y **un build por vez**: el server tiene poca RAM y `next build` es el build más pesado de todos.
- Mientras corre el build, la web puede fallar por un momento, porque Next reescribe la carpeta `.next` que está sirviendo. Pasa lo mismo que en el deploy manual de siempre: conviene deployar en horario tranquilo.
