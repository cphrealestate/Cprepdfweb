import { motion } from 'motion/react';
import { Building2, TrendingUp, MapPin, Award, Loader2 } from 'lucide-react';
import { portfolioData } from '../data/portfolio';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '../assets/Symbol-Real-estate.png';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

import { getPortfolioSettings, getRegions, getPropertiesByRegion } from '../lib/sanity-queries';

interface PortfolioOverviewProps {
  onNavigateToProperties: () => void;
  onNavigateToCapex: () => void;
  onNavigateToPresentations?: () => void;
}

interface RegionProperty {
  name: string;
  address: string;
  area: string;
  totalRent: string;
}

export function PortfolioOverview({ onNavigateToProperties, onNavigateToCapex, onNavigateToPresentations }: PortfolioOverviewProps) {
  // Fallback to hardcoded data initially
  const [data, setData] = useState(portfolioData);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionPropertiesData, setRegionPropertiesData] = useState<Record<string, RegionProperty[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingRegionProperties, setLoadingRegionProperties] = useState(false);

  // Fetch data from Sanity
  useEffect(() => {
    async function loadData() {
      try {
        const [settings, regions] = await Promise.all([
          getPortfolioSettings(),
          getRegions()
        ]);

        if (settings && regions.length > 0) {
          setData({
            title: settings.title,
            description: settings.description,
            stats: {
              totalProperties: settings.totalProperties || 0,
              totalArea: settings.totalArea || '',
              totalValue: settings.totalValue || '',
              occupancyRate: settings.occupancyRate || '',
            },
            regions: regions.map(r => ({
              name: r.name,
              percentage: r.percentage,
              properties: r.propertyCount,
            })),
            highlights: settings.highlights || [],
            regionProperties: portfolioData.regionProperties, // Will be fetched per region
          });
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Fetch region properties when dialog opens
  useEffect(() => {
    async function loadRegionProperties() {
      if (selectedRegion && !regionPropertiesData[selectedRegion]) {
        setLoadingRegionProperties(true);
        try {
          const properties = await getPropertiesByRegion(selectedRegion);
          setRegionPropertiesData(prev => ({
            ...prev,
            [selectedRegion]: properties
          }));
        } catch (error) {
          console.error('Error loading region properties:', error);
        } finally {
          setLoadingRegionProperties(false);
        }
      }
    }

    loadRegionProperties();
  }, [selectedRegion, regionPropertiesData]);

  const { title, description, stats, regions, highlights, regionProperties } = data;
  const currentRegionProperties = regionPropertiesData[selectedRegion || ''] || regionProperties[selectedRegion || ''] || [];

  // Show loading state while initial data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#767A57] animate-spin mx-auto mb-4" />
          <p className="font-['Albert_Sans',sans-serif] text-[18px] text-[#595959]">
            Indlæser portefølje data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      {/* Hero Section */}
      <section className="px-12 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto"
        >
          <div className="flex items-center gap-8 mb-6">
            <h1 className="font-['Crimson_Text',serif] text-[72px] leading-[86px] text-black">
              {title}
            </h1>
            <div className="w-20 h-20 flex-shrink-0">
              <ImageWithFallback
                src={logoImage}
                alt="Copenhagen Real Estate Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <p className="font-['Albert_Sans',sans-serif] text-[24px] leading-[33px] text-[#595959] max-w-[800px]">
            {description}
          </p>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="px-12 pb-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-6">
          {[
            { label: 'Ejendomme', value: stats.totalProperties, icon: Building2 },
            { label: 'Total Areal', value: stats.totalArea, icon: MapPin },
            { label: 'Samlet Værdi', value: stats.totalValue, icon: TrendingUp },
            { label: 'Udlejningsgrad', value: stats.occupancyRate, icon: Award }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <stat.icon className="w-8 h-8 text-[#767A57] mb-4" />
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-2">
                {stat.label}
              </p>
              <p className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-black">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Regional Distribution */}
      <section className="px-12 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Geografisk Fordeling
          </motion.h2>
          
          <div className="grid grid-cols-3 gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-lg p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Albert_Sans',sans-serif] text-[24px] text-black">
                    {region.name}
                  </h3>
                  <span className="font-['Crimson_Text',serif] text-[36px] text-[#767A57]">
                    {region.percentage}%
                  </span>
                </div>
                <div className="bg-[#f5f5f0] rounded-full h-3 overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-[#767A57]"
                  />
                </div>
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                  {region.properties} ejendomme
                </p>
                <button
                  className="text-[#767A57] font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] underline"
                  onClick={() => setSelectedRegion(region.name)}
                >
                  Se Ejendomme
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="px-12 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Portefølje Højdepunkter
          </motion.h2>
          
          <div className="grid grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="bg-white rounded-lg p-8"
              >
                <h3 className="font-['Albert_Sans',sans-serif] text-[20px] text-black mb-3">
                  {highlight.title}
                </h3>
                <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to Properties */}
      <section className="px-12 pb-20">
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="flex gap-6 justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              onClick={onNavigateToProperties}
              className="bg-[#767A57] text-white px-12 py-5 rounded-lg font-['Albert_Sans',sans-serif] text-[18px] hover:bg-[#5f6345] transition-colors shadow-lg"
            >
              Se Ejendomme
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              onClick={onNavigateToCapex}
              className="bg-[#767A57] text-white px-12 py-5 rounded-lg font-['Albert_Sans',sans-serif] text-[18px] hover:bg-[#5f6345] transition-colors shadow-lg"
            >
              Se Capex Projekter
            </motion.button>
            {onNavigateToPresentations && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                onClick={onNavigateToPresentations}
                className="bg-[#767A57] text-white px-12 py-5 rounded-lg font-['Albert_Sans',sans-serif] text-[18px] hover:bg-[#5f6345] transition-colors shadow-lg"
              >
                Præsentationer
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Region Properties Dialog */}
      {selectedRegion && (
        <Dialog open={true} onOpenChange={() => setSelectedRegion(null)}>
          <DialogContent className="max-w-[1000px]">
            <DialogHeader>
              <DialogTitle className="font-['Crimson_Text',serif] text-[36px] text-black">
                Ejendomme i {selectedRegion}
              </DialogTitle>
              <DialogDescription className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
                Her er en liste over ejendomme i {selectedRegion}.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              {loadingRegionProperties ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-[#767A57] animate-spin mx-auto mb-3" />
                  <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
                    Indlæser ejendomme...
                  </p>
                </div>
              ) : currentRegionProperties.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#767A57]">
                      <th className="text-left pb-4 font-['Albert_Sans',sans-serif] text-[16px] text-black">
                        Ejendomsnavn
                      </th>
                      <th className="text-left pb-4 font-['Albert_Sans',sans-serif] text-[16px] text-black">
                        Adresse
                      </th>
                      <th className="text-right pb-4 font-['Albert_Sans',sans-serif] text-[16px] text-black">
                        Areal
                      </th>
                      <th className="text-right pb-4 font-['Albert_Sans',sans-serif] text-[16px] text-black">
                        Leje
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRegionProperties.map((property, index) => (
                      <motion.tr
                        key={property.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#e5e5e5] hover:bg-[#f5f5f0] transition-colors"
                      >
                        <td className="py-4 font-['Albert_Sans',sans-serif] text-[16px] text-black">
                          {property.name}
                        </td>
                        <td className="py-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
                          {property.address}
                        </td>
                        <td className="py-4 text-right font-['Albert_Sans',sans-serif] text-[16px] text-black">
                          {property.area}
                        </td>
                        <td className="py-4 text-right font-['Albert_Sans',sans-serif] text-[16px] text-[#767A57]">
                          {property.totalRent}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959]">
                    Ingen ejendomme fundet i denne region.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}