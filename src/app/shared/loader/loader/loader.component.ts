import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent {
  @Input()
  inlineStyle: boolean = false;

  @HostBinding('class.inline')
  get inline(): boolean {
    console.log(this.inlineStyle);
    return this.inlineStyle;
  }
}
