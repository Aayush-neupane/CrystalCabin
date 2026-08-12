# Crystal Cabin Detailing

A backend and frontend site for a Canadian mobile car detailing shop.

## Stack

- **Frontend**: React 19, TypeScript, Vite, Framer Motion, GSAP
- **Backend**: Express + Nodemailer (deployed as a Netlify serverless function)

## Development

```bash
# frontend (port 5173)
npm run dev

# backend (port 3001)
npm run dev --prefix server
```

## Deployment

Netlify handles both frontend and backend:

- Static site builds from `dist/` (see `netlify.toml`)
- The Express API runs as the serverless function `server/netlify/functions/api.ts`
- `/api/*` requests are redirected to the function; `/*` is an SPA fallback

Required env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `ADMIN_EMAIL`, `FRONTEND_URL`.