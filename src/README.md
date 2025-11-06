# 🏠 Copenhagen Real Estate

En moderne, responsiv web-applikation til præsentation af ejendomsportefølje med Sanity CMS integration.

![Copenhagen Real Estate](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-blue)
![Sanity](https://img.shields.io/badge/Sanity-CMS-red)

---

## 📖 Om Projektet

Copenhagen Real Estate er en omfattende web-applikation designet til at præsentere ejendomsinvesteringer på en elegant og professionel måde. Appen understøtter:

- 📊 Portfolio oversigt med statistik og geografisk fordeling
- 🏢 Detaljerede ejendomspræsentationer med nøgletal
- 🔨 Capex projekter med før/efter sammenligninger
- 🖼️ Billede management via Sanity CMS
- 🎨 Moderne design med gradient baggrund
- 📱 Fuldt responsiv til mobil og desktop

---

## ✨ Features

### Portfolio Management
- **Geografisk Fordeling**: Visualisering af ejendomme fordelt på 6 danske byer
- **Real-time Statistik**: Automatisk opdaterede nøgletal fra Sanity
- **Interactive Dialogs**: Klik på byer for at se ejendomsliste

### Ejendomspræsentation
- **Grid Layout**: Overskuelig visning af alle ejendomme
- **Detaljesider**: Omfattende information om hver ejendom
- **Afstandsmåling**: Vis nærhed til landmarks og transport

### Capex Projekter
- **Før/Efter Visning**: Side-by-side sammenligning af renoveringer
- **Status Tracking**: Planlagt, I gang, Afsluttet
- **ROI Metrics**: Før/efter nøgletal og besparelser

### Content Management
- **Sanity CMS**: Administrer alt indhold uden at røre koden
- **Image CDN**: Automatisk optimering og levering af billeder
- **Fallback Data**: Graceful degradation til hardcoded data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x eller nyere
- npm eller yarn
- Sanity konto (gratis på [sanity.io](https://sanity.io))

### Installation

```bash
# 1. Clone repository
git clone [your-repo-url]
cd copenhagen-real-estate

# 2. Installer dependencies
npm install
npm install @sanity/client @sanity/image-url

# 3. Setup environment variables
cp .env.local.example .env.local
# Rediger .env.local og tilføj dit Sanity Project ID

# 4. Start development server
npm run dev
```

Åbn [http://localhost:5173](http://localhost:5173) i din browser.

---

## 📚 Dokumentation

Vi har omfattende dokumentation til at hjælpe dig i gang:

| Dokument | Beskrivelse | Tid |
|----------|-------------|-----|
| **[START_HER.md](./START_HER.md)** | 👈 **Start her!** Overordnet guide | 5 min |
| [QUICK_START.md](./QUICK_START.md) | Hurtig opsætning af Sanity | 10 min |
| [SANITY_SETUP.md](./SANITY_SETUP.md) | Detaljeret Sanity integration guide | 30 min |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Step-by-step deployment til Vercel | 15 min |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Komplet projekt struktur oversigt | 10 min |
| [README_BACKEND.md](./README_BACKEND.md) | Backend arkitektur og best practices | 15 min |

**Anbefalet rækkefølge:**
1. START_HER.md → QUICK_START.md → Test lokal udvikling
2. SANITY_SETUP.md → Setup Sanity Studio
3. DEPLOYMENT_CHECKLIST.md → Deploy til Vercel

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Vite** - Build tool
- **Motion/React** - Animations
- **Lucide React** - Icons

### Backend & CMS
- **Sanity CMS** - Headless content management
- **Sanity Client** - API integration
- **Image URL Builder** - Image optimization

### UI Components
- **Shadcn/ui** - Pre-built, customizable components
- **Dialog, Card, Button** - Modal dialogs og UI elements

### Deployment
- **Vercel** - Hosting og continuous deployment
- **Environment Variables** - Secure configuration

---

## 📁 Projekt Struktur

```
/
├── App.tsx                    # Main application
├── components/
│   ├── PortfolioOverview.tsx # Forside
│   ├── PropertyList.tsx      # Ejendomsliste
│   ├── PropertyDetail.tsx    # Ejendomsdetaljer
│   ├── CapexList.tsx         # Capex liste
│   ├── CapexDetail.tsx       # Capex detaljer
│   └── ui/                   # Shadcn komponenter
├── lib/
│   ├── sanity.ts             # Sanity configuration
│   └── sanity-queries.ts     # Data queries
├── sanity/schemas/           # CMS schemas
└── data/portfolio.ts         # Fallback data
```

Se [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detaljer.

---

## 🎨 Design System

### Farver
- **Primary**: `#767A57` (Oliven grøn)
- **Background**: Gradient fra `#f5f5f0` (lys beige) til `#767A57`
- **Text**: `#000000` (Black) og `#595959` (Gray)
- **Accents**: `#ffffff` (White cards)

### Typography
- **Headings**: Crimson Text (Serif)
- **Body**: Albert Sans (Sans-serif)

### Layout
- **Max Width**: 1400px
- **Spacing**: Konsistent 12px grid
- **Cards**: Rounded corners, subtle shadows

---

## 🌐 Deployment

### Vercel (Anbefalet)

```bash
# Deploy via Git
git push origin main
# Vercel auto-deploys

# Eller via CLI
vercel --prod
```

**Environment Variables (Vercel Dashboard):**
```
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

Se [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for fuld guide.

---

## 📊 Data Management

### Sanity Studio

Administrer indhold via Sanity Studio:

1. **Portfolio Settings** - Global stats og highlights
2. **Regions** - Byer med procentfordeling
3. **Properties** - Ejendomme med detaljer
4. **Capex Projects** - Renoveringsprojekter

### Data Import

Migrer eksisterende data:

```bash
# Generer NDJSON
node scripts/migrate-to-sanity.ts > data.ndjson

# Import til Sanity
sanity dataset import data.ndjson production
```

---

## 🔧 Development

### Kommandoer

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Opret `.env.local` fil:

```env
VITE_SANITY_PROJECT_ID=your_project_id_here
VITE_SANITY_DATASET=production
```

---

## 🧪 Testing

### Lokal Test
1. Kør `npm run dev`
2. Test alle sider (Overview, Properties, Capex)
3. Verificer Sanity data vises
4. Check browser console for errors

### Production Test
1. Build lokalt: `npm run build && npm run preview`
2. Test på production URL efter deployment
3. Verificer CORS settings i Sanity

---

## 🔐 Sikkerhed

### Nuværende Status
- ✅ Public read access (ingen følsomme data)
- ✅ Sanity Studio login for admin
- ✅ Environment variables for API keys

### Fase 2 (Kommende)
- 🔜 Password protection på frontend
- 🔜 User authentication
- 🔜 Role-based access control

---

## 📈 Performance

### Optimizations
- ✅ Image CDN via Sanity
- ✅ Lazy loading af billeder
- ✅ Code splitting
- ✅ Vercel Edge Network

### Metrics
- **Lighthouse Score**: 90+ (mål)
- **Load Time**: < 2s (mål)
- **Bundle Size**: Optimeret med Vite

---

## 🤝 Contributing

Dette projekt er privat, men hvis du arbejder på det:

1. **Opret branch**: `git checkout -b feature/ny-feature`
2. **Commit changes**: `git commit -m 'Add ny feature'`
3. **Push branch**: `git push origin feature/ny-feature`
4. **Test lokalt** før merge til main

---

## 📝 License

Proprietary - Alle rettigheder forbeholdt Copenhagen Real Estate

---

## 🆘 Support

### Troubleshooting

**Data vises ikke?**
- Check `.env.local` har korrekt Project ID
- Verificer Sanity Studio har content
- Se browser console for errors

**Build fejler?**
- Kør `npm install` igen
- Check Node.js version (18.x+)
- Se [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**CORS errors?**
- Tilføj din URL til Sanity CORS settings
- Se [SANITY_SETUP.md](./SANITY_SETUP.md) → Troubleshooting

### Dokumentation
- Sanity: https://www.sanity.io/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev

---

## 🎯 Roadmap

### ✅ Fase 1 (Nuværende)
- Portfolio overview
- Ejendomsliste og detaljer
- Capex projekter
- Sanity CMS integration
- Vercel deployment

### 🔜 Fase 2 (Planlagt)
- Password protection
- Video support
- PDF export
- Analytics
- Search funktionalitet

### 💡 Fase 3 (Fremtid)
- Multi-language support
- Advanced filtering
- Comparison tool
- Mobile app

---

## 👥 Team

Udviklet til Copenhagen Real Estate portefølje præsentationer.

---

## 🙏 Acknowledgments

- **Shadcn/ui** - UI komponenter
- **Sanity** - Headless CMS platform
- **Vercel** - Hosting og deployment
- **Unsplash** - Stock images fallback

---

**Version:** 1.0.0  
**Opdateret:** November 2024  
**Status:** Ready for Production ✅

---

**Kom i gang →** [START_HER.md](./START_HER.md)
