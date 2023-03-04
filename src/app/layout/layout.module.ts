import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [
    NavComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    NavComponent,
    FooterComponent,
  ]
})
export class LayoutModule { }
