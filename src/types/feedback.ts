export interface FeedbackResponse {
  id: string;
  timestamp: number;
  q1: number; // ด้านเนื้อหาหลักสูตร
  q2: number; // ด้านวิทยากรและการถ่ายทอด
  q3: number; // ด้านเอกสาร สื่อ และเทคโนโลยี
  q4: number; // ด้านสถานที่ ระยะเวลา และการอำนวยความสะดวก
  q5: number; // ด้านการนำความรู้ไปประยุกต์ใช้
  suggestion?: string;
  deviceFingerprint?: string;
}

export interface QuestionDefinition {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  shortLabel: string;
  category: string;
}

export const QUESTIONS: QuestionDefinition[] = [
  {
    id: 'q1',
    title: '1. เนื้อหาหลักสูตรมีความทันสมัย ครบถ้วน และตรงตามวัตถุประสงค์',
    shortLabel: 'เนื้อหาหลักสูตร',
    category: 'หลักสูตร'
  },
  {
    id: 'q2',
    title: '2. วิทยากรมีความรู้ความเชี่ยวชาญ และถ่ายทอดเข้าใจง่าย มีการตอบคำถามชัดเจน',
    shortLabel: 'วิทยากรและการถ่ายทอด',
    category: 'วิทยากร'
  },
  {
    id: 'q3',
    title: '3. เอกสารประกอบ สื่อนำเสนอ และอุปกรณ์สนับสนุนการเรียนรู้เหมาะสม',
    shortLabel: 'เอกสารและสื่อการสอน',
    category: 'สื่อการสอน'
  },
  {
    id: 'q4',
    title: '4. ระยะเวลา สถานที่ ระบบออนไลน์ และการจัดบรรยากาศมีความเหมาะสม',
    shortLabel: 'สถานที่และบรรยากาศ',
    category: 'การจัดการ'
  },
  {
    id: 'q5',
    title: '5. สามารถนำความรู้และทักษะที่ได้รับไปประยุกต์ใช้ในการทำงานได้จริง',
    shortLabel: 'การนำไปประยุกต์ใช้',
    category: 'ผลลัพธ์'
  }
];

export interface RatingScale {
  score: number;
  label: string;
  sublabel: string;
  emoji: string;
  color: string;
}

export const RATING_SCALES: RatingScale[] = [
  { score: 1, label: 'น้อยที่สุด', sublabel: 'ควรปรับปรุง', emoji: '😞', color: 'rose' },
  { score: 2, label: 'น้อย', sublabel: 'พอใช้', emoji: '🙁', color: 'orange' },
  { score: 3, label: 'ปานกลาง', sublabel: 'ปานกลาง', emoji: '😐', color: 'amber' },
  { score: 4, label: 'มาก', sublabel: 'ดี', emoji: '😊', color: 'blue' },
  { score: 5, label: 'มากที่สุด', sublabel: 'ดีเยี่ยม', emoji: '🤩', color: 'emerald' },
];

export interface LikertInterpretation {
  min: number;
  max: number;
  level: string;
  grade: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

/**
 * เกณฑ์การแปลผลคะแนนเฉลี่ยแบบ Likert 5 ระดับ (ตามหลักวิชาการสถิติการประเมิน)
 * ช่วงชั้น = (5 - 1) / 5 = 0.80
 * 4.51 - 5.00 : มากที่สุด (Highest)
 * 3.51 - 4.50 : มาก (High)
 * 2.51 - 3.50 : ปานกลาง (Moderate)
 * 1.51 - 2.50 : น้อย (Low)
 * 1.00 - 1.50 : น้อยที่สุด (Lowest)
 */
export function interpretLikertScore(score: number): LikertInterpretation {
  if (score >= 4.51) {
    return {
      min: 4.51,
      max: 5.00,
      level: 'มากที่สุด',
      grade: 'ดีเยี่ยม (Excellent)',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200'
    };
  }
  if (score >= 3.51) {
    return {
      min: 3.51,
      max: 4.50,
      level: 'มาก',
      grade: 'ดี (Good)',
      colorClass: 'text-indigo-700',
      bgClass: 'bg-indigo-50',
      borderClass: 'border-indigo-200'
    };
  }
  if (score >= 2.51) {
    return {
      min: 2.51,
      max: 3.50,
      level: 'ปานกลาง',
      grade: 'ปานกลาง (Moderate)',
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200'
    };
  }
  if (score >= 1.51) {
    return {
      min: 1.51,
      max: 2.50,
      level: 'น้อย',
      grade: 'พอใช้ (Fair)',
      colorClass: 'text-orange-700',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200'
    };
  }
  return {
    min: 1.00,
    max: 1.50,
    level: 'น้อยที่สุด',
    grade: 'ควรปรับปรุง (Needs Improvement)',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200'
  };
}

export interface WorkshopInfo {
  title: string;
  instructor: string;
  date: string;
  organization: string;
}

export const DEFAULT_WORKSHOP_INFO: WorkshopInfo = {
  title: 'โครงการอบรมเชิงปฏิบัติการเพื่อการพัฒนาทักษะ (Workshop 2026)',
  instructor: 'คณะวิทยากรผู้ทรงคุณวุฒิ',
  date: 'พฤศจิกายน 2026',
  organization: 'ฝ่ายพัฒนาทรัพยากรบุคคลและการเรียนรู้'
};
