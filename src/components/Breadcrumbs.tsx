import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 mb-6 text-[14px] font-['Albert_Sans',sans-serif]"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#595959]" />
            )}

            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="flex items-center gap-1.5 text-[#767A57] hover:text-[#5f6345] transition-colors hover:underline"
              >
                {isFirst && <Home className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            ) : (
              <span className={`flex items-center gap-1.5 ${isLast ? 'text-[#595959] font-medium' : 'text-[#767A57]'}`}>
                {isFirst && <Home className="w-4 h-4" />}
                <span>{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
}
