import { ThaiBahtTextPipe } from './thai-baht-text.pipe';

describe('ThaiBahtTextPipe', () => {
  const pipe = new ThaiBahtTextPipe();

  describe('transform', () => {
    it('จำนวนเต็ม ลงท้าย บาทถ้วน', () => {
      expect(pipe.transform(25000)).toBe('สองหมื่นห้าพันบาทถ้วน');
    });

    it('ใช้ "ยี่สิบ" และ "เอ็ด"', () => {
      expect(pipe.transform(21)).toBe('ยี่สิบเอ็ดบาทถ้วน');
    });

    it('มีสตางค์', () => {
      expect(pipe.transform(1234.5)).toBe('หนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบสตางค์');
    });

    it('ศูนย์', () => {
      expect(pipe.transform(0)).toBe('ศูนย์บาทถ้วน');
    });

    it('จำนวนเต็มเป็นศูนย์แต่มีสตางค์ → ตัด "ศูนย์บาท"', () => {
      expect(pipe.transform(0.5)).toBe('ห้าสิบสตางค์');
    });

    it('ค่าติดลบ', () => {
      expect(pipe.transform(-10)).toBe('ลบสิบบาทถ้วน');
    });

    it('ปัดเศษสตางค์เป็น 2 ตำแหน่ง', () => {
      expect(pipe.transform(1.256)).toBe('หนึ่งบาทยี่สิบหกสตางค์');
    });

    it('รับ string ตัวเลขได้', () => {
      expect(pipe.transform('100')).toBe('หนึ่งร้อยบาทถ้วน');
    });

    it('คืนค่าว่างเมื่อไม่ใช่ตัวเลข', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('abc')).toBe('');
    });

    it('Infinity/-Infinity → คืนค่าว่าง', () => {
      expect(pipe.transform(Infinity)).toBe('');
      expect(pipe.transform(-Infinity)).toBe('');
    });
  });

  describe('readInteger (static)', () => {
    it('สิบ ไม่ใช่ หนึ่งสิบ', () => {
      expect(ThaiBahtTextPipe.readInteger(10)).toBe('สิบ');
    });
    it('สิบเอ็ด', () => {
      expect(ThaiBahtTextPipe.readInteger(11)).toBe('สิบเอ็ด');
    });
    it('หนึ่งร้อยเอ็ด', () => {
      expect(ThaiBahtTextPipe.readInteger(101)).toBe('หนึ่งร้อยเอ็ด');
    });
    it('หนึ่งพันเอ็ด', () => {
      expect(ThaiBahtTextPipe.readInteger(1001)).toBe('หนึ่งพันเอ็ด');
    });
    it('หลักล้าน', () => {
      expect(ThaiBahtTextPipe.readInteger(1000000)).toBe('หนึ่งล้าน');
      expect(ThaiBahtTextPipe.readInteger(1000001)).toBe('หนึ่งล้านเอ็ด');
    });

    it('หลักล้านล้าน (กลุ่มกลางเป็นศูนย์)', () => {
      expect(ThaiBahtTextPipe.readInteger(1000000000000)).toBe('หนึ่งล้านล้าน');
      expect(ThaiBahtTextPipe.readInteger(2000001000000)).toBe('สองล้านล้านหนึ่งล้าน');
    });
    it('เลขผสมหลายหลัก', () => {
      expect(ThaiBahtTextPipe.readInteger(12345678)).toBe(
        'สิบสองล้านสามแสนสี่หมื่นห้าพันหกร้อยเจ็ดสิบแปด',
      );
    });
  });
});
