import { sanityClient } from './sanity';

// Media types for gallery (images and videos)
export type MediaItem = {
  _type: 'image';
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: any;
} | {
  _type: 'file';
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
};

// Types matching your current data structure
export interface Region {
  _id: string;
  name: string;
  percentage: number;
  propertyCount: number;
  order?: number;
}

export interface Property {
  _id: string;
  name: string;
  location: string;
  address: string;
  type: string;
  area: string;
  totalRent?: string;
  value: string;
  occupancy: string;
  yearBuilt: number;
  description: string;
  image?: any; // Sanity image object (legacy)
  images?: MediaItem[]; // Sanity image/video array
  keyFacts: Array<{
    label: string;
    value: string;
  }>;
  distances?: Array<{
    location: string;
    distance: string;
  }>;
  region?: {
    _id: string;
    name: string;
  };
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

export type ProjectPhase = 'Skitseprojekt' | 'Lokalplan' | 'Byggetilladelse' | 'Projektering' | 'Byggeri' | 'Udlejning';

export interface CapexProject {
  _id: string;
  name: string;
  propertyName: string;
  location: string;
  status: 'Planlagt' | 'I gang' | 'Afsluttet';
  currentPhase?: ProjectPhase;
  completedPhases?: ProjectPhase[];
  progressPercentage?: number;
  investment: string;
  startDate: string;
  completionDate: string;
  description: string;
  beforeDescription: string;
  afterDescription: string;
  beforeImage?: any; // Sanity image object
  afterImage?: any; // Sanity image object
  images?: MediaItem[]; // Sanity image/video array
  keyMetrics: Array<{
    label: string;
    before: string;
    after: string;
  }>;
  benefits: string[];
  property?: {
    _id: string;
    name: string;
  };
}

export interface PortfolioSettings {
  _id: string;
  title: string;
  description: string;
  totalProperties?: number;
  totalArea?: string;
  totalValue?: string;
  totalRent?: string;
  highlights?: Array<{
    title: string;
    description: string;
  }>;
}

export interface PresentationModule {
  moduleType: 'portfolioOverview' | 'property' | 'region' | 'capex' | 'allProperties' | 'allCapex' | 'custom';
  property?: Property;
  region?: Region;
  capexProject?: CapexProject;
  customTitle?: string;
  customContent?: any;
  customImage?: any;
}

export interface Presentation {
  _id: string;
  title: string;
  description?: string;
  modules: PresentationModule[];
  presentationType?: 'slideshow' | 'property';
  property?: Property;
}

// Fetch portfolio settings
export async function getPortfolioSettings(): Promise<PortfolioSettings | null> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return null;
  }
  
  const query = `*[_type == "portfolioSettings"][0]{
    _id,
    title,
    description,
    totalProperties,
    totalArea,
    totalValue,
    totalRent,
    highlights
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching portfolio settings:', error);
    return null;
  }
}

// Fetch all regions
export async function getRegions(): Promise<Region[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }
  
  const query = `*[_type == "region"] | order(order asc){
    _id,
    name,
    percentage,
    "propertyCount": propertyCount,
    order
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

// Fetch properties by region
export async function getPropertiesByRegion(regionName: string): Promise<Property[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }
  
  const query = `*[_type == "property" && location == $regionName]{
    _id,
    name,
    address,
    area,
    totalRent
  }`;
  
  try {
    return await sanityClient.fetch(query, { regionName });
  } catch (error) {
    console.error('Error fetching properties by region:', error);
    return [];
  }
}

// Fetch all properties
export async function getProperties(): Promise<Property[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }
  
  const query = `*[_type == "property"] | order(name asc){
    _id,
    name,
    location,
    address,
    type,
    area,
    totalRent,
    value,
    occupancy,
    yearBuilt,
    description,
    image,
    images,
    keyFacts,
    distances,
    tenants,
    tenantDistribution,
    region->{
      _id,
      name
    }
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Fetch single property by ID
export async function getPropertyById(id: string): Promise<Property | null> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return null;
  }
  
  const query = `*[_type == "property" && _id == $id][0]{
    _id,
    name,
    location,
    address,
    type,
    area,
    totalRent,
    value,
    occupancy,
    yearBuilt,
    description,
    image,
    images,
    keyFacts,
    distances,
    tenants,
    tenantDistribution,
    region->{
      _id,
      name
    }
  }`;
  
  try {
    return await sanityClient.fetch(query, { id });
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Fetch all Capex projects
export async function getCapexProjects(): Promise<CapexProject[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }
  
  const query = `*[_type == "capexProject"] | order(startDate desc){
    _id,
    name,
    propertyName,
    location,
    status,
    currentPhase,
    completedPhases,
    progressPercentage,
    investment,
    startDate,
    completionDate,
    description,
    beforeDescription,
    afterDescription,
    beforeImage{
      ...,
      asset->
    },
    afterImage{
      ...,
      asset->
    },
    images,
    keyMetrics,
    benefits,
    property->{
      _id,
      name
    }
  }`;
  
  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching capex projects:', error);
    return [];
  }
}

// Fetch single Capex project by ID
export async function getCapexProjectById(id: string): Promise<CapexProject | null> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return null;
  }
  
  const query = `*[_type == "capexProject" && _id == $id][0]{
    _id,
    name,
    propertyName,
    location,
    status,
    currentPhase,
    completedPhases,
    progressPercentage,
    investment,
    startDate,
    completionDate,
    description,
    beforeDescription,
    afterDescription,
    beforeImage{
      ...,
      asset->
    },
    afterImage{
      ...,
      asset->
    },
    images,
    keyMetrics,
    benefits,
    property->{
      _id,
      name
    }
  }`;
  
  try {
    return await sanityClient.fetch(query, { id });
  } catch (error) {
    console.error('Error fetching capex project:', error);
    return null;
  }
}

// Fetch Capex projects for a specific property
export async function getCapexProjectsByPropertyId(propertyId: string): Promise<CapexProject[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }

  const query = `*[_type == "capexProject" && property._ref == $propertyId] | order(startDate desc){
    _id,
    name,
    propertyName,
    location,
    status,
    currentPhase,
    completedPhases,
    progressPercentage,
    investment,
    startDate,
    completionDate,
    description,
    beforeDescription,
    afterDescription,
    beforeImage{
      ...,
      asset->
    },
    afterImage{
      ...,
      asset->
    },
    images,
    keyMetrics,
    benefits,
    property->{
      _id,
      name
    }
  }`;

  try {
    return await sanityClient.fetch(query, { propertyId });
  } catch (error) {
    console.error('Error fetching capex projects for property:', error);
    return [];
  }
}

// Fetch all presentations
export async function getPresentations(): Promise<Presentation[]> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return [];
  }

  const query = `*[_type == "presentation"] | order(_createdAt desc){
    _id,
    title,
    description,
    modules[]{
      moduleType,
      property->{
        _id,
        name,
        location,
        address,
        type,
        area,
        totalRent,
        value,
        occupancy,
        yearBuilt,
        description,
        image,
        images,
        keyFacts,
        distances,
        tenants,
        tenantDistribution,
        region->{
          _id,
          name
        }
      },
      region->{
        _id,
        name,
        percentage,
        "propertyCount": propertyCount
      },
      capexProject->{
        _id,
        name,
        propertyName,
        location,
        status,
        investment,
        startDate,
        completionDate,
        description,
        beforeDescription,
        afterDescription,
        beforeImage{
          ...,
          asset->
        },
        afterImage{
          ...,
          asset->
        },
        keyMetrics,
        benefits
      },
      customTitle,
      customContent,
      customImage
    }
  }`;

  try {
    return await sanityClient.fetch(query);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    return [];
  }
}

// Fetch single presentation by ID
export async function getPresentationById(id: string): Promise<Presentation | null> {
  if (!sanityClient) {
    console.log('Sanity not configured - using fallback data');
    return null;
  }

  const query = `*[_type == "presentation" && _id == $id][0]{
    _id,
    title,
    description,
    presentationType,
    property->{
      _id,
      name,
      location,
      address,
      type,
      area,
      value,
      occupancy,
      yearBuilt,
      description,
      image,
      images,
      keyFacts,
      distances,
      tenants,
      tenantDistribution
    },
    modules[]{
      moduleType,
      property->{
        _id,
        name,
        location,
        address,
        type,
        area,
        totalRent,
        value,
        occupancy,
        yearBuilt,
        description,
        image,
        images,
        keyFacts,
        distances,
        tenants,
        tenantDistribution,
        region->{
          _id,
          name
        }
      },
      region->{
        _id,
        name,
        percentage,
        "propertyCount": propertyCount
      },
      capexProject->{
        _id,
        name,
        propertyName,
        location,
        status,
        investment,
        startDate,
        completionDate,
        description,
        beforeDescription,
        afterDescription,
        beforeImage{
          ...,
          asset->
        },
        afterImage{
          ...,
          asset->
        },
        keyMetrics,
        benefits
      },
      customTitle,
      customContent,
      customImage
    }
  }`;

  try {
    return await sanityClient.fetch(query, { id });
  } catch (error) {
    console.error('Error fetching presentation:', error);
    return null;
  }
}