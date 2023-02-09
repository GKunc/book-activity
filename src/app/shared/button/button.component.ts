import { Component, Input } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'hub-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent {
  @Input()
  type: NzButtonType = 'primary';

  @Input()
  text: string | undefined;

  @Input()
  isLoading: boolean;

}
