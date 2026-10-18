// Jalali / Persian date conversion & helpers

export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

// Precise Gregorian to Jalali converter
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_DAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
];

export function getTodayJalali(): { year: number; month: number; day: number; monthName: string; dayName: string; fullFormatted: string } {
  const now = new Date();
  const dayIndex = now.getDay();
  const [year, month, day] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const monthName = PERSIAN_MONTHS[month - 1];
  const dayName = PERSIAN_DAYS[dayIndex];

  return {
    year,
    month,
    day,
    monthName,
    dayName,
    fullFormatted: `${dayName}، ${toPersianDigits(day)} ${monthName} ${toPersianDigits(year)}`
  };
}

export function getGreeting(): { text: string; icon: string; quote: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: 'صبح بخیر قهرمان',
      icon: '🌅',
      quote: 'امروز قراره روز تو باشه؛ فقط با یک قدم ۵ دقیقه‌ای شروع کن.'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: 'ظهر بخیر پرانرژی',
      icon: '☀️',
      quote: 'بهترین زمان برای بلعیدن قورباغه روزت همین الانه!'
    };
  } else if (hour >= 17 && hour < 22) {
    return {
      text: 'عصر بخیر رفیق',
      icon: '🌤️',
      quote: 'قدم‌های کوچک مداوم، کوه‌ها رو جابه‌جا می‌کنه.'
    };
  } else {
    return {
      text: 'شب آرامی داشته باشی',
      icon: '🌙',
      quote: 'اگر کاری ناتموم موند، خودت رو سرزنش نکن. فردا فرصت تازه‌ای است.'
    };
  }
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${toPersianDigits(minutes)} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(remainingMinutes)} دقیقه`;
}
