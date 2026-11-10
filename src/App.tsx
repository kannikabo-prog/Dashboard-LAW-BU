import React, { useState, useEffect } from 'react';
import { Navbar, AppViewMode } from './components/Navbar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { SplitPreview } from './components/SplitPreview';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { QRCodeModal } from './components/QRCodeModal';
import { FirebaseSettingsModal } from './components/FirebaseSettingsModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('dashboard');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');

      // Detect mobile screens or explicit url mode
      const isMobile = window.innerWidth < 768;

      if (modeParam === 'survey' || (isMobile && !modeParam)) {
        setCurrentView('survey');
      } else if (modeParam === 'dashboard') {
        setCurrentView('dashboard');
      } else if (modeParam === 'split') {
        setCurrentView('split');
      } else if (modeParam === 'guide') {
        setCurrentView('guide');
      }

      // Generate direct mobile survey link
      const directUrl = `${window.location.origin}${window.location.pathname}?mode=survey`;
      setSurveyUrl(directUrl);
    }
  }, []);

  const handleViewChange = (view: AppViewMode) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', view);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      currentView === 'dashboard' || currentView === 'split' ? 'bg-neutral-950' : 'bg-neutral-50'
    }`}>
      
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenQR={() => setIsQRModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'survey' && (
          <div className="flex-1 flex items-center justify-center py-4 sm:py-8 bg-neutral-50">
            <SurveyView
              onSuccessSubmit={() => {}}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="flex-1 bg-neutral-950">
            <DashboardView
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'split' && (
          <div className="flex-1 bg-neutral-950">
            <SplitPreview
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          </div>
        )}

        {currentView === 'guide' && (
          <div className="flex-1 bg-neutral-100/60">
            <FirebaseGuideView />
          </div>
        )}
      </main>

      {/* Global QR Code Scanner Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Firebase Database Custom Settings Modal */}
      <FirebaseSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Minimal Footer */}
      <footer className={`border-t py-4 px-6 text-center text-xs transition-colors ${
        currentView === 'dashboard' || currentView === 'split'
          ? 'bg-neutral-950 text-neutral-400 border-neutral-800/80'
          : 'bg-white text-neutral-400 border-neutral-200'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Workshop Satisfaction System</span>
            <span aria-hidden="true">·</span>
            <span>Firebase Realtime Database Free Plan</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>สเกล 1-5 (Likert Scale)</span>
            <span aria-hidden="true">·</span>
            <span>ป้องกันการตอบซ้ำ</span>
            <span aria-hidden="true">·</span>
            <span>ส่งออก CSV</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
