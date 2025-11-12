import { motion } from 'motion/react';
import { Presentation } from '../lib/sanity-queries';
import { Play, FileText } from 'lucide-react';
import { LogoButton } from './LogoButton';
import { Breadcrumbs } from './Breadcrumbs';

interface PresentationListProps {
  presentations: Presentation[];
  onSelectPresentation: (presentationId: string) => void;
  onNavigateBack: () => void;
}

export function PresentationList({ presentations, onSelectPresentation, onNavigateBack }: PresentationListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] via-[#e8e8dd] to-[#767A57] overflow-y-auto pb-20">
      <LogoButton onClick={onNavigateBack} />

      {/* Header */}
      <section className="px-12 pt-20 pb-16">
        <div className="max-w-[1400px] mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Forside', onClick: onNavigateBack },
              { label: 'Præsentationer' }
            ]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] mx-auto"
        >
          <h1 className="font-['Crimson_Text',serif] text-[72px] leading-[86px] text-black mb-4">
            Præsentationer
          </h1>
          <p className="font-['Albert_Sans',sans-serif] text-[24px] leading-[33px] text-[#595959] max-w-[800px]">
            Vælg en præsentation for at starte fuld-skærm præsentations mode
          </p>
        </motion.div>
      </section>

      {/* Presentations Grid */}
      <section className="px-12 pb-20">
        <div className="max-w-[1400px] mx-auto">
          {presentations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg p-12 text-center shadow-sm"
            >
              <FileText className="w-16 h-16 text-[#999] mx-auto mb-4" />
              <h3 className="font-['Albert_Sans',sans-serif] text-[20px] text-[#595959] mb-2">
                Ingen præsentationer endnu
              </h3>
              <p className="font-['Albert_Sans',sans-serif] text-[16px] text-[#999]">
                Opret din første præsentation i Sanity Studio
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {presentations.map((presentation, index) => (
                <motion.div
                  key={presentation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => onSelectPresentation(presentation._id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-['Crimson_Text',serif] text-[32px] leading-[38px] text-black mb-2 group-hover:text-[#767A57] transition-colors">
                        {presentation.title}
                      </h3>
                      {presentation.description && (
                        <p className="font-['Albert_Sans',sans-serif] text-[16px] leading-[24px] text-[#595959]">
                          {presentation.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 rounded-full bg-[#767A57] flex items-center justify-center group-hover:bg-[#5f6345] transition-colors">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4 border-t border-[#e5e5e5]">
                    <div>
                      <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#999] mb-1">
                        Slides
                      </p>
                      <p className="font-['Albert_Sans',sans-serif] text-[18px] text-black">
                        {presentation.modules?.length || 0}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
