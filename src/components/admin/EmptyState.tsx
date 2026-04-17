import type { ReactNode } from 'react';

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ eyebrow, title, description, action }: EmptyStateProps) => (
  <div className="admin-empty-state col-span-full rounded-[32px] px-6 py-14 text-center sm:px-10">
    <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">{eyebrow}</p>
    <h3 className="mt-4 text-2xl font-semibold text-white font-['Space_Grotesk']">{title}</h3>
    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">{description}</p>
    {action && <div className="mt-6 inline-flex">{action}</div>}
  </div>
);

export default EmptyState;
