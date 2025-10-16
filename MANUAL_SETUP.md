# הקמת הפרויקט ידנית - צעד אחר צעד

אם יש בעיה עם הורדת הקובץ, תוכל ליצור את הפרויקט ידנית:

## 1. צור תיקיה חדשה
```bash
mkdir bank-discount-chatbot
cd bank-discount-chatbot
```

## 2. צור את מבנה התיקיות
```bash
mkdir src
mkdir public
mkdir public/static
```

## 3. צור את הקבצים הבסיסיים

### package.json
```json
{
  "name": "bank-discount-chatbot",
  "version": "1.0.0",
  "description": "צ'אטבוט פנים-ארגוני לבנק דיסקונט עם תגובות מותאמות אישית",
  "type": "module",
  "keywords": ["chatbot", "hono", "cloudflare", "typescript", "hebrew"],
  "author": "בנק דיסקונט",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "wrangler pages dev dist --port 8788",
    "start": "npm run build && npm run preview",
    "deploy": "npm run build && wrangler pages deploy dist",
    "test": "curl -s http://localhost:8788 | grep -o 'צ.*בוט' | head -1",
    "clean": "rm -rf dist .wrangler node_modules",
    "setup": "npm install && npm run build",
    "cf-typegen": "wrangler types --env-interface CloudflareBindings"
  },
  "dependencies": {
    "hono": "^4.9.9"
  },
  "devDependencies": {
    "@hono/vite-build": "^1.2.0",
    "@hono/vite-dev-server": "^0.18.2",
    "vite": "^6.3.5",
    "wrangler": "^4.4.0"
  }
}
```

### vite.config.ts
```typescript
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx'
    }),
    build({
      entry: 'src/index.tsx'
    })
  ]
})
```

### wrangler.jsonc
```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "bank-discount-chatbot",
  "compatibility_date": "2024-10-01",
  "pages_build_output_dir": "./dist"
}
```

## 4. התקנה והרצה
```bash
npm install
npm run build
npm run start
```

## 5. פתח בדפדפן
http://localhost:8788

---

**הערה:** הקבצים הנוספים (src/index.tsx, renderer.tsx, קבצי CSS ו-JS) יסופקו בהודעות נפרדות.