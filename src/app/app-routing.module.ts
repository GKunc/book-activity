import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'find-activities',
    component: FindActivitiesComponent,
  },
  {
    path: 'detail/:id',
    component: ActivityDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
