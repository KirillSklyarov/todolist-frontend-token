import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appStopPropagation]'
})
export class StopDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent){
    event.stopPropagation();
  }
}
