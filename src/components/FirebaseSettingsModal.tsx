import React, { useState } from 'react';
import { storageService, FirebaseConfigSetting } from '../services/storageService';
import { X, Flame, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const currentConfig = storageService.getFirebaseConfig();
  const [dbUrl, setDbUrl] = useState(currentConfig.databaseURL || '');
  const [autoSync, setAutoSync] = useState(currentConfig.autoSync || false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveFirebaseConfig({
      databaseURL: dbUrl.trim(),
      autoSync: autoSync && dbUrl.trim().length > 0
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">ตั้งค่า Firebase Realtime Database</h3>
            <p className="text-xs text-slate-400">เชื่อมต่อฐานข้อมูลภายนอก (ไม่บังคับ)</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          โดยค่าเริ่มต้น ระบบจะใช้ Realtime Sync ภายในเบราว์เซอร์และข้ามแท็บอัตโนมัติ หากคุณมี Firebase Realtime Database URL จากโปรเจกต์ของตัวเอง สามารถกรอกเพื่อเชื่อมต่อจริงได้ที่นี่:
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Firebase Database URL
            </label>
            <input
              type="text"
              placeholder="https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
              value={dbUrl}
              onChange={(e) => setDbUrl(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>ส่งข้อมูลคู่ขนานไปยัง Firebase Realtime Database REST API</span>
          </label>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>บันทึกการตั้งค่าเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-all cursor-pointer font-medium"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
