# Sanity Integration Guide

Denne guide hjælper dig med at integrere dit eksisterende Sanity projekt med din Copenhagen Real Estate web-app.

## 📋 Forudsætninger

Du skal allerede have:
- Et Sanity projekt oprettet
- Sanity Studio installeret

## 🚀 Step 1: Installer Sanity Client i React App

Kør følgende kommandoer i din React app:

```bash
npm install @sanity/client @sanity/image-url
```

## 📁 Step 2: Tilføj Schemas til Sanity Studio

I dit **Sanity Studio projekt** skal du tilføje de 4 schemas:

### Placering i Sanity Studio:
```
sanity-studio/
  schemas/
    portfolioSettings.ts
    region.ts
    property.ts
    capexProject.ts
    index.ts
```

Kopiér filerne fra `/sanity/schemas/` mappen i denne React app til dit Sanity Studio projekt.

### Opdater din `sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Copenhagen Real Estate',
  
  projectId: 'YOUR_PROJECT_ID', // Find på sanity.io/manage
  dataset: 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: schemaTypes,
  },
})
```

## 🔑 Step 3: Tilføj Environment Variables

Opret en `.env.local` fil i roden af din React app:

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

**Find dit Project ID:**
1. Gå til [sanity.io/manage](https://sanity.io/manage)
2. Vælg dit projekt
3. Kopier Project ID

## 📝 Step 4: Indlæs Data til Sanity

Start Sanity Studio:

```bash
cd sanity-studio
npm run dev
```

Åbn [http://localhost:3333](http://localhost:3333) (eller din Studio URL)

### 4.1 Opret Portfolio Indstillinger (1 dokument)

1. Klik på "Portfolio Indstillinger"
2. Udfyld:
   - **Titel**: Copenhagen Real Estate
   - **Beskrivelse**: En omfattende oversigt over vores ejendomsinvesteringer i Danmark
   - **Antal Ejendomme**: 15
   - **Samlet Areal**: 125,000 m²
   - **Samlet Værdi**: 2.5 mia. DKK
   - **Udlejningsgrad**: 96%
   - **Highlights**: Tilføj 3 highlights (se `/data/portfolio.ts`)

### 4.2 Opret Regioner (6 dokumenter)

Opret hver region med:

| Navn | Procentdel | Antal ejendomme | Rækkefølge |
|------|-----------|----------------|------------|
| Storkøbenhavn | 30 | 5 | 1 |
| Horsens | 23 | 3 | 2 |
| Kolding | 21 | 3 | 3 |
| Århus | 5 | 1 | 4 |
| Randers | 13 | 2 | 5 |
| Varde | 8 | 1 | 6 |

### 4.3 Opret Ejendomme (15 dokumenter)

Kopier data fra `/data/portfolio.ts` - `regionProperties` objektet.

**Eksempel for "Kontorhuset Ørestad":**
- **Navn**: Kontorhuset Ørestad
- **By/Lokation**: Storkøbenhavn (eller København)
- **Adresse**: Ørestads Boulevard 73, 2300 København S
- **Type**: Kontor
- **Areal**: 8,500 m²
- **Samlet Leje**: 15.7 mio. DKK/år
- **Værdi**: 185 mio. DKK (fra `properties` array)
- **Udlejningsgrad**: 100%
- **Opførelsesår**: 2019
- **Hovedbillede**: Upload et billede eller brug Unsplash
- **Nøgletal**: Tilføj fra `keyFacts` array
- **Afstande**: Tilføj fra `distances` array

### 4.4 Opret Capex Projekter (6 dokumenter)

Kopier data fra `/data/portfolio.ts` - `capexProjects` array.

**Vigtigt for billeder:**
- Upload før/efter billeder direkte i Sanity Studio
- Eller brug Unsplash integration til stock photos

## 🎨 Step 5: Test Integration

1. Start din React app:
```bash
npm run dev
```

2. Åbn appen - den skulle nu hente data fra Sanity
3. Hvis data ikke vises, check browser console for fejl

## 🔧 Troubleshooting

### "Project ID not found"
- Tjek at `.env.local` filen er i roden af projektet
- Restart development server efter tilføjelse af env variables
- Verificer Project ID på sanity.io/manage

### "CORS error"
1. Gå til [sanity.io/manage](https://sanity.io/manage)
2. Vælg dit projekt → API → CORS Origins
3. Tilføj `http://localhost:5173` (eller din dev server URL)
4. Tilføj din production URL (fx din Vercel URL)

### Ingen data vises
- Check at du har oprettet mindst 1 dokument af hver type i Studio
- Åbn browser console for fejlmeddelelser
- Verificer at dataset navnet matcher (normalt "production")

## 🚢 Deploy til Vercel

1. **Tilføj environment variables i Vercel:**
   - Gå til Vercel Dashboard → dit projekt → Settings → Environment Variables
   - Tilføj:
     - `VITE_SANITY_PROJECT_ID`
     - `VITE_SANITY_DATASET`

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Sanity integration"
   git push
   ```

3. **Opdater CORS i Sanity:**
   - Tilføj din Vercel URL til allowed origins

## 📚 Næste Skridt

Nu hvor Sanity er sat op, kan du:

1. ✅ **Administrere indhold**: Log ind i Sanity Studio for at tilføje/redigere ejendomme
2. ✅ **Upload billeder**: Brug Sanity's image upload direkte i Studio
3. ✅ **Real-time opdateringer**: Ændringer i Studio vises efter page refresh
4. 🔜 **Real-time listeners**: Implementer live updates uden refresh
5. 🔜 **Image optimization**: Brug Sanity's image CDN til automatisk resize/crop
6. 🔜 **Preview mode**: Se ændringer før publicering

## 💡 Tips

- **Backup din data**: Brug `sanity dataset export` til backup
- **Multiple datasets**: Opret "staging" dataset til test
- **Rich text**: Brug Portable Text til formateret indhold
- **Relationer**: Link Capex projekter direkte til ejendomme med references

## 🆘 Brug for hjælp?

- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Community Slack](https://slack.sanity.io/)
- Check `/lib/sanity-queries.ts` for query eksempler
