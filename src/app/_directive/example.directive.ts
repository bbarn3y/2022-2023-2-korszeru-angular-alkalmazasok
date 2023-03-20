import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appExample]',
  // host: {
  //   '[style.background-color]': '"red"'
  // }
})
export class ExampleDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
