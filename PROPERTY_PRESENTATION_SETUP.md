# Property Presentation Mode - Setup Guide

Denne guide viser hvordan man opdaterer Sanity CMS til at understøtte ejendomspræsentationer.

## 🎯 Oversigt

Property Presentation Mode er en ny type præsentation der viser en specifik ejendom i et flot slideshow format med 5 slides:
1. **Hero** - Stort billede + nøgletal
2. **Stats** - Detaljerede nøgletal grid
3. **Description** - Om ejendommen
4. **Details** - Billede + alle detaljer
5. **Location** - Beliggenhed & afstande (hvis tilgængelig)

## 📋 Sanity Schema Opdateringer

### 1. Opdater `presentation` schema

Tilføj disse to nye felter i jeres `sanity/schemas/presentation.ts` (eller lignende):

```typescript
export default {
  name: 'presentation',
  title: 'Presentation',
  type: 'document',
  fields: [
    // ... eksisterende felter (title, description, etc.) ...

    // 🆕 NYT FELT: Vælg præsentationstype
    {
      name: 'presentationType',
      title: 'Præsentationstype',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Slideshow', value: 'slideshow' },
          { title: 'Ejendomspræsentation', value: 'property' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required(),
      initialValue: 'slideshow'
    },

    // 🆕 NYT FELT: Vælg ejendom (kun synlig hvis type = property)
    {
      name: 'property',
      title: 'Ejendom',
      type: 'reference',
      to: [{ type: 'property' }],
      description: 'Vælg den ejendom som skal præsenteres',
      hidden: ({ document }) => document?.presentationType !== 'property',
      validation: Rule => Rule.custom((value, context) => {
        if (context.document?.presentationType === 'property' && !value) {
          return 'Vælg venligst en ejendom for ejendomspræsentationer'
        }
        return true
      })
    },

    // ... eksisterende 'modules' felt ...
    // Note: modules er kun relevant for 'slideshow' type
  ]
}
```

### 2. Opdater Sanity Studio (hvis nødvendigt)

Hvis I har custom views eller input komponenter, skal disse opdateres til at skjule/vise relevante felter baseret på `presentationType`.

## 🎨 Frontend - Allerede Implementeret

Følgende er allerede implementeret i frontend koden:

### ✅ Nye Komponenter
- `/src/components/PropertyPresentation.tsx` - Komplet ejendomspræsentation slideshow

### ✅ Opdaterede Komponenter
- `/src/components/PresentationView.tsx` - Understøtter nu både slideshow og property typer
- `/src/lib/sanity-queries.ts` - Opdateret Presentation interface og query

### ✅ Features
- 🎹 Keyboard navigation (← → Escape)
- 📱 Responsive design
- 🎨 Smooth slide transitions
- 🖼️ Understøtter både Sanity images og URL strings
- 🗺️ Automatisk location slide hvis distances findes

## 🚀 Sådan Bruger Du Det

### I Sanity Studio:

1. **Opret ny præsentation**
   - Gå til "Presentations" i Sanity
   - Klik "Create new"

2. **Vælg type**
   - Under "Præsentationstype" vælg **"Ejendomspræsentation"**
   - "Modules" feltet skjules automatisk

3. **Vælg ejendom**
   - Under "Ejendom" feltet vælg den ejendom du vil præsentere
   - Alle ejendomsdata hentes automatisk

4. **Publiser**
   - Gem og publiser præsentationen

### På Websitet:

1. Gå til **"Præsentationer"** i menuen
2. Klik på din nye ejendomspræsentation
3. Præsentationen åbnes i fullscreen mode
4. Brug **←** og **→** pil taster for at navigere
5. Tryk **Escape** eller **X** for at lukke

## 📊 Data Mapping

PropertyPresentation bruger disse felter fra Sanity:

```typescript
{
  name: string;           // Ejendomsnavn
  location: string;       // By/område
  address: string;        // Fuld adresse
  type: string;           // Type (Kontor, Blandet, etc.)
  area: string;           // Areal (8,500 m²)
  value: string;          // Værdi (185 mio. DKK)
  occupancy: string;      // Udlejningsgrad (100%)
  yearBuilt: number;      // Byggeår (2019)
  description: string;    // Beskrivelse
  images: any[];          // Billeder (Sanity image objects eller URLs)
  keyFacts: Array<{       // Ekstra fakta
    label: string;
    value: string;
  }>;
  distances?: Array<{     // Afstande (valgfrit)
    location: string;
    distance: string;
  }>;
}
```

## 🔧 Troubleshooting

### Problem: "property" feltet vises ikke
**Løsning:** Sørg for at `presentationType` er sat til 'property'

### Problem: Præsentationen viser ikke billeder
**Løsning:**
- Tjek at ejendommen har billeder i `images` array
- Verificer at billederne er published i Sanity

### Problem: Location slide vises ikke
**Løsning:** Dette er forventet - location slide vises kun hvis ejendommen har `distances` data

### Problem: Build fejl om manglende felter
**Løsning:**
- Sørg for at Sanity schema er deployed
- Genstart Sanity Studio
- Clear browser cache

## 📝 Næste Skridt

1. ✅ Opdater Sanity schema (se ovenfor)
2. ✅ Deploy Sanity schema: `npm run deploy` i Sanity mappen
3. ✅ Genstart Sanity Studio
4. ✅ Test: Opret en ejendomspræsentation
5. ✅ Deploy frontend til Vercel

## 💡 Tips

- **Mix præsentationstyper**: Du kan have både slideshow og property præsentationer
- **Genbrug ejendomme**: Samme ejendom kan bruges i flere præsentationer
- **Standard slideshow**: Hvis du ikke vælger type, bruges standard slideshow (backwards compatible)

## 🎉 Færdig!

Nu skulle ejendomspræsentationer virke! Hvis du har problemer, tjek console for fejlmeddelelser.
