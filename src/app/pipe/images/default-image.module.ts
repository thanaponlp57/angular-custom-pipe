import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultImagePipe } from './default-image.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DefaultImagePipe],
  exports: [DefaultImagePipe],
})
export class DefaultImagePipeModule {}
