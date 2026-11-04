import { COLORS } from '../constants/colors'
import { Task } from '../types/task'

export const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'ایمیل‌ها', description: 'پاسخ به ایمیل‌های مهم امروز', priority: 'high', completed: false, skipped: false, color: COLORS[0] },
  { id: '2', title: 'گزارش', description: 'تهیه گزارش هفتگی تیم', priority: 'medium', completed: false, skipped: false, color: COLORS[1] },
  { id: '3', title: 'جلسه', description: 'آماده‌سازی اسلایدهای جلسه', priority: 'high', completed: false, skipped: false, color: COLORS[3] },
  { id: '4', title: 'ورزش', description: '۳۰ دقیقه پیاده‌روی', priority: 'low', completed: false, skipped: false, color: COLORS[5] },
  { id: '5', title: 'مطالعه', description: 'مطالعه ۲۰ صفحه کتاب', priority: 'medium', completed: false, skipped: false, color: COLORS[6] },
]
