# Copenhagen Real Estate - Backend Setup Guide

## 📖 Oversigt

Din Copenhagen Real Estate app er nu klar til at integrere med **Sanity CMS** som backend. Dette giver dig mulighed for at:

✅ **Administrere Indhold**: Tilføj, rediger og slet ejendomme via et skønt admin interface  
✅ **Upload Billeder**: Drag & drop billeder direkte i Sanity Studio  
✅ **Opdater Data**: Juster procentsatser, nøgletal, Capex projekter osv.  
✅ **Real-time**: Se ændringer reflekteret i din app (efter refresh)  
✅ **CDN**: Automatisk image optimization og hurtig levering  

## 🗂️ Projekt Struktur

```
/
├── lib/
│   ├── sanity.ts                # Sanity client configuration
│   └── sanity-queries.ts        # API queries til at hente data
├── sanity/
│   └── schemas/                 # Schemas til Sanity Studio
│       ├── portfolioSettings.ts # Portfolio metadata
│       ├── region.ts            # Byer/regioner
│       ├── property.ts          # Ejendomme
│       ├── capexProject.ts      # Capex projekter
│       └── index.ts             # Schema export
├── scripts/
│   └── migrate-to-sanity.ts     # Hjælper med at migrere data
├── data/
│   └── portfolio.ts             # Hardcoded fallback data
├── QUICK_START.md               # 10-minutters guide
├── SANITY_SETUP.md              # Detaljeret setup guide
└── .env.local.example           # Environment variables template
```

## 🚀 Kom i Gang

### Option 1: Quick Start (10 minutter)
Følg [QUICK_START.md](./QUICK_START.md) for hurtig opsætning

### Option 2: Detaljeret Guide
Følg [SANITY_SETUP.md](./SANITY_SETUP.md) for komplet dokumentation

## 📊 Sanity Schema Oversigt

### 1. Portfolio Settings
**En samlet konfiguration** for hele din portefølje:
- Portfolio titel og beskrivelse
- Statistik (antal ejendomme, areal, værdi, udlejningsgrad)
- Highlights (3 højdepunkter)

**Opret**: Kun ét dokument af denne type

### 2. Regions
**Byer hvor du har ejendomme**:
- Navn (fx "Storkøbenhavn", "Horsens")
- Procentdel af portefølje
- Antal ejendomme
- Rækkefølge (til sortering)

**Opret**: 6 dokumenter (en per by)

### 3. Properties
**Individuelle ejendomme**:
- Grunddata (navn, adresse, lokation, type)
- Økonomi (areal, værdi, leje, udlejningsgrad)
- Detaljer (opførelsesår, beskrivelse)
- Billede
- Nøgletal (lejere, energimærke, p-pladser osv.)
- Afstande til landmarks
- Reference til region

**Opret**: 15+ dokumenter

### 4. Capex Projects
**Renoveringsprojekter**:
- Projekt navn og beskrivelse
- Tilknyttet ejendom
- Status (Planlagt/I gang/Afsluttet)
- Investering og datoer
- Før/efter beskrivelser
- Før/efter billeder
- Nøgletal (før/efter sammenligninger)
- Fordele liste
- Reference til ejendom

**Opret**: 6+ dokumenter

## 🔄 Data Flow

```
Sanity Studio → Sanity API → React App
     ↓
  [Opret/Rediger]
  [Upload Billeder]
  [Publicer]
                      ↓
                [Fetch Data]
                [Display]
```

### Fallback Strategi
Hvis Sanity ikke er tilgængelig, fallback'er appen til hardcoded data i `/data/portfolio.ts`.

## 🛠️ Teknisk Stack

- **Frontend**: React + TypeScript + Vite
- **Backend/CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (anbefalet)
- **Images**: Sanity CDN + Image URL Builder

## 📦 Dependencies

```json
{
  "@sanity/client": "^6.x",
  "@sanity/image-url": "^1.x"
}
```

## 🌐 Deploy til Production

### 1. Vercel Setup
```bash
# Deploy via Vercel CLI
vercel

# Eller push til GitHub og forbind til Vercel
```

### 2. Environment Variables (Vercel)
Gå til Vercel Dashboard → Settings → Environment Variables:

```
VITE_SANITY_PROJECT_ID = dit_project_id
VITE_SANITY_DATASET = production
```

### 3. CORS (Sanity)
Tilføj din production URL:
- Gå til sanity.io/manage
- Vælg projekt → API → CORS Origins
- Tilføj: `https://din-app.vercel.app`

## 💡 Best Practices

### Content Management
1. **Brug Drafts**: Test ændringer før publicering
2. **Image Upload**: Brug høj kvalitet billeder (Sanity optimerer automatisk)
3. **Konsistens**: Hold navngivning konsistent (fx "mio. DKK" ikke "millioner DKK")
4. **Validation**: Sanity schemas har validation - følg dem!

### Data Migration
1. Brug migration script til initial import
2. Verificer data efter import
3. Upload billeder manuelt (bedre kvalitet)

### Performance
1. Sanity CDN håndterer caching automatisk
2. Brug image URL builder til optimerede størrelser
3. Implementer loading states i komponenter

## 🔐 Sikkerhed

- **Public Read**: Data er public (ingen følsomme oplysninger)
- **Password Protection** (Fase 2): Implementer med Vercel Edge Middleware eller Supabase Auth
- **Admin Access**: Kun Sanity Studio login giver skriveadgang

## 📈 Næste Fase

Når Sanity er sat op, kan du arbejde videre med:

1. ✅ **Real-time Listeners**: Live updates uden refresh
2. ✅ **Preview Mode**: Se ændringer før publicering  
3. ✅ **Rich Text**: Brug Portable Text til formateret beskrivelser
4. ✅ **Video Support**: Embed videos direkte fra Sanity
5. 🔜 **Password Protection**: Vercel Middleware eller Supabase Auth (Fase 2)
6. 🔜 **Analytics**: Track visninger og downloads

## 🆘 Support

### Dokumentation
- Sanity Docs: https://www.sanity.io/docs
- GROQ Query Reference: https://www.sanity.io/docs/groq

### Debugging
```bash
# Check Sanity connection
console.log(sanityClient)

# Test query
sanityClient.fetch('*[_type == "property"][0]').then(console.log)
```

### Common Issues
Se [SANITY_SETUP.md](./SANITY_SETUP.md) troubleshooting sektion

## 🎯 Konklusion

Med Sanity backend får du:
- 🎨 Professionelt CMS uden at bygge det selv
- 📸 Image management og CDN gratis
- 🚀 Hurtig deployment og skalering
- 👥 Nem adgang for ikke-tekniske brugere

**Held og lykke med deployment!** 🍀
