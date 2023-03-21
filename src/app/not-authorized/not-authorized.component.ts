import { Component } from '@angular/core';
import { ModalService } from '../common/services/modal/modal.service';
import { SignComponent } from '../sign/sign.component';

@Component({
  selector: 'not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.less']
})
export class NotAuthorizedComponent {
  constructor(
    private modalService: ModalService,
  ) {}

  openLoginModal(): void {
    this.modalService.createModal(SignComponent, 'Login', 440);
  }
}
