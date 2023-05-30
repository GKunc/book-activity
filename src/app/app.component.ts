import { Component, OnInit } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from 'src/environments/environment';
import { ALLOW_COOKIES } from './common/consts/local-storage.consts';
import { LocalStorageService } from './common/services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'book-activity';
  pageId = environment.FACEBOOK_APP_ID;
  showCookies: boolean = false;

  constructor(
    private iconService: IconService,
    private nzConfigService: NzConfigService,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService
  ) {
    this.iconService.addIcon(...[PlusOutline]);
    this.iconService.twoToneColor = { primaryColor: '#fff' };
    this.nzConfigService.set('theme', { primaryColor: '#008dff' });
  }

  ngOnInit(): void {
    this.initFacebookService();
    this.showCookies = this.localStorageService.getItem<boolean>(ALLOW_COOKIES) == null ?? true;
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v16.0' };
    this.facebookService.init(initParams);
  }
}
