import { TestBed } from '@angular/core/testing';
import { PipeHeader } from './pipe-header';

describe('PipeHeader', () => {
  it('แสดงชื่อ pipe, ส่วนเอียง, ตำแหน่งหน้า และคำโปรย', async () => {
    const fixture = TestBed.createComponent(PipeHeader);
    const ref = fixture.componentRef;
    ref.setInput('category', 'Custom Pipe · วันที่');
    ref.setInput('name', 'thaiDate');
    ref.setInput('titleAccent', '— วันที่ไทย');
    ref.setInput('lede', 'จัดรูปแบบวันที่แบบไทย');
    ref.setInput('index', 0);
    ref.setInput('total', 4);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.pipe-name')?.textContent).toContain('thaiDate');
    expect(el.querySelector('.pipe-name em')?.textContent).toContain('วันที่ไทย');
    expect(el.querySelector('.eyebrow')?.textContent).toContain('01 / 04');
    expect(el.querySelector('.lede')?.textContent).toContain('จัดรูปแบบวันที่แบบไทย');
  });
});
