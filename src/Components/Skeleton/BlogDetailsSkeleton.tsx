import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Skeleton from './Skeleton';

export default function BlogDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex">
        <Sidebar active="myblogs" />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Skeleton className="h-5 w-36" />
            </div>

            <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="h-64 sm:h-96">
                <Skeleton className="h-full w-full rounded-none" />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <Skeleton className="h-10 w-4/5 mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>

                <div className="space-y-3 mb-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-11/12' : i % 3 === 1 ? 'w-10/12' : 'w-9/12'}`} />
                  ))}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-8">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-6 w-36" />
                </div>

                <div className="border-t pt-8">
                  <Skeleton className="h-7 w-48 mb-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-48 mb-2" />
                            <Skeleton className="h-4 w-11/12" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
