# 🚀 Sanity Backend Setup Guide

This guide will help you set up your Sanity CMS backend from scratch in **under 15 minutes**.

---

## 📋 What You'll Accomplish

- ✅ Create a free Sanity account
- ✅ Create a new Sanity project
- ✅ Configure your environment variables
- ✅ Launch Sanity Studio (your CMS admin panel)
- ✅ Create your first portfolio content
- ✅ Connect your Vercel app to Sanity

---

## 🎯 Step 1: Create a Sanity Account (2 minutes)

### **Option A: Sign Up with GitHub (Recommended)**
1. Go to [sanity.io](https://www.sanity.io/)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Sanity to access your GitHub account

### **Option B: Sign Up with Email**
1. Go to [sanity.io](https://www.sanity.io/)
2. Click **"Get Started"**
3. Enter your email and create a password
4. Verify your email address

---

## 🏗️ Step 2: Create a New Sanity Project (3 minutes)

You have **two options** to create your Sanity project:

### **Option A: Via Sanity CLI (In This Project)**

```bash
# Run this in your project root
npx sanity init --project-id auto --dataset production
```

**Follow the prompts:**
- ✅ **Login?** → Yes (browser will open)
- ✅ **Project name?** → "Copenhagen Real Estate Portfolio"
- ✅ **Use default dataset?** → Yes (production)
- ✅ **Project template?** → Clean project (no predefined schemas)

**After completion:**
- Your `.env.local` will be auto-created with your project ID
- A new project will appear at [sanity.io/manage](https://sanity.io/manage)

### **Option B: Via Sanity.io Dashboard**

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Click **"Create New Project"**
3. **Project name:** Copenhagen Real Estate Portfolio
4. **Dataset:** production
5. Click **"Create Project"**
6. **Copy your Project ID** (you'll need it in Step 3)

---

## 🔑 Step 3: Configure Environment Variables (2 minutes)

### **If you used CLI (Option A):**

Your `.env.local` should already exist. Open it and verify:

```env
VITE_SANITY_PROJECT_ID=your_actual_project_id
VITE_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your_actual_project_id
SANITY_STUDIO_DATASET=production
```

### **If you used Dashboard (Option B):**

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and replace the placeholders:**
   ```env
   VITE_SANITY_PROJECT_ID=abc12345          # Your actual project ID
   VITE_SANITY_DATASET=production
   SANITY_STUDIO_PROJECT_ID=abc12345        # Same project ID
   SANITY_STUDIO_DATASET=production
   ```

3. **Find your Project ID:**
   - Go to [sanity.io/manage](https://sanity.io/manage)
   - Click on your project
   - Copy the **Project ID** (looks like: `abc12345`)

---

## 🎨 Step 4: Launch Sanity Studio (1 minute)

Sanity Studio is your CMS admin panel where you'll manage content.

```bash
# Start Sanity Studio
npm run studio
```

**Expected output:**
```
Sanity Studio v4
Local:     http://localhost:3333
Network:   http://192.168.1.x:3333
```

**Open in browser:** http://localhost:3333

You should see the Sanity Studio login screen. **Log in** with the same account you created in Step 1.

---

## 📝 Step 5: Create Your Content (5-10 minutes)

You'll see 4 content types in the sidebar:

### **5.1 Portfolio Settings** (Required - Create 1)

This is your global portfolio configuration.

Click **"Portfolio Settings"** → **"Create"**

Fill in:
- **Titel:** Copenhagen Real Estate
- **Beskrivelse:** En omfattende oversigt over vores ejendomsinvesteringer i Danmark
- **Antal Ejendomme:** 15
- **Samlet Areal:** 125,000 m²
- **Samlet Værdi:** 2.5 mia. DKK
- **Udlejningsgrad:** 96%

**Highlights (Add 3):**
1.
   - **Title:** Bæredygtige Investeringer
   - **Description:** 85% af vores portefølje er DGNB Gold certificeret
2.
   - **Title:** Stabil Vækst
   - **Description:** 12% årlig værdistigning siden 2019
3.
   - **Title:** Premium Lejere
   - **Description:** 92% af lejemål er Fortune 500 virksomheder

Click **"Publish"**

### **5.2 Regions** (Create 6)

Click **"Region"** → **"Create"** (repeat 6 times)

| Navn | Procentdel | Antal ejendomme | Rækkefølge |
|------|-----------|----------------|------------|
| Storkøbenhavn | 30 | 5 | 1 |
| Horsens | 23 | 3 | 2 |
| Kolding | 21 | 3 | 3 |
| Århus | 5 | 1 | 4 |
| Randers | 13 | 2 | 5 |
| Varde | 8 | 1 | 6 |

Click **"Publish"** after each region.

### **5.3 Properties** (Create 2-3 to start)

Click **"Property"** → **"Create"**

**Example 1: Kontorhuset Ørestad**
- **Navn:** Kontorhuset Ørestad
- **By/Lokation:** København
- **Adresse:** Ørestads Boulevard 73, 2300 København S
- **Type:** Kontor
- **Areal:** 8,500 m²
- **Samlet Leje:** 15.7 mio. DKK/år
- **Værdi:** 185 mio. DKK
- **Udlejningsgrad:** 100%
- **Opførelsesår:** 2019
- **Beskrivelse:**
  ```
  Moderne kontorbygning i Ørestad med topmoderne faciliteter og
  fremragende transportforbindelser. Bæredygtig design med DGNB Gold
  certificering.
  ```
- **Region:** Select "Storkøbenhavn"

**Nøgletal (Add 3):**
1. Label: "Årlig Leje", Value: "15.7 mio. DKK"
2. Label: "Værdi", Value: "185 mio. DKK"
3. Label: "Certificering", Value: "DGNB Gold"

**Afstande (Add 2):**
1. Location: "Københavns Lufthavn", Distance: "5 km"
2. Location: "Metro Ørestad", Distance: "200 m"

**Hovedbillede:** Click upload → You can:
- Upload your own image
- Or skip for now (app will use Unsplash fallback)

Click **"Publish"**

**Example 2: Quick property template:**
- **Navn:** Erhvervspark Horsens
- **By/Lokation:** Horsens
- **Adresse:** Industriparken 24, 8700 Horsens
- **Type:** Erhverv
- **Areal:** 6,200 m²
- **Værdi:** 92 mio. DKK
- **Udlejningsgrad:** 95%
- **Opførelsesår:** 2016
- **Region:** Select "Horsens"

Click **"Publish"**

> **💡 Tip:** Create 2-3 properties now, you can add more later!

### **5.4 Capex Projects** (Optional - Create 1-2)

Click **"Capex Project"** → **"Create"**

**Example: Energioptimering Ørestad**
- **Navn:** Energioptimering Ørestad
- **Ejendom:** Kontorhuset Ørestad
- **By/Lokation:** København
- **Status:** Afsluttet (completed)
- **Investering:** 8.5 mio. DKK
- **Startdato:** 2023-03-01
- **Afslutningsdato:** 2023-11-30
- **Beskrivelse:** Omfattende energioptimeringsprojekt med installation af solceller og varmepumper
- **Før Beskrivelse:** Konventionelle energisystemer med høj CO2-udledning
- **Efter Beskrivelse:** 100% vedvarende energi med 65% reduktion i energiomkostninger

**Nøgletal (Add 2):**
1. Label: "Energibesparelse", Before: "350 kWh/m²", After: "122 kWh/m²"
2. Label: "CO2 Reduktion", Before: "185 tons/år", After: "12 tons/år"

**Fordele (Add 3):**
- 65% reduktion i energiomkostninger
- DGNB Gold certificering opnået
- Øget ejendomsværdi med 8%

**Images:** Upload before/after images or skip

Click **"Publish"**

---

## 🔗 Step 6: Connect Vercel to Sanity (2 minutes)

### **6.1 Add Environment Variables to Vercel**

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SANITY_PROJECT_ID` | `your_project_id` | Production, Preview, Development |
| `VITE_SANITY_DATASET` | `production` | Production, Preview, Development |

5. Click **"Save"**

### **6.2 Redeploy Your Vercel App**

```bash
# In your project terminal
git add .
git commit -m "Add Sanity backend configuration"
git push
```

Or in Vercel Dashboard:
- Go to **Deployments** → Click **"Redeploy"** on latest deployment

### **6.3 Configure CORS in Sanity**

This allows your Vercel app to fetch data from Sanity.

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** → **CORS Origins**
4. Click **"Add CORS origin"**
5. Add **BOTH** of these URLs:

   **For Development:**
   ```
   http://localhost:3000
   ```

   **For Production:**
   ```
   https://your-vercel-app.vercel.app
   ```

   (Replace with your actual Vercel URL)

6. Settings for each:
   - **Allow credentials:** No
   - Click **"Save"**

---

## ✅ Step 7: Test Everything (1 minute)

### **Test Local Development:**

```bash
# In one terminal: Run your React app
npm run dev
```

Visit http://localhost:3000

You should see:
- ✅ Portfolio data from Sanity
- ✅ Regions with percentages
- ✅ Properties you created
- ✅ Capex projects (if you created any)

### **Test Vercel Production:**

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Verify data loads from Sanity

### **Test Sanity Studio:**

```bash
# In another terminal: Run Sanity Studio
npm run studio
```

Visit http://localhost:3333

You should see:
- ✅ All your content
- ✅ Ability to edit and publish

---

## 🎉 You're Done!

Your complete architecture is now running:

```
┌─────────────────────────────────────────────────────┐
│  Sanity Studio (http://localhost:3333)              │
│  ↓ You edit content here                            │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Sanity Cloud (sanity.io)                           │
│  ↓ Stores your data with CDN                        │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  Your React App (Vercel)                            │
│  ↓ Fetches and displays data                        │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│  End Users                                           │
│  ↓ See your beautiful portfolio                     │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps

### **Content Management:**
```bash
# Start editing content
npm run studio
```

### **Available Commands:**
```bash
npm run dev              # Run React app (port 3000)
npm run studio           # Run Sanity Studio (port 3333)
npm run studio:build     # Build Studio for deployment
npm run studio:deploy    # Deploy Studio to Sanity's hosting
```

### **Add More Content:**
- Add all 15 properties from `src/data/portfolio.ts`
- Create all 6 Capex projects
- Upload professional images
- Add more highlights

### **Advanced Features:**
- **Real-time updates:** Implement listeners for live data
- **Image optimization:** Use Sanity's image CDN parameters
- **Draft/Publish:** Use Sanity's built-in versioning
- **Custom workflows:** Add approval processes

---

## 🔧 Troubleshooting

### **"Project ID not found" error:**
```bash
# Verify your .env.local file exists and has correct values
cat .env.local

# Restart your dev server after changing .env.local
npm run dev
```

### **CORS errors in browser console:**
- Add your URLs to Sanity CORS settings (see Step 6.3)
- Ensure URLs match exactly (http vs https, trailing slash, etc.)

### **Sanity Studio won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Try starting again
npm run studio
```

### **No data showing in app:**
1. Check browser console for errors
2. Verify you published content in Sanity (not just saved drafts)
3. Check that dataset name matches in .env.local
4. Verify Project ID is correct

### **Can't log into Sanity Studio:**
- Clear browser cache
- Try incognito/private mode
- Verify you're using the same account as sanity.io

---

## 📚 Useful Links

- **Sanity Dashboard:** https://sanity.io/manage
- **Sanity Documentation:** https://www.sanity.io/docs
- **Your Local Studio:** http://localhost:3333
- **Your Local App:** http://localhost:3000
- **Vercel Dashboard:** https://vercel.com/dashboard

---

## 💡 Pro Tips

1. **Backup Your Data:**
   ```bash
   npx sanity dataset export production backup.tar.gz
   ```

2. **Deploy Studio to Sanity Cloud (Free):**
   ```bash
   npm run studio:deploy
   ```
   Access it anywhere at: `https://your-project.sanity.studio`

3. **Use Multiple Datasets:**
   - Create a "staging" dataset for testing
   - Switch between datasets in .env.local

4. **Image Best Practices:**
   - Upload images to Sanity (not Unsplash fallback)
   - Use Sanity's CDN for automatic optimization
   - Recommended size: 1920x1080px for property images

---

## ✨ You're All Set!

Your Sanity backend is fully configured and connected to your Vercel frontend. You can now:

✅ **Manage content** via Sanity Studio
✅ **Edit on the fly** - changes reflect after refresh
✅ **Scale infinitely** - Sanity handles everything
✅ **Work anywhere** - Deploy Studio to cloud

**Need help?** Check the troubleshooting section or the existing docs in `src/SANITY_SETUP.md`

Happy content managing! 🎊
