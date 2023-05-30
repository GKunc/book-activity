import { Component, EventEmitter, Input, Output } from '@angular/core';
import { INSTALL_PWA } from '../common/consts/local-storage.consts';
import { LocalStorageService } from '../common/services/local-storage/local-storage.service';

@Component({
  selector: 'install-pwa',
  templateUrl: './install-pwa.component.html',
  styleUrls: ['./install-pwa.component.less'],
})
export class InstallPwaComponent {
  @Input()
  system: 'iOS' | 'Android';

  @Input()
  promptEvent: any;

  @Output()
  hideBanner: EventEmitter<void> = new EventEmitter();

  constructor(private localStorageService: LocalStorageService) {}

  installPWA(): void {
    this.addCookieAndClosePrompt();

    if (this.promptEvent) {
      this.promptEvent.prompt();
    }
  }

  addCookieAndClosePrompt(): void {
    const timeToAdd = 60 * 60 * 24 * 1000 * 7; // 7 days
    const date = new Date();
    const expiryTime = parseInt(date.getTime().toString()) + timeToAdd;
    date.setTime(expiryTime);
    const utcTime = date.toUTCString();
    document.cookie = `${INSTALL_PWA}=true; expires=${utcTime};`;

    this.hideBanner.emit();
  }
}
