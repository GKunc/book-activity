import { Component, Input } from '@angular/core';
import { NzButtonSize, NzButtonType } from 'ng-zorro-antd/button';

@Component({
  selector: 'hub-button',
  templateUrl: './button.component.html',
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
