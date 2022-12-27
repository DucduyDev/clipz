import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]',
})
export class EventBlockerDirective {
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  handleEvent(event: Event): void {
    event.preventDefault();
  }

  // @HostListener('dragover', ['$event'])
  // handleEvent2(event: Event): void {
  //   event.preventDefault();
  // }
}
