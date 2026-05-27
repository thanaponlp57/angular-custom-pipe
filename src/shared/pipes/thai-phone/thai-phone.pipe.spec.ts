import { ThaiPhonePipe } from './thai-phone.pipe';

describe('ThaiPhonePipe', () => {
  const pipe = new ThaiPhonePipe();

  it('มือถือ 0XX-XXX-XXXX', () => {
    expect(pipe.transform('0812345678')).toBe('081-234-5678');
  });

  it('เบอร์บ้าน กทม. 0X-XXX-XXXX', () => {
    expect(pipe.transform('021234567')).toBe('02-123-4567');
  });

  it('เบอร์บ้านต่างจังหวัด 0XX-XXX-XXX', () => {
    expect(pipe.transform('032345678')).toBe('032-345-678');
  });

  it('07x เป็นเบอร์บ้านภาคใต้ (landline) ไม่ใช่มือถือ', () => {
    expect(pipe.transform('077123456')).toBe('077-123-456');
  });

  it('แปลง +66 / 66 นำหน้าเป็น 0', () => {
    expect(pipe.transform('+66812345678')).toBe('081-234-5678');
    expect(pipe.transform('66812345678')).toBe('081-234-5678');
  });

  it('prefix ไม่รู้จัก/ไม่ครบ → คืนตัวเลขตามที่มี', () => {
    expect(pipe.transform('0112345678')).toBe('0112345678');
    expect(pipe.transform('081234')).toBe('081234');
  });

  it('mask = true ปิดกลุ่มกลางด้วย *', () => {
    expect(pipe.transform('0812345678', true)).toBe('081-***-5678');
    expect(pipe.transform('021234567', true)).toBe('02-***-4567');
    expect(pipe.transform('032345678', true)).toBe('032-***-678');
  });

  it('คืนค่าว่างเมื่อ null/undefined/ไม่มีตัวเลข', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('abc')).toBe('');
  });
});
