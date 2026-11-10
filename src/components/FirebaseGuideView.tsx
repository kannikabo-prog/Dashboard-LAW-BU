import React, { useState } from 'react';
import { SURVEY_HTML_TEMPLATE, DASHBOARD_HTML_TEMPLATE } from '../data/standaloneTemplates';
import {
  Download,
  Copy,
  Check,
  Code2,
  BookOpen,
  FileCode,
  Flame,
  Globe,
  ExternalLink
} from 'lucide-react';

export const FirebaseGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'survey_code' | 'dashboard_code'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firebaseRulesCode = `{
  "rules": {
    "workshop_feedback": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"]
    }
  }
}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Minimal Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-neutral-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              โค้ดแยก 2 ไฟล์ & คู่มือการใช้งาน Firebase
            </h1>
            <p className="text-xs text-neutral-400">
              ไฟล์ HTML เดี่ยวพร้อมรันได้ทันทีโดยไม่ต้องติดตั้ง Node.js
            </p>
          </div>

          {/* Quick Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadFile(SURVEY_HTML_TEMPLATE, 'index.html')}
              className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>index.html</span>
            </button>
            <button
              onClick={() => handleDownloadFile(DASHBOARD_HTML_TEMPLATE, 'dashboard.html')}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>dashboard.html</span>
            </button>
          </div>
        </div>

        {/* Minimal Tab Switchers */}
        <div className="flex items-center gap-1 border-t border-neutral-800 pt-4">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>วิธีตั้งค่า Firebase & Deploy</span>
          </button>
          <button
            onClick={() => setActiveTab('survey_code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'survey_code'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>โค้ด index.html</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard_code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dashboard_code'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>โค้ด dashboard.html</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Step-by-Step Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-4 text-neutral-800">
          
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-400">01</span>
              <h3 className="text-sm font-semibold text-neutral-900">
                สร้าง Firebase Project (ฟรีตลอดชีพ Spark Plan)
              </h3>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-600 pl-4 leading-relaxed">
              <li>ไปที่ <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-neutral-900 underline font-medium inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a> แล้วลงชื่อเข้าใช้ด้วยบัญชี Google</li>
              <li>คลิก <strong>Add project</strong> ตั้งชื่อโปรเจกต์ เช่น <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">workshop-feedback</code></li>
              <li>กด Next จนสร้างโปรเจกต์เสร็จสิ้น</li>
            </ol>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-400">02</span>
              <h3 className="text-sm font-semibold text-neutral-900">
                สร้าง Realtime Database
              </h3>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-600 pl-4 leading-relaxed">
              <li>ในเมนูด้านซ้าย เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong></li>
              <li>คลิก <strong>Create Database</strong></li>
              <li>เลือก Location เช่น <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">Singapore (asia-southeast1)</code></li>
              <li>เลือก <strong>Start in test mode</strong> แล้วกด Enable</li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-400">03</span>
              <h3 className="text-sm font-semibold text-neutral-900">
                ตั้งค่า Security Rules (ให้อ่านและเขียนได้โดยไม่ต้องล็อกอิน)
              </h3>
            </div>
            <p className="text-xs text-neutral-600">
              ไปที่แท็บ <strong>Rules</strong> ของ Realtime Database แล้ววาง JSON นี้แล้วกด <strong>Publish</strong>:
            </p>
            <div className="relative">
              <pre className="bg-neutral-950 text-neutral-300 p-3.5 rounded-lg text-xs font-mono overflow-x-auto border border-neutral-800">
                {firebaseRulesCode}
              </pre>
              <button
                onClick={() => handleCopy(firebaseRulesCode, setCopiedRules)}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedRules ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRules ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-400">04</span>
              <h3 className="text-sm font-semibold text-neutral-900">
                คัดลอก Firebase Config มาวางในโค้ดทั้ง 2 ไฟล์
              </h3>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-600 pl-4 leading-relaxed">
              <li>ไปที่รูปฟันเฟือง ⚙️ <strong>Project settings</strong> &gt; เลื่อนลงมาที่หัวข้อ <strong>Your apps</strong> &gt; คลิกไอคอนเว็บ <strong>&lt;/&gt;</strong></li>
              <li>ตั้งชื่อแอป แล้วคลิก Register app</li>
              <li>คัดลอกตัวแปร <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">firebaseConfig</code> แล้วนำไปวางแทนที่ใน <code className="font-mono">index.html</code> และ <code className="font-mono">dashboard.html</code></li>
            </ol>
          </div>

          {/* Step 5 */}
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-neutral-400">05</span>
              <h3 className="text-sm font-semibold text-neutral-900">
                นำขึ้นออนไลน์ (Deploy ฟรี)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-1">
                <span className="font-semibold text-neutral-900 block">Firebase Hosting</span>
                <p className="text-neutral-500 text-[11px]">รันคำสั่งใน Terminal:</p>
                <code className="block bg-neutral-900 text-neutral-200 p-2 rounded text-[11px] font-mono">
                  firebase init hosting{'\n'}firebase deploy
                </code>
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/70 space-y-1">
                <span className="font-semibold text-neutral-900 block">Netlify Drop หรือ GitHub Pages</span>
                <p className="text-neutral-500 text-[11px]">
                  เพียงลากโฟลเดอร์ที่มีไฟล์ไปวางที่ <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="underline text-neutral-800">app.netlify.com/drop</a> ก็จะได้ URL ทันที
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Survey Code */}
      {activeTab === 'survey_code' && (
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 sm:p-6 space-y-3 text-neutral-100">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
            <span className="font-mono text-neutral-300">index.html (หน้าตอบสำหรับมือถือ)</span>
            <button
              onClick={() => handleCopy(SURVEY_HTML_TEMPLATE, setCopiedSurvey)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedSurvey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSurvey ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
            </button>
          </div>
          <pre className="p-3 bg-neutral-900/60 rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto max-h-[500px] border border-neutral-800/80 leading-relaxed">
            {SURVEY_HTML_TEMPLATE}
          </pre>
        </div>
      )}

      {/* Tab 3: Dashboard Code */}
      {activeTab === 'dashboard_code' && (
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 sm:p-6 space-y-3 text-neutral-100">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
            <span className="font-mono text-neutral-300">dashboard.html (หน้าจอแดชบอร์ด)</span>
            <button
              onClick={() => handleCopy(DASHBOARD_HTML_TEMPLATE, setCopiedDashboard)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedDashboard ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedDashboard ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
            </button>
          </div>
          <pre className="p-3 bg-neutral-900/60 rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto max-h-[500px] border border-neutral-800/80 leading-relaxed">
            {DASHBOARD_HTML_TEMPLATE}
          </pre>
        </div>
      )}

    </div>
  );
};
