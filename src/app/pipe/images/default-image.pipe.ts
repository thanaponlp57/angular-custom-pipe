import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage',
})
export class DefaultImagePipe implements PipeTransform {
  transform(url: string, altUrl: any): string {
    return this.checkImgExist(url) ? url : altUrl;
  }

  checkImgExist(url: string): boolean {
    const image = new Image();
    image.src = url;
    return image.complete;
  }
}
