import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[scrolledToBottom]'
})
export class ScrolledToBottomDirective {
  @Output()
  atTheBottom = new EventEmitter<void>();

  @HostListener('scroll', ['$event.target'])
  onScroll(elem) {
   if(( elem.offsetHeight + elem.scrollTop) >=  elem.scrollHeight) {
      this.atTheBottom.emit();
   }
  }
}
