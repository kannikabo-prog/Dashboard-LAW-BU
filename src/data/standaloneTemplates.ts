/**
 * Minimalist template files for standalone export:
 * 1. survey.html (or index.html) - Mobile-friendly feedback questionnaire
 * 2. dashboard.html - Live projector dashboard with realtime listener, charts, and CSV download
 */

export const SURVEY_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Prompt:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body { font-family: 'Prompt', 'Plus Jakarta Sans', sans-serif; }
    button, input, textarea { touch-action: manipulation; }
  </style>
</head>
<body class="bg-neutral-50 text-neutral-900 min-h-screen antialiased flex flex-col justify-between">

  <!-- Minimal Header -->
  <header class="bg-white border-b border-neutral-200/80 sticky top-0 z-20">
    <div class="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
      <span class="text-xs font-semibold text-neutral-900">WorkshopPulse</span>
      <span class="text-[11px] text-neutral-400">ไม่ระบุตัวตน</span>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-md mx-auto w-full px-5 py-6 flex-1">

    <div id="survey-form-container" class="space-y-6">
      
      <div class="space-y-1">
        <h1 class="text-base sm:text-lg font-semibold text-neutral-900">แบบประเมินความพึงพอใจ</h1>
        <p class="text-xs text-neutral-500">
          สเกล 1 (น้อยที่สุด) ถึง 5 (มากที่สุด) เพื่อนำไปปรับปรุงการจัดอบรม
        </p>
      </div>

      <form id="feedback-form" class="space-y-4">
        
        <!-- Question 1 -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <div>
            <span class="text-xs font-mono text-neutral-400">01</span>
            <label class="block text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
              1. เนื้อหาหลักสูตรมีความทันสมัย ครบถ้วน ตรงตามวัตถุประสงค์
            </label>
          </div>
          <div class="grid grid-cols-5 gap-1.5" data-question="q1">
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="1">
              <span class="text-base">😞</span><span>1</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="2">
              <span class="text-base">🙁</span><span>2</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="3">
              <span class="text-base">😐</span><span>3</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="4">
              <span class="text-base">😊</span><span>4</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="5">
              <span class="text-base">🤩</span><span>5</span>
            </button>
          </div>
          <input type="hidden" name="q1" id="q1-input" required>
        </div>

        <!-- Question 2 -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <div>
            <span class="text-xs font-mono text-neutral-400">02</span>
            <label class="block text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
              2. วิทยากรมีความรู้ความเชี่ยวชาญ และถ่ายทอดเข้าใจง่าย
            </label>
          </div>
          <div class="grid grid-cols-5 gap-1.5" data-question="q2">
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="1">
              <span class="text-base">😞</span><span>1</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="2">
              <span class="text-base">🙁</span><span>2</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="3">
              <span class="text-base">😐</span><span>3</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="4">
              <span class="text-base">😊</span><span>4</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="5">
              <span class="text-base">🤩</span><span>5</span>
            </button>
          </div>
          <input type="hidden" name="q2" id="q2-input" required>
        </div>

        <!-- Question 3 -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <div>
            <span class="text-xs font-mono text-neutral-400">03</span>
            <label class="block text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
              3. เอกสารประกอบ สื่อนำเสนอ และเทคโนโลยีมีความเหมาะสม
            </label>
          </div>
          <div class="grid grid-cols-5 gap-1.5" data-question="q3">
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="1">
              <span class="text-base">😞</span><span>1</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="2">
              <span class="text-base">🙁</span><span>2</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="3">
              <span class="text-base">😐</span><span>3</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="4">
              <span class="text-base">😊</span><span>4</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="5">
              <span class="text-base">🤩</span><span>5</span>
            </button>
          </div>
          <input type="hidden" name="q3" id="q3-input" required>
        </div>

        <!-- Question 4 -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <div>
            <span class="text-xs font-mono text-neutral-400">04</span>
            <label class="block text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
              4. สถานที่ บรรยากาศ และระยะเวลาการจัดมีความเหมาะสม
            </label>
          </div>
          <div class="grid grid-cols-5 gap-1.5" data-question="q4">
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="1">
              <span class="text-base">😞</span><span>1</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="2">
              <span class="text-base">🙁</span><span>2</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="3">
              <span class="text-base">😐</span><span>3</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="4">
              <span class="text-base">😊</span><span>4</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="5">
              <span class="text-base">🤩</span><span>5</span>
            </button>
          </div>
          <input type="hidden" name="q4" id="q4-input" required>
        </div>

        <!-- Question 5 -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <div>
            <span class="text-xs font-mono text-neutral-400">05</span>
            <label class="block text-xs sm:text-sm font-medium text-neutral-900 mt-0.5">
              5. สามารถนำความรู้และทักษะไปประยุกต์ใช้ได้จริง
            </label>
          </div>
          <div class="grid grid-cols-5 gap-1.5" data-question="q5">
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="1">
              <span class="text-base">😞</span><span>1</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="2">
              <span class="text-base">🙁</span><span>2</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="3">
              <span class="text-base">😐</span><span>3</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="4">
              <span class="text-base">😊</span><span>4</span>
            </button>
            <button type="button" class="rating-btn py-2.5 rounded-lg border border-neutral-200/80 bg-neutral-50 hover:bg-neutral-100 text-xs font-mono flex flex-col items-center gap-0.5" data-val="5">
              <span class="text-base">🤩</span><span>5</span>
            </button>
          </div>
          <input type="hidden" name="q5" id="q5-input" required>
        </div>

        <!-- Suggestion Input (Optional) -->
        <div class="bg-white p-4 rounded-xl border border-neutral-200/80 space-y-2">
          <label for="suggestion" class="block text-xs font-medium text-neutral-900">
            ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)
          </label>
          <textarea
            id="suggestion"
            rows="3"
            class="w-full text-xs p-3 rounded-lg border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-400 resize-none"
            placeholder="สิ่งที่ประทับใจ หรือสิ่งที่ควรพัฒนา..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="submit-btn"
          class="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer"
        >
          ส่งแบบประเมิน
        </button>
      </form>
    </div>

    <!-- Thank You Container -->
    <div id="thankyou-container" class="hidden text-center py-12 px-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
      <div class="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
        ✓
      </div>
      <h2 class="text-base font-semibold text-neutral-900">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
      <p class="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
        ขอขอบคุณสำหรับความคิดเห็น ข้อมูลของคุณถูกส่งต่อไปยังแดชบอร์ดของผู้จัดเรียบร้อยแล้ว
      </p>
      <div class="pt-4 border-t border-neutral-100">
        <button id="resubmit-btn" class="text-xs text-neutral-500 hover:text-neutral-800 underline">
          [สำหรับทดสอบ] ล้างสถานะเพื่อตอบอีกครั้ง
        </button>
      </div>
    </div>

    <!-- Already Submitted -->
    <div id="already-submitted-container" class="hidden text-center py-12 px-6 bg-white rounded-2xl border border-neutral-200 space-y-3">
      <h2 class="text-base font-semibold text-neutral-900">เครื่องนี้ได้ตอบแบบประเมินแล้ว</h2>
      <p class="text-xs text-neutral-500">
        เพื่อความเที่ยงตรงของผลประเมิน ระบบจำกัดการส่งคำตอบ 1 ครั้งต่อ 1 อุปกรณ์
      </p>
      <button id="unlock-btn" class="mt-2 px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg">
        ล้างสถานะเครื่องนี้ (เพื่อทดสอบส่งใหม่)
      </button>
    </div>

  </main>

  <footer class="py-4 text-center text-xs text-neutral-400 border-t border-neutral-200/60 bg-white">
    ระบบประเมินความพึงพอใจแบบเรียลไทม์ · ข้อมูลปลอดภัย
  </footer>

  <script>
    // ==========================================
    // ตั้งค่า FIREBASE CONFIG (นำข้อมูลจาก Firebase Console มาใส่ที่นี่)
    // ==========================================
    const firebaseConfig = {
      apiKey: "AIzaSy_YOUR_API_KEY",
      authDomain: "your-project-id.firebaseapp.com",
      databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };

    let database = null;
    try {
      if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('your-project-id')) {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
      }
    } catch(err) {
      console.warn("Firebase not configured yet.", err);
    }

    const SUBMIT_KEY = 'workshop_has_submitted_token';
    const formContainer = document.getElementById('survey-form-container');
    const thankYouContainer = document.getElementById('thankyou-container');
    const alreadyContainer = document.getElementById('already-submitted-container');

    function checkPreviousSubmission() {
      if (localStorage.getItem(SUBMIT_KEY)) {
        formContainer.classList.add('hidden');
        alreadyContainer.classList.remove('hidden');
      }
    }
    checkPreviousSubmission();

    document.getElementById('unlock-btn').addEventListener('click', () => {
      localStorage.removeItem(SUBMIT_KEY);
      alreadyContainer.classList.add('hidden');
      formContainer.classList.remove('hidden');
    });

    document.getElementById('resubmit-btn').addEventListener('click', () => {
      localStorage.removeItem(SUBMIT_KEY);
      thankYouContainer.classList.add('hidden');
      formContainer.classList.remove('hidden');
    });

    const answers = { q1: null, q2: null, q3: null, q4: null, q5: null };

    document.querySelectorAll('.rating-btn').forEach(button => {
      button.addEventListener('click', function() {
        const parent = this.closest('[data-question]');
        const questionKey = parent.getAttribute('data-question');
        const value = parseInt(this.getAttribute('data-val'), 10);

        parent.querySelectorAll('.rating-btn').forEach(btn => {
          btn.classList.remove('bg-neutral-900', 'text-white', 'border-neutral-900');
          btn.classList.add('bg-neutral-50', 'text-neutral-700', 'border-neutral-200/80');
        });

        this.classList.remove('bg-neutral-50', 'text-neutral-700', 'border-neutral-200/80');
        this.classList.add('bg-neutral-900', 'text-white', 'border-neutral-900');

        answers[questionKey] = value;
        document.getElementById(questionKey + '-input').value = value;
      });
    });

    document.getElementById('feedback-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      for (let i = 1; i <= 5; i++) {
        if (!answers['q' + i]) {
          alert('กรุณาเลือกคะแนนให้ครบทุกข้อ (ข้อ ' + i + ')');
          return;
        }
      }

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'กำลังบันทึก...';

      const payload = {
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        suggestion: document.getElementById('suggestion').value.trim() || null,
        timestamp: Date.now()
      };

      try {
        if (database) {
          await database.ref('workshop_feedback').push(payload);
        } else {
          const existing = JSON.parse(localStorage.getItem('local_fallback_feedbacks') || '[]');
          existing.unshift({ id: 'local_' + Date.now(), ...payload });
          localStorage.setItem('local_fallback_feedbacks', JSON.stringify(existing));
        }

        localStorage.setItem(SUBMIT_KEY, 'true');

        if (window.confetti) {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        }

        formContainer.classList.add('hidden');
        thankYouContainer.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        submitBtn.disabled = false;
        submitBtn.innerText = 'ส่งแบบประเมิน';
      }
    });
  </script>
</body>
</html>`;

export const DASHBOARD_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Realtime Dashboard | สรุปผลความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Prompt:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  <style>
    body { font-family: 'Prompt', 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-100 min-h-screen antialiased flex flex-col justify-between selection:bg-neutral-800 selection:text-white">

  <!-- Minimal Header -->
  <header class="border-b border-neutral-800/80 px-6 py-4">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-white">ผลการประเมินความพึงพอใจ</h1>
        <p class="text-xs text-neutral-400 mt-0.5">ระบบสรุปผลแบบเรียลไทม์ · สัมมนาเชิงปฏิบัติการ</p>
      </div>

      <div class="flex items-center gap-2">
        <button id="open-qr-btn" class="px-3.5 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
          <span>เปิด QR Code</span>
        </button>

        <button id="download-csv-btn" class="px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
          <span>ส่งออก CSV</span>
        </button>

        <button id="fullscreen-btn" title="เต็มจอ" class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Viewport -->
  <main class="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-8">

    <!-- 4 Minimal Columns -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      
      <div class="space-y-1">
        <span class="text-xs text-neutral-400">ผู้ตอบแบบประเมิน</span>
        <div class="flex items-baseline gap-1.5">
          <span id="metric-total" class="font-mono text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">0</span>
          <span class="text-xs text-neutral-400">คน</span>
        </div>
        <p class="text-[11px] text-neutral-400">ไม่ระบุตัวตน</p>
      </div>

      <div class="space-y-1">
        <span class="text-xs text-neutral-400">คะแนนเฉลี่ยรวม</span>
        <div class="flex items-baseline gap-1.5">
          <span id="metric-mean" class="font-mono text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">0.00</span>
          <span class="text-xs text-neutral-400">/ 5.00</span>
        </div>
        <p class="text-[11px] text-neutral-400">จาก 5 ด้านการประเมิน</p>
      </div>

      <div class="space-y-1">
        <span class="text-xs text-neutral-400">ระดับผลการประเมิน</span>
        <div class="flex items-baseline gap-2">
          <span id="metric-likert-badge" class="text-3xl sm:text-4xl font-semibold text-white tracking-tight">—</span>
        </div>
        <p id="metric-likert-sub" class="text-[11px] text-neutral-400">เกณฑ์ Likert 5 ระดับ</p>
      </div>

      <div class="space-y-1">
        <span class="text-xs text-neutral-400">ความพึงพอใจเชิงบวก</span>
        <div class="flex items-baseline gap-1">
          <span id="metric-positive" class="font-mono text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight tabular-nums">0%</span>
        </div>
        <p class="text-[11px] text-neutral-400">คะแนนระดับ 4-5 ดาว</p>
      </div>

    </div>

    <!-- Center Content -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

      <!-- Left Column: Bars (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-800">
          <h2 class="text-sm font-medium text-neutral-300">คะแนนเฉลี่ยรายด้าน (1.00 – 5.00)</h2>
          <span class="text-xs text-neutral-400 font-mono">ค่าเฉลี่ย</span>
        </div>

        <div id="questions-chart-container" class="space-y-5">
          <div class="text-center py-10 text-neutral-400 text-xs">กำลังโหลดข้อมูล...</div>
        </div>

        <div class="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400 font-light">
          <span>เกณฑ์:</span>
          <span>4.51–5.00 มากที่สุด</span><span>·</span>
          <span>3.51–4.50 มาก</span><span>·</span>
          <span>2.51–3.50 ปานกลาง</span><span>·</span>
          <span>1.51–2.50 น้อย</span><span>·</span>
          <span>1.00–1.50 น้อยที่สุด</span>
        </div>
      </div>

      <!-- Right Column: Suggestions (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-800">
          <h2 class="text-sm font-medium text-neutral-300">ข้อเสนอแนะล่าสุด</h2>
          <span id="comment-count-badge" class="text-xs text-neutral-400 font-mono">0 ข้อความ</span>
        </div>

        <div id="suggestions-list" class="space-y-3 overflow-y-auto max-h-[380px] pr-1">
          <div class="text-center py-12 text-neutral-400 text-xs">ยังไม่มีข้อเสนอแนะเพิ่มเติม</div>
        </div>
      </div>

    </div>

  </main>

  <!-- Minimal QR Code Modal -->
  <div id="qr-modal" class="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 hidden">
    <div class="bg-neutral-900 border border-neutral-800 max-w-sm w-full p-6 rounded-2xl text-center shadow-2xl relative">
      <button id="close-qr-btn" class="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 text-lg">✕</button>
      <h3 class="text-base font-semibold text-white mt-1">สแกนเพื่อตอบแบบประเมิน</h3>
      <p class="text-xs text-neutral-400 mt-1 mb-5">ใช้กล้องมือถือสแกนเพื่อเปิดแบบสอบถาม</p>

      <div class="bg-white p-3.5 rounded-xl inline-block mx-auto mb-4">
        <div id="qrcode-canvas"></div>
      </div>

      <div class="bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] font-mono text-neutral-400 break-all mb-4" id="survey-url-display">
        http://...
      </div>

      <button id="download-qr-image-btn" class="w-full py-2 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-medium rounded-lg">
        ดาวน์โหลดภาพ QR Code (PNG)
      </button>
    </div>
  </div>

  <footer class="border-t border-neutral-800/80 py-4 px-6 text-center text-xs text-neutral-400">
    Workshop Satisfaction Engine · ข้อมูลอัปเดตแบบเรียลไทม์
  </footer>

  <script>
    const firebaseConfig = {
      apiKey: "AIzaSy_YOUR_API_KEY",
      authDomain: "your-project-id.firebaseapp.com",
      databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef123456"
    };

    const QUESTIONS = [
      { id: 'q1', title: 'เนื้อหาหลักสูตร', sub: 'ทันสมัย ครบถ้วน ตรงตามวัตถุประสงค์' },
      { id: 'q2', title: 'วิทยากรและการถ่ายทอด', sub: 'เชี่ยวชาญ ถ่ายทอดเข้าใจง่าย' },
      { id: 'q3', title: 'เอกสารและสื่อการสอน', sub: 'เหมาะสม สะดวกต่อการเรียนรู้' },
      { id: 'q4', title: 'สถานที่และบรรยากาศ', sub: 'สถานที่ ห้องอบรม เวลาเหมาะสม' },
      { id: 'q5', title: 'การนำไปประยุกต์ใช้', sub: 'สามารถนำความรู้ไปใช้ได้จริง' }
    ];

    let cachedResponses = [];

    function interpretScore(score) {
      if (score >= 4.51) return 'มากที่สุด';
      if (score >= 3.51) return 'มาก';
      if (score >= 2.51) return 'ปานกลาง';
      if (score >= 1.51) return 'น้อย';
      return 'น้อยที่สุด';
    }

    function updateDashboard(responses) {
      cachedResponses = responses;
      const count = responses.length;

      document.getElementById('metric-total').innerText = count;

      if (count === 0) {
        document.getElementById('metric-mean').innerText = '0.00';
        document.getElementById('metric-positive').innerText = '0%';
        document.getElementById('metric-likert-badge').innerText = '—';
        document.getElementById('questions-chart-container').innerHTML = '<div class="text-center py-10 text-neutral-400 text-xs">ยังไม่มีข้อมูลการตอบแบบประเมิน</div>';
        document.getElementById('suggestions-list').innerHTML = '<div class="text-center py-10 text-neutral-400 text-xs">ยังไม่มีข้อเสนอแนะ</div>';
        return;
      }

      const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      let positiveCount = 0;

      responses.forEach(r => {
        sums.q1 += Number(r.q1) || 0;
        sums.q2 += Number(r.q2) || 0;
        sums.q3 += Number(r.q3) || 0;
        sums.q4 += Number(r.q4) || 0;
        sums.q5 += Number(r.q5) || 0;

        const avgPersonal = ((+r.q1 + +r.q2 + +r.q3 + +r.q4 + +r.q5) / 5);
        if (avgPersonal >= 3.8) positiveCount++;
      });

      const avg = {
        q1: (sums.q1 / count),
        q2: (sums.q2 / count),
        q3: (sums.q3 / count),
        q4: (sums.q4 / count),
        q5: (sums.q5 / count)
      };

      const overallMean = ((avg.q1 + avg.q2 + avg.q3 + avg.q4 + avg.q5) / 5);
      document.getElementById('metric-mean').innerText = overallMean.toFixed(2);
      document.getElementById('metric-positive').innerText = Math.round((positiveCount / count) * 100) + '%';
      document.getElementById('metric-likert-badge').innerText = interpretScore(overallMean);

      const container = document.getElementById('questions-chart-container');
      container.innerHTML = QUESTIONS.map((q, idx) => {
        const score = avg[q.id];
        const percent = Math.min(100, Math.max(0, (score / 5) * 100));
        const level = interpretScore(score);

        return \`
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-baseline gap-1.5">
                <span class="text-neutral-400 font-mono">\${idx + 1}.</span>
                <span class="font-medium text-neutral-200">\${q.title}</span>
              </div>
              <div class="flex items-baseline gap-2.5">
                <span class="text-neutral-400 text-[11px]">\${level}</span>
                <span class="font-mono font-semibold text-white w-9 text-right">\${score.toFixed(2)}</span>
              </div>
            </div>
            <div class="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div class="bg-indigo-400 h-full rounded-full transition-all duration-500" style="width: \${percent}%"></div>
            </div>
          </div>
        \`;
      }).join('');

      const suggestions = responses
        .filter(r => r.suggestion && r.suggestion.trim() !== '')
        .slice(0, 20);

      document.getElementById('comment-count-badge').innerText = suggestions.length + ' ข้อความ';

      const sugList = document.getElementById('suggestions-list');
      if (suggestions.length === 0) {
        sugList.innerHTML = '<div class="text-center py-10 text-neutral-400 text-xs">ยังไม่มีข้อเสนอแนะเพิ่มเติม</div>';
      } else {
        sugList.innerHTML = suggestions.map(s => {
          const timeStr = s.timestamp ? new Date(s.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '';
          return \`
            <div class="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-lg text-xs space-y-1">
              <div class="flex items-center justify-between text-neutral-400 text-[11px]">
                <span>ความคิดเห็น</span>
                <span class="font-mono text-[10px]">\${timeStr}</span>
              </div>
              <p class="text-neutral-200 leading-relaxed font-light">\${escapeHtml(s.suggestion)}</p>
            </div>
          \`;
        }).join('');
      }
    }

    function escapeHtml(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    try {
      if (firebaseConfig.databaseURL && !firebaseConfig.databaseURL.includes('your-project-id')) {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        db.ref('workshop_feedback').on('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list = Object.keys(val).map(key => ({ id: key, ...val[key] })).reverse();
            updateDashboard(list);
          } else {
            updateDashboard([]);
          }
        });
      } else {
        const local = JSON.parse(localStorage.getItem('local_fallback_feedbacks') || '[]');
        updateDashboard(local);
        window.addEventListener('storage', () => {
          const updated = JSON.parse(localStorage.getItem('local_fallback_feedbacks') || '[]');
          updateDashboard(updated);
        });
      }
    } catch (e) {
      console.warn("Firebase initialize failed:", e);
    }

    document.getElementById('download-csv-btn').addEventListener('click', () => {
      if (cachedResponses.length === 0) {
        alert('ยังไม่มีข้อมูลการตอบแบบสอบถาม');
        return;
      }

      const headers = ['ลำดับ', 'วันเวลา', 'ข้อ 1', 'ข้อ 2', 'ข้อ 3', 'ข้อ 4', 'ข้อ 5', 'คะแนนเฉลี่ย', 'ข้อเสนอแนะ'];
      const rows = cachedResponses.map((r, i) => {
        const d = r.timestamp ? new Date(r.timestamp).toLocaleString('th-TH') : '-';
        const mean = ((+r.q1 + +r.q2 + +r.q3 + +r.q4 + +r.q5) / 5).toFixed(2);
        const comment = (r.suggestion || '-').replace(/"/g, '""');
        return [i + 1, \`"\${d}"\`, r.q1, r.q2, r.q3, r.q4, r.q5, mean, \`"\${comment}"\`].join(',');
      });

      const csvString = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'workshop_feedback_results.csv';
      link.click();
    });

    const qrModal = document.getElementById('qr-modal');
    const surveyUrl = window.location.href.replace('dashboard.html', 'index.html');
    document.getElementById('survey-url-display').innerText = surveyUrl;

    let qrCodeObj = null;
    document.getElementById('open-qr-btn').addEventListener('click', () => {
      qrModal.classList.remove('hidden');
      const container = document.getElementById('qrcode-canvas');
      container.innerHTML = '';
      if (window.QRCode) {
        qrCodeObj = new QRCode(container, {
          text: surveyUrl,
          width: 200,
          height: 200,
          colorDark: "#171717",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    });

    document.getElementById('close-qr-btn').addEventListener('click', () => {
      qrModal.classList.add('hidden');
    });

    document.getElementById('download-qr-image-btn').addEventListener('click', () => {
      const img = document.querySelector('#qrcode-canvas img');
      if (img && img.src) {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = 'survey_qr.png';
        a.click();
      }
    });

    document.getElementById('fullscreen-btn').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    });
  </script>
</body>
</html>`;
