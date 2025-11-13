import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { capexProjects, CapexProject } from '../data/portfolio';
import { LogoButton } from './LogoButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Breadcrumbs } from './Breadcrumbs';
import { useState, useEffect } from 'react';
import { getCapexProjectById, CapexProject as SanityCapexProject } from '../lib/sanity-queries';

interface CapexDetailProps {
  capexId: string;
  onBack: () => void;
  onBackToHome: () => void;
  onSelectProperty?: (propertyId: string) => void;
}

export function CapexDetail({ capexId, onBack, onBackToHome, onSelectProperty }: CapexDetailProps) {
  const [project, setProject] = useState<CapexProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      // First try to find in hardcoded data
      const hardcodedProject = capexProjects.find((p) => p.id === capexId);

      if (hardcodedProject) {
        setProject(hardcodedProject);
        setLoading(false);
        return;
      }

      // If not found, try to fetch from Sanity
      try {
        const sanityProject = await getCapexProjectById(capexId);

        if (sanityProject) {
          // Adapt Sanity project to match CapexProject type
          const adapted: CapexProject = {
            id: sanityProject._id,
            name: sanityProject.name,
            propertyName: sanityProject.propertyName,
            location: sanityProject.location,
            status: sanityProject.status,
            investment: sanityProject.investment,
            startDate: sanityProject.startDate,
            completionDate: sanityProject.completionDate,
            description: sanityProject.description,
            beforeDescription: sanityProject.beforeDescription,
            afterDescription: sanityProject.afterDescription,
            // Preserve Sanity image object, fallback to Unsplash if not available
            beforeImage: sanityProject.beforeImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
            afterImage: sanityProject.afterImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            keyMetrics: sanityProject.keyMetrics,
            benefits: sanityProject.benefits,
          };
          setProject(adapted);
        }
      } catch (error) {
        console.error('Error loading capex project:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [capexId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <p className="font-['Albert_Sans',sans-serif] text-[24px] text-[#595959]">
          Indlæser projekt...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <p className="font-['Albert_Sans',sans-serif] text-[24px] text-[#595959]">
          Projekt ikke fundet
        </p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onBackToHome} />

      {/* Hero Section */}
      <section className="px-12 pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Forside', onClick: onBackToHome },
              { label: 'CAPEX Projekter', onClick: onBack },
              { label: project.name }
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="font-['Crimson_Text',serif] text-[64px] leading-[76px] text-black">
                  {project.name}
                </h1>
                <div className={`px-4 py-2 rounded-full ${getStatusColor(project.status)} flex items-center gap-2`}>
                  <span className="font-['Albert_Sans',sans-serif] text-[14px]">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Property Button - Only show if property is linked */}
              {project.property?._id && onSelectProperty && (
                <button
                  onClick={() => onSelectProperty(project.property!._id)}
                  className="bg-[#767A57] text-white px-12 py-5 rounded-lg font-['Albert_Sans',sans-serif] text-[18px] hover:bg-[#5f6345] transition-colors shadow-lg"
                >
                  Se Ejendom
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-8 mb-6">
              <div className="flex items-center gap-2 text-[#595959]">
                <MapPin className="w-5 h-5" />
                <span className="font-['Albert_Sans',sans-serif] text-[18px]">
                  {project.propertyName}, {project.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#767A57]">
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
          </motion.div>
        </div>
      </section>

      {/* Before & After Interactive Slider */}
      <section className="px-12 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Før & Efter
          </motion.h2>

          <BeforeAfterSlider
            beforeImage={project.beforeImage}
            afterImage={project.afterImage}
            beforeDescription={project.beforeDescription}
            afterDescription={project.afterDescription}
          />
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-12 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Nøgletal
          </motion.h2>
          
          <div className="grid grid-cols-4 gap-6">
            {project.keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-lg p-6"
              >
                <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mb-3">
                  {metric.label}
                </p>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-['Crimson_Text',serif] text-[24px] text-[#999] line-through">
                    {metric.before}
                  </span>
                  <TrendingUp className="w-5 h-5 text-[#767A57]" />
                </div>
                <span className="font-['Crimson_Text',serif] text-[36px] text-[#767A57]">
                  {metric.after}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-12 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Fordele & Resultater
          </motion.h2>
          
          <div className="bg-white rounded-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              {project.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-[#767A57] flex-shrink-0 mt-1" />
                  <span className="font-['Albert_Sans',sans-serif] text-[18px] leading-[27px] text-[#595959]">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}