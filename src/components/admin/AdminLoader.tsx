interface AdminLoaderProps {
  label?: string;
  variant?: 'cards' | 'list' | 'spinner';
  count?: number;
}

const CardSkeleton = () => (
  <div className="admin-grid-card overflow-hidden rounded-[30px]">
    <div className="aspect-video animate-pulse" style={{ background: 'var(--admin-border)' }} />
    <div className="space-y-4 p-6">
      <div className="h-5 w-3/4 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
        <div className="h-3 w-5/6 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
        <div className="h-3 w-4/6 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 w-20 animate-pulse rounded-xl" style={{ background: 'var(--admin-border)' }} />
        <div className="h-8 w-16 animate-pulse rounded-xl" style={{ background: 'var(--admin-border)' }} />
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="admin-grid-card rounded-[24px] p-5">
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-full" style={{ background: 'var(--admin-border)' }} />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
        <div className="h-3 w-2/3 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
        <div className="h-3 w-1/2 animate-pulse rounded-md" style={{ background: 'var(--admin-border)' }} />
      </div>
    </div>
  </div>
);

const Spinner = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <div
      className="h-10 w-10 animate-spin rounded-full border-[3px]"
      style={{
        borderColor: 'var(--admin-border)',
        borderTopColor: 'var(--admin-purple)',
      }}
    />
    {label && (
      <p className="text-sm font-medium" style={{ color: 'var(--admin-text-muted)' }}>
        {label}
      </p>
    )}
  </div>
);

const AdminLoader = ({ label = 'Loading...', variant = 'cards', count = 4 }: AdminLoaderProps) => {
  if (variant === 'spinner') {
    return <Spinner label={label} />;
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <ListSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default AdminLoader;
