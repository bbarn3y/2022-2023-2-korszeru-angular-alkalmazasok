import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHoverColor]',
  // host: {
  //   '[style.background-color]': '"red"'
  // }
})
export class HoverColorDirective {
  @Input() color: string = 'red';

  // @HostBinding('style.background-color') backgroundColor = 'red';

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(false);
  }

  constructor(private el: ElementRef) { }

  highlight(on: boolean) {
    this.el.nativeElement.style.backgroundColor = on ? this.color : '';
  }

}
