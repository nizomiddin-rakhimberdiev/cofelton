# Cofelton — Deploy qilish

Bepul hosting uchun **Vercel** yoki **Netlify** ishlatishingiz mumkin.

---

## 1. Vercel (tavsiya etiladi)

### GitHub orqali

1. Loyihani GitHub ga yuklang:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/cofelton.git
   git push -u origin main
   ```

2. [vercel.com](https://vercel.com) ga kiring
3. **Add New Project** → GitHub reponi tanlang
4. **Deploy** bosing (sozlamalar avtomatik)

### Vercel CLI orqali

```bash
npm i -g vercel
vercel
```

---

## 2. Netlify

### Drag & Drop

1. `npm run build` bajaring
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Deploy manually**
3. `dist` papkasini tortib tashlang

### GitHub orqali

1. Loyihani GitHub ga yuklang
2. Netlify → **Add new site** → **Import from Git**
3. Reponi tanlang, **Deploy** bosing

---

## 3. Environment variables (Telegram)

Deploy qilishdan oldin **Environment Variables** ga qo‘shing:

| Key | Value |
|-----|-------|
| `VITE_TELEGRAM_BOT_TOKEN` | Bot token |
| `VITE_TELEGRAM_CHAT_ID` | Chat ID yoki bir nechta: `726130790, 5664135803` |

**Vercel:** Project Settings → Environment Variables  
**Netlify:** Site settings → Build & deploy → Environment variables

---

## 4. Custom domain (ixtiyoriy)

- **Vercel:** Project Settings → Domains
- **Netlify:** Domain settings → Add custom domain
