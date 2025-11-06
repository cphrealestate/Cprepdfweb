# 📁 Project Structure Overview

## Komplet Filstruktur

```
copenhagen-real-estate/
│
├── 📄 App.tsx                          # Main app component med routing
├── 📄 Attributions.md                  # Asset attributions
│
├── 📂 components/                      # React komponenter
│   ├── CapexDetail.tsx                # Detaljevisning af Capex projekt
│   ├── CapexList.tsx                  # Liste over Capex projekter
│   ├── LogoButton.tsx                 # Logo/home knap
│   ├── PortfolioOverview.tsx          # Forside med portfolio oversigt
│   ├── PropertyDetail.tsx             # Detaljevisning af ejendom
│   ├── PropertyList.tsx               # Liste over ejendomme
│   ├── SanityImage.tsx                # Helper til Sanity billeder
│   │
│   ├── 📂 figma/
│   │   └── ImageWithFallback.tsx      # Billede med Unsplash fallback
│   │
│   └── 📂 ui/                          # Shadcn UI komponenter
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (mange flere)
│
├── 📂 data/
│   └── portfolio.ts                   # Hardcoded fallback data
│
├── 📂 lib/
│   ├── sanity.ts                      # Sanity client configuration
│   └── sanity-queries.ts              # API queries og types
│
├── 📂 sanity/
│   └── 📂 schemas/                     # Sanity CMS schemas
│       ├── portfolioSettings.ts       # Portfolio metadata schema
│       ├── region.ts                  # Region/by schema
│       ├── property.ts                # Ejendom schema
│       ├── capexProject.ts            # Capex projekt schema
│       └── index.ts                   # Schema export
│
├── 📂 scripts/
│   └── migrate-to-sanity.ts           # Data migration helper
│
├── 📂 imports/                         # Figma import assets
│   ├── Desktop1.tsx
│   ├── svg-*.ts
│   └── ...
│
├── 📂 styles/
│   └── globals.css                    # Global styles og Tailwind
│
├── 📂 guidelines/
│   └── Guidelines.md                  # Projekt guidelines
│
├── 📄 .env.local.example              # Environment variables template
├── 📄 .gitignore                      # Git ignore file
├── 📄 package.json                    # Dependencies
├── 📄 tsconfig.json                   # TypeScript config
├── 📄 vite.config.ts                  # Vite config
│
└── 📚 DOKUMENTATION/
    ├── README_BACKEND.md              # Hovedoversigt over backend
    ├── QUICK_START.md                 # 10-minutters guide
    ├── SANITY_SETUP.md                # Detaljeret Sanity setup
    ├── DEPLOYMENT_CHECKLIST.md        # Deployment til Vercel
    ├── INSTALL_DEPENDENCIES.md        # Installation guide
    └── PROJECT_STRUCTURE.md           # Denne fil
```

---

## 🗂️ Detaljeret Beskrivelse

### Root Files

#### App.tsx
**Main application component**
- Håndterer navigation mellem views (overview, list, detail, capex)
- Henter data fra Sanity via `useEffect`
- Adapter Sanity data til eksisterende Property interface
- Fallback til hardcoded data hvis Sanity fejler

**Key features:**
- View state management
- Data fetching fra Sanity
- Property selection state

---

### 📂 components/

Alle React komponenter organiseret efter funktion.

#### Core Components

**PortfolioOverview.tsx**
- Forside med hero section
- Portfolio statistik grid (4 cards)
- Geografisk fordeling (6 byer i 3x2 grid)
- Highlights sektion
- Dialog med ejendomme per region
- Henter data fra Sanity (portfolioSettings, regions)

**PropertyList.tsx**
- Grid visning af alle ejendomme
- Filtreringsmuligheder (by, type)
- Click handler til detaljevisning
- Modtager properties som prop

**PropertyDetail.tsx**
- Fuld detaljevisning af enkelt ejendom
- Hero billede
- Nøgletal grid
- Afstande til landmarks
- Back navigation

**CapexList.tsx**
- Grid visning af Capex projekter
- Status badges (Afsluttet/I gang/Planlagt)
- Før/efter billeder preview
- Henter data fra Sanity

**CapexDetail.tsx**
- Fuld detaljevisning af Capex projekt
- Før/efter sammenligning med billeder
- Metrics comparison grid
- Benefits liste

**LogoButton.tsx**
- Floating logo/home button
- Sticky positioning
- Navigation til overview

**SanityImage.tsx**
- Helper component til Sanity billeder
- Automatisk fallback til Unsplash
- Image URL generation med width
- Lazy loading

#### UI Components

`components/ui/` indeholder alle Shadcn/ui komponenter:
- Dialog, Button, Card, Badge, etc.
- Pre-styled, customizable
- Bruges på tværs af hele appen

---

### 📂 lib/

Utility functions og configuration.

#### sanity.ts
**Sanity Client Setup**
```typescript
- sanityConfig: Project ID, dataset, API version
- sanityClient: Client instance
- urlFor(): Image URL builder
- getImageUrl(): Helper til image URLs
```

#### sanity-queries.ts
**API Queries & Types**

**Types:**
- Region, Property, CapexProject, PortfolioSettings
- Matcher Sanity schema struktur

**Query Functions:**
- `getPortfolioSettings()`: Portfolio metadata
- `getRegions()`: Alle regioner
- `getPropertiesByRegion(name)`: Filtrerede ejendomme
- `getProperties()`: Alle ejendomme
- `getPropertyById(id)`: Enkelt ejendom
- `getCapexProjects()`: Alle Capex projekter
- `getCapexProjectById(id)`: Enkelt Capex projekt

**Features:**
- Error handling
- TypeScript types
- GROQ queries
- References (region, property)

---

### 📂 data/

#### portfolio.ts
**Hardcoded Fallback Data**

Indeholder:
- `portfolioData`: Stats, regioner, highlights, regionProperties
- `properties[]`: Array af 15 test ejendomme
- `capexProjects[]`: Array af 6 test projekter

**Bruges til:**
- Fallback hvis Sanity ikke tilgængelig
- Development uden Sanity setup
- Type definitions (Property, CapexProject interfaces)

---

### 📂 sanity/schemas/

Sanity Studio schemas - **skal kopieres til dit Sanity Studio projekt**.

#### portfolioSettings.ts
**Single document**
- Portfolio titel, beskrivelse
- Statistik (totalProperties, totalArea, totalValue, occupancyRate)
- Highlights array

#### region.ts
**Multiple documents**
- Navn, procentdel, antal ejendomme
- Order field til sortering
- Preview med percentage og count

#### property.ts
**Multiple documents**
- Grunddata (navn, lokation, adresse, type)
- Økonomi (area, totalRent, value, occupancy)
- Image field (Sanity image)
- KeyFacts array (label/value)
- Distances array
- Reference til region

#### capexProject.ts
**Multiple documents**
- Projekt info (navn, status, investment, dates)
- Beskrivelser (description, before, after)
- Images (beforeImage, afterImage - Sanity images)
- KeyMetrics array (label, before, after)
- Benefits array (strings)
- Reference til property

#### index.ts
Export af alle schemas til Sanity Studio config.

---

### 📂 scripts/

#### migrate-to-sanity.ts
**Data Migration Helper**

Konverterer hardcoded data til NDJSON format for Sanity import:
- Læser `/data/portfolio.ts`
- Genererer Sanity documents
- Outputs NDJSON format
- Optional: Write to file

**Usage:**
```bash
node scripts/migrate-to-sanity.ts > migration-data.ndjson
sanity dataset import migration-data.ndjson production
```

---

### 📂 styles/

#### globals.css
- Tailwind directives (@tailwind base, components, utilities)
- CSS variables for colors
- Typography defaults
- Global gradient baggrund
- Font families (Crimson Text, Albert Sans)

---

### 📚 Dokumentation

#### README_BACKEND.md
**Hovedoversigt**
- Introduktion til Sanity backend
- Projekt struktur
- Schema beskrivelser
- Data flow diagram
- Teknisk stack
- Best practices

#### QUICK_START.md
**Hurtig opsætning (10 min)**
- TL;DR installation
- Minimal setup steps
- Test integration
- Troubleshooting basics

#### SANITY_SETUP.md
**Detaljeret guide**
- Forudsætninger
- Step-by-step installation
- Schema setup
- Data import
- CORS konfiguration
- Deployment
- Næste skridt

#### DEPLOYMENT_CHECKLIST.md
**Vercel deployment**
- Pre-deployment checklist
- Step-by-step Vercel setup
- Environment variables
- CORS setup
- Post-deployment testing
- Troubleshooting
- Custom domain setup

#### INSTALL_DEPENDENCIES.md
**Package installation**
- npm install kommandoer
- Package beskrivelser
- Verificering
- Troubleshooting

#### PROJECT_STRUCTURE.md
**Denne fil**
- Komplet filstruktur
- Detaljerede beskrivelser
- Relationer mellem filer

---

## 🔄 Data Flow

```
┌─────────────────┐
│  Sanity Studio  │
│  (Admin Panel)  │
└────────┬────────┘
         │
         │ [Edit Content]
         │ [Upload Images]
         ↓
┌─────────────────┐
│   Sanity API    │
│  (Cloud Hosted) │
└────────┬────────┘
         │
         │ [GROQ Queries]
         ↓
┌─────────────────┐
│ sanity-queries  │
│  (lib/...)      │
└────────┬────────┘
         │
         │ [React Hooks]
         ↓
┌─────────────────┐
│   Components    │
│  (App.tsx, etc) │
└────────┬────────┘
         │
         │ [Render]
         ↓
┌─────────────────┐
│   Browser UI    │
│  (End User)     │
└─────────────────┘
```

---

## 🎯 Key Relationships

### Data → UI
```
portfolio.ts (fallback)
    ↓
sanity-queries.ts (API)
    ↓
App.tsx (state management)
    ↓
PortfolioOverview.tsx (display)
```

### Schemas → Queries
```
sanity/schemas/property.ts
    ↓
lib/sanity-queries.ts (getProperties)
    ↓
App.tsx (fetch on mount)
    ↓
PropertyList.tsx (render)
```

### Images → Display
```
Sanity Studio (upload)
    ↓
lib/sanity.ts (urlFor)
    ↓
SanityImage.tsx (component)
    ↓
PropertyDetail.tsx (display)
```

---

## 📝 Navngivningskonventioner

### Komponenter
- PascalCase: `PortfolioOverview.tsx`
- Beskrivende navne: `PropertyDetail` ikke `Detail`

### Lib/Utils
- camelCase: `sanity-queries.ts`
- Grouped by function: `sanity.ts` (config), `sanity-queries.ts` (data)

### Schemas
- camelCase: `portfolioSettings.ts`
- Singular form: `property.ts` ikke `properties.ts`

### Typer
- PascalCase interfaces: `Property`, `CapexProject`
- Descriptive: `PortfolioSettings` ikke `Settings`

---

## 🚀 Getting Started

For at arbejde med projektet:

1. **Første gang:**
   - Følg [INSTALL_DEPENDENCIES.md](./INSTALL_DEPENDENCIES.md)
   - Følg [QUICK_START.md](./QUICK_START.md)

2. **Development:**
   ```bash
   npm run dev
   ```

3. **Tilføj ny feature:**
   - Komponenter i `/components`
   - Data fetching i `/lib/sanity-queries.ts`
   - Schemas i `/sanity/schemas` (hvis nye data typer)

4. **Deploy:**
   - Følg [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 💡 Tips

- **State Management**: Brug React's `useState` og `useEffect` - ingen Redux nødvendigt
- **Styling**: Brug Tailwind classes - ingen custom CSS filer
- **Images**: Altid brug `SanityImage` eller `ImageWithFallback`
- **Queries**: Test queries i Sanity Vision tool først
- **Types**: Opdater TypeScript types når schemas ændres

---

Opdateret: November 2024
