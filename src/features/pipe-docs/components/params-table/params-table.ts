import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipeParam } from '../../models/pipe-doc.model';

/** ตารางแสดงพารามิเตอร์ของ pipe: ชื่อ / ชนิด / คำอธิบาย (+ ป้าย "ไม่บังคับ") */
@Component({
  selector: 'app-params-table',
  templateUrl: './params-table.html',
  styleUrl: './params-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamsTable {
  readonly params = input.required<readonly PipeParam[]>();
}
