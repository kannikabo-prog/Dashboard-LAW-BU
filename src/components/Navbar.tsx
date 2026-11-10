import React from 'react';
import {
  Smartphone,
  BarChart2,
  Columns,
  BookOpen,
  QrCode,
  Settings
} from 'lucide-react';

export type AppViewMode = 'survey' | 'dashboard' | 'split' | 'guide';

interface NavbarProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  onOpenQR: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenQR,
  onOpenSettings
}) => {
  return (
    <header className="bg-neutral-950 border-b border-neutral-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap">
            WorkshopPulse
          </span>
        </div>

        {/* Zone 2: Navigation Links / Minimal segmented switcher */}
        <nav className="flex items-center gap-1 p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => onViewChange('survey')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'survey'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบมือถือ</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>แดชบอร์ด</span>
          </button>

          <button
            onClick={() => onViewChange('split')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'split'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>จอคู่สาธิต</span>
          </button>

          <button
            onClick={() => onViewChange('guide')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'guide'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>โค้ด & คู่มือ Firebase</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Settings */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="ตั้งค่า Firebase Database URL"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenQR}
            className="px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
        </div>

      </div>
    </header>
  );
};
