# 🚢 Deployment Checklist til Vercel

## Pre-Deployment (Før du deployer)

### ✅ 1. Sanity Setup
- [ ] Sanity Studio er sat op og kører
- [ ] Alle 4 schemas er tilføjet (portfolioSettings, region, property, capexProject)
- [ ] Mindst 1 dokument af hver type er oprettet i Sanity
- [ ] Billeder er uploaded til Sanity (eller Unsplash fallback virker)
- [ ] Test at data vises korrekt i Studio

### ✅ 2. Environment Variables
- [ ] `.env.local` er oprettet lokalt
- [ ] `VITE_SANITY_PROJECT_ID` er sat korrekt
- [ ] `VITE_SANITY_DATASET` er sat til "production"
- [ ] Test at appen henter data fra Sanity lokalt (`npm run dev`)

### ✅ 3. Code Ready
- [ ] Alle dependencies er installeret (`npm install`)
- [ ] Build succeeder lokalt (`npm run build`)
- [ ] Ingen TypeScript errors
- [ ] Ingen console errors i browser

### ✅ 4. Git Repository
- [ ] Kode er committed til Git
- [ ] Repository er pushed til GitHub/GitLab/Bitbucket
- [ ] `.env.local` er i `.gitignore` (må IKKE committes!)

---

## Deployment til Vercel

### 🎯 Step 1: Import Project til Vercel

**Via Vercel Dashboard:**
1. Gå til [vercel.com](https://vercel.com)
2. Klik "Add New Project"
3. Vælg dit Git repository
4. Klik "Import"

**Via Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel
```

### 🔑 Step 2: Tilføj Environment Variables

I Vercel Dashboard → dit projekt → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SANITY_PROJECT_ID` | `dit_project_id_her` | Production, Preview, Development |
| `VITE_SANITY_DATASET` | `production` | Production, Preview, Development |

**Find dit Project ID:**
- Gå til [sanity.io/manage](https://sanity.io/manage)
- Vælg dit projekt
- Kopier "Project ID"

### 🚀 Step 3: Deploy

```bash
# Automatisk deploy ved Git push
git push origin main

# Eller manuel deploy via CLI
vercel --prod
```

**First Deployment:**
- Vercel bygger automatisk ved første import
- Vent 2-3 minutter på build completion
- Du får en URL: `https://dit-projekt.vercel.app`

---

## Post-Deployment (Efter deploy)

### ✅ 1. Test Production Site
- [ ] Åbn din Vercel URL
- [ ] Verificer at portfolio overview vises
- [ ] Test navigation til ejendomme
- [ ] Test navigation til Capex projekter
- [ ] Check at alle billeder loader (eller Unsplash fallback virker)
- [ ] Test dialog/popup funktionalitet

### ✅ 2. CORS Setup i Sanity

**Vigtigt!** Tilføj din production URL til Sanity's allowed origins:

1. Gå til [sanity.io/manage](https://sanity.io/manage)
2. Vælg dit projekt
3. Gå til "API" → "CORS Origins"
4. Klik "Add CORS Origin"
5. Tilføj din Vercel URL: `https://dit-projekt.vercel.app`
6. Tillad credentials: Nej
7. Gem

**Test CORS:**
- Refresh din production site
- Åbn browser console
- Check for CORS errors (skulle være væk nu)

### ✅ 3. Performance Check
- [ ] Test loading speed (brug Lighthouse i Chrome DevTools)
- [ ] Verificer images loader fra Sanity CDN
- [ ] Check at gradient baggrund vises korrekt
- [ ] Test på mobil (responsive design)

### ✅ 4. Update Sanity Content
- [ ] Log ind i Sanity Studio
- [ ] Lav en test ændring (fx opdater en procentsats)
- [ ] Refresh production site efter 30-60 sekunder
- [ ] Verificer at ændring vises (CDN caching kan tage lidt tid)

---

## 🔧 Troubleshooting

### Build Errors

**Problem:** Build fejler i Vercel
```
Error: Cannot find module '@sanity/client'
```

**Løsning:**
```bash
npm install @sanity/client @sanity/image-url
git add package.json package-lock.json
git commit -m "Add Sanity dependencies"
git push
```

### CORS Errors

**Problem:** Console error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Løsning:**
- Se "CORS Setup i Sanity" ovenfor
- Husk at tilføje BÅDE preview og production URLs

### Ingen Data Vises

**Problem:** Portfolio viser ingen data eller fallback data

**Løsning:**
1. Check Environment Variables i Vercel
2. Verificer Sanity Project ID er korrekt
3. Sørg for at mindst 1 dokument er oprettet i Sanity
4. Check browser console for API errors

### Images Ikke Loading

**Problem:** Billeder vises ikke

**Løsning:**
- Verificer at billeder er uploaded i Sanity Studio
- Check at Unsplash fallback virker (hvis ingen Sanity billede)
- Inspicér image URL i browser DevTools

---

## 🎨 Custom Domain (Valgfrit)

### Tilføj dit eget domæne:

1. Gå til Vercel Dashboard → dit projekt → Settings → Domains
2. Klik "Add Domain"
3. Indtast dit domæne: `copenhagenrealestate.dk`
4. Følg instruktioner for DNS setup
5. **Opdater CORS i Sanity** med nyt domæne

---

## 📊 Monitoring

### Analytics (Valgfrit)
Tilføj Vercel Analytics:
```bash
npm install @vercel/analytics
```

```tsx
// I App.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      {/* ... existing code */}
      <Analytics />
    </>
  );
}
```

### Speed Insights
Tilføj Vercel Speed Insights:
```bash
npm install @vercel/speed-insights
```

---

## ✨ Success Criteria

Din app er succesfuldt deployed når:

- ✅ Site er tilgængeligt på Vercel URL
- ✅ Data hentes fra Sanity (ikke hardcoded fallback)
- ✅ Alle sider virker (Overview, Properties, Capex)
- ✅ Billeder loader korrekt
- ✅ Ingen console errors
- ✅ CORS er konfigureret korrekt
- ✅ Ændringer i Sanity reflekteres på sitet

---

## 🔄 Continuous Deployment

**Automatisk deployment ved Git push:**
```bash
# Lav ændringer
git add .
git commit -m "Update content"
git push origin main

# Vercel deployer automatisk! 🎉
```

**Preview Deployments:**
- Hver branch får sin egen preview URL
- Test ændringer før merge til main
- Perfekt til staging/test miljø

---

## 📞 Support

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Sanity Support:**
- Docs: https://www.sanity.io/docs
- Slack: https://slack.sanity.io

---

## 🎉 Tillykke!

Din Copenhagen Real Estate app er nu live! 🚀

Næste skridt:
- Del linket med stakeholders
- Begynd at tilføje rigtige ejendomme i Sanity
- Upload high-quality billeder
- Overvej password protection (Fase 2)
