# ⚙️ Vite Environment Variables

## 🔑 Vigtigt: Vite vs Next.js

Din app bruger **Vite** (ikke Next.js), så environment variables har et andet prefix:

### ❌ Forkert (Next.js)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
```

### ✅ Korrekt (Vite)
```env
VITE_SANITY_PROJECT_ID=abc123
```

## 📝 Hvordan Virker Det?

### I Kode
Vite bruger `import.meta.env` i stedet for `process.env`:

```typescript
// ❌ Forkert (virker ikke i Vite)
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// ✅ Korrekt (Vite)
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
```

### Prefix Regler

**Vite:**
- Alle public variables skal starte med `VITE_`
- Kun `VITE_` prefix bliver exposed til browser
- Sikkerhed: Andre env vars er kun tilgængelige server-side

**Next.js:**
- Bruger `NEXT_PUBLIC_` prefix
- Samme sikkerhedsmodel

## 🛠️ Din Setup

### .env.local
Opret filen med:

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

### Vercel Environment Variables

Når du deployer til Vercel, tilføj samme variables:

| Name | Value |
|------|-------|
| `VITE_SANITY_PROJECT_ID` | `dit_sanity_project_id` |
| `VITE_SANITY_DATASET` | `production` |

**Vigtigt:** Husk at bruge `VITE_` prefix også i Vercel!

## 🔒 Sikkerhed

### Public Variables (VITE_ prefix)
- ✅ Synlige i browser
- ✅ OK til API endpoints, project IDs
- ❌ Aldrig API secrets eller passwords

### Private Variables (ingen prefix)
- ✅ Kun tilgængelige server-side
- ✅ Brug til secrets
- ❌ Bliver IKKE exposed til browser

## 📚 Eksempler

### Sanity Config (lib/sanity.ts)
```typescript
export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'YOUR_PROJECT_ID',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};
```

### Tilføj Flere Variables
Hvis du tilføjer flere Vite variables:

```env
# .env.local
VITE_SANITY_PROJECT_ID=abc123
VITE_SANITY_DATASET=production
VITE_API_URL=https://api.example.com
VITE_ENABLE_ANALYTICS=true
```

```typescript
// I din kode
const apiUrl = import.meta.env.VITE_API_URL;
const analytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
```

## ⚠️ TypeScript Types

Hvis du får TypeScript errors om `import.meta.env`, tilføj types:

```typescript
// vite-env.d.ts eller global.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string;
  readonly VITE_SANITY_DATASET: string;
  // tilføj flere her
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 🔄 Restart Server

Efter ændringer i `.env.local`:

```bash
# Stop server (Ctrl+C)
# Start igen
npm run dev
```

Environment variables bliver kun læst ved server start!

## ✅ Test Det Virker

```typescript
// I din browser console
console.log(import.meta.env.VITE_SANITY_PROJECT_ID);
// Skulle vise dit project ID

console.log(import.meta.env.VITE_SANITY_DATASET);
// Skulle vise "production"
```

Hvis det viser `undefined`, check:
1. Er `.env.local` i projekt root?
2. Bruger du `VITE_` prefix?
3. Har du restarted dev server?

## 📖 Mere Info

- [Vite Env Docs](https://vitejs.dev/guide/env-and-mode.html)
- [Environment Variables in Vercel](https://vercel.com/docs/projects/environment-variables)

---

**Husk:** `VITE_` prefix for public variables! 🚀
