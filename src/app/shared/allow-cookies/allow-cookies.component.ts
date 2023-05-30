import { Component, EventEmitter, Output } from '@angular/core';
import { ALLOW_COOKIES } from 'src/app/common/consts/local-storage.consts';
import { LocalStorageService } from 'src/app/common/services/local-storage/local-storage.service';

@Component({
  selector: 'allow-cookies',
  templateUrl: './allow-cookies.component.html',
  styleUrls: ['./allow-cookies.component.less'],
})
export class AllowCookiesComponent {
  @Output()
  cookiesConfirmed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private localStorageService: LocalStorageService) {}

  confirmCookies(): void {
    this.localStorageService.setItem(ALLOW_COOKIES, true);
    this.cookiesConfirmed.emit();
  }
}
