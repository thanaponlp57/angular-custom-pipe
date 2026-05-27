import { Pipe, PipeTransform } from '@angular/core';

/** คำอ่านตัวเลข 0–9 (index 0 = ไม่มีคำ ใช้สำหรับเลข 0) */
const DIGITS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
/** คำอ่านหลักภายในกลุ่ม 6 หลัก (index 0 = หน่วย ... 5 = แสน) — หลักสิบจัดการแยก */
const PLACES = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

/**
 * Thai baht text pipe (อ่านจำนวนเงินเป็นตัวอักษรภาษาไทย)
 *
 * จัดการกฎภาษา: ยี่สิบ (ไม่ใช่สองสิบ), สิบ (ไม่ใช่หนึ่งสิบ), เอ็ด ในหลักหน่วย,
 * "บาทถ้วน" เมื่อไม่มีสตางค์, "...บาท...สตางค์" เมื่อมีสตางค์,
 * จำนวนเต็มเป็นศูนย์แต่มีสตางค์จะตัด "ศูนย์บาท" ออก, ค่าติดลบนำหน้าด้วย "ลบ"
 *
 * ตัวอย่าง:
 *   {{ 25000 | thaiBahtText }}    // สองหมื่นห้าพันบาทถ้วน
 *   {{ 1234.5 | thaiBahtText }}   // หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์
 */
@Pipe({ name: 'thaiBahtText' })
export class ThaiBahtTextPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    const num = ThaiBahtTextPipe.toNumber(value);
    if (num === null) return '';
    return ThaiBahtTextPipe.bahtText(num);
  }

  /** แปลงค่า input เป็น number; คืน null ถ้าไม่ใช่ตัวเลข (รวม NaN/Infinity) */
  static toNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const num = typeof value === 'number' ? value : Number(value);
    // กัน Infinity/-Infinity (isNaN ไม่จับ) เพราะจะทำให้ readInteger วนไม่รู้จบ
    return isNaN(num) || !isFinite(num) ? null : num;
  }

  /** อ่านจำนวนเงินเป็นข้อความภาษาไทย */
  static bahtText(amount: number): string {
    const negative = amount < 0;
    const abs = Math.abs(amount);

    // ปัดทศนิยม 2 ตำแหน่ง แล้วแยกส่วนบาท/สตางค์
    const rounded = Math.round(abs * 100);
    const baht = Math.floor(rounded / 100);
    const satang = rounded % 100;

    let text = '';
    if (baht > 0) {
      text = ThaiBahtTextPipe.readInteger(baht) + 'บาท';
    }

    if (satang === 0) {
      // ไม่มีสตางค์ → ลงท้าย "ถ้วน" (ถ้า baht = 0 ด้วย จะได้ "ศูนย์บาทถ้วน")
      text = (text || 'ศูนย์บาท') + 'ถ้วน';
    } else {
      // มีสตางค์ → ถ้า baht = 0 ตัด "ศูนย์บาท" ออก (เช่น 0.50 → ห้าสิบสตางค์)
      text = text + ThaiBahtTextPipe.readInteger(satang) + 'สตางค์';
    }

    return negative ? 'ลบ' + text : text;
  }

  /** อ่านจำนวนเต็มเป็นข้อความไทย รองรับหลักล้านด้วยการวนกลุ่มละ 6 หลัก */
  static readInteger(n: number): string {
    if (n === 0) return 'ศูนย์';

    // แตกเป็นกลุ่มละ 6 หลัก (หลักล้าน) จากท้ายมาหน้า; groups[0] = กลุ่มต่ำสุด
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
      if (chunk === 0) continue; // ข้ามกลุ่มที่เป็นศูนย์
      // กลุ่มต่ำสุด (i===0) ที่มีกลุ่มสูงกว่า → บังคับใช้ "เอ็ด" ในหลักหน่วย (เช่น 1,000,001)
      const forceEt = i === 0 && hasHigherGroups;
      // กลุ่มที่ index i อยู่ระดับ 10^(6*i) จึงต่อท้ายด้วย "ล้าน" จำนวน i ครั้ง
      // (เช่น 2,000,001,000,000 = สองล้านล้านหนึ่งล้าน)
      result += ThaiBahtTextPipe.readGroup(chunk, forceEt) + 'ล้าน'.repeat(i);
    }
    return result;
  }

  /** อ่านเลข 1–999,999 (กลุ่มเดียว); forceEt = บังคับ "เอ็ด" ในหลักหน่วยเมื่อข้ามกลุ่ม */
  static readGroup(chunk: number, forceEt = false): string {
    if (chunk === 0) return '';
    const digits = String(chunk).split('').map(Number); // หลักสูงสุดอยู่ index 0
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
}
