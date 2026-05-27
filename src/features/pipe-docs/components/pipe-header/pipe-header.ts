import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-pipe-header',
  templateUrl: './pipe-header.html',
  styleUrl: './pipe-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeHeader {
  /** ข้อความหมวดหมู่ฝั่งซ้ายของ eyebrow เช่น 'Custom Pipe · วันที่' */
  readonly category = input.required<string>();
  /** ชื่อ pipe เช่น 'thaiDate' */
  readonly name = input.required<string>();
  /** ส่วนเอียงสีเน้นต่อท้ายชื่อ เช่น '— วันที่ไทย' */
  readonly titleAccent = input('');
  readonly lede = input.required<string>();
  readonly index = input.required<number>(); // 0-based
  readonly total = input.required<number>();

  /** เติมศูนย์ให้เลขหน้าเป็น 2 หลัก (เช่น 4 → '04') ให้เข้ากับดีไซน์ */
  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
