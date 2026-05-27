import { Pipe, PipeTransform } from '@angular/core';

/**
 * Thai phone pipe (จัดรูปแบบเบอร์โทรศัพท์ไทยเพื่อแสดงผล)
 *
 * ตรวจประเภทอัตโนมัติ: มือถือ 0[689] → 0XX-XXX-XXXX,
 * เบอร์บ้าน กทม. 02 → 0X-XXX-XXXX, เบอร์บ้านต่างจังหวัด 0[3-57] → 0XX-XXX-XXX
 * แปลง prefix +66/66 → 0 ; mask = true ปิดกลุ่มกลางด้วย *
 *
 * logic เป็นชุดของ pipe เอง (อิสระเต็มตัว ไม่อ้างอิงโค้ดส่วนอื่น)
 *
 * ตัวอย่าง:
 *   {{ '0812345678' | thaiPhone }}        // 081-234-5678
 *   {{ '0812345678' | thaiPhone:true }}   // 081-***-5678
 */
@Pipe({ name: 'thaiPhone' })
export class ThaiPhonePipe implements PipeTransform {
  transform(value: string | number | null | undefined, mask = false): string {
    if (value === null || value === undefined) return '';
    const digits = ThaiPhonePipe.normalize(String(value));
    if (digits.length === 0) return '';
    const formatted = ThaiPhonePipe.format(digits);
    return mask ? ThaiPhonePipe.maskMiddle(formatted) : formatted;
  }

  /** ตัดอักขระที่ไม่ใช่ตัวเลข, แปลง +66/66 นำหน้า → 0, จำกัด 10 หลัก */
  static normalize(raw: string): string {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('66') && digits.length > 9) {
      digits = '0' + digits.slice(2);
    }
    return digits.slice(0, 10);
  }

  /** จัดรูปแบบตามประเภทเบอร์ที่ตรวจพบ; ถ้าไม่เข้าเกณฑ์/ไม่ครบ คืนตัวเลขตามที่มี */
  static format(digits: string): string {
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
  static maskMiddle(formatted: string): string {
    const parts = formatted.split('-');
    if (parts.length !== 3) return formatted; // ยังไม่ครบรูปแบบ ไม่ปิด
    parts[1] = '*'.repeat(parts[1].length);
    return parts.join('-');
  }
}
