import React from 'react';
import { SurveyView } from './SurveyView';
import { DashboardView } from './DashboardView';
import { Smartphone, Monitor } from 'lucide-react';

interface SplitPreviewProps {
  onOpenQR: () => void;
}

export const SplitPreview: React.FC<SplitPreviewProps> = ({ onOpenQR }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Quiet minimal banner */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-neutral-200 font-medium">จอคู่สาธิต (Split Simulator)</span>
          <span className="hidden sm:inline">· ส่งคำตอบทางซ้ายเพื่อดูกราฟทางขวาขยับทันที</span>
        </div>
        <span className="font-mono text-[11px] text-neutral-400">Realtime Sync</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Mobile Frame (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-neutral-400 mb-2 px-1">
            <span className="flex items-center gap-1.5 font-medium text-neutral-300">
              <Smartphone className="w-3.5 h-3.5" />
              <span>หน้าจอมือถือ</span>
            </span>
          </div>

          <div className="w-full max-w-[380px] bg-neutral-900 border border-neutral-800 rounded-[32px] p-2 shadow-xl">
            <div className="bg-neutral-50 rounded-[26px] overflow-y-auto max-h-[680px]">
              <SurveyView isEmbedded={true} />
            </div>
          </div>
        </div>

        {/* Right: Projector Live Dashboard (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="w-full flex items-center justify-between text-xs text-neutral-400 mb-2 px-1">
            <span className="flex items-center gap-1.5 font-medium text-neutral-300">
              <Monitor className="w-3.5 h-3.5" />
              <span>หน้าจอแดชบอร์ด</span>
            </span>
          </div>

          <div className="bg-neutral-950 rounded-2xl border border-neutral-800/80 overflow-hidden shadow-xl">
            <DashboardView onOpenQR={onOpenQR} isEmbedded={true} />
          </div>
        </div>

      </div>
    </div>
  );
};
