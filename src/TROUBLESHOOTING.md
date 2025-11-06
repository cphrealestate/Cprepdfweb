# 🔧 Troubleshooting Guide

## 🚨 Common Errors & Solutions

### Error: "Cannot read properties of undefined (reading 'VITE_SANITY_PROJECT_ID')"

**Problem:** Environment variables ikke konfigureret eller Vite kan ikke læse dem.

**Løsning:**

#### 1. Check at `.env.local` filen eksisterer
```bash
# I projekt root, check om filen findes
ls -la .env.local
```

Hvis filen ikke findes:
```bash
cp .env.local.example .env.local
```

#### 2. Verificer indhold af `.env.local`
Filen skal se sådan ud:
```env
VITE_SANITY_PROJECT_ID=your_actual_project_id_here
VITE_SANITY_DATASET=production
```

**Vigtigt:**
- ✅ Brug `VITE_` prefix (ikke `NEXT_PUBLIC_`)
- ✅ Ingen mellemrum omkring `=`
- ✅ Ingen citationstegn
- ✅ Erstat `your_actual_project_id_here` med dit rigtige Project ID

#### 3. Restart development server
Environment variables bliver kun læst ved server start:
```bash
# Stop server (Ctrl+C eller Cmd+C)
npm run dev
```

#### 4. Hvis stadig ikke virker - Fallback Mode
Appen vil automatisk bruge hardcoded test data hvis Sanity ikke er konfigureret. Du skulle se i console:
```
Sanity not configured - using fallback data
```

Dette er OK! Du kan stadig teste appen med demo data.

---

### Error: "process is not defined"

**Problem:** Bruger `process.env` i stedet for `import.meta.env`

**Løsning:** Dette skulle være fixed i `/lib/sanity.ts`. Hvis du stadig ser fejlen:

1. Check at `/lib/sanity.ts` bruger:
```typescript
import.meta.env.VITE_SANITY_PROJECT_ID  // ✅ Korrekt
// IKKE: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID  // ❌ Forkert
```

2. Tjek om du har brug for vite-env.d.ts:
```typescript
/// <reference types="vite/client" />
```

---

### Error: "Failed to fetch" eller CORS error

**Problem:** Sanity CORS ikke konfigureret til din URL.

**Løsning:**

#### For localhost (development)
1. Gå til [sanity.io/manage](https://sanity.io/manage)
2. Vælg dit projekt
3. Klik "API" → "CORS Origins"
4. Tilføj: `http://localhost:5173`
5. Gem

#### For production (Vercel)
Tilføj også din production URL:
- `https://din-app.vercel.app`

**Credentials:** Sæt til "No" (vi bruger public read)

---

### Data vises ikke efter Sanity setup

**Problem:** Ingen indhold i Sanity Studio.

**Løsning:**

#### 1. Verificer Sanity Studio
```bash
cd path/to/sanity-studio
npm run dev
```

Åbn [http://localhost:3333](http://localhost:3333)

#### 2. Check at du har oprettet content
Du skal have mindst:
- [ ] 1 Portfolio Settings dokument
- [ ] 1+ Regions
- [ ] 1+ Properties

Uden content returnerer API tomme arrays.

#### 3. Test query direkte
I Sanity Studio, brug Vision tool:
```groq
*[_type == "portfolioSettings"]
```

Hvis ingen resultater → ingen content oprettet endnu.

---

### Build fejler: "Cannot find module '@sanity/client'"

**Problem:** Dependencies ikke installeret.

**Løsning:**
```bash
npm install @sanity/client @sanity/image-url
```

Hvis det ikke virker:
```bash
# Slet node_modules og reinstaller
rm -rf node_modules package-lock.json
npm install
npm install @sanity/client @sanity/image-url
```

---

### TypeScript Error: "Property 'VITE_SANITY_PROJECT_ID' does not exist"

**Problem:** TypeScript kender ikke environment variable types.

**Løsning:**

Check at `/vite-env.d.ts` eksisterer med:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Restart IDE hvis nødvendigt.

---

### Billeder vises ikke

**Problem:** Manglende billeder i Sanity eller image URL builder fejler.

**Løsning:**

#### 1. Check Sanity images
I Sanity Studio, verificer at ejendomme har billeder uploaded.

#### 2. Fallback til Unsplash
Hvis ingen Sanity billeder, bruger appen automatisk Unsplash fallback via `ImageWithFallback` komponenten.

#### 3. Test image URL generation
I browser console:
```javascript
import { getImageUrl } from './lib/sanity';
console.log(getImageUrl(someImage));
```

---

### Environment Variables virker ikke i Vercel

**Problem:** Glemt at tilføje env vars i Vercel Dashboard.

**Løsning:**

1. Gå til Vercel Dashboard → dit projekt
2. Settings → Environment Variables
3. Tilføj:
   - `VITE_SANITY_PROJECT_ID` = `dit_project_id`
   - `VITE_SANITY_DATASET` = `production`
4. Vælg **alle** environments (Production, Preview, Development)
5. Gem
6. **Redeploy** din app (Deployments → ... → Redeploy)

**Vigtigt:** Vercel læser kun env vars ved build time. Du skal redeploy efter tilføjelse!

---

### "Invalid Project ID" fejl fra Sanity

**Problem:** Forkert Project ID eller typo.

**Løsning:**

#### 1. Find korrekt Project ID
1. Gå til [sanity.io/manage](https://sanity.io/manage)
2. Vælg dit projekt
3. Kopier "Project ID" (ikke "Organization ID"!)

#### 2. Verificer i `.env.local`
```env
VITE_SANITY_PROJECT_ID=abc123xyz  # Skal matche Project ID fra Sanity
```

#### 3. Double-check for typos
- Ingen mellemrum
- Correct case (Sanity IDs er case-sensitive)
- Correct antal karakterer

---

## 🔍 Debug Checklist

Hvis du oplever problemer, gennemgå denne checklist:

### Environment Setup
- [ ] `.env.local` eksisterer i projekt root
- [ ] Bruger `VITE_` prefix (ikke `NEXT_PUBLIC_`)
- [ ] Project ID er korrekt kopieret fra Sanity
- [ ] Development server er restarted efter .env ændringer

### Sanity Setup
- [ ] Sanity Studio kører og er tilgængelig
- [ ] Schemas er tilføjet til Studio
- [ ] Mindst 1 dokument er oprettet i hvert schema
- [ ] CORS er konfigureret for din URL

### Code Setup
- [ ] Dependencies er installeret (`@sanity/client`, `@sanity/image-url`)
- [ ] `/lib/sanity.ts` bruger `import.meta.env`
- [ ] `/vite-env.d.ts` eksisterer med types
- [ ] Ingen TypeScript errors i editoren

### Build & Deploy
- [ ] Lokal build succeeder (`npm run build`)
- [ ] Preview virker lokalt (`npm run preview`)
- [ ] Vercel env vars er sat korrekt
- [ ] App er redeployed efter env var ændringer

---

## 🆘 Still Stuck?

### Browser Console
Åbn browser DevTools (F12) og check:
- Console tab for fejlmeddelelser
- Network tab for API calls
- Application tab → Local Storage for cached data

### Sanity Logs
Log ind i Sanity Studio og check:
- Vision tool til at teste queries
- Console log for API errors

### Fallback Mode
Hvis alt andet fejler, kører appen i fallback mode med hardcoded data. Check console for:
```
Sanity not configured - using fallback data
```

Dette betyder appen virker, men uden Sanity connection.

---

## 📚 Relaterede Guides

- [VITE_ENV_VARS.md](./VITE_ENV_VARS.md) - Environment variables i Vite
- [SANITY_SETUP.md](./SANITY_SETUP.md) - Komplet Sanity setup
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deploy guide

---

## 💡 Pro Tips

1. **Use Console Logs:** Check browser console - mange fejl vises kun der
2. **Test Incrementally:** Test hver del separat (env vars → Sanity → deploy)
3. **Check Fallback:** Hvis appen virker med hardcoded data, er problemet i Sanity connection
4. **Vision Tool:** Brug Sanity Vision til at teste queries før du bruger dem i kode

---

**Hjælp stadig nødvendig?** Check [Sanity Documentation](https://www.sanity.io/docs) eller [Vite Guide](https://vitejs.dev/guide/).
