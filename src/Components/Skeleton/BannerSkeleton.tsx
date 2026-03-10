import Skeleton from './Skeleton';

type BannerSkeletonProps = {
  isSidebarCollapsed?: boolean;
};

export default function BannerSkeleton({ isSidebarCollapsed = false }: BannerSkeletonProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0077b6] via-[#005a8c] to-[#003d5c] text-white py-20 sm:py-24 lg:py-32">
      <div className={`relative w-full ${isSidebarCollapsed ? 'px-4 sm:px-6 lg:px-8' : 'pl-0 pr-4 sm:pr-6 lg:pr-8'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <Skeleton className="h-5 w-40 bg-white/20" />
            <Skeleton className="mt-8 h-14 w-4/5 bg-white/20" />
            <Skeleton className="mt-3 h-14 w-3/5 bg-white/20" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-5 w-full bg-white/20" />
              <Skeleton className="h-5 w-11/12 bg-white/20" />
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Skeleton className="h-14 w-52 rounded-xl bg-white/20" />
              <Skeleton className="h-14 w-48 rounded-xl bg-white/20" />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Skeleton className="h-[420px] w-full rounded-none bg-white/15" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 sm:h-20 lg:h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.05"/>
          <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 95 960 100 1080 102C1200 105 1320 105 1380 105L1440 105V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>
    </section>
  );
}
