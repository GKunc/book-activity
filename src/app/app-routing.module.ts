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
    path: 'add-activity',
    loadComponent: () => import('./add-activity/add-activity.component').then((x) => x.AddActivityComponent),
  },
  {
    path: 'sign',
    loadComponent: () => import('./sign/sign.component').then((x) => x.SignComponent),
  },
  {
    path: 'packages',
    loadComponent: () => import('./packages/packages.component').then((x) => x.PackagesComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then((x) => x.ResetPasswordComponent),
  },
  {
    path: 'payment-confirmation',
    loadComponent: () =>
      import('./payment/payment-confirmation/payment-confirmation.component').then(
        (x) => x.PaymentConfirmationComponent
      ),
  },
  {
    path: 'payment-cancelled',
    loadComponent: () =>
      import('./payment/payment-cancelled/payment-cancelled.component').then((x) => x.PaymentCancelledComponent),
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
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
