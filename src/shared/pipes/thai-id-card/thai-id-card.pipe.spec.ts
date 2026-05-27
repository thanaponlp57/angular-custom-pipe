import { ThaiIdCardPipe } from './thai-id-card.pipe';

describe('ThaiIdCardPipe', () => {
  const pipe = new ThaiIdCardPipe();

  it('จัดรูปแบบ 13 หลักเป็น 1-2345-67890-12-3', () => {
    expect(pipe.transform('1234567890123')).toBe('1-2345-67890-12-3');
  });

  it('รับ number ได้', () => {
    expect(pipe.transform(1234567890123)).toBe('1-2345-67890-12-3');
  });

  it('ตัดอักขระที่ไม่ใช่ตัวเลขออกก่อนจัดรูปแบบ', () => {
    expect(pipe.transform('1-2345-67890-12-3')).toBe('1-2345-67890-12-3');
  });

  it('จัดกลุ่มเท่าที่มีเมื่อยังไม่ครบ 13 หลัก', () => {
    expect(pipe.transform('12345')).toBe('1-2345');
    expect(pipe.transform('1234567')).toBe('1-2345-67');
  });

  it('mask = true ปิดหลักที่ 7–12 ด้วย *', () => {
    expect(pipe.transform('1234567890123', true)).toBe('1-2345-6****-**-3');
  });

  it('mask กับเลขไม่ครบ 13 หลัก → จัดรูปแบบปกติ (ไม่ปิด)', () => {
    expect(pipe.transform('1234567', true)).toBe('1-2345-67');
  });

  it('คืนค่าว่างเมื่อ null/undefined/ไม่มีตัวเลข', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('abc')).toBe('');
  });
});
