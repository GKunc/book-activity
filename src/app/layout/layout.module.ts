import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { ActivityCategoriesComponent } from '../shared/activity-categories/activity-categories.component';

@NgModule({
  declarations: [NavComponent, FooterComponent],
  exports: [NavComponent, FooterComponent],
  imports: [CommonModule, SharedModule, ActivityCategoriesComponent],
})
export class HubLayoutModule {}
