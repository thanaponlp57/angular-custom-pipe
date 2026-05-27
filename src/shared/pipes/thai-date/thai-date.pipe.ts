import { Pipe, PipeTransform } from '@angular/core';

/** ชื่อเดือนภาษาไทยแบบเต็ม (index 0 = มกราคม) */
const MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
/** ชื่อเดือนภาษาไทยแบบย่อ */
const MONTHS_ABBR = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
/** ชื่อวันในสัปดาห์แบบเต็ม (index 0 = วันอาทิตย์ ตรงกับ Date.getDay()) */
const DAYS_FULL = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์',
];
/** ชื่อวันในสัปดาห์แบบย่อ */
const DAYS_ABBR = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** ยุคปีที่ใช้แสดงผล: BE = พุทธศักราช (ค.ศ. + 543), CE = คริสต์ศักราช */
export type ThaiEra = 'BE' | 'CE';

/**
 * Thai date pipe (วันที่แบบไทย)
 *
 * รับ token format string สไตล์ Angular DatePipe แต่เป็นโทเคนไทย และปีเริ่มต้นเป็น พ.ศ.
 *
 * โทเคน: d/dd (วันที่), M/MM (เลขเดือน), MMM/MMMM (เดือนย่อ/เต็ม),
 *        yy/yyyy (ปี 2/4 หลักตาม era), E/EEE (วันย่อ), EEEE (วันเต็ม),
 *        '...' (literal), '' (single quote)
 *
 * ตัวอย่าง:
 *   {{ d | thaiDate }}                                   // 15 มกราคม 2568
 *   {{ d | thaiDate:'d MMM yy' }}                         // 15 ม.ค. 68
 *   {{ d | thaiDate:"EEEE'ที่' d MMMM 'พ.ศ.' yyyy" }}    // วันพุธที่ 15 มกราคม พ.ศ. 2568
 */
@Pipe({ name: 'thaiDate' })
export class ThaiDatePipe implements PipeTransform {
  transform(
    value: Date | string | number | null | undefined,
    format = 'd MMMM yyyy',
    era: ThaiEra = 'BE',
  ): string {
    const date = ThaiDatePipe.toDate(value);
    if (!date) return '';
    return ThaiDatePipe.formatThaiDate(date, format, era);
  }

  /** แปลงค่า input เป็น Date; คืน null ถ้าแปลงไม่ได้ */
  static toDate(value: Date | string | number | null | undefined): Date | null {
    if (value === null || value === undefined || value === '') return null;
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  /** จัดรูปแบบวันที่ตาม token format string (โทเคนไทย) */
  static formatThaiDate(date: Date, format: string, era: ThaiEra = 'BE'): string {
    const year = era === 'BE' ? date.getFullYear() + 543 : date.getFullYear();
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const weekday = date.getDay();

    // จับ literal ใน '...' (รวม '' = quote ตัวเดียว) หรือกลุ่มอักษรเดียวกันซ้ำ (โทเคน)
    const tokenRegex = /'(?:[^']|'')*'|([a-zA-Z])\1*/g;

    return format.replace(tokenRegex, (match) => {
      // literal: ขึ้นต้นด้วย ' → ตัด quote หัวท้าย, '' → ' , กรณี '' ล้วน = single quote
      if (match.startsWith("'")) {
        const inner = match.slice(1, -1);
        return inner === '' ? "'" : inner.replace(/''/g, "'");
      }
      switch (match) {
        case 'd': return String(day);
        case 'dd': return String(day).padStart(2, '0');
        case 'M': return String(monthIndex + 1);
        case 'MM': return String(monthIndex + 1).padStart(2, '0');
        case 'MMM': return MONTHS_ABBR[monthIndex];
        case 'MMMM': return MONTHS_FULL[monthIndex];
        case 'yy': return String(year).slice(-2);
        case 'yyyy': return String(year);
        case 'E':
        case 'EEE': return DAYS_ABBR[weekday];
        case 'EEEE': return DAYS_FULL[weekday];
        default: return match; // โทเคนที่ไม่รู้จัก คงไว้ตามเดิม
      }
    });
  }
}
