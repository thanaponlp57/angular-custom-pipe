import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SumPipe } from './sum.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SumPipe],
  exports: [SumPipe],
})
export class SumPipeModule {}
