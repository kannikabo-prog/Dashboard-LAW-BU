import { FeedbackResponse } from '../types/feedback';

const STORAGE_KEY = 'workshop_feedback_data_v1';
const SUBMISSION_FLAG_KEY = 'workshop_feedback_has_submitted';
const FIREBASE_CONFIG_KEY = 'workshop_feedback_firebase_config';

export interface FirebaseConfigSetting {
  databaseURL: string;
  apiKey?: string;
  projectId?: string;
  autoSync: boolean;
}

// Initial realistic seed data for demonstrative elegance
const INITIAL_SEED_RESPONSES: FeedbackResponse[] = [
  {
    id: 'res_01',
    timestamp: Date.now() - 1000 * 60 * 42,
    q1: 5,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 5,
    suggestion: 'วิทยากรอธิบายเนื้อหาได้เห็นภาพชัดเจนมาก มี Workshop ให้ทดลองทำจริง ทำให้เข้าใจอย่างลึกซึ้งครับ'
  },
  {
    id: 'res_02',
    timestamp: Date.now() - 1000 * 60 * 35,
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 4,
    q5: 5,
    suggestion: 'เอกสารและสไลด์สรุปเนื้อหาดีมาก อยากให้เพิ่มเวลาช่วงฝึกปฏิบัติอีกสัก 30 นาทีค่ะ'
  },
  {
    id: 'res_03',
    timestamp: Date.now() - 1000 * 60 * 28,
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 5,
    q5: 4,
    suggestion: 'สถานที่จัดอบรมสะดวกสบาย แอร์เย็นกำลังดี เจ้าหน้าที่ดูแลดีมากครับ'
  },
  {
    id: 'res_04',
    timestamp: Date.now() - 1000 * 60 * 22,
    q1: 5,
    q2: 4,
    q3: 5,
    q4: 4,
    q5: 5,
    suggestion: 'สามารถนำตัวอย่างโค้ดและเทคนิคไปประยุกต์ใช้กับโปรเจกต์ที่ทำงานได้ทันทีเลยค่ะ ขอบคุณมากค่ะ'
  },
  {
    id: 'res_05',
    timestamp: Date.now() - 1000 * 60 * 15,
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 3,
    q5: 4,
    suggestion: 'สัญญาณ Wi-Fi มีช่วงหน่วงนิดหน่อยช่วงบ่าย แต่ภาพรวมการบรรยายและการตอบคำถามยอดเยี่ยมมากครับ'
  },
  {
    id: 'res_06',
    timestamp: Date.now() - 1000 * 60 * 9,
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
    suggestion: 'เป็นหลักสูตรที่ดีที่สุดของปีนี้เลย ได้ทั้ง Mindset และ Actionable steps ที่ทำได้จริง'
  },
  {
    id: 'res_07',
    timestamp: Date.now() - 1000 * 60 * 3,
    q1: 5,
    q2: 4,
    q3: 4,
    q4: 4,
    q5: 4,
    suggestion: 'อยากให้จัดหัวข้อขั้นสูง (Advanced level) ต่อยอดในรุ่นถัดไปด้วยครับ'
  }
];

class StorageService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(responses: FeedbackResponse[]) => void> = new Set();
  private firebaseConfig: FirebaseConfigSetting = {
    databaseURL: '',
    autoSync: false
  };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('workshop_feedback_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'UPDATE') {
            this.notifyListeners();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }

      // Also listen to storage events across tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifyListeners();
        }
      });

      // Load saved Firebase config
      try {
        const savedConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
        if (savedConfig) {
          this.firebaseConfig = JSON.parse(savedConfig);
        }
      } catch (err) {
        console.error('Failed to load Firebase config', err);
      }

      // Initialize with seed if first time
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_RESPONSES));
      }
    }
  }

  public getResponses(): FeedbackResponse[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse feedback data', e);
      return [];
    }
  }

  public async saveResponse(response: Omit<FeedbackResponse, 'id' | 'timestamp'>): Promise<FeedbackResponse> {
    const fullResponse: FeedbackResponse = {
      ...response,
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now()
    };

    const current = this.getResponses();
    const updated = [fullResponse, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Mark device as submitted
    localStorage.setItem(SUBMISSION_FLAG_KEY, 'true');

    // Notify local listeners & tabs
    this.notifyListeners();
    this.channel?.postMessage({ type: 'UPDATE' });

    // If Firebase configured, post to Realtime Database REST endpoint
    if (this.firebaseConfig.databaseURL && this.firebaseConfig.autoSync) {
      this.syncToFirebaseREST(fullResponse).catch(err => {
        console.warn('Firebase RTDB sync failed:', err);
      });
    }

    return fullResponse;
  }

  private async syncToFirebaseREST(response: FeedbackResponse) {
    try {
      let baseUrl = this.firebaseConfig.databaseURL.trim().replace(/\/$/, '');
      if (!baseUrl.startsWith('http')) {
        baseUrl = 'https://' + baseUrl;
      }
      const endpoint = `${baseUrl}/workshop_feedback.json`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      });
    } catch (err) {
      console.error('Error posting to Firebase RTDB:', err);
    }
  }

  public hasDeviceSubmitted(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SUBMISSION_FLAG_KEY) === 'true';
  }

  public resetDeviceSubmission(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUBMISSION_FLAG_KEY);
    }
  }

  public clearAllResponses(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      this.notifyListeners();
      this.channel?.postMessage({ type: 'UPDATE' });
    }
  }

  public resetToSeedData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_RESPONSES));
      this.notifyListeners();
      this.channel?.postMessage({ type: 'UPDATE' });
    }
  }

  public simulateNewResponse(): FeedbackResponse {
    const randomScore = (min = 4, max = 5) => Math.floor(Math.random() * (max - min + 1)) + min;
    const sampleComments = [
      'เข้าใจหัวข้อที่นำเสนอได้ชัดเจนมาก ชอบช่วงถามตอบครับ',
      'สไลด์สวยและข้อมูลอัปเดต เหมาะกับการนำไปสอนต่อให้ทีมงาน',
      'ดีเยี่ยมมากครับ วิทยากรมีมุกตลกสอดแทรกทำให้ไม่ง่วงเลย',
      'การจัดสรรเวลาดีมาก กระชับแต่ได้ใจความครบถ้วน',
      'อยากให้มีเอกสารสรุป Cheat Sheet แจกเพิ่มอีกนิดครับ แต่ภาพรวมดีมาก'
    ];

    const sim: FeedbackResponse = {
      id: 'sim_' + Date.now(),
      timestamp: Date.now(),
      q1: randomScore(4, 5),
      q2: randomScore(4, 5),
      q3: randomScore(3, 5),
      q4: randomScore(4, 5),
      q5: randomScore(4, 5),
      suggestion: Math.random() > 0.3 ? sampleComments[Math.floor(Math.random() * sampleComments.length)] : undefined
    };

    const current = this.getResponses();
    const updated = [sim, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    this.notifyListeners();
    this.channel?.postMessage({ type: 'UPDATE' });

    return sim;
  }

  public subscribe(callback: (responses: FeedbackResponse[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getResponses());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    const data = this.getResponses();
    this.listeners.forEach((fn) => fn(data));
  }

  public getFirebaseConfig(): FirebaseConfigSetting {
    return { ...this.firebaseConfig };
  }

  public saveFirebaseConfig(config: FirebaseConfigSetting): void {
    this.firebaseConfig = { ...config };
    if (typeof window !== 'undefined') {
      localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(this.firebaseConfig));
    }
  }

  /**
   * Export all responses to CSV format with UTF-8 BOM for Thai language Excel support
   */
  public exportToCSV(filename = 'workshop_satisfaction_results.csv'): void {
    const responses = this.getResponses();
    if (responses.length === 0) {
      alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
      return;
    }

    const headers = [
      'ลำดับ (No.)',
      'รหัสการตอบ (Response ID)',
      'วันเวลาที่ส่ง (Timestamp)',
      'ข้อ 1: เนื้อหาหลักสูตร (1-5)',
      'ข้อ 2: วิทยากรและการถ่ายทอด (1-5)',
      'ข้อ 3: เอกสารและสื่อการสอน (1-5)',
      'ข้อ 4: สถานที่และบรรยากาศ (1-5)',
      'ข้อ 5: การนำไปประยุกต์ใช้ (1-5)',
      'คะแนนเฉลี่ยรายบุคคล (Mean)',
      'ข้อเสนอแนะเพิ่มเติม (Suggestions)'
    ];

    const rows = responses.map((r, index) => {
      const dateStr = new Date(r.timestamp).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const mean = ((r.q1 + r.q2 + r.q3 + r.q4 + r.q5) / 5).toFixed(2);
      const cleanSuggestion = (r.suggestion || '-').replace(/"/g, '""');

      return [
        index + 1,
        `"${r.id}"`,
        `"${dateStr}"`,
        r.q1,
        r.q2,
        r.q3,
        r.q4,
        r.q5,
        mean,
        `"${cleanSuggestion}"`
      ].join(',');
    });

    // Add Summary Row at the bottom
    const count = responses.length;
    const avgQ1 = (responses.reduce((acc, cur) => acc + cur.q1, 0) / count).toFixed(2);
    const avgQ2 = (responses.reduce((acc, cur) => acc + cur.q2, 0) / count).toFixed(2);
    const avgQ3 = (responses.reduce((acc, cur) => acc + cur.q3, 0) / count).toFixed(2);
    const avgQ4 = (responses.reduce((acc, cur) => acc + cur.q4, 0) / count).toFixed(2);
    const avgQ5 = (responses.reduce((acc, cur) => acc + cur.q5, 0) / count).toFixed(2);
    const totalAvg = ((+avgQ1 + +avgQ2 + +avgQ3 + +avgQ4 + +avgQ5) / 5).toFixed(2);

    const summaryRow = [
      'สรุปผลรวม',
      `"จำนวนผู้ตอบ ${count} คน"`,
      '""',
      avgQ1,
      avgQ2,
      avgQ3,
      avgQ4,
      avgQ5,
      totalAvg,
      `"คะแนนเฉลี่ยรวมทั้งโครงการ: ${totalAvg} / 5.00"`
    ].join(',');

    // UTF-8 BOM (\uFEFF) ensures Excel opens Thai characters without garbled font encoding
    const csvContent = '\uFEFF' + [headers.join(','), ...rows, '', summaryRow].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const storageService = new StorageService();
