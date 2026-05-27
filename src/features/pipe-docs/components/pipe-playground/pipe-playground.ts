import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { PipeDoc } from '../../models/pipe-doc.model';
import { PlaygroundField } from './playground-field/playground-field';
import { PlaygroundOutput } from './playground-output/playground-output';

/**
 * Playground แบบโต้ตอบได้ — แสดงช่อง input ตามที่ pipe กำหนด แล้วคำนวณผลลัพธ์สด
 *
 * เป็นเจ้าของ state ของทุกช่อง (key → ค่า) ; ใช้ linkedSignal เพื่อ "รีเซ็ต" state
 * กลับเป็นค่า default โดยอัตโนมัติเมื่อผู้ใช้สลับ pipe ผ่าน pager
 * ผลลัพธ์คำนวณจาก doc().simulate (จำลองแยกจาก pipe จริง — ดู playground-sim.ts)
 */
@Component({
  selector: 'app-pipe-playground',
  imports: [PlaygroundField, PlaygroundOutput],
  templateUrl: './pipe-playground.html',
  styleUrl: './pipe-playground.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipePlayground {
  readonly doc = input.required<PipeDoc>();

  /** ค่าของทุกช่อง (key → ค่า) ; รีเซ็ตเป็น default เมื่อ doc เปลี่ยน */
  protected readonly state = linkedSignal<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of this.doc().playground) {
      initial[field.key] = field.default;
    }
    return initial;
  });

  /** ผลลัพธ์สด: ส่งช่อง 'value' เป็น value, ส่ง state ทั้งก้อนเป็น selections */
  protected readonly output = computed(() => {
    const s = this.state();
    return this.doc().simulate(s['value'] ?? '', s);
  });

  /** นิพจน์ template ที่สะท้อนค่าปัจจุบัน เช่น {{ value | thaiDate:'d MMM yy':'BE' }} */
  protected readonly expression = computed(() => {
    const s = this.state();
    // boolean แสดงค่าดิบ (true/false), ชนิดอื่นใส่ single quote ตามสไตล์ template
    const args = this.doc()
      .params.map((p) => (p.type === 'boolean' ? s[p.name] : `'${s[p.name] ?? ''}'`))
      .join(':');
    const tail = args ? ':' + args : '';
    return `{{ value | ${this.doc().name}${tail} }}`;
  });

  protected setValue(key: string, value: string): void {
    this.state.update((s) => ({ ...s, [key]: value }));
  }
}
