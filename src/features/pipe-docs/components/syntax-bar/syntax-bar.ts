import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipeParam } from '../../models/pipe-doc.model';

/**
 * แถบ syntax แสดงรูปแบบการใช้ pipe เช่น {{ value | thaiDate:format:era }}
 * param ที่ไม่บังคับจะถูกหรี่ลง (จาง) เพื่อสื่อว่าใส่หรือไม่ก็ได้
 */
@Component({
  selector: 'app-syntax-bar',
  templateUrl: './syntax-bar.html',
  styleUrl: './syntax-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyntaxBar {
  readonly name = input.required<string>();
  readonly params = input.required<readonly PipeParam[]>();
}
