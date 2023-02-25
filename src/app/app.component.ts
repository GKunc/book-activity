import { Component } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons'
import { NzConfigService } from 'ng-zorro-antd/core/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'book-activity';

  constructor(private iconService: IconService, private nzConfigService: NzConfigService) {
    this.iconService.addIcon(...[PlusOutline]);
    this.iconService.twoToneColor = { primaryColor: '#fff' };
    this.nzConfigService.set('theme', { primaryColor: 'purple' })
  }
}
