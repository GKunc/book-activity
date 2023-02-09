import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindActivitiesComponent } from './find-activities.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    FindActivitiesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FindActivitiesComponent
  ],
})
export class FindActivitiesModule { }
