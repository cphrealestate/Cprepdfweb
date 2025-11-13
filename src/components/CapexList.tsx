import { motion } from 'motion/react';
import { ArrowRight, Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { capexProjects } from '../data/portfolio';
import { LogoButton } from './LogoButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { Breadcrumbs } from './Breadcrumbs';
import { useState, useEffect, useMemo } from 'react';
import { getCapexProjects, CapexProject as SanityCapexProject } from '../lib/sanity-queries';

interface CapexListProps {
  onBack: () => void;
  onSelectCapex: (id: string) => void;
}

export function CapexList({ onBack, onSelectCapex }: CapexListProps) {
  const [projects, setProjects] = useState(capexProjects);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  // Fetch Capex projects from Sanity
  useEffect(() => {
    async function loadProjects() {
      try {
        const sanityProjects = await getCapexProjects();
        if (sanityProjects && sanityProjects.length > 0) {
          // Adapt Sanity projects to match current format
          const adapted = sanityProjects.map(p => ({
            id: p._id,
            name: p.name,
            propertyName: p.propertyName,
            location: p.location,
            status: p.status,
            investment: p.investment,
            startDate: p.startDate,
            completionDate: p.completionDate,
            description: p.description,
            beforeDescription: p.beforeDescription,
            afterDescription: p.afterDescription,
            // Preserve Sanity image object, fallback to Unsplash if not available
            beforeImage: p.beforeImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
            afterImage: p.afterImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            keyMetrics: p.keyMetrics,
            benefits: p.benefits,
            property: p.property,
          }));
          setProjects(adapted as any);
        }
      } catch (error) {
        console.error('Error loading Capex projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Afsluttet':
        return <CheckCircle className="w-5 h-5" />;
      case 'I gang':
        return <Clock className="w-5 h-5" />;
      case 'Planlagt':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Afsluttet':
        return 'bg-green-100 text-green-800';
      case 'I gang':
        return 'bg-blue-100 text-blue-800';
      case 'Planlagt':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter projects based on selected statuses
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = selectedStatuses.size === 0 || selectedStatuses.has(project.status);
      return matchesStatus;
    });
  }, [projects, selectedStatuses]);

  // Get unique statuses from projects
  const availableStatuses = useMemo(() => {
    return ['Planlagt', 'I gang', 'Afsluttet'];
  }, []);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setSelectedStatuses(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBack} />

      {/* Header */}
      <section className="px-12 pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Forside', onClick: onBack },
              { label: 'CAPEX Projekter' }
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto"
        >
          <h1 className="font-['Crimson_Text',serif] text-[72px] leading-[86px] text-black mb-4">
            Capex Projekter
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[24px] leading-[33px] text-[#595959] max-w-[800px]">
            Investeringer i vores ejendomme for at skabe langsigtet værdi og bæredygtighed
          </p>
        </motion.div>
      </section>

      {/* Status Filter Section */}
      <section className="px-12 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6"
          >
            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mr-2">
                Filtrer efter status:
              </span>
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`flex items-center justify-center gap-1 rounded-full w-36 font-medium border px-3 h-8 text-sm transition-all ${
                    selectedStatuses.has(status)
                      ? 'bg-[#767A57] text-white border-[#767A57]'
                      : 'bg-white text-[#595959] border-[#e5e5e0] hover:border-[#767A57]'
                  }`}
                >
                  {status}
                </button>
              ))}
              {selectedStatuses.size > 0 && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-[#767A57] hover:text-[#5f6345] font-['Albert_Sans',sans-serif] text-[14px] underline"
                >
                  Nulstil filter
                </button>
              )}
            </div>

            {/* Result count */}
            <div className="mt-4 font-['Albert_Sans',sans-serif] text-[14px] text-[#595959]">
              Viser {filteredProjects.length} af {projects.length} projekter
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-12">
        {filteredProjects.length === 0 ? (
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-12 text-center"
            >
              <p className="font-['Crimson_Text',serif] text-[32px] text-black mb-4">
                Ingen projekter fundet
              </p>
              <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#595959] mb-6">
                Prøv at justere dine filtre for at se flere projekter
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#767A57] text-white rounded-lg font-['Albert_Sans',sans-serif] text-[16px] hover:bg-[#5f6345] transition-colors"
              >
                Nulstil filtre
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectCapex(project.id)}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                {typeof project.afterImage === 'object' && project.afterImage !== null ? (
                  <SanityImage
                    image={project.afterImage}
                    alt={project.name}
                    width={800}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <ImageWithFallback
                    src={project.afterImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full ${getStatusColor(project.status)} flex items-center gap-2`}>
                    {getStatusIcon(project.status)}
                    <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8">
                <h3 className="font-['Crimson_Text',serif] text-[32px] leading-[38px] text-black mb-2">
                  {project.name}
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[#595959]">
                    <MapPin className="w-4 h-4" />
                    <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                      {project.propertyName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#595959]">
                    <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                      {project.investment}
                    </span>
                  </div>
                </div>

                <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959] mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#595959]">
                    <Calendar className="w-4 h-4" />
                    <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                      {project.startDate} - {project.completionDate}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#767A57] group-hover:gap-3 transition-all">
                    <span className="font-['Albert_Sans',sans-serif] text-[16px]">
                      Se detaljer
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}