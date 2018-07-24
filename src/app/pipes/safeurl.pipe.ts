import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl'
})
export class safeUrlPipe implements PipeTransform {
  constructor ( private _domSanitizer:DomSanitizer){}
  transform(value: string, url:string = ''): any {
    return this._domSanitizer.bypassSecurityTrustResourceUrl( 'https://drive.google.com/viewerng/viewer?embedded=true&url=http://bigwave-api.herokuapp.com' + value);
  }
}
