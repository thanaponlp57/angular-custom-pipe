import { ThaiDatePipe } from './thai-date.pipe';

describe('ThaiDatePipe', () => {
  const pipe = new ThaiDatePipe();
  // วันพุธที่ 15 มกราคม 2025 (ค.ศ.) = พ.ศ. 2568 ; ใช้ constructor แบบ local เพื่อกัน timezone
  const date = new Date(2025, 0, 15);

  describe('transform', () => {
    it('ใช้ค่า default format = วันที่ เดือนเต็ม ปี พ.ศ.', () => {
      expect(pipe.transform(date)).toBe('15 มกราคม 2568');
    });

    it('รองรับ format ย่อ (d MMM yy)', () => {
      expect(pipe.transform(date, 'd MMM yy')).toBe('15 ม.ค. 68');
    });

    it('รองรับ literal ใน quote และวันเต็ม', () => {
      expect(pipe.transform(date, "EEEE'ที่' d MMMM 'พ.ศ.' yyyy")).toBe(
        'วันพุธที่ 15 มกราคม พ.ศ. 2568',
      );
    });

    it('รองรับ era = CE (ค.ศ.)', () => {
      expect(pipe.transform(date, 'd MMMM yyyy', 'CE')).toBe('15 มกราคม 2025');
    });

    it('รับ timestamp (number) ได้', () => {
      expect(pipe.transform(date.getTime(), 'dd/MM/yyyy')).toBe('15/01/2568');
    });

    it('รับ ISO string (local) ได้', () => {
      expect(pipe.transform('2025-01-15T00:00:00', 'd MMM yyyy')).toBe('15 ม.ค. 2568');
    });

    it('คืนค่าว่างเมื่อ input เป็น null/undefined/ค่าที่ parse ไม่ได้', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
      expect(pipe.transform('ไม่ใช่วันที่')).toBe('');
    });
  });

  describe('formatThaiDate (static)', () => {
    it('dd และ MM เติมศูนย์', () => {
      const d = new Date(2025, 8, 5); // 5 กันยายน
      expect(ThaiDatePipe.formatThaiDate(d, 'dd/MM/yyyy')).toBe('05/09/2568');
    });

    it('d และ M ไม่เติมศูนย์', () => {
      const d = new Date(2025, 8, 5);
      expect(ThaiDatePipe.formatThaiDate(d, 'd/M/yyyy')).toBe('5/9/2568');
    });

    it('E/EEE = วันย่อ', () => {
      expect(ThaiDatePipe.formatThaiDate(date, 'EEE')).toBe('พ.');
      expect(ThaiDatePipe.formatThaiDate(date, 'E')).toBe('พ.');
    });

    it("'' = single quote ตัวอักษร", () => {
      expect(ThaiDatePipe.formatThaiDate(date, "d'' MMM")).toBe("15' ม.ค.");
    });
  });
});
