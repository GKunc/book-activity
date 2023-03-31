import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityListComponent } from './find-activities/activity-list/activity-list.component';
import { ActivityMapComponent } from './find-activities/activity-map/activity-map.component';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { YourActivitiesComponent } from './your-activities/your-activities.component';

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
    path: 'activity-map',
    component: ActivityMapComponent,
  },
  {
    path: 'detail/:id',
    component: ActivityDetailsComponent,
  },
  {
    path: 'your-activities',
    component: YourActivitiesComponent,
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
