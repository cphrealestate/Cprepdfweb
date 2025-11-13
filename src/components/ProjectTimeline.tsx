import { motion } from 'motion/react';
import { Clock, CheckCircle } from 'lucide-react';
import { ProjectPhase } from '../lib/sanity-queries';

interface ProjectTimelineProps {
  currentPhase?: ProjectPhase;
  completedPhases?: ProjectPhase[];
  progressPercentage?: number;
  status: 'Planlagt' | 'I gang' | 'Afsluttet';
}

const PHASES: ProjectPhase[] = [
  'Skitseprojekt',
  'Lokalplan',
  'Byggetilladelse',
  'Projektering',
  'Byggeri',
  'Udlejning',
];

export function ProjectTimeline({
  currentPhase,
  completedPhases = [],
  progressPercentage,
  status,
}: ProjectTimelineProps) {
  // Calculate progress percentage if not provided
  const currentPhaseIndex = currentPhase ? PHASES.indexOf(currentPhase) : -1;
  const calculatedProgress = currentPhase
    ? Math.round((currentPhaseIndex / (PHASES.length - 1)) * 100)
    : status === 'Afsluttet'
    ? 100
    : status === 'I gang'
    ? 50
    : 0;

  const displayProgress = progressPercentage ?? calculatedProgress;

  // Calculate progress line width based on current phase
  const lineProgress = currentPhase
    ? (currentPhaseIndex / (PHASES.length - 1)) * 100
    : status === 'Afsluttet'
    ? 100
    : status === 'I gang'
    ? 40
    : 0;

  // Get status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'Planlagt':
        return { bg: '#FED7AA', text: '#9A3412' };
      case 'I gang':
        return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'Afsluttet':
        return { bg: '#DCFCE7', text: '#166534' };
      default:
        return { bg: '#F3F4F6', text: '#595959' };
    }
  };

  const statusColor = getStatusColor();

  // Check if a phase is completed
  const isPhaseCompleted = (phase: ProjectPhase) => {
    return completedPhases.includes(phase);
  };

  // Check if a phase is current
  const isPhaseActive = (phase: ProjectPhase) => {
    return phase === currentPhase;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg p-10 mb-12"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-16 px-4">
        {/* Left - Progress Percentage */}
        <div className="ml-4">
          <p className="font-['Albert_Sans',sans-serif] text-[18px] text-[#595959] mb-3">
            Status
          </p>
          <p className="font-['Crimson_Text',serif] text-[36px] leading-[43px] text-[#767A57]">
            {displayProgress}% Gennemført
          </p>
        </div>

        {/* Right - Status Badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full mr-4"
          style={{ backgroundColor: statusColor.bg }}
        >
          <Clock className="w-4 h-4" style={{ color: statusColor.text }} />
          <span
            className="font-['Albert_Sans',sans-serif] text-[14px]"
            style={{ color: statusColor.text }}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mb-6 px-8">
        {/* Background Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#E5E7EB] transform -translate-y-1/2 z-0" />

        {/* Progress Line */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${lineProgress}%` }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
          className="absolute top-1/2 left-8 h-1 bg-[#767A57] transform -translate-y-1/2 z-0"
        />

        {/* Phase Steps */}
        <div className="relative z-10 flex justify-between">
          {PHASES.map((phase, index) => {
            const completed = isPhaseCompleted(phase);
            const active = isPhaseActive(phase);

            return (
              <motion.div
                key={phase}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="flex flex-col items-center"
              >
                {/* Circle */}
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-4 transition-all ${
                    completed
                      ? 'bg-[#767A57] border-[#767A57]'
                      : active
                      ? 'bg-white border-[#767A57] shadow-[0_10px_25px_rgba(118,122,87,0.3)]'
                      : 'bg-white border-[#D1D5DB]'
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : active ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-4 h-4 bg-[#767A57] rounded-full"
                    />
                  ) : (
                    <span className="font-['Crimson_Text',serif] text-[24px] text-[#595959]">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`font-['Albert_Sans',sans-serif] text-[14px] text-center mb-1 max-w-[100px] ${
                    completed || active ? 'text-[#767A57] font-medium' : 'text-[#595959]'
                  }`}
                >
                  {phase}
                </p>

                {/* Status Text */}
                {active && (
                  <p className="font-['Albert_Sans',sans-serif] text-[12px] text-[#767A57]">
                    Aktuel fase
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <div className="bg-[#F3F4F6] rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${displayProgress}%` }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(to right, #767A57, #8B8F64)',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
