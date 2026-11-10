import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl?: string;
  workshopTitle?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  surveyUrl
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const targetUrl = surveyUrl || (typeof window !== 'undefined' ? window.location.origin + '?mode=survey' : 'https://example.com');

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#171717',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'workshop_survey_qr.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-neutral-100 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-semibold text-white mt-1">
          สแกน QR Code เพื่อร่วมประเมิน
        </h3>
        <p className="text-xs text-neutral-400 mt-1 mb-5">
          เปิดกล้องบนมือถือเพื่อเข้าสู่แบบสอบถามทันที
        </p>

        {/* Clean QR Code Container */}
        <div className="bg-white p-3.5 rounded-xl inline-block mx-auto mb-4 shadow-xs">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Survey QR Code"
              className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-sm object-contain"
            />
          ) : (
            <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center text-neutral-400 text-xs">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* Minimal URL display and copy button */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 mb-4 flex items-center justify-between gap-2 text-left">
          <p className="text-[11px] font-mono text-neutral-400 truncate pl-1">{targetUrl}</p>
          <button
            onClick={handleCopyLink}
            className="shrink-0 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>คัดลอก</span>
              </>
            )}
          </button>
        </div>

        {/* Minimal Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleDownloadQR}
            className="w-full py-2 bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดภาพ QR Code</span>
          </button>
          
          <a
            href={targetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors flex items-center justify-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>เปิดหน้าแบบสอบถามในแท็บใหม่</span>
          </a>
        </div>
      </div>
    </div>
  );
};
