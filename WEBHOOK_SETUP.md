# 🔄 Sanity → Vercel Webhook Setup

Dette dokument forklarer hvordan du sætter automatiske deployments op, så Vercel rebuilder sitet når du opdaterer indhold i Sanity CMS.

## Problemet

Når du opdaterer indhold i Sanity Studio, ved Vercel ikke at den skal rebuilde din website. Dette betyder at ændringer først vises efter en manuel rebuild eller når du pusher ny kode.

## Løsningen

Vi bruger **Sanity Webhooks** + **Vercel Deploy Hooks** til at automatisk trigger en rebuild når indhold ændres.

## Hvordan det virker

```
Sanity CMS
   ↓ (content update)
   ↓
Webhook trigger
   ↓ (POST request)
   ↓
/api/revalidate endpoint
   ↓ (calls Vercel Deploy Hook)
   ↓
Vercel Deployment
   ↓
Opdateret website ✅
```

## Setup Guide

### 1️⃣ Opret Deploy Hook i Vercel

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Vælg **cprepdfweb** projektet
3. Gå til **Settings** → **Git**
4. Scroll ned til **Deploy Hooks**
5. Klik **Create Hook**
   - Name: `Sanity Content Update`
   - Branch: `main` (eller din production branch)
6. Kopiér den genererede URL (f.eks. `https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx`)

### 2️⃣ Tilføj Environment Variables i Vercel

1. I Vercel Dashboard → **Settings** → **Environment Variables**
2. Tilføj følgende variables:

| Key | Value | Required? |
|-----|-------|-----------|
| `VERCEL_DEPLOY_HOOK` | Din Deploy Hook URL fra step 1 | ✅ Required |
| `SANITY_WEBHOOK_SECRET` | Et random secret (valgfri sikkerhed) | ⚠️ Anbefalet |

**Vigtigt:** Husk at vælge alle environments (Production, Preview, Development)

3. Klik **Save**
4. **Redeploy projektet** for at environment variables træder i kraft

### 3️⃣ Opsæt Webhook i Sanity

1. Gå til [Sanity Dashboard](https://sanity.io/manage)
2. Vælg dit projekt
3. Gå til **API** → **Webhooks**
4. Klik **Create webhook**
5. Udfyld følgende:

```
Name: Vercel Deploy Trigger
URL: https://DIN-VERCEL-URL.vercel.app/api/revalidate
Dataset: production
Method: POST
```

**Trigger on:** Vælg alle:
- ✅ Create
- ✅ Update
- ✅ Delete

**Optional Headers** (hvis du bruger SANITY_WEBHOOK_SECRET):
```
Header: sanity-webhook-signature
Value: [dit secret fra Vercel environment variables]
```

**Projection:**
```json
{_type, _id, _rev}
```

**API version:** `v2024-01-01`

6. Klik **Save**

### 4️⃣ Test Webhook

1. Gå til Sanity Studio
2. Rediger et dokument (f.eks. opdater en ejendom titel)
3. Gem ændringen
4. Check webhook status:
   - Gå til Sanity Dashboard → API → Webhooks
   - Klik på dit webhook
   - Se under **Deliveries** - du skulle se en grøn ✓
5. Check Vercel deployment:
   - Gå til Vercel Dashboard → Deployments
   - Du skulle se en ny deployment

### 5️⃣ Verificer Opdatering

1. Vent 30-90 sekunder på deployment
2. Åbn dit website
3. Tryk **Ctrl+Shift+R** (hard refresh) for at clear cache
4. Dine ændringer skulle nu være synlige!

## 🔧 Troubleshooting

### Problem: Webhook får 500 fejl

**Løsning:**
- Check at `VERCEL_DEPLOY_HOOK` er sat korrekt i Vercel
- Husk at redeploy efter tilføjelse af environment variables
- Se Vercel Function Logs under **Deployments** → **Functions** tab

### Problem: Webhook får 401 Unauthorized

**Løsning:**
- Check at `sanity-webhook-signature` header matcher din `SANITY_WEBHOOK_SECRET`
- Alternativt: fjern secret helt (mindre sikkert)

### Problem: Deployment triggeres ikke

**Løsning:**
- Verificer webhook URL: `https://din-url.vercel.app/api/revalidate`
- Check Sanity Dashboard → Webhooks → Deliveries for fejlbeskeder
- Tjek om Deploy Hook URL er korrekt i Vercel environment variables

### Problem: Ændringer vises ikke

**Løsning:**
- Vent 30-90 sekunder på deployment
- Hard refresh browseren (Ctrl+Shift+R / Cmd+Shift+R)
- Check browser cache - prøv incognito mode
- Verificer deployment succeeded i Vercel Dashboard

### Problem: For mange deployments

**Løsning:**
- Sanity sender webhook ved hver enkelt ændring
- Overvej at bruge Sanity's batch editing
- Alternativt: implementer debouncing i webhook handler

## 📁 Filer Involveret

- `/api/revalidate.ts` - Webhook handler endpoint
- `/.env.example` - Environment variable template
- `/src/SANITY_SETUP.md` - Fuld Sanity setup guide
- `/vercel.json` - Vercel konfiguration

## 🔒 Sikkerhed

**Anbefalet sikkerhed:**
- ✅ Brug `SANITY_WEBHOOK_SECRET` til at validere requests
- ✅ Hold Deploy Hook URL hemmelig (ikke i frontend kode)
- ✅ Log webhook events for debugging

**Optional ekstra sikkerhed:**
- Whitelist Sanity's IP addresses
- Rate limiting på webhook endpoint
- Implementer signature verification

## 📊 Monitoring

**Check webhook status:**
```
Sanity Dashboard → API → Webhooks → Deliveries
```

**Check deployment status:**
```
Vercel Dashboard → Deployments
```

**Debug webhook:**
```
Vercel Dashboard → Deployments → vælg deployment → Functions tab
```

## ✅ Checklist

Før du går i produktion:

- [ ] Deploy Hook oprettet i Vercel
- [ ] `VERCEL_DEPLOY_HOOK` tilføjet til Vercel environment variables
- [ ] `SANITY_WEBHOOK_SECRET` oprettet (anbefalet)
- [ ] Webhook oprettet i Sanity Dashboard
- [ ] Test webhook ved at redigere et dokument
- [ ] Verificer grøn ✓ i Sanity webhook deliveries
- [ ] Verificer ny deployment i Vercel
- [ ] Verificer ændringer vises på website

## 🆘 Brug for hjælp?

- [Sanity Webhooks Dokumentation](https://www.sanity.io/docs/webhooks)
- [Vercel Deploy Hooks Guide](https://vercel.com/docs/deployments/deploy-hooks)
- Check `/api/revalidate.ts` kode kommentarer

---

**Sidst opdateret:** 2025-11-06
