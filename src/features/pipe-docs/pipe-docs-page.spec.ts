import { TestBed } from '@angular/core/testing';
import { PipeDocsPage } from './pipe-docs-page';
import { PIPE_DOCS } from './data-access/pipe-docs.data';

describe('PipeDocsPage', () => {
  it('แสดง pipe ตัวแรกเป็นค่าเริ่มต้น', async () => {
    const fixture = TestBed.createComponent(PipeDocsPage);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(PIPE_DOCS[0].name); // thaiDate
  });

  it('แสดง playground เสมอ', async () => {
    const fixture = TestBed.createComponent(PipeDocsPage);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('app-pipe-playground')).toBeTruthy();
  });

  it('สลับเนื้อหาเมื่อกด pager', async () => {
    const fixture = TestBed.createComponent(PipeDocsPage);
    await fixture.whenStable();

    const lastIndex = PIPE_DOCS.length - 1;
    const pageButtons = fixture.nativeElement.querySelectorAll('.pagination .page-link');
    (pageButtons[lastIndex] as HTMLButtonElement).click();
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(PIPE_DOCS[lastIndex].name); // thaiPhone
  });

  it('ซ่อนตาราง Parameters สำหรับ pipe ที่ไม่มี param (thaiBahtText)', async () => {
    const fixture = TestBed.createComponent(PipeDocsPage);
    await fixture.whenStable();

    // index 1 = thaiBahtText (params ว่าง)
    const bahtIndex = PIPE_DOCS.findIndex((d) => d.params.length === 0);
    expect(bahtIndex).toBeGreaterThanOrEqual(0);
    const pageButtons = fixture.nativeElement.querySelectorAll('.pagination .page-link');
    (pageButtons[bahtIndex] as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-params-table')).toBeNull();
  });
});
