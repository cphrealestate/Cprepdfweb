import { motion } from 'motion/react';
import { Building2, TrendingUp, MapPin, Award, Calendar } from 'lucide-react';
import { PresentationModule } from '../lib/sanity-queries';
import { SanityImage } from './SanityImage';
import { getImageUrl } from '../lib/sanity';
import { useState, useEffect } from 'react';
import { getPortfolioSettings, getRegions, getProperties, getCapexProjects } from '../lib/sanity-queries';

interface PresentationModuleRendererProps {
  module: PresentationModule;
}

export function PresentationModuleRenderer({ module }: PresentationModuleRendererProps) {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [regionsData, setRegionsData] = useState<any[]>([]);
  const [propertiesData, setPropertiesData] = useState<any[]>([]);
  const [capexData, setCapexData] = useState<any[]>([]);

  // Fetch data for portfolio overview, all properties, and all capex
  useEffect(() => {
    async function loadData() {
      if (module.moduleType === 'portfolioOverview') {
        const [settings, regions] = await Promise.all([
          getPortfolioSettings(),
          getRegions()
        ]);
        setPortfolioData(settings);
        setRegionsData(regions);
      } else if (module.moduleType === 'allProperties') {
        const properties = await getProperties();
        setPropertiesData(properties);
      } else if (module.moduleType === 'allCapex') {
        const capex = await getCapexProjects();
        setCapexData(capex);
      }
    }
    loadData();
  }, [module.moduleType]);

  // Portfolio Overview Module
  if (module.moduleType === 'portfolioOverview' && portfolioData) {
    return (
      <div className="space-y-12">
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[76px] text-black mb-4">
            {portfolioData.title}
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[20px] leading-[28px] text-[#595959]">
            {portfolioData.description}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Ejendomme', value: portfolioData.totalProperties, icon: Building2 },
            { label: 'Total Areal', value: portfolioData.totalArea, icon: MapPin },
            { label: 'Samlet Værdi', value: portfolioData.totalValue, icon: TrendingUp },
            { label: 'Udlejningsgrad', value: portfolioData.occupancyRate, icon: Award }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <stat.icon className="w-10 h-10 text-[#767A57] mb-4" />
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-2">
                {stat.label}
              </p>
              <p className="font-['Crimson_Text',serif] text-[42px] leading-[50px] text-black">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {regionsData.length > 0 && (
          <div>
            <h2 className="font-['Crimson_Text',serif] text-[42px] leading-[50px] text-black mb-6">
              Geografisk Fordeling
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {regionsData.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-['Albert_Sans',sans-serif] text-[20px] text-black">
                      {region.name}
                    </h3>
                    <span className="font-['Crimson_Text',serif] text-[32px] text-[#767A57]">
                      {region.percentage}%
                    </span>
                  </div>
                  <div className="bg-[#f5f5f0] rounded-full h-3 overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-[#767A57]"
                    />
                  </div>
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                    {region.propertyCount} ejendomme
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Single Property Module
  if (module.moduleType === 'property' && module.property) {
    const property = module.property;
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[77px] text-black mb-4">
            {property.name}
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[18px] text-[#767A57] flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {property.location}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Image */}
          <div>
            {property.image && (
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <SanityImage
                  image={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Key Stats */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
              Nøgletal
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Type</span>
                <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.type}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Areal</span>
                <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.area}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Værdi</span>
                <span className="font-['Crimson_Text',serif] text-[24px] text-[#767A57]">{property.value}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Udlejningsgrad</span>
                <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.occupancy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">Byggeår</span>
                <span className="font-['Albert_Sans',sans-serif] text-[18px] text-black">{property.yearBuilt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="font-['Crimson_Text',serif] text-[28px] text-black mb-4">
            Om Ejendommen
          </h2>
          <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
            {property.description}
          </p>
        </div>

        {/* Additional Info - Key Facts */}
        {property.keyFacts && property.keyFacts.length > 0 && (
          <div className="grid grid-cols-3 gap-6">
            {property.keyFacts.map((fact, index) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-2">
                  {fact.label}
                </p>
                <p className="font-['Crimson_Text',serif] text-[28px] text-black">
                  {fact.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Distances */}
        {property.distances && property.distances.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="font-['Crimson_Text',serif] text-[28px] text-black mb-6">
              Afstande
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {property.distances.map((distance, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">{distance.location}</span>
                  <span className="font-['Albert_Sans',sans-serif] text-[16px] text-black">{distance.distance}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Region Module
  if (module.moduleType === 'region' && module.region) {
    const region = module.region;
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[76px] text-black mb-4">
            {region.name}
          </h1>
          <div className="flex items-center justify-center gap-12">
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] mb-2">
                Procentdel af portefølje
              </p>
              <p className="font-['Crimson_Text',serif] text-[56px] text-[#767A57]">
                {region.percentage}%
              </p>
            </div>
            <div>
              <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] mb-2">
                Antal ejendomme
              </p>
              <p className="font-['Crimson_Text',serif] text-[56px] text-black">
                {region.propertyCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="bg-[#f5f5f0] rounded-full h-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${region.percentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-[#767A57]"
            />
          </div>
        </div>
      </div>
    );
  }

  // Capex Project Module
  if (module.moduleType === 'capex' && module.capexProject) {
    const project = module.capexProject;
    const statusColors = {
      'Planlagt': 'bg-orange-100 text-orange-800',
      'I gang': 'bg-blue-100 text-blue-800',
      'Afsluttet': 'bg-green-100 text-green-800'
    };

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[76px] text-black">
              {project.name}
            </h1>
            <div className={`px-4 py-2 rounded-full ${statusColors[project.status]}`}>
              <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-[#595959]">
              <MapPin className="w-5 h-5" />
              <span className="font-['Albert_Sans',sans-serif] text-[18px]">
                {project.propertyName}, {project.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#767A57]">
              <TrendingUp className="w-5 h-5" />
              <span className="font-['Albert_Sans',sans-serif] text-[18px]">
                Investering: {project.investment}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#595959]">
              <Calendar className="w-5 h-5" />
              <span className="font-['Albert_Sans',sans-serif] text-[18px]">
                {project.startDate} - {project.completionDate}
              </span>
            </div>
          </div>

          <p className="font-['Albert_Sans',sans-serif] text-[20px] leading-[30px] text-[#595959] max-w-[900px]">
            {project.description}
          </p>
        </div>

        {/* Before & After Images */}
        <div>
          <h2 className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8">
            Før & Efter
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {project.beforeImage && (
                <div className="h-80 overflow-hidden">
                  <SanityImage
                    image={project.beforeImage}
                    alt={`${project.name} - før`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-['Albert_Sans',sans-serif] text-[24px] text-black mb-3">
                  Før
                </h3>
                <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
                  {project.beforeDescription}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {project.afterImage && (
                <div className="h-80 overflow-hidden">
                  <SanityImage
                    image={project.afterImage}
                    alt={`${project.name} - efter`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-['Albert_Sans',sans-serif] text-[24px] text-black mb-3">
                  Efter
                </h3>
                <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
                  {project.afterDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {project.keyMetrics && project.keyMetrics.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
              Nøgletal - Forbedringer
            </h2>
            <div className="grid grid-cols-3 gap-8">
              {project.keyMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-3">
                    {metric.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-['Crimson_Text',serif] text-[28px] text-[#999] line-through">
                      {metric.before}
                    </span>
                    <span className="text-[#767A57] text-[20px]">→</span>
                    <span className="font-['Crimson_Text',serif] text-[32px] text-[#767A57] font-semibold">
                      {metric.after}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {project.benefits && project.benefits.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black mb-6">
              Resultater & Fordele
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {project.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-[#767A57] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[14px]">✓</span>
                  </div>
                  <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // All Properties Module
  if (module.moduleType === 'allProperties' && propertiesData.length > 0) {
    return (
      <div className="space-y-8">
        <h1 className="font-['Crimson_Text',serif] text-[52px] leading-[62px] text-black mb-8">
          Alle Ejendomme
        </h1>
        <div className="grid grid-cols-3 gap-6">
          {propertiesData.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              {property.image && (
                <div className="h-[180px] overflow-hidden">
                  <SanityImage
                    image={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-['Albert_Sans',sans-serif] text-[18px] text-black mb-2">
                  {property.name}
                </h3>
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-3">
                  {property.location}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <span className="text-[#595959]">Areal: </span>
                    <span className="text-black">{property.area}</span>
                  </div>
                  <div>
                    <span className="text-[#595959]">Udlejning: </span>
                    <span className="text-[#767A57]">{property.occupancy}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // All Capex Projects Module
  if (module.moduleType === 'allCapex' && capexData.length > 0) {
    const statusColors = {
      'Planlagt': 'bg-blue-100 text-blue-800',
      'I gang': 'bg-yellow-100 text-yellow-800',
      'Afsluttet': 'bg-green-100 text-green-800'
    };

    return (
      <div className="space-y-8">
        <h1 className="font-['Crimson_Text',serif] text-[52px] leading-[62px] text-black mb-8">
          Capex Projekter
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {capexData.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-['Albert_Sans',sans-serif] text-[20px] text-black">
                  {project.name}
                </h3>
                <span className={`px-3 py-1 rounded-lg font-['Albert_Sans',sans-serif] text-[12px] ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-4">
                {project.propertyName} • {project.location}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959]">
                    Investering
                  </p>
                  <p className="font-['Crimson_Text',serif] text-[24px] text-[#767A57]">
                    {project.investment}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#595959]">
                    Periode
                  </p>
                  <p className="font-['Albert_Sans',sans-serif] text-[14px] text-black">
                    {project.startDate} - {project.completionDate}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Custom Slide Module
  if (module.moduleType === 'custom') {
    return (
      <div className="space-y-8">
        {module.customTitle && (
          <h1 className="font-['Crimson_Text',serif] text-[52px] leading-[62px] text-black">
            {module.customTitle}
          </h1>
        )}

        {module.customImage && (
          <div className="rounded-lg overflow-hidden shadow-lg">
            <SanityImage
              image={module.customImage}
              alt={module.customTitle || 'Custom slide'}
              className="w-full max-h-[500px] object-contain"
            />
          </div>
        )}

        {module.customContent && (
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959] prose prose-lg max-w-none">
              {/* Render Sanity portable text here - for now just show as JSON */}
              {JSON.stringify(module.customContent)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex items-center justify-center h-full">
      <p className="font-['Albert_Sans',sans-serif] text-[20px] text-[#595959]">
        Modul type ikke understøttet: {module.moduleType}
      </p>
    </div>
  );
}
