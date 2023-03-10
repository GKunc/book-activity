import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent {
  @Input()
  inlineStyle = false;

  @HostBinding('class.inline')
  get inline(): boolean {
    return this.inlineStyle;
  }
}
