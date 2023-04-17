import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.less']
})
export class NoDataComponent {
  @Input()
  inlineStyle = false;
  
  @HostBinding('class.inline')
  get inline(): boolean {
    return this.inlineStyle;
  }
}
