import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  // host: {
  //   "[style.background-color]": "'red'"
  // }
})
export class HighlightDirective {

  @Input() color: string = 'aqua';

  // @HostBinding("style.background-color") backgroundColor = "blue";

  @HostListener("mouseenter") mouseEnter = (event: MouseEvent) => {
    this.highlight(true);
  }

  @HostListener("mouseleave") mouseEvent = (event: MouseEvent) => {
    this.highlight(false);
  }

  constructor(private el: ElementRef) { }

  highlight(on: boolean) {
    this.el.nativeElement.style.backgroundColor = on ? this.color : '';
  }

}
