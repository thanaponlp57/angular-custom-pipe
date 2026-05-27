import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * แสดงนิพจน์ template ปัจจุบัน + แถบผลลัพธ์ของ playground
 * ถ้า output ว่าง (input ไม่ถูกต้อง) จะแสดงข้อความแทนและใส่คลาส is-empty
 */
@Component({
  selector: 'app-playground-output',
  templateUrl: './playground-output.html',
  styleUrl: './playground-output.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundOutput {
  readonly expression = input.required<string>();
  readonly output = input.required<string>();
}
