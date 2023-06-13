import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'find-activities',
    loadComponent: () => import('./find-activities/find-activities.component').then((x) => x.FindActivitiesComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./activity-details/activity-details.component').then((x) => x.ActivityDetailsComponent),
  },
  {
    path: 'your-activities',
    loadComponent: () => import('./your-activities/your-activities.component').then((x) => x.YourActivitiesComponent),
  },
  {
    path: 'favourites',
    loadComponent: () => import('./favourites-list/favourites-list.component').then((x) => x.FavouritesListComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then((x) => x.ProfileComponent),
  },
  {
    path: 'email-confirmation',
    loadComponent: () =>
      import('./email-confirmation/email-confirmation.component').then((x) => x.EmailConfirmationComponent),
  },
  {
    path: 'sign',
    loadComponent: () => import('./sign/sign.component').then((x) => x.SignComponent),
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./not-authorized/not-authorized.component').then((x) => x.NotAuthorizedComponent),
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
