import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../common/services/authentication/authentication.service';
import { ModalService } from '../common/services/modal/modal.service';
import { SignComponent } from '../sign/sign.component';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.less'],
})
export class EmailConfirmationComponent implements OnInit {
  success: boolean = false;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authSerice: AuthenticationService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    const confirmationSecret = this.route.snapshot.queryParamMap.get('confirmationSecret');
    const userId = this.route.snapshot.queryParamMap.get('userId');
    this.authSerice.confirmEmail(confirmationSecret, userId).subscribe((result) => {
      this.loading = false;
      this.success = result.isSuccess;
    });
  }

  login(): void {
    this.modalService.createModal(SignComponent, 'Login', 440);
  }
}