import { PipeSimulate } from '../models/pipe-doc.model';

/**
 * Playground simulation — จำลองผลลัพธ์ของ Thai pipe แต่ละตัวสำหรับหน้า docs
 *
 * ⚠️ จงใจเขียน logic แยกต่างหากจาก pipe จริงใน src/shared/pipes/ (ตามที่ตกลงไว้)
 * เพื่อให้ playground ไม่ผูกกับ Angular pipe โดยตรง — ข้อแลกเปลี่ยนคือ logic ซ้ำ 2 ที่
 * playground-sim.spec.ts ยืนยันว่าผลตรงกับเคสมาตรฐานเดียวกับ spec ของ pipe จริง เพื่อกัน drift
 *
 * ทุกฟังก์ชันรับ value เป็นสตริง (จากช่องกรอก) + selections (ค่าที่เลือกจาก chip)
 * และคืน '' เมื่อ input ว่าง/ไม่ถูกต้อง (ตรงพฤติกรรมจริงของ pipe)
 */

/* ─────────────────────────── thaiDate ─────────────────────────── */

const MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
const MONTHS_ABBR = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
const DAYS_FULL = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์',
];
const DAYS_ABBR = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

/** จัดรูปแบบวันที่แบบไทยตาม token format string; era 'BE' = พ.ศ. (ค.ศ.+543), 'CE' = ค.ศ. */
export const simThaiDate: PipeSimulate = (value, selections) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';

  const format = selections['format'] || 'd MMMM yyyy';
  const era = selections['era'] === 'CE' ? 'CE' : 'BE';
  const year = era === 'BE' ? date.getFullYear() + 543 : date.getFullYear();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const weekday = date.getDay();

  // จับ literal ใน '...' (รวม '' = quote ตัวเดียว) หรือกลุ่มอักษรเดียวกันซ้ำ (โทเคน)
  const tokenRegex = /'(?:[^']|'')*'|([a-zA-Z])\1*/g;

  return format.replace(tokenRegex, (match) => {
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
};

/* ───────────────────────── thaiBahtText ───────────────────────── */

const DIGITS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

/** อ่านเลข 1–999,999 (กลุ่มเดียว); forceEt = บังคับ "เอ็ด" ในหลักหน่วยเมื่อข้ามกลุ่ม */
function readGroup(chunk: number, forceEt = false): string {
  if (chunk === 0) return '';
  const digits = String(chunk).split('').map(Number);
  const len = digits.length;
  let text = '';

  for (let i = 0; i < len; i++) {
    const d = digits[i];
    const place = len - i - 1; // 0 = หน่วย, 1 = สิบ, ... , 5 = แสน
    if (d === 0) continue;

    if (place === 1) {
      // หลักสิบ: 1 → สิบ, 2 → ยี่สิบ, อื่นๆ → {เลข}สิบ
      if (d === 1) text += 'สิบ';
      else if (d === 2) text += 'ยี่สิบ';
      else text += DIGITS[d] + 'สิบ';
    } else if (place === 0 && d === 1 && (len > 1 || forceEt)) {
      // หลักหน่วยเป็น 1 และมีหลักสูงกว่า (หรือถูกบังคับข้ามกลุ่ม) → เอ็ด
      text += 'เอ็ด';
    } else {
      text += DIGITS[d] + PLACES[place];
    }
  }
  return text;
}

/** อ่านจำนวนเต็มเป็นข้อความไทย รองรับหลักล้านด้วยการวนกลุ่มละ 6 หลัก */
function readInteger(n: number): string {
  if (n === 0) return 'ศูนย์';
  const groups: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000000);
    remaining = Math.floor(remaining / 1000000);
  }
  const hasHigherGroups = groups.length > 1;
  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const chunk = groups[i];
    if (chunk === 0) continue;
    const forceEt = i === 0 && hasHigherGroups;
    result += readGroup(chunk, forceEt) + 'ล้าน'.repeat(i);
  }
  return result;
}

/** อ่านจำนวนเงินเป็นตัวอักษรภาษาไทย (บาท/สตางค์, ถ้วน, ลบ) */
export const simThaiBahtText: PipeSimulate = (value) => {
  if (!value) return '';
  const num = Number(value);
  // กัน NaN/Infinity (Infinity จะทำให้ readInteger วนไม่รู้จบ)
  if (isNaN(num) || !isFinite(num)) return '';

  const negative = num < 0;
  const abs = Math.abs(num);
  const rounded = Math.round(abs * 100); // ปัดทศนิยม 2 ตำแหน่ง
  const baht = Math.floor(rounded / 100);
  const satang = rounded % 100;

  let text = '';
  if (baht > 0) text = readInteger(baht) + 'บาท';

  if (satang === 0) {
    text = (text || 'ศูนย์บาท') + 'ถ้วน';
  } else {
    // มีสตางค์ + บาท = 0 → ตัด "ศูนย์บาท" ออก (เช่น 0.50 → ห้าสิบสตางค์)
    text = text + readInteger(satang) + 'สตางค์';
  }

  return negative ? 'ลบ' + text : text;
};

/* ────────────────────────── thaiIdCard ────────────────────────── */

/** ขนาดกลุ่มของเลขบัตรประชาชน: 1-2345-67890-12-3 */
const ID_GROUP_SIZES = [1, 4, 5, 2, 1];

/** จัดกลุ่มตามขนาด 1-4-5-2-1 (จัดเท่าที่มีถ้ายังไม่ครบ 13 หลัก) */
function groupIdCard(value: string): string {
  const groups: string[] = [];
  let pos = 0;
  for (const size of ID_GROUP_SIZES) {
    if (pos >= value.length) break;
    groups.push(value.slice(pos, pos + size));
    pos += size;
  }
  return groups.join('-');
}

/** จัดรูปแบบเลขบัตรประชาชน 13 หลัก; mask = ปิดหลัก 7–12 ด้วย * (เมื่อครบ 13 หลัก) */
export const simThaiIdCard: PipeSimulate = (value, selections) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length === 0) return '';

  const mask = selections['mask'] === 'true';
  // mask ใช้ได้เมื่อครบ 13 หลักเท่านั้น (เลขไม่ครบยังไม่ใช่บัตรจริง จึงไม่ปิด)
  const shown =
    mask && digits.length === 13
      ? digits.split('').map((ch, i) => (i >= 6 && i <= 11 ? '*' : ch)).join('')
      : digits;
  return groupIdCard(shown);
};

/* ─────────────────────────── thaiPhone ────────────────────────── */

/** ตัดอักขระที่ไม่ใช่ตัวเลข, แปลง +66/66 นำหน้า → 0, จำกัด 10 หลัก */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('66') && digits.length > 9) {
    digits = '0' + digits.slice(2);
  }
  return digits.slice(0, 10);
}

/** จัดรูปแบบตามประเภทเบอร์; ถ้าไม่เข้าเกณฑ์/ไม่ครบ คืนตัวเลขตามที่มี */
function formatPhone(digits: string): string {
  // มือถือ 0[689] 10 หลัก → 0XX-XXX-XXXX
  if (/^0[689]\d{8}$/.test(digits)) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  // เบอร์บ้าน กทม. 02 9 หลัก → 0X-XXX-XXXX
  if (/^02\d{7}$/.test(digits)) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  // เบอร์บ้านต่างจังหวัด 0[3-57] 9 หลัก → 0XX-XXX-XXX
  if (/^0[3-57]\d{7}$/.test(digits)) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

/** ปิดกลุ่มกลางด้วย * (เช่น 081-234-5678 → 081-***-5678) */
function maskMiddlePhone(formatted: string): string {
  const parts = formatted.split('-');
  if (parts.length !== 3) return formatted; // ยังไม่ครบรูปแบบ ไม่ปิด
  parts[1] = '*'.repeat(parts[1].length);
  return parts.join('-');
}

/** จัดรูปแบบเบอร์โทรไทย (มือถือ/บ้าน) ตรวจประเภทอัตโนมัติ; mask = ปิดกลุ่มกลาง */
export const simThaiPhone: PipeSimulate = (value, selections) => {
  if (!value) return '';
  const digits = normalizePhone(value);
  if (digits.length === 0) return '';
  const formatted = formatPhone(digits);
  return selections['mask'] === 'true' ? maskMiddlePhone(formatted) : formatted;
};
