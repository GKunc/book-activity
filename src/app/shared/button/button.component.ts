import { Component, HostBinding, Input } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'hub-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent {
  @Input()
  type: NzButtonType = 'primary';

  @Input()
  size: NzButtonSize = 'default';

  @Input()
  text: string | undefined;

  @Input()
  isLoading: boolean;

  @Input()
  icon: string;
}
