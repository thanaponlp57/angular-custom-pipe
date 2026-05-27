import { TestBed } from '@angular/core/testing';
import { ParamsTable } from './params-table';
import { PipeParam } from '../../models/pipe-doc.model';

const params: PipeParam[] = [
  { name: 'mask', type: 'boolean', description: 'ปิดหลักกลาง', optional: true },
];

describe('ParamsTable', () => {
  it('แสดงหนึ่งแถวต่อ param พร้อมป้าย "ไม่บังคับ"', async () => {
    const fixture = TestBed.createComponent(ParamsTable);
    fixture.componentRef.setInput('params', params);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.p-name')?.textContent).toContain('mask');
    expect(el.querySelector('.p-type')?.textContent).toContain('boolean');
    expect(el.querySelector('.optional-tag')?.textContent).toContain('ไม่บังคับ');
  });
});
