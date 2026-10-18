import { MicroStep } from '../types';

interface TemplateRule {
  keywords: string[];
  steps: { title: string; durationMinutes: number }[];
}

const TEMPLATES: TemplateRule[] = [
  {
    keywords: ['درس', 'مطالعه', 'کتاب', 'امتحان', 'کنکور', 'خلاصه', 'جزوه', 'دانشگاه', 'مدرسه'],
    steps: [
      { title: 'فقط کتاب یا جزوه رو روی میز باز کن (۳۰ ثانیه)', durationMinutes: 1 },
      { title: 'فهرست یا تیترهای بخش مورد نظر رو سرسری نگاه کن', durationMinutes: 2 },
      { title: 'یک ماژیک یا خودکار بردار و فقط پاراگراف اول رو بخون', durationMinutes: 5 },
      { title: 'نکات کلیدی همین یک صفحه رو گوشه کتاب یادداشت کن', durationMinutes: 10 },
      { title: 'ادامه مطالعه تا اتمام یک بخش کوچک', durationMinutes: 15 },
    ]
  },
  {
    keywords: ['تمیز', 'اتاق', 'خونه', 'مرتب', 'لباس', 'شستن', 'آشپزخونه', 'ظرف'],
    steps: [
      { title: 'پخش یک موسیقی یا پادکست انرژی‌بخش (۳۰ ثانیه)', durationMinutes: 1 },
      { title: 'فقط ۵ تکه آشغال یا وسیله اضافه رو بنداز دور', durationMinutes: 2 },
      { title: 'فقط لباس‌های روی تخت رو تا کن یا آویزون کن', durationMinutes: 5 },
      { title: 'مرتب‌سازی سطح میز کار تا کاملاً خلوت بشه', durationMinutes: 5 },
      { title: 'یک جارو یا دستمال کشیدن سریع', durationMinutes: 10 },
    ]
  },
  {
    keywords: ['ایمیل', 'پیام', 'تماس', 'زنگ', 'جواب', 'ارسال'],
    steps: [
      { title: 'باز کردن اپلیکیشن ایمیل یا پیام‌رسان', durationMinutes: 1 },
      { title: 'فقط نوشتن سلام و عنوان کوتاه بدون حساسیت', durationMinutes: 2 },
      { title: 'تایپ ۲ جمله از اصل مطلب بدون وسواس', durationMinutes: 3 },
      { title: 'یک بار خواندن سریع و زدن دکمه ارسال!', durationMinutes: 2 },
    ]
  },
  {
    keywords: ['ورزش', 'باشگاه', 'پیاده‌روی', 'دویدن', 'تمرین', 'شنا'],
    steps: [
      { title: 'فقط کفش و لباس ورزشی رو بپوش (همین کافیه!)', durationMinutes: 2 },
      { title: 'پر کردن یک قمقمه آب و نوشیدن یک جرعه', durationMinutes: 1 },
      { title: 'انجام ۲ دقیقه حرکات کششی ساده دست و پا', durationMinutes: 2 },
      { title: 'شروع اولین حرکت سبک ورزشی', durationMinutes: 5 },
      { title: 'ادامه تمرین تا زمانی که احساس خوبی داری', durationMinutes: 15 },
    ]
  },
  {
    keywords: ['کد', 'برنامه‌نویسی', 'پروژه', 'سایت', 'باگ', 'طراحی', 'برنامه'],
    steps: [
      { title: 'باز کردن ادیتور و ساخت برنچ یا فایل جدید', durationMinutes: 2 },
      { title: 'نوشتن کامنت مشخص‌کننده ورودی و خروجی تابع', durationMinutes: 3 },
      { title: 'پیاده‌سازی ساده‌ترین نسخه کارآمد (بدون بهینه‌سازی)', durationMinutes: 10 },
      { title: 'تست یک سناریوی ساده', durationMinutes: 5 },
      { title: 'کامیت کردن اولین تغییر کوچک', durationMinutes: 2 },
    ]
  },
  {
    keywords: ['خرید', 'بانک', 'قبض', 'پول', 'حساب', 'پرداخت'],
    steps: [
      { title: 'ورود به اپلیکیشن بانکی یا کارت بانکی رو بذار روی میز', durationMinutes: 1 },
      { title: 'فقط نوشتن یا بررسی لیست صورت‌حساب‌ها', durationMinutes: 2 },
      { title: 'پرداخت اولین و فوری‌ترین قبض', durationMinutes: 2 },
      { title: 'تیک زدن و ثبت رسید', durationMinutes: 1 },
    ]
  }
];

// Fallback universal 2-minute activation rule
const DEFAULT_DECONSTRUCTION = [
  { title: 'آماده‌سازی محیط: بستن تب‌های اضافه و قرار دادن لیوان آب روی میز', durationMinutes: 1 },
  { title: 'تایپ یا نوشتن اولین جمله / اولین قدم بسیار ساده و خنده‌دار', durationMinutes: 2 },
  { title: 'فقط ۵ دقیقه کار کردن بدون نگاه کردن به ساعت یا گوشی', durationMinutes: 5 },
  { title: 'بررسی پیشرفت و تصمیم‌گیری برای ادامه کار', durationMinutes: 2 },
];

export function deconstructTask(taskTitle: string): MicroStep[] {
  const normalized = taskTitle.toLowerCase();
  
  const matched = TEMPLATES.find(template => 
    template.keywords.some(keyword => normalized.includes(keyword))
  );

  const rawSteps = matched ? matched.steps : DEFAULT_DECONSTRUCTION;

  return rawSteps.map((s, index) => ({
    id: `micro-${Date.now()}-${index}`,
    title: s.title,
    durationMinutes: s.durationMinutes,
    completed: false
  }));
}
