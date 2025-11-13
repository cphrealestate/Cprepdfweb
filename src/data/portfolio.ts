// Portfolio overview data
export const portfolioData = {
  title: "Copenhagen Real Estate",
  description: "En omfattende oversigt over vores ejendomsinvesteringer i Danmark",
  stats: {
    totalProperties: 15,
    totalArea: "125,000 m²",
    totalValue: "2.5 mia. DKK",
    occupancyRate: "96%"
  },
  regions: [
    { name: "Storkøbenhavn", percentage: 30, properties: 5 },
    { name: "Horsens", percentage: 23, properties: 3 },
    { name: "Kolding", percentage: 21, properties: 3 },
    { name: "Århus", percentage: 5, properties: 1 },
    { name: "Randers", percentage: 13, properties: 2 },
    { name: "Varde", percentage: 8, properties: 1 }
  ],
  regionProperties: {
    "Storkøbenhavn": [
      { name: "Kontorhuset Ørestad", address: "Ørestads Boulevard 73, 2300 København S", area: "8,500 m²", totalRent: "15.7 mio. DKK/år" },
      { name: "Kalvebod Brygge 45", address: "Kalvebod Brygge 45, 1560 København V", area: "11,200 m²", totalRent: "22.4 mio. DKK/år" },
      { name: "Nordhavn Office", address: "Sundkrogsgade 21, 2100 København Ø", area: "9,800 m²", totalRent: "18.6 mio. DKK/år" },
      { name: "Islands Brygge 43", address: "Islands Brygge 43, 2300 København S", area: "6,500 m²", totalRent: "12.3 mio. DKK/år" },
      { name: "Vester Voldgade 10", address: "Vester Voldgade 10, 1552 København V", area: "7,200 m²", totalRent: "14.4 mio. DKK/år" }
    ],
    "Horsens": [
      { name: "City Tower Horsens", address: "Søndergade 45, 8000 Horsens C", area: "12,000 m²", totalRent: "21.6 mio. DKK/år" },
      { name: "Horsens Ø Business", address: "Værkmestergade 2, 8000 Horsens C", area: "8,900 m²", totalRent: "15.1 mio. DKK/år" },
      { name: "Europaplads 16", address: "Europaplads 16, 8000 Horsens C", area: "7,600 m²", totalRent: "13.3 mio. DKK/år" }
    ],
    "Kolding": [
      { name: "Campus Kolding", address: "Nørregade 15, 5000 Kolding C", area: "6,800 m²", totalRent: "11.6 mio. DKK/år" },
      { name: "Kolding Port", address: "Havnegade 32, 5000 Kolding C", area: "9,100 m²", totalRent: "15.5 mio. DKK/år" },
      { name: "Kolding Waterfront", address: "Stigsborg Havnevej 8, 9400 Nørresundby", area: "8,800 m²", totalRent: "14.1 mio. DKK/år" }
    ],
    "Århus": [
      { name: "Boulevarden 13", address: "Boulevarden 13, 9000 Århus", area: "7,400 m²", totalRent: "12.6 mio. DKK/år" }
    ],
    "Randers": [
      { name: "Randers Business Center", address: "Nørregade 15, 5000 Randers C", area: "6,800 m²", totalRent: "11.6 mio. DKK/år" },
      { name: "Randers Port", address: "Havnegade 32, 5000 Randers C", area: "9,100 m²", totalRent: "15.5 mio. DKK/år" }
    ],
    "Varde": [
      { name: "Varde Business Center", address: "Nørregade 15, 5000 Varde C", area: "6,800 m²", totalRent: "11.6 mio. DKK/år" }
    ]
  },
  highlights: [
    {
      title: "Stærk geografisk spredning",
      description: "Vores portefølje er strategisk placeret i de fire største byer i Danmark"
    },
    {
      title: "Høj udlejningsgrad",
      description: "96% udlejningsgrad på tværs af hele porteføljen sikrer stabile indtægter"
    },
    {
      title: "Moderne erhvervsejendomme",
      description: "Fokus på kontorer og mixede anvendelser i attraktive beliggenhed"
    }
  ]
};

// Individual properties data
export interface Property {
  id: string;
  name: string;
  location: string;
  address: string;
  type: string;
  area: string;
  value: string;
  totalRent?: string;
  occupancy: string;
  yearBuilt: number;
  description: string;
  images: any[]; // Can be Sanity images, videos, or URL strings
  keyFacts: Array<{
    label: string;
    value: string;
  }>;
  distances?: Array<{
    location: string;
    distance: string;
  }>;
  tenants?: Array<{
    name: string;
    type: string;
    address: string;
    area: number;
    yearlyRent: number;
    rentPerSqm: number;
  }>;
  tenantDistribution?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

export const properties: Property[] = [
  {
    id: "prop-1",
    name: "Kontorhuset Ørestad",
    location: "København",
    address: "Ørestads Boulevard 73, 2300 København S",
    type: "Kontor",
    area: "8,500 m²",
    value: "185 mio. DKK",
    totalRent: "12.0 mio. DKK/år",
    occupancy: "100%",
    yearBuilt: 2019,
    description: "Moderne kontorejendom i hjertet af Ørestad med fremragende offentlig transport og faciliteter.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200"
    ],
    keyFacts: [
      { label: "Lejere", value: "6 virksomheder" },
      { label: "Gennemsnitlig leje", value: "1,850 DKK/m²" },
      { label: "Energimærke", value: "A" },
      { label: "P-pladser", value: "85 stk" }
    ],
    distances: [
      { location: "Københavns Lufthavn", distance: "8 km" },
      { location: "København H", distance: "6 km" },
      { location: "Bella Center", distance: "2 km" }
    ],
    tenants: [
      { name: "TechStart ApS", type: "IT", address: "Ørestads Boulevard 73, 2. sal", area: 1500, yearlyRent: 2850000, rentPerSqm: 1900 },
      { name: "Creative Agency", type: "Marketing", address: "Ørestads Boulevard 73, 3. sal", area: 1000, yearlyRent: 1800000, rentPerSqm: 1800 },
      { name: "Nordic Consulting", type: "Rådgivning", address: "Ørestads Boulevard 73, 4. sal", area: 1200, yearlyRent: 2160000, rentPerSqm: 1800 },
      { name: "Wellness Klinik", type: "Sundhed", address: "Ørestads Boulevard 73, 5. sal", area: 800, yearlyRent: 1520000, rentPerSqm: 1900 },
      { name: "Design Studio", type: "Design", address: "Ørestads Boulevard 73, 6. sal", area: 900, yearlyRent: 1620000, rentPerSqm: 1800 },
      { name: "Law Partners", type: "Advokat", address: "Ørestads Boulevard 73, 7. sal", area: 1100, yearlyRent: 2090000, rentPerSqm: 1900 }
    ],
    tenantDistribution: [
      { category: "IT", count: 1, percentage: 16.67 },
      { category: "Marketing", count: 1, percentage: 16.67 },
      { category: "Rådgivning", count: 1, percentage: 16.67 },
      { category: "Sundhed", count: 1, percentage: 16.67 },
      { category: "Design", count: 1, percentage: 16.67 },
      { category: "Advokat", count: 1, percentage: 16.67 }
    ]
  },
  {
    id: "prop-2",
    name: "City Tower Aarhus",
    location: "Aarhus",
    address: "Søndergade 45, 8000 Aarhus C",
    type: "Blandet",
    area: "12,000 m²",
    value: "245 mio. DKK",
    totalRent: "18.5 mio. DKK/år",
    occupancy: "95%",
    yearBuilt: 2021,
    description: "Ikonisk højhus i Aarhus centrum med kontorer, detailhandel og cafe i stueetagen.",
    images: [
      "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200"
    ],
    keyFacts: [
      { label: "Etager", value: "12" },
      { label: "Detailhandel", value: "800 m²" },
      { label: "Energimærke", value: "A" },
      { label: "P-kælder", value: "120 stk" }
    ],
    distances: [
      { location: "Aarhus H", distance: "1.2 km" },
      { location: "ARoS", distance: "500 m" },
      { location: "Dokk1", distance: "800 m" }
    ]
  },
  {
    id: "prop-3",
    name: "Campus Odense",
    location: "Odense",
    address: "Nørregade 15, 5000 Odense C",
    type: "Kontor",
    area: "6,800 m²",
    value: "125 mio. DKK",
    totalRent: "9.8 mio. DKK/år",
    occupancy: "92%",
    yearBuilt: 2018,
    description: "Fleksibel kontorejendom tæt på Odense Banegård med moderne faciliteter.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      "https://images.unsplash.com/photo-1497366811353-6870c455e76e?w=1200"
    ],
    keyFacts: [
      { label: "Lejere", value: "8 virksomheder" },
      { label: "Mødecenter", value: "Ja" },
      { label: "Energimærke", value: "B" },
      { label: "P-pladser", value: "45 stk" }
    ]
  }
];

// Capex Projects data
export type ProjectPhase = 'Skitseprojekt' | 'Lokalplan' | 'Byggetilladelse' | 'Projektering' | 'Byggeri' | 'Udlejning';

export interface CapexProject {
  id: string;
  name: string;
  propertyName: string;
  location: string;
  status: "Planlagt" | "I gang" | "Afsluttet";
  currentPhase?: ProjectPhase;
  completedPhases?: ProjectPhase[];
  progressPercentage?: number;
  investment: string;
  startDate: string;
  completionDate: string;
  description: string;
  beforeDescription: string;
  afterDescription: string;
  beforeImage: string | any; // Can be URL string or Sanity image object
  afterImage: string | any;  // Can be URL string or Sanity image object
  images?: any[]; // Array of image/video media items
  keyMetrics: Array<{
    label: string;
    before: string;
    after: string;
  }>;
  benefits: string[];
}

export const capexProjects: CapexProject[] = [
  {
    id: "capex-1",
    name: "Facade Renovering & Energioptimering",
    propertyName: "Kontorhuset Ørestad",
    location: "København",
    status: "Afsluttet",
    currentPhase: "Udlejning",
    completedPhases: ["Skitseprojekt", "Lokalplan", "Byggetilladelse", "Projektering", "Byggeri", "Udlejning"],
    progressPercentage: 100,
    investment: "12.5 mio. DKK",
    startDate: "Januar 2024",
    completionDate: "Juni 2024",
    description: "Komplet facade renovering med forbedret isolering og installation af nye energieffektive vinduer for at reducere energiforbrug og øge lejerkomfort.",
    beforeDescription: "Bygningen havde en forældet facade fra 2005 med enkeltrammede vinduer og utilstrækkelig isolering, hvilket resulterede i høje energiomkostninger.",
    afterDescription: "Ny moderne facade med trelagsrude, forbedret isolering og automatiseret solafskærmning. Energimærke opgraderet fra C til A.",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    keyMetrics: [
      { label: "Energiforbrug", before: "145 kWh/m²/år", after: "65 kWh/m²/år" },
      { label: "CO2 Reduktion", before: "-", after: "55%" },
      { label: "Årlig Besparelse", before: "-", after: "285,000 DKK" },
      { label: "Energimærke", before: "C", after: "A" }
    ],
    benefits: [
      "55% reduktion i energiforbrug",
      "Forbedret indeklima for lejere",
      "Øget ejendomsværdi",
      "Lavere driftsomkostninger",
      "Moderne og attraktiv facade"
    ]
  },
  {
    id: "capex-2",
    name: "Fællesarealer Modernisering",
    propertyName: "City Tower Aarhus",
    location: "Aarhus",
    status: "I gang",
    currentPhase: "Projektering",
    completedPhases: ["Skitseprojekt", "Lokalplan", "Byggetilladelse"],
    progressPercentage: 60,
    investment: "8.2 mio. DKK",
    startDate: "Marts 2024",
    completionDate: "August 2024",
    description: "Omfattende renovering af lobby, elevator og fællesarealer med fokus på moderne design og forbedret brugeroplevelse.",
    beforeDescription: "Utidssvarende indretning fra 2010 med slidte overflader og manglende moderne faciliteter som digital adgangskontrol.",
    afterDescription: "Moderne skandinavisk design med naturlige materialer, digital adgangskontrol, og fleksible loungeområder.",
    beforeImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&q=80",
    keyMetrics: [
      { label: "Lejertilfredshed", before: "72%", after: "94%" },
      { label: "Besøgstal", before: "850/måned", after: "1,200/måned" },
      { label: "Digital Integration", before: "Ingen", after: "100%" },
      { label: "Markedsværdi", before: "245 mio.", after: "265 mio." }
    ],
    benefits: [
      "Markant forbedret lejertilfredshed",
      "Øget attraktion for potentielle lejere",
      "Moderne sikkerhedssystemer",
      "Fleksible mødezoner",
      "8% stigning i ejendomsværdi"
    ]
  },
  {
    id: "capex-3",
    name: "Tagterrasse & Grønne Områder",
    propertyName: "Campus Odense",
    location: "Odense",
    status: "I gang",
    investment: "6.5 mio. DKK",
    startDate: "September 2024",
    completionDate: "December 2024",
    description: "Udvikling af tagterrasse med grønne områder, udendørs arbejdspladser og sociale zoner for at tilbyde lejere moderne outdoor faciliteter.",
    beforeDescription: "Ubrugt tagområde uden adgang eller faciliteter.",
    afterDescription: "1,200 m² tagterrasse med beplantning, siddepladser, udendørs mødelokaler og BBQ-område.",
    beforeImage: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80",
    keyMetrics: [
      { label: "Anvendelig Areal", before: "0 m²", after: "1,200 m²" },
      { label: "Grøn Dækning", before: "0%", after: "40%" },
      { label: "Lejeforespørgsler", before: "12/år", after: "Est. 45/år" },
      { label: "Leje Premium", before: "-", after: "+8%" }
    ],
    benefits: [
      "Unikt differentiationspunkt",
      "Forbedret medarbejdervelvære",
      "Bidrag til bæredygtighedsmål",
      "Øget markedsføringsværdi",
      "Forventet lejepremium på 8%"
    ]
  },
  {
    id: "capex-4",
    name: "Solcelleanlæg Installation",
    propertyName: "Kontorhuset Ørestad",
    location: "København",
    status: "Planlagt",
    investment: "4.8 mio. DKK",
    startDate: "Februar 2025",
    completionDate: "Maj 2025",
    description: "Installation af 800 m² solcelleanlæg på tag for at reducere el-omkostninger og øge bæredygtighedsprofil.",
    beforeDescription: "Al elektricitet købes fra nettet med stigende omkostninger.",
    afterDescription: "Delvis selvforsyning med grøn energi, reduceret afhængighed af net og lavere driftsomkostninger.",
    beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
    keyMetrics: [
      { label: "Årlig Produktion", before: "0 kWh", after: "145,000 kWh" },
      { label: "Selvforsyning", before: "0%", after: "35%" },
      { label: "CO2 Reduktion", before: "-", after: "58 tons/år" },
      { label: "ROI Periode", before: "-", after: "8.5 år" }
    ],
    benefits: [
      "35% selvforsyning med grøn energi",
      "Årlig besparelse: 320,000 DKK",
      "Betydelig CO2 reduktion",
      "Øget ESG rating",
      "Attraktivt for bæredygtige lejere"
    ]
  },
  {
    id: "capex-5",
    name: "Smart Building Systemer",
    propertyName: "City Tower Aarhus",
    location: "Aarhus",
    status: "I gang",
    investment: "5.3 mio. DKK",
    startDate: "Oktober 2024",
    completionDate: "Februar 2025",
    description: "Implementation af intelligent bygningsstyring med IoT sensorer til optimering af energiforbrug, ventilation og komfort.",
    beforeDescription: "Manuel styring af klima og belysning med ineffektiv ressourceudnyttelse.",
    afterDescription: "Fuldt automatiseret system med AI-baseret optimering af energi, belysning og ventilation baseret på realtidsdata.",
    beforeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80",
    keyMetrics: [
      { label: "Energibesparelse", before: "-", after: "22%" },
      { label: "Indeklima Score", before: "78/100", after: "Est. 92/100" },
      { label: "Vedligehold", before: "Reaktivt", after: "Prediktivt" },
      { label: "Driftsomkostninger", before: "100%", after: "83%" }
    ],
    benefits: [
      "22% reduktion i energiforbrug",
      "Optimeret indeklima",
      "Prediktiv vedligeholdelse",
      "Reducerede driftsomkostninger",
      "Real-time overvågning og rapportering"
    ]
  },
  {
    id: "capex-6",
    name: "P-kælder EV Ladestandere",
    propertyName: "Campus Odense",
    location: "Odense",
    status: "Planlagt",
    investment: "2.1 mio. DKK",
    startDate: "Januar 2025",
    completionDate: "Marts 2025",
    description: "Installation af 30 elbil ladestandere i P-kælder for at understøtte grøn mobilitet og moderne lejerforventninger.",
    beforeDescription: "Ingen faciliteter til elbiler trods stigende efterspørgsel fra lejere.",
    afterDescription: "30 intelligente ladestandere med app-styring og betalingssystem.",
    beforeImage: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200&q=80",
    afterImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80",
    keyMetrics: [
      { label: "Ladestandere", before: "0", after: "30" },
      { label: "Ladekapacitet", before: "0 kW", after: "660 kW" },
      { label: "EV-klar", before: "0%", after: "67%" },
      { label: "Lejer Efterspørgsel", before: "Høj", after: "Dækket" }
    ],
    benefits: [
      "Dækker stigende EV efterspørgsel",
      "Moderne og attraktiv facilitet",
      "Indtægtsmulighed via ladeafgifter",
      "Understøtter bæredygtighedsmål",
      "Konkurrencefordel i markedet"
    ]
  }
];