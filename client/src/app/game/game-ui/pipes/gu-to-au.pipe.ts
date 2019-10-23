import { Pipe, PipeTransform } from '@angular/core';
import { guToAu } from '../../Utils';

@Pipe({
  name: 'guToAu'
})
export class GuToAuPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return guToAu(value);
  }

}
