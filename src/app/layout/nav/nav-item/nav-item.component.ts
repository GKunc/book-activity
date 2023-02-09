import { Component, Input } from '@angular/core';

@Component({
  selector: 'hub-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.less']
})
export class NavItemComponent {

  @Input()
  text: string | undefined;

}
