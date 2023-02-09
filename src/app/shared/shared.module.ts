import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from './button/button.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';

import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ButtonComponent,
  ],
  imports: [
    SocialLoginModule,

    CommonModule,
    RouterModule,

    NzButtonModule,
    NzIconModule,
    NzTimePickerModule,
    NzInputModule,
    NzModalModule,
    NzNotificationModule,
    NzStepsModule,
    NzSelectModule,
    NzFormModule,
    NzUploadModule,

    ReactiveFormsModule,
  ],
  exports: [
    SocialLoginModule,

    ButtonComponent,
    RouterModule,

    NzButtonModule,
    NzIconModule,
    NzTimePickerModule,
    NzInputModule,
    NzModalModule,
    NzNotificationModule,
    NzStepsModule,
    NzSelectModule,
    NzFormModule,
    NzUploadModule,

    ReactiveFormsModule,
  ]
})
export class SharedModule { }
