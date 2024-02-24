import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

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
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then((x) => x.SettingsComponent),
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./settings/profile/profile.component').then((x) => x.ProfileComponent),
      },
      {
        path: 'favourites',
        loadComponent: () =>
          import('./settings/favourites-list/favourites-list.component').then((x) => x.FavouritesListComponent),
      },
      {
        path: 'your-activities',
        loadComponent: () =>
          import('./settings/your-activities/your-activities.component').then((x) => x.YourActivitiesComponent),
      },
      {
        path: 'add-activity',
        loadComponent: () => import('./add-activity/add-activity.component').then((x) => x.AddActivityComponent),
      },
      {
        path: 'statute',
        loadComponent: () => import('./settings/statute/statute.component').then((x) => x.StatuteComponent),
      },
      {
        path: 'paid-activities',
        loadComponent: () =>
          import('./settings/paid-activities/paid-activities.component').then((x) => x.PaidActivitiesComponent),
      },
    ],
  },
  {
    path: 'sign',
    loadComponent: () => import('./sign/login-page/login-page.component').then((x) => x.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./sign/register-page/register-page.component').then((x) => x.RegisterPageComponent),
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
