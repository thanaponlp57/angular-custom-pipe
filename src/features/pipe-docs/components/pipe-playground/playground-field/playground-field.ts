import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PlaygroundField as PlaygroundFieldModel } from '../../../models/pipe-doc.model';

/**
 * ช่อง input หนึ่งช่องใน playground — เป็นได้ทั้งช่องพิมพ์ข้อความ (text)
 * หรือกลุ่มปุ่ม chip ให้เลือก 1 ค่า; ส่งค่าที่เปลี่ยนกลับผ่าน output valueChange
 * (เป็น component แบบไม่มี state ของตัวเอง — พ่อ (PipePlayground) เป็นเจ้าของ state)
 */
@Component({
  selector: 'app-playground-field',
  templateUrl: './playground-field.html',
  styleUrl: './playground-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundField {
  readonly field = input.required<PlaygroundFieldModel>();
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  protected selectChip(value: string): void {
    this.valueChange.emit(value);
  }
}
