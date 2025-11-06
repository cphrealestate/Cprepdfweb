/**
 * Migration Script: Hardcoded Data → Sanity
 * 
 * Dette script hjælper dig med at migrere din hardcoded data til Sanity.
 * 
 * BRUG:
 * 1. Installer Sanity CLI: npm install -g @sanity/cli
 * 2. Login: sanity login
 * 3. Kør: sanity dataset import ./scripts/migrate-to-sanity.ndjson production
 * 
 * Eller brug Sanity's import API direkte.
 */

import { portfolioData, properties, capexProjects } from '../data/portfolio';

// Generate Sanity documents
const sanityDocuments = [];

// 1. Portfolio Settings
sanityDocuments.push({
  _type: 'portfolioSettings',
  _id: 'portfolio-settings-main',
  title: portfolioData.title,
  description: portfolioData.description,
  totalProperties: portfolioData.stats.totalProperties,
  totalArea: portfolioData.stats.totalArea,
  totalValue: portfolioData.stats.totalValue,
  occupancyRate: portfolioData.stats.occupancyRate,
  highlights: portfolioData.highlights,
});

// 2. Regions
portfolioData.regions.forEach((region, index) => {
  sanityDocuments.push({
    _type: 'region',
    _id: `region-${region.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: region.name,
    percentage: region.percentage,
    propertyCount: region.properties,
    order: index + 1,
  });
});

// 3. Properties
properties.forEach((property) => {
  sanityDocuments.push({
    _type: 'property',
    _id: property.id,
    name: property.name,
    location: property.location,
    address: property.address,
    type: property.type,
    area: property.area,
    value: property.value,
    occupancy: property.occupancy,
    yearBuilt: property.yearBuilt,
    description: property.description,
    // Note: You'll need to upload images manually in Sanity Studio
    keyFacts: property.keyFacts,
    distances: property.distances,
  });
});

// 4. Capex Projects
capexProjects.forEach((project) => {
  sanityDocuments.push({
    _type: 'capexProject',
    _id: project.id,
    name: project.name,
    propertyName: project.propertyName,
    location: project.location,
    status: project.status,
    investment: project.investment,
    startDate: project.startDate,
    completionDate: project.completionDate,
    description: project.description,
    beforeDescription: project.beforeDescription,
    afterDescription: project.afterDescription,
    // Note: You'll need to upload before/after images manually in Sanity Studio
    keyMetrics: project.keyMetrics,
    benefits: project.benefits,
  });
});

// Export as NDJSON format (newline-delimited JSON)
const ndjson = sanityDocuments.map(doc => JSON.stringify(doc)).join('\n');

console.log('=== Sanity Migration Data ===');
console.log('Generated', sanityDocuments.length, 'documents');
console.log('\nSummary:');
console.log('- Portfolio Settings: 1');
console.log('- Regions:', portfolioData.regions.length);
console.log('- Properties:', properties.length);
console.log('- Capex Projects:', capexProjects.length);
console.log('\n=== Copy the NDJSON below to a file and import it ===\n');
console.log(ndjson);

// Optional: Write to file if running in Node.js
if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    fs.writeFileSync('./migration-data.ndjson', ndjson);
    console.log('\n✅ Written to ./migration-data.ndjson');
    console.log('\nTo import, run:');
    console.log('sanity dataset import ./migration-data.ndjson production --replace');
  } catch (err) {
    console.log('\n⚠️  Could not write file, but you can copy the NDJSON above');
  }
}
