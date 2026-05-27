import { Pipe, PipeTransform } from '@angular/core';

/** ขนาดกลุ่มของเลขบัตรประชาชน: 1-2345-67890-12-3 */
const GROUP_SIZES = [1, 4, 5, 2, 1];

/**
 * Thai citizen ID card pipe (จัดรูปแบบเลขบัตรประชาชน 13 หลัก)
 *
 * รูปแบบ X-XXXX-XXXXX-XX-X ; ตัดอักขระที่ไม่ใช่ตัวเลขออก, จัดกลุ่มเท่าที่มีเมื่อยังไม่ครบ
 * mask = true ปิดหลักที่ 7–12 ด้วย * (เปิดหลัก 1–6 และหลักสุดท้าย) ตาม PDPA
 *
 * ตัวอย่าง:
 *   {{ '1234567890123' | thaiIdCard }}        // 1-2345-67890-12-3
 *   {{ '1234567890123' | thaiIdCard:true }}   // 1-2345-6****-**-3
 */
@Pipe({ name: 'thaiIdCard' })
export class ThaiIdCardPipe implements PipeTransform {
  transform(value: string | number | null | undefined, mask = false): string {
    if (value === null || value === undefined) return '';
    const digits = String(value).replace(/\D/g, '').slice(0, 13);
    if (digits.length === 0) return '';
    // mask ใช้ได้เมื่อเลขครบ 13 หลักเท่านั้น (เลขไม่ครบยังไม่ใช่บัตรจริง จึงไม่ปิด)
    const shown = mask && digits.length === 13 ? ThaiIdCardPipe.maskDigits(digits) : digits;
    return ThaiIdCardPipe.group(shown);
  }

  /** จัดกลุ่มตามขนาด 1-4-5-2-1 (จัดเท่าที่มี ถ้ายังไม่ครบ 13 หลัก) */
  static group(value: string): string {
    const groups: string[] = [];
    let pos = 0;
    for (const size of GROUP_SIZES) {
      if (pos >= value.length) break;
      groups.push(value.slice(pos, pos + size));
      pos += size;
    }
    return groups.join('-');
  }

  /** ปิดหลักที่ 7–12 (index 6–11) ด้วย * เปิดหลัก 1–6 และหลักสุดท้าย */
  static maskDigits(digits: string): string {
    return digits
      .split('')
      .map((ch, i) => (i >= 6 && i <= 11 ? '*' : ch))
      .join('');
  }
}
