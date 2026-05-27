import { simThaiBahtText, simThaiDate, simThaiIdCard, simThaiPhone } from './playground-sim';

/**
 * sim เหล่านี้จำลอง pipe จริงแบบแยกต่างหาก (ดู playground-sim.ts)
 * spec นี้ยืนยันว่าผลลัพธ์ตรงกับเคสมาตรฐานเดียวกับ spec ของ pipe จริง — กัน drift
 */
describe('playground-sim', () => {
  describe('simThaiDate', () => {
    // วันพุธที่ 15 มกราคม 2025 (ค.ศ.) = พ.ศ. 2568 — ใช้ ISO local กัน timezone
    const value = '2025-01-15T00:00:00';

    it('ค่า default = วันที่ เดือนเต็ม ปี พ.ศ.', () => {
      expect(simThaiDate(value, {})).toBe('15 มกราคม 2568');
    });

    it('format ย่อ d MMM yy', () => {
      expect(simThaiDate(value, { format: 'd MMM yy' })).toBe('15 ม.ค. 68');
    });

    it('literal ใน quote + วันเต็ม', () => {
      expect(simThaiDate(value, { format: "EEEE'ที่' d MMMM 'พ.ศ.' yyyy" })).toBe(
        'วันพุธที่ 15 มกราคม พ.ศ. 2568',
      );
    });

    it('era = CE', () => {
      expect(simThaiDate(value, { format: 'd MMMM yyyy', era: 'CE' })).toBe('15 มกราคม 2025');
    });

    it('dd/MM/yyyy เติมศูนย์', () => {
      expect(simThaiDate(value, { format: 'dd/MM/yyyy' })).toBe('15/01/2568');
    });

    it('คืนค่าว่างเมื่อ parse ไม่ได้/ว่าง', () => {
      expect(simThaiDate('ไม่ใช่วันที่', {})).toBe('');
      expect(simThaiDate('', {})).toBe('');
    });
  });

  describe('simThaiBahtText', () => {
    it('จำนวนเต็ม → บาทถ้วน', () => {
      expect(simThaiBahtText('25000', {})).toBe('สองหมื่นห้าพันบาทถ้วน');
    });
    it('ยี่สิบเอ็ด', () => {
      expect(simThaiBahtText('21', {})).toBe('ยี่สิบเอ็ดบาทถ้วน');
    });
    it('มีสตางค์', () => {
      expect(simThaiBahtText('1234.5', {})).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์');
    });
    it('ศูนย์', () => {
      expect(simThaiBahtText('0', {})).toBe('ศูนย์บาทถ้วน');
    });
    it('จำนวนเต็ม 0 แต่มีสตางค์ → ตัดศูนย์บาท', () => {
      expect(simThaiBahtText('0.5', {})).toBe('ห้าสิบสตางค์');
    });
    it('ค่าติดลบ', () => {
      expect(simThaiBahtText('-10', {})).toBe('ลบสิบบาทถ้วน');
    });
    it('ปัดเศษสตางค์ 2 ตำแหน่ง', () => {
      expect(simThaiBahtText('1.256', {})).toBe('หนึ่งบาทยี่สิบหกสตางค์');
    });
    it('เลขหลายหลัก (หลักล้าน)', () => {
      expect(simThaiBahtText('12345678', {})).toBe(
        'สิบสองล้านสามแสนสี่หมื่นห้าพันหกร้อยเจ็ดสิบแปดบาทถ้วน',
      );
    });
    it('คืนค่าว่างเมื่อไม่ใช่ตัวเลข/ว่าง', () => {
      expect(simThaiBahtText('abc', {})).toBe('');
      expect(simThaiBahtText('', {})).toBe('');
    });
  });

  describe('simThaiIdCard', () => {
    it('จัดรูปแบบ 13 หลัก', () => {
      expect(simThaiIdCard('1234567890123', {})).toBe('1-2345-67890-12-3');
    });
    it('mask = true ปิดหลัก 7–12', () => {
      expect(simThaiIdCard('1234567890123', { mask: 'true' })).toBe('1-2345-6****-**-3');
    });
    it('จัดกลุ่มเท่าที่มีเมื่อไม่ครบ 13 หลัก', () => {
      expect(simThaiIdCard('12345', {})).toBe('1-2345');
    });
    it('mask กับเลขไม่ครบ → ไม่ปิด', () => {
      expect(simThaiIdCard('1234567', { mask: 'true' })).toBe('1-2345-67');
    });
    it('คืนค่าว่างเมื่อไม่มีตัวเลข/ว่าง', () => {
      expect(simThaiIdCard('abc', {})).toBe('');
      expect(simThaiIdCard('', {})).toBe('');
    });
  });

  describe('simThaiPhone', () => {
    it('มือถือ', () => {
      expect(simThaiPhone('0812345678', {})).toBe('081-234-5678');
    });
    it('เบอร์บ้าน กทม.', () => {
      expect(simThaiPhone('021234567', {})).toBe('02-123-4567');
    });
    it('mask = true ปิดกลุ่มกลาง', () => {
      expect(simThaiPhone('0812345678', { mask: 'true' })).toBe('081-***-5678');
    });
    it('แปลง +66 นำหน้าเป็น 0', () => {
      expect(simThaiPhone('+66812345678', {})).toBe('081-234-5678');
    });
    it('คืนค่าว่างเมื่อไม่มีตัวเลข/ว่าง', () => {
      expect(simThaiPhone('abc', {})).toBe('');
      expect(simThaiPhone('', {})).toBe('');
    });
  });
});
