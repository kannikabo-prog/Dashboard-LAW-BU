import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS, RATING_SCALES, FeedbackResponse } from '../types/feedback';
import { storageService } from '../services/storageService';
import { Check, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface SurveyViewProps {
  onSuccessSubmit?: () => void;
  isEmbedded?: boolean;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  onSuccessSubmit,
  isEmbedded = false
}) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0
  });
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<FeedbackResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const submitted = storageService.hasDeviceSubmitted();
    setHasSubmitted(submitted);
  }, []);

  const handleScoreSelect = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score
    }));
    setErrorMessage(null);
  };

  const completedQuestionsCount = Object.values(answers).filter((v) => v > 0).length;
  const progressPercent = Math.round((completedQuestionsCount / QUESTIONS.length) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const unanswered = QUESTIONS.find((q) => !answers[q.id] || answers[q.id] === 0);
    if (unanswered) {
      setErrorMessage(`กรุณาตอบให้ครบทุกข้อ (ข้อที่ยังไม่ได้ตอบ: ${unanswered.shortLabel})`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const saved = await storageService.saveResponse({
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        suggestion: suggestion.trim() || undefined
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setLastSubmittedData(saved);
      setHasSubmitted(true);
      if (onSuccessSubmit) onSuccessSubmit();
    } catch (err) {
      console.error(err);
      setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    storageService.resetDeviceSubmission();
    setHasSubmitted(false);
    setAnswers({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setSuggestion('');
    setLastSubmittedData(null);
    setErrorMessage(null);
  };

  return (
    <div className={`w-full mx-auto ${isEmbedded ? 'max-w-md p-4' : 'max-w-lg px-4 py-8'}`}>
      
      {/* Already Submitted State */}
      {hasSubmitted ? (
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto text-xl">
            <Check className="w-6 h-6 text-neutral-800" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              บันทึกข้อมูลเรียบร้อยแล้ว
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
              ขอขอบคุณสำหรับความคิดเห็น ข้อมูลของคุณถูกส่งต่อไปยังแดชบอร์ดของผู้จัดอบรมแล้ว
            </p>
          </div>

          {lastSubmittedData && (
            <div className="bg-neutral-50 rounded-xl p-3 text-left text-xs space-y-1.5 border border-neutral-100">
              <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                <span>คะแนนที่คุณประเมินเฉลี่ย</span>
                <span className="font-mono font-semibold text-neutral-800">
                  {((lastSubmittedData.q1 + lastSubmittedData.q2 + lastSubmittedData.q3 + lastSubmittedData.q4 + lastSubmittedData.q5) / 5).toFixed(2)} / 5.00
                </span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-neutral-100 flex flex-col items-center gap-2">
            <span className="text-[11px] text-neutral-400">
              ป้องกันการตอบซ้ำจากอุปกรณ์เดิม
            </span>
            <button
              onClick={handleResetForTesting}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer pt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>[สำหรับทดสอบ] ล้างสถานะเพื่อตอบอีกครั้ง</span>
            </button>
          </div>
        </div>
      ) : (
        /* Questionnaire Form */
        <div className="space-y-6">
          
          {/* Header Info */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <h1 className="text-base sm:text-lg font-semibold text-neutral-900">
                แบบประเมินความพึงพอใจการอบรม
              </h1>
              <span className="text-xs font-mono text-neutral-400">
                {completedQuestionsCount}/{QUESTIONS.length}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              สเกล 1 (น้อยที่สุด) ถึง 5 (มากที่สุด) · ไม่ระบุชื่อผู้ตอบ
            </p>

            {/* Hairline progress */}
            <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden mt-3">
              <div
                className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-neutral-100 rounded-xl text-xs text-neutral-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-neutral-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 5 Questions */}
            {QUESTIONS.map((question, qIdx) => {
              const currentScore = answers[question.id] || 0;

              return (
                <div
                  key={question.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200/70 space-y-3"
                >
                  <div>
                    <span className="text-xs font-mono text-neutral-400">0{qIdx + 1}</span>
                    <h2 className="text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
                      {question.title}
                    </h2>
                  </div>

                  {/* Minimal 1-5 rating buttons */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {RATING_SCALES.map((scale) => {
                      const isSelected = currentScore === scale.score;
                      return (
                        <button
                          key={scale.score}
                          type="button"
                          onClick={() => handleScoreSelect(question.id, scale.score)}
                          className={`py-2.5 sm:py-3 rounded-lg border transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/80'
                          }`}
                        >
                          <span className="text-base sm:text-lg">{scale.emoji}</span>
                          <span className={`text-xs font-mono font-medium ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                            {scale.score}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10px] text-neutral-400 px-0.5">
                    <span>1 น้อยที่สุด</span>
                    <span>5 มากที่สุด</span>
                  </div>
                </div>
              );
            })}

            {/* Optional Suggestion */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200/70 space-y-2">
              <label htmlFor="survey-suggestion" className="block text-xs font-medium text-neutral-900">
                ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
              </label>
              <textarea
                id="survey-suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                rows={3}
                placeholder="สิ่งที่ประทับใจ หรือสิ่งที่ควรปรับปรุง..."
                className="w-full text-xs p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-400 resize-none"
                maxLength={400}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || completedQuestionsCount < QUESTIONS.length}
              className={`w-full py-3.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                completedQuestionsCount === QUESTIONS.length
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-[0.99]'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <span>
                    {completedQuestionsCount === QUESTIONS.length
                      ? 'ส่งแบบประเมิน'
                      : `ตอบให้ครบอีก ${QUESTIONS.length - completedQuestionsCount} ข้อ`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
