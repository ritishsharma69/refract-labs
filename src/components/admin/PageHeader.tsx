import type { ReactNode } from 'react';

interface Stat {
  label: string;
  value: number | string;
  helper?: string;
}

interface Pill {
  label: string;
  color: string;
}

interface PageHeaderProps {
  chip: string;
  title: string;
  description: string;
  note?: string;
  pills?: Pill[];
  stats?: Stat[];
  footerNote?: string;
  actions?: ReactNode;
}

const PageHeader = ({ chip, title, description, note, pills, stats, footerNote, actions }: PageHeaderProps) => (
  <section className="admin-surface rounded-[34px] p-6 sm:p-8 xl:p-10">
    <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
      <div className="max-w-3xl">
        <span className="admin-chip">{chip}</span>
        <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[44px]">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">{description}</p>
        {note && <p className="mt-3 text-sm text-orange-300/90">{note}</p>}
        {pills && pills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {pills.map((pill) => (
              <div key={pill.label} className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: pill.color, boxShadow: `0 0 14px ${pill.color}` }} />
                {pill.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className={`grid gap-4 ${stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="admin-form-block rounded-[26px] px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
              {stat.helper && <p className="mt-2 text-sm leading-6 text-gray-500">{stat.helper}</p>}
            </div>
          ))}
        </div>
      )}
    </div>

    {(footerNote || actions) && (
      <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
        {footerNote && <p className="max-w-2xl text-sm leading-7 text-gray-500">{footerNote}</p>}
        {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
      </div>
    )}
  </section>
);

export default PageHeader;
