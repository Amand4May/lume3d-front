# Lume 3D — Frontend (React)

SPA React + Vite. Deploy no **Vercel**.

## Deploy no Vercel

1. Conecte este repositório no Vercel: **New Project**
2. Framework preset: **Vite** (detectado automaticamente)
3. Adicione a variável de ambiente:
   - **Nome:** `VITE_API_URL`
   - **Valor:** URL do backend no Render (ex: `https://lume3d-api.onrender.com`)
4. Deploy

> O `vercel.json` já configura o roteamento SPA automaticamente.

## Desenvolvimento local

```bash
cp .env.example .env.local
# Edite .env.local e descomente: VITE_API_URL=http://localhost:8000
npm install
npm run dev   # porta 8080 — o proxy redireciona /api para localhost:8000
```

O backend precisa estar rodando na porta 8000 para o dev local funcionar.
