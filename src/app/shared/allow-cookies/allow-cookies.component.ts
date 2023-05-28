import { Component, EventEmitter, Output } from '@angular/core';
import { ALLOW_COOKIES } from 'src/app/common/consts/local-storage.consts';

@Component({
  selector: 'allow-cookies',
  templateUrl: './allow-cookies.component.html',
  styleUrls: ['./allow-cookies.component.less'],
})
export class AllowCookiesComponent {
  @Output()
  cookiesConfirmed: EventEmitter<void> = new EventEmitter<void>();

  confirmCookies(): void {
    localStorage.setItem(ALLOW_COOKIES, 'true');
    this.cookiesConfirmed.emit();
  }
}
