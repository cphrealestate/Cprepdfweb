# 📦 Installation af Sanity Dependencies

## Installer Sanity Client Packages

Kør følgende kommando i din React app's root directory:

```bash
npm install @sanity/client @sanity/image-url
```

## Hvad installerer vi?

### @sanity/client
Den officielle Sanity JavaScript client til at hente data fra Sanity API.

**Version:** Seneste stabile (^6.x)

**Bruges til:**
- Oprette forbindelse til Sanity projektet
- Fetch data med GROQ queries
- Real-time listeners (optional)

### @sanity/image-url
Image URL builder til at generere optimerede Sanity image URLs.

**Version:** Seneste stabile (^1.x)

**Bruges til:**
- Generere CDN URLs til billeder
- Auto-format (WebP, AVIF)
- Resize og crop billeder on-the-fly
- Hotspot cropping

## Verificer Installation

```bash
# Check at packages er installeret
npm list @sanity/client
npm list @sanity/image-url

# Du skulle se noget lignende:
# @sanity/client@6.x.x
# @sanity/image-url@1.x.x
```

## Alternative Installation

Hvis du bruger **yarn**:
```bash
yarn add @sanity/client @sanity/image-url
```

Hvis du bruger **pnpm**:
```bash
pnpm add @sanity/client @sanity/image-url
```

## TypeScript Types

TypeScript types er inkluderet i begge packages - ingen ekstra `@types/*` packages nødvendige! 🎉

## Næste Skridt

Efter installation:
1. ✅ Opret `.env.local` fil (se `.env.local.example`)
2. ✅ Tilføj Sanity Project ID og Dataset
3. ✅ Restart development server: `npm run dev`
4. ✅ Følg [QUICK_START.md](./QUICK_START.md) for setup

## Troubleshooting

### Installation fejler?

**Problem:** npm install fejler med "ERESOLVE unable to resolve dependency tree"

**Løsning:**
```bash
npm install @sanity/client @sanity/image-url --legacy-peer-deps
```

### Gamle versions?

Check om du har den seneste version:
```bash
npm outdated @sanity/client
npm outdated @sanity/image-url
```

Opdater hvis nødvendigt:
```bash
npm update @sanity/client @sanity/image-url
```

## Package Sizes

- @sanity/client: ~50kb (gzipped)
- @sanity/image-url: ~5kb (gzipped)

Total tilføjet bundle size: ~55kb ✅
