import { TestBed } from '@angular/core/testing';
import { SyntaxBar } from './syntax-bar';
import { PipeParam } from '../../models/pipe-doc.model';

const params: PipeParam[] = [
  { name: 'format', type: 'string', description: 'รูปแบบ', optional: true },
  { name: 'era', type: "'BE' | 'CE'", description: 'ยุคปี', optional: true },
];

describe('SyntaxBar', () => {
  it('แสดงชื่อ pipe และ param ครบทุกตัว', async () => {
    const fixture = TestBed.createComponent(SyntaxBar);
    fixture.componentRef.setInput('name', 'thaiDate');
    fixture.componentRef.setInput('params', params);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.pipe-name')?.textContent).toContain('thaiDate');
    const paramEls = el.querySelectorAll('.param');
    expect(paramEls.length).toBe(2);
    expect(paramEls[0].textContent).toContain('format');
    // param ไม่บังคับต้องมีคลาส optional
    expect(paramEls[0].classList.contains('optional')).toBe(true);
  });

  it('ไม่มี param → แสดงเฉพาะชื่อ pipe', async () => {
    const fixture = TestBed.createComponent(SyntaxBar);
    fixture.componentRef.setInput('name', 'thaiBahtText');
    fixture.componentRef.setInput('params', []);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.param').length).toBe(0);
    expect(el.querySelector('.pipe-name')?.textContent).toContain('thaiBahtText');
  });
});
