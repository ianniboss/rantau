export const CardSkeleton = ({ image = true }) => (
  <div className="overflow-hidden rounded-xl border border-line bg-panel" data-testid="skeleton-card">
    {image && <div className="skeleton h-40 w-full" />}
    <div className="space-y-3 p-5">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 6, image = true, cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) => (
  <div className={`grid gap-6 ${cols}`} data-testid="list-skeleton">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} image={image} />)}
  </div>
);

export const DetailSkeleton = () => (
  <div className="space-y-6" data-testid="detail-skeleton">
    <div className="skeleton h-64 w-full rounded-2xl" />
    <div className="skeleton h-8 w-2/3 rounded" />
    <div className="skeleton h-4 w-full rounded" />
    <div className="skeleton h-4 w-5/6 rounded" />
  </div>
);
