import { TestBed } from '@angular/core/testing';
import { DocsPager } from './docs-pager';

function build(currentIndex: number, total: number) {
  const fixture = TestBed.createComponent(DocsPager);
  fixture.componentRef.setInput('currentIndex', currentIndex);
  fixture.componentRef.setInput('total', total);
  fixture.componentRef.setInput('prevLabel', 'Prev');
  fixture.componentRef.setInput('nextLabel', 'Next');
  return fixture;
}

describe('DocsPager', () => {
  it('แสดงปุ่มเลขหน้าครบตามจำนวน', async () => {
    const fixture = build(0, 4);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.pagination .page-item').length).toBe(4);
  });

  it('ปิดปุ่มก่อนหน้าที่หน้าแรก และปิดปุ่มถัดไปที่หน้าสุดท้าย', async () => {
    const first = build(0, 4);
    await first.whenStable();
    expect((first.nativeElement.querySelector('.pager-link.prev') as HTMLButtonElement).disabled).toBe(true);
    expect((first.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).disabled).toBe(false);

    const last = build(3, 4);
    await last.whenStable();
    expect((last.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).disabled).toBe(true);
  });

  it('emit index เป้าหมายเมื่อคลิกเลขหน้า', async () => {
    const fixture = build(0, 4);
    const seen: number[] = [];
    fixture.componentInstance.navigate.subscribe((i) => seen.push(i));
    await fixture.whenStable();
    const pageButtons = fixture.nativeElement.querySelectorAll('.pagination .page-link');
    (pageButtons[2] as HTMLButtonElement).click();
    expect(seen).toEqual([2]);
  });

  it('emit index ถัดไปจากปุ่มถัดไป', async () => {
    const fixture = build(1, 4);
    const seen: number[] = [];
    fixture.componentInstance.navigate.subscribe((i) => seen.push(i));
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.pager-link.next') as HTMLButtonElement).click();
    expect(seen).toEqual([2]);
  });
});
