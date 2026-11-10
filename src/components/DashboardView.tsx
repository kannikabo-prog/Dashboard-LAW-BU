import React, { useState, useEffect } from 'react';
import { FeedbackResponse, QUESTIONS, interpretLikertScore } from '../types/feedback';
import { storageService } from '../services/storageService';
import {
  Download,
  QrCode,
  Maximize2,
  Minimize2,
  Plus,
  RotateCcw,
  Search,
  MessageSquare
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQR: () => void;
  isEmbedded?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQR,
  isEmbedded = false
}) => {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [searchComment, setSearchComment] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const unsubscribe = storageService.subscribe((data) => {
      setResponses(data);
    });

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      unsubscribe();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const totalRespondents = responses.length;

  const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  let positiveFeedbackCount = 0;

  responses.forEach((r) => {
    sums.q1 += r.q1;
    sums.q2 += r.q2;
    sums.q3 += r.q3;
    sums.q4 += r.q4;
    sums.q5 += r.q5;

    const meanPersonal = (r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5;
    if (meanPersonal >= 3.8) {
      positiveFeedbackCount++;
    }
  });

  const questionAverages = {
    q1: totalRespondents > 0 ? sums.q1 / totalRespondents : 0,
    q2: totalRespondents > 0 ? sums.q2 / totalRespondents : 0,
    q3: totalRespondents > 0 ? sums.q3 / totalRespondents : 0,
    q4: totalRespondents > 0 ? sums.q4 / totalRespondents : 0,
    q5: totalRespondents > 0 ? sums.q5 / totalRespondents : 0
  };

  const overallMean = totalRespondents > 0
    ? (questionAverages.q1 + questionAverages.q2 + questionAverages.q3 + questionAverages.q4 + questionAverages.q5) / 5
    : 0;

  const likertInterpretation = interpretLikertScore(overallMean);
  const positivePercentage = totalRespondents > 0
    ? Math.round((positiveFeedbackCount / totalRespondents) * 100)
    : 0;

  const handleSimulate = () => {
    storageService.simulateNewResponse();
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นชุดตัวอย่างเริ่มต้นใช่หรือไม่?')) {
      storageService.resetToSeedData();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const filteredComments = responses
    .filter((r) => r.suggestion && r.suggestion.trim() !== '')
    .filter((r) => {
      if (!searchComment) return true;
      return r.suggestion?.toLowerCase().includes(searchComment.toLowerCase());
    });

  return (
    <div className={`w-full ${isEmbedded ? 'p-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'} space-y-8 text-neutral-100`}>
      
      {/* Minimal Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            ภาพรวมผลการประเมิน
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            อัปเดตแบบเรียลไทม์ · สรุปความพึงพอใจโครงการอบรม
          </p>
        </div>

        {/* Minimal Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQR}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>เปิด QR Code</span>
          </button>

          <button
            onClick={() => storageService.exportToCSV()}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            title="ส่งออกไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ส่งออก CSV</span>
          </button>

          <button
            onClick={handleSimulate}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="จำลองคำตอบ +1"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>จำลอง +1</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="รีเซ็ตข้อมูลตัวอย่าง"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="ขยายเต็มจอ"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 4 Minimal Metric Columns (Airy, clean numbers, no heavy boxes) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Metric 1: Total */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400">ผู้ตอบแบบประเมิน</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
              {totalRespondents}
            </span>
            <span className="text-xs text-neutral-400">คน</span>
          </div>
          <p className="text-[11px] text-neutral-400">ไม่ระบุตัวตน</p>
        </div>

        {/* Metric 2: Mean */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400">คะแนนเฉลี่ยรวม</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
              {overallMean > 0 ? overallMean.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-neutral-400">/ 5.00</span>
          </div>
          <p className="text-[11px] text-neutral-400">จาก 5 ด้านการประเมิน</p>
        </div>

        {/* Metric 3: Likert Level */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400">ระดับผลการประเมิน</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {totalRespondents > 0 ? likertInterpretation.level : '—'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {totalRespondents > 0 ? likertInterpretation.grade : 'เกณฑ์ Likert 5 ระดับ'}
          </p>
        </div>

        {/* Metric 4: Positive % */}
        <div className="space-y-1">
          <span className="text-xs text-neutral-400">ความพึงพอใจเชิงบวก</span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight tabular-nums">
              {positivePercentage}%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">คะแนนระดับ 4-5 ดาว</p>
        </div>

      </div>

      {/* Main Content Split: Sleek Bars & Live Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left Column: Clean Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-300">
              คะแนนเฉลี่ยรายด้าน (1.00 – 5.00)
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              ค่าเฉลี่ย
            </span>
          </div>

          {totalRespondents === 0 ? (
            <div className="py-16 text-center text-neutral-400 text-xs">
              ยังไม่มีข้อมูลการตอบแบบประเมิน
            </div>
          ) : (
            <div className="space-y-5">
              {QUESTIONS.map((q, idx) => {
                const score = questionAverages[q.id as keyof typeof questionAverages];
                const percent = Math.min(100, Math.max(0, (score / 5) * 100));
                const interp = interpretLikertScore(score);

                return (
                  <div key={q.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-baseline gap-2">
                        <span className="text-neutral-400 font-mono text-xs">{idx + 1}.</span>
                        <span className="text-neutral-200 font-medium">{q.shortLabel}</span>
                        <span className="text-neutral-400 text-xs hidden md:inline">({q.category})</span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs text-neutral-400 font-normal">{interp.level}</span>
                        <span className="font-mono text-sm font-semibold text-white tabular-nums w-10 text-right">
                          {score.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Minimal hairline progress bar */}
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Minimal 1-line Likert Scale Legend */}
          <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400 font-light">
            <span>เกณฑ์การแปลผล:</span>
            <span>4.51–5.00 มากที่สุด</span>
            <span>·</span>
            <span>3.51–4.50 มาก</span>
            <span>·</span>
            <span>2.51–3.50 ปานกลาง</span>
            <span>·</span>
            <span>1.51–2.50 น้อย</span>
            <span>·</span>
            <span>1.00–1.50 น้อยที่สุด</span>
          </div>
        </div>

        {/* Right Column: Minimal Suggestions Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neutral-400" />
              <h2 className="text-sm font-medium text-neutral-300">ข้อเสนอแนะล่าสุด</h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {filteredComments.length} ข้อความ
            </span>
          </div>

          {/* Minimal Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="ค้นหาข้อความ..."
              value={searchComment}
              onChange={(e) => setSearchComment(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
            />
          </div>

          {/* Clean Comments Stream */}
          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {filteredComments.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                {searchComment ? 'ไม่พบข้อความที่ค้นหา' : 'ยังไม่มีข้อเสนอแนะเพิ่มเติม'}
              </div>
            ) : (
              filteredComments.map((item) => {
                const mean = ((item.q1 + item.q2 + item.q3 + item.q4 + item.q5) / 5).toFixed(2);
                const timeAgo = formatTimeAgo(item.timestamp);

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-mono text-neutral-300">{mean} ★</span>
                      <span className="font-mono text-[10px] text-neutral-400">{timeAgo}</span>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed font-light">
                      {item.suggestion}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 30) return 'เมื่อสักครู่';
  if (diffSec < 60) return `${diffSec} วินาทีที่แล้ว`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ชม. ที่แล้ว`;
  return new Date(timestamp).toLocaleDateString('th-TH');
}
