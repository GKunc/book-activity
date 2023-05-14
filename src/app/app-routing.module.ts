import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ProfileComponent } from './profile/profile.component';
import { SignComponent } from './sign/sign.component';
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
    path: 'detail/:id',
    component: ActivityDetailsComponent,
  },
  {
    path: 'your-activities',
    component: YourActivitiesComponent,
  },
  {
    path: 'favourites',
    component: FavouritesListComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'email-confirmation',
    component: EmailConfirmationComponent,
  },
  {
    path: 'sign',
    component: SignComponent,
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
