import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Skeleton from './Skeleton';

export default function MyBlogsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="flex">
        <Sidebar active="myblogs" />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <Skeleton className="h-10 w-56 mb-4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-9 w-64 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 h-48 lg:h-auto">
                      <Skeleton className="h-full w-full rounded-none" />
                    </div>
                    <div className="flex-1 p-6 lg:p-8">
                      <Skeleton className="h-7 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-5" />

                      <div className="flex flex-wrap gap-3 mb-6">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-32 rounded-xl" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-24 rounded-xl" />
                          <Skeleton className="h-10 w-24 rounded-xl" />
                          <Skeleton className="h-10 w-24 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
