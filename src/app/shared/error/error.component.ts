/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent {
  @Input()
  retryHandler: any;

  @Input()
  inlineStyle = false;

  @HostBinding('class.inline')
  get inline(): boolean {
    return this.inlineStyle;
  }
}

