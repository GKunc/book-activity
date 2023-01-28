import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { GridComponent } from './grid/grid.component';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SocialLoginModule } from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [
    ButtonComponent,
    GridComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    SocialLoginModule,
  ],
  exports: [
    ButtonComponent,
    RouterModule,
    NzButtonModule,
    NzIconModule,
    SocialLoginModule,
  ]
})
export class SharedModule { }
