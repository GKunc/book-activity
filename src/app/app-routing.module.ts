import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';

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
    path: 'log-in',
    component: LoginPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
