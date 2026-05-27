import { TestBed } from '@angular/core/testing';
import { PipePlayground } from './pipe-playground';
import { PipeDoc } from '../../models/pipe-doc.model';

/** doc ปลอมสำหรับทดสอบ: simulate คืน "value-mode" เพื่อตรวจ state ได้ง่าย */
function makeDoc(slug: string, valueDefault: string, modeDefault: string): PipeDoc {
  return {
    slug,
    category: 'ทดสอบ',
    name: 'fakePipe',
    titleAccent: '',
    lede: '',
    params: [{ name: 'mode', type: 'string', description: '', optional: true }],
    playground: [
      { key: 'value', label: 'value', kind: 'text', default: valueDefault },
      {
        key: 'mode',
        label: 'mode',
        kind: 'chips',
        default: modeDefault,
        options: [{ value: 'up' }, { value: 'down' }],
      },
    ],
    simulate: (value, sel) => (value ? `${value}-${sel['mode']}` : ''),
    code: { filename: 'x.html', language: 'html', content: '' },
    notes: [],
  };
}

function create(doc: PipeDoc) {
  const fixture = TestBed.createComponent(PipePlayground);
  fixture.componentRef.setInput('doc', doc);
  return fixture;
}

describe('PipePlayground', () => {
  it('คำนวณ output จากค่า default ตอนเริ่ม', async () => {
    const fixture = create(makeDoc('a', 'hello', 'up'));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.pg-output-value')?.textContent).toContain('hello-up');
    expect(el.querySelector('.pg-expression')?.textContent).toContain("{{ value | fakePipe:'up' }}");
  });

  it('พิมพ์ในช่อง text แล้ว output อัปเดต', async () => {
    const fixture = create(makeDoc('a', 'hello', 'up'));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const inputEl = el.querySelector('.pg-input') as HTMLInputElement;
    inputEl.value = 'world';
    inputEl.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.querySelector('.pg-output-value')?.textContent).toContain('world-up');
  });

  it('เลือก chip แล้ว output + expression อัปเดต', async () => {
    const fixture = create(makeDoc('a', 'hello', 'up'));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const chips = el.querySelectorAll('.pg-chip');
    (chips[1] as HTMLButtonElement).click(); // 'down'
    await fixture.whenStable();
    expect(el.querySelector('.pg-output-value')?.textContent).toContain('hello-down');
    expect(el.querySelector('.pg-expression')?.textContent).toContain("{{ value | fakePipe:'down' }}");
  });

  it('สลับ pipe (doc) แล้ว state รีเซ็ตเป็น default ของ pipe ใหม่', async () => {
    const fixture = create(makeDoc('a', 'hello', 'up'));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    // เปลี่ยนค่าก่อน
    const chips = el.querySelectorAll('.pg-chip');
    (chips[1] as HTMLButtonElement).click(); // 'down'
    await fixture.whenStable();
    expect(el.querySelector('.pg-output-value')?.textContent).toContain('hello-down');

    // สลับ doc → ต้องรีเซ็ตเป็น default ของ doc ใหม่
    fixture.componentRef.setInput('doc', makeDoc('b', 'bye', 'up'));
    await fixture.whenStable();
    expect(el.querySelector('.pg-output-value')?.textContent).toContain('bye-up');
  });

  it('input ว่าง → แสดงสถานะ "input ไม่ถูกต้อง"', async () => {
    const fixture = create(makeDoc('a', '', 'up'));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.pg-output-value.is-empty')?.textContent).toContain('input ไม่ถูกต้อง');
  });
});
