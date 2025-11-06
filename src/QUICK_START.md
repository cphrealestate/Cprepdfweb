# 🚀 Quick Start: Sanity Integration

## TL;DR - Kom i Gang på 10 Minutter

### 1. Install Dependencies
```bash
npm install @sanity/client @sanity/image-url
```

### 2. Setup Environment Variables
```bash
# Kopier example filen
cp .env.local.example .env.local

# Rediger .env.local og tilføj dit Sanity Project ID
# Find det på: https://sanity.io/manage
```

### 3. Tilføj Schemas til Sanity Studio

Kopier alle filer fra `/sanity/schemas/` til dit Sanity Studio projekt:

```
Din-Sanity-Studio/
  schemas/
    portfolioSettings.ts    ← Kopier fra /sanity/schemas/
    region.ts               ← Kopier fra /sanity/schemas/
    property.ts             ← Kopier fra /sanity/schemas/
    capexProject.ts         ← Kopier fra /sanity/schemas/
    index.ts                ← Kopier fra /sanity/schemas/
```

### 4. Opdater Sanity Config

I dit Sanity Studio projekt, rediger `sanity.config.ts`:

```typescript
import { schemaTypes } from './schemas'

export default defineConfig({
  // ... existing config
  schema: {
    types: schemaTypes,
  },
})
```

### 5. Start Sanity Studio

```bash
cd path/to/sanity-studio
npm run dev
```

Åbn [http://localhost:3333](http://localhost:3333)

### 6. Opret Din Første Content

**Portfolio Indstillinger** (1 dokument):
- Titel: Copenhagen Real Estate
- Beskrivelse: En omfattende oversigt over vores ejendomsinvesteringer i Danmark
- Antal Ejendomme: 15
- Osv.

**Regioner** (6 dokumenter):
Se listen i `/data/portfolio.ts`

**Ejendomme**: 
Start med at oprette 2-3 test ejendomme

### 7. Test Integration

```bash
# I din React app
npm run dev
```

Åbn appen - den skulle nu vise Sanity data! 🎉

## 📚 Næste Skridt

- Læs den fulde guide: [SANITY_SETUP.md](./SANITY_SETUP.md)
- Import eksisterende data med migration script
- Upload billeder i Sanity Studio

## 🆘 Hjælp

**CORS Error?**
- Gå til sanity.io/manage → Dit projekt → API → CORS Origins
- Tilføj `http://localhost:5173` og din production URL

**Ingen data vises?**
- Check browser console for errors
- Verificer at `.env.local` har korrekt Project ID
- Sørg for at du har oprettet mindst 1 dokument i Sanity Studio
