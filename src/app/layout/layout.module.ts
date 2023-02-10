import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { NavItemComponent } from './nav/nav-item/nav-item.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NavComponent,
    NavItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NavComponent,
  ]
})
export class LayoutModule { }
