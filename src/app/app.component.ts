import { Component, OnInit } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'book-activity';

  constructor(
    private iconService: IconService,
    private nzConfigService: NzConfigService,
    private facebookService: FacebookService
  ) {
    this.iconService.addIcon(...[PlusOutline]);
    this.iconService.twoToneColor = { primaryColor: '#fff' };
    this.nzConfigService.set('theme', { primaryColor: '#008dff' });
  }

  ngOnInit(): void {
    this.initFacebookService();
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v16.0' };
    this.facebookService.init(initParams);
    document.querySelector('#facebook-messanger').setAttribute('page_id', environment.FACEBOOK_APP_ID);
  }
}
