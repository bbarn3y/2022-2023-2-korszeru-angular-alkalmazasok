import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'example',
  // pure: false
})
export class ExamplePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    console.log('Example transform');
    return value.toUpperCase();
  }

}
