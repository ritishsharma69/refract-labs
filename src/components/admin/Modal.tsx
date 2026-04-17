import type { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const widthMap: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

const Modal = ({ open, onClose, eyebrow, title, description, children, maxWidth = '4xl' }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`admin-modal-panel max-h-[90vh] w-full overflow-y-auto rounded-[32px] ${widthMap[maxWidth]}`}>
        <div className="flex items-start justify-between gap-4 border-b border-white/6 p-6 sm:p-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">{title}</h2>
            {description && <p className="mt-2 text-sm leading-7 text-gray-400">{description}</p>}
          </div>
          <button onClick={onClose} className="admin-icon-btn rounded-2xl p-3 text-gray-300 hover:text-white" type="button">
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
