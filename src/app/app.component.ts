import { Component, OnInit } from '@angular/core';
import { IconService } from '@ant-design/icons-angular';
import { PlusOutline } from '@ant-design/icons-angular/icons';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from 'src/environments/environment';
import { ALLOW_COOKIES, INSTALL_PWA } from './common/consts/local-storage.consts';
import { getCookie, LocalStorageService } from './common/services/local-storage/local-storage.service';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'book-activity';
  pageId = environment.FACEBOOK_APP_ID;
  showCookies: boolean = false;
  showInstallPWA: boolean = false;
  currentSystem: 'iOS' | 'Android' = null;
  promptEvent: any;

  constructor(
    private iconService: IconService,
    private nzConfigService: NzConfigService,
    private facebookService: FacebookService,
    private localStorageService: LocalStorageService,
    private platform: Platform
  ) {
    this.iconService.addIcon(...[PlusOutline]);
    this.iconService.twoToneColor = { primaryColor: '#fff' };
    this.nzConfigService.set('theme', { primaryColor: '#00549E' });
  }

  ngOnInit(): void {
    this.initFacebookService();
    console.log(`|${getCookie(INSTALL_PWA)}`);

    if (getCookie(INSTALL_PWA) === '') {
      this.installPWA();
    } else {
      this.showCookies = this.localStorageService.getItem<boolean>(ALLOW_COOKIES) == null ?? true;
    }
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v16.0' };
    this.facebookService.init(initParams);
  }

  private installPWA(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      this.promptEvent = event;
      this.showInstallPWA = true;
      if (this.platform.IOS) {
        this.currentSystem = 'iOS';
        const isPWA = 'standalone' in window.navigator && window.navigator['standalone'];
        if (!isPWA) {
          this.showInstallPWA = true;
        }
      } else {
        event.preventDefault();
        this.currentSystem = 'Android';
      }
    });
  }
}
