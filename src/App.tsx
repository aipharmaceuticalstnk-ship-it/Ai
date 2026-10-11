import React, { useState } from 'react';
import { PharmaProvider, usePharma } from './context/PharmaContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DetailingPlayer } from './components/edetailing/DetailingPlayer';
import { AdminSlideManager } from './components/edetailing/AdminSlideManager';
import { DoctorDirectory } from './components/doctors/DoctorDirectory';
import { BrandCatalog } from './components/brands/BrandCatalog';
import { UserAndPatchManager } from './components/admin/UserAndPatchManager';
import { SampleManager } from './components/samples/SampleManager';
import { DailyCallReport } from './components/reporting/DailyCallReport';
import { SalesAnalytics } from './components/analytics/SalesAnalytics';

const AppContent: React.FC = () => {
  const { detailingSession } = usePharma();
  const [currentTab, setCurrentTab] = useState<string>('detailing');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Navigation conforming to the 3-Zone Contract */}
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar */}
        <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'detailing' && <AdminSlideManager />}
            {currentTab === 'doctors' && <DoctorDirectory />}
            {currentTab === 'brands' && <BrandCatalog />}
            {currentTab === 'users-patches' && <UserAndPatchManager />}
            {currentTab === 'samples' && <SampleManager />}
            {currentTab === 'reporting' && <DailyCallReport />}
            {currentTab === 'analytics' && <SalesAnalytics />}
          </div>
        </main>
      </div>

      {/* Fullscreen Interactive e-Detailing Player Overlay */}
      {detailingSession.isOpen && <DetailingPlayer />}
    </div>
  );
};

export default function App() {
  return (
    <PharmaProvider>
      <AppContent />
    </PharmaProvider>
  );
}
