import Skeleton from './Skeleton';

export default function FeaturedSkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      {Array.from({ length: 6 }).map((_, i) => (
        <article key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-48">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <div className="p-6">
            <Skeleton className="h-5 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-5/6 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-4" />
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
