import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Banner from "../Banner/Banner";
import Featured from "../Featured/Featured";
import BannerSkeleton from "../../Components/Skeleton/BannerSkeleton";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const t = setTimeout(() => setIsBannerLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <Header isSidebarCollapsed={isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex">
        <Sidebar 
          active="home" 
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1">
          <div className="transition-all duration-300">
            {isBannerLoading ? <BannerSkeleton isSidebarCollapsed={isSidebarCollapsed} /> : <Banner isSidebarCollapsed={isSidebarCollapsed} />}
            <Featured isSidebarCollapsed={isSidebarCollapsed} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}