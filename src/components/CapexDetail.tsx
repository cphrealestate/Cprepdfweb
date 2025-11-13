import { motion } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, TrendingUp, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { capexProjects, CapexProject } from '../data/portfolio';
import { LogoButton } from './LogoButton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SanityImage } from './SanityImage';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Breadcrumbs } from './Breadcrumbs';
import { ProjectTimeline } from './ProjectTimeline';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getCapexProjectById, CapexProject as SanityCapexProject } from '../lib/sanity-queries';
import { isVideo, getFileUrl } from '../lib/sanity';

export function CapexDetail() {
  const { id: capexId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!capexId) {
    return <Navigate to="/capex" replace />;
  }
  const [project, setProject] = useState<CapexProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
            currentPhase: sanityProject.currentPhase,
            completedPhases: sanityProject.completedPhases,
            progressPercentage: sanityProject.progressPercentage,
            investment: sanityProject.investment,
            startDate: sanityProject.startDate,
            completionDate: sanityProject.completionDate,
            description: sanityProject.description,
            beforeDescription: sanityProject.beforeDescription,
            afterDescription: sanityProject.afterDescription,
            // Preserve Sanity image object, fallback to Unsplash if not available
            beforeImage: sanityProject.beforeImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
            afterImage: sanityProject.afterImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
            images: sanityProject.images,
            keyMetrics: sanityProject.keyMetrics,
            benefits: sanityProject.benefits,
            property: sanityProject.property,
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

  // Gallery navigation functions
  const images = project?.images || [];
  const currentMedia = images[currentImageIndex];
  const isCurrentVideo = currentMedia && isVideo(currentMedia);
  const isSanityImage = currentMedia && currentMedia._type === 'image';

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const previousImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        previousImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, currentImageIndex, images.length]);

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
      <LogoButton onClick={() => navigate('/')} />

      {/* Hero Section */}
      <section className="px-12 pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Forside', onClick: () => navigate('/') },
              { label: 'CAPEX Projekter', onClick: () => navigate('/capex') },
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
              {project.property?._id && (
                <button
                  onClick={() => navigate(`/properties/${project.property!._id}`)}
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

      {/* Project Timeline */}
      <section className="px-12 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
          >
            Projekt Fremskridt
          </motion.h2>

          <ProjectTimeline
            currentPhase={project.currentPhase}
            completedPhases={project.completedPhases}
            progressPercentage={project.progressPercentage}
            status={project.status}
          />
        </div>
      </section>

      {/* Project Gallery */}
      {images && images.length > 0 && (
        <section className="px-12 pb-12">
          <div className="max-w-[1400px] mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="font-['Crimson_Text',serif] text-[48px] leading-[58px] text-black mb-8"
            >
              Projekt Galleri
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="aspect-[16/9] bg-[#e5e5e0] rounded-lg overflow-hidden relative group"
            >
              {/* Main media - clickable */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="cursor-pointer w-full h-full"
              >
                {isCurrentVideo ? (
                  <video
                    src={getFileUrl(currentMedia)}
                    controls
                    autoPlay={currentImageIndex === 0}
                    muted={currentImageIndex === 0}
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : isSanityImage ? (
                  <SanityImage
                    image={currentMedia}
                    alt={`${project.name} - Billede ${currentImageIndex + 1}`}
                    width={650}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src={currentMedia as string}
                    alt={`${project.name} - Billede ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Navigation buttons - show only if multiple images */}
              {images.length > 1 && (
                <>
                  {/* Previous button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previousImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-70 group-hover:opacity-100 transition-opacity"
                    aria-label="Forrige billede"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>

                  {/* Next button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-70 group-hover:opacity-100 transition-opacity"
                    aria-label="Næste billede"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>

                  {/* Dot navigation */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Gå til billede ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full font-['Albert_Sans',sans-serif] text-[14px]">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </section>
      )}

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

      {/* Lightbox/Modal for Gallery */}
      {images && images.length > 0 && (
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent
            className="w-full max-w-[calc(100%-2rem)] sm:max-w-7xl !max-w-[90vw] !w-[90vw] sm:!max-w-[90vw] flex flex-col p-0"
            style={{ maxWidth: '90vw', width: '90vw', maxHeight: '85vh' }}
          >
            {/* Hidden titles for accessibility */}
            <DialogTitle className="sr-only">
              {project.name} - Billede {currentImageIndex + 1} af {images.length}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Projekt galleri for {project.name}
            </DialogDescription>

            {/* Media section with proper flex layout */}
            <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-white" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {isCurrentVideo ? (
                <video
                  key={currentImageIndex} // Force re-mount on index change
                  src={getFileUrl(currentMedia)}
                  controls
                  autoPlay={currentImageIndex === 0}
                  muted={currentImageIndex === 0}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: 'calc(85vh - 180px)' }}
                />
              ) : isSanityImage ? (
                <SanityImage
                  image={currentMedia}
                  alt={`${project.name} - Billede ${currentImageIndex + 1}`}
                  width={1400}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageWithFallback
                  src={currentMedia as string}
                  alt={`${project.name} - Billede ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Navigation buttons - center bottom - subtle like navbar */}
            {images.length > 1 && (
              <div className="flex-shrink-0 py-2.5 flex justify-center items-center gap-3 bg-white/95 shadow-[0_-2px_10px_rgba(0,0,0,0.075)]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage(e);
                  }}
                  className="bg-transparent hover:bg-gray-50 text-gray-600 hover:text-black p-2 rounded-full transition-all"
                  aria-label="Forrige billede"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Slide indicators (prikker) */}
                <div className="flex items-center gap-1.5 px-4">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(index);
                      }}
                      className={`rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-[#767A57] w-2 h-2'
                          : 'bg-gray-300 w-1.5 h-1.5 hover:bg-gray-400'
                      }`}
                      aria-label={`Gå til billede ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e);
                  }}
                  className="bg-transparent hover:bg-gray-50 text-gray-600 hover:text-black p-2 rounded-full transition-all"
                  aria-label="Næste billede"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Project Info Bottom Bar - subtle like navbar */}
            <div className="flex-shrink-0 py-3 px-6 bg-white/95 shadow-[0_0_10px_rgba(0,0,0,0.075)]">
              <h3 className="font-['Crimson_Text',serif] text-[20px] leading-tight text-black">
                {project.name}
              </h3>
              <p className="font-['Albert_Sans',sans-serif] text-[14px] text-[#595959] mt-0.5">
                {project.location}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}