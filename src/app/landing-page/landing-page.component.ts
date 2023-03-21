import { Component } from '@angular/core';
import { ModalService } from '../common/services/modal/modal.service';
import { ResizeService } from '../common/services/resize/resize.service';
import { SignComponent } from '../sign/sign.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent {
  constructor(
    private modalService: ModalService,
    public resizeService: ResizeService
    ) { }

    openLoginModal(): void {
      this.modalService.createModal(SignComponent, 'Login', 440, { showLogin: false});
    }
}
