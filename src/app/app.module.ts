import { NgModule, isDevMode, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HubLayoutModule } from './layout/layout.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { pl_PL } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { ActivityDataFormComponent } from './add-activity/activity-data-form/activity-data-form.component';
import { ClientDataFormComponent } from './add-activity/client-data-form/client-data-form.component';
import { LocationDataFormComponent } from './add-activity/location-data-form/location-data-form.component';
import { IconModule } from '@ant-design/icons-angular';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { MediaDataFormComponent } from './add-activity/media-data-form/media-data-form.component';
import { DragAndDropDirective } from './common/directives/drag-and-drop/drag-and-drop.directive';
import { ActivityGroupsFormComponent } from './add-activity/activity-groups-form/activity-groups-form.component';
import { YourActivitiesComponent } from './your-activities/your-activities.component';
import { DeleteModalComponent } from './your-activities/delete-modal/delete-modal.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ActivityBoxComponent } from './find-activities/activity-card/activity-box.component';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { ActivityMapComponent } from './find-activities/activity-map/activity-map.component';
import { CategoryPipe } from './common/pipes/category.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorInterceptor } from './common/interceptors/error/global-error-interceptor.service';

import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { RegisterPageComponent } from './sign/register-page/register-page.component';
import { SignComponent } from './sign/sign.component';
import { LoginPageComponent } from './sign/login-page/login-page.component';
import { HttpRequestInterceptor } from './common/interceptors/auth/auth.interceptor';
import { ActivityListComponent } from './find-activities/activity-list/activity-list.component';
import { ScrolledToBottomDirective } from './common/directives/drag-and-drop/scroll.directive';
import { FavouritesListComponent } from './favourites-list/favourites-list.component';
import { CommentsComponent } from './activity-details/comments/comments.component';
import { RateSummaryComponent } from './activity-details/rate-summary/rate-summary.component';
import { OpinionsComponent } from './activity-details/opinions/opinions.component';
import { ProfileComponent } from './profile/profile.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { PackagesComponent } from './packages/packages.component';

import { FacebookModule } from 'ngx-facebook';
import { InstallPwaComponent } from './install-pwa/install-pwa.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AddActivityComponent,
    ActivityDataFormComponent,
    ClientDataFormComponent,
    LocationDataFormComponent,
    ActivityDetailsComponent,
    MediaDataFormComponent,
    ActivityDetailsComponent,
    DragAndDropDirective,
    ScrolledToBottomDirective,
    ActivityGroupsFormComponent,
    YourActivitiesComponent,
    DeleteModalComponent,
    NotAuthorizedComponent,
    ActivityBoxComponent,
    FindActivitiesComponent,
    ActivityMapComponent,
    LoginPageComponent,
    RegisterPageComponent,
    SignComponent,
    ActivityListComponent,
    FavouritesListComponent,
    CommentsComponent,
    RateSummaryComponent,
    OpinionsComponent,
    ProfileComponent,
    EmailConfirmationComponent,
    PackagesComponent,
    InstallPwaComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    HubLayoutModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    IconModule,
    FacebookModule.forRoot(),
    NgxGoogleAnalyticsModule.forRoot(environment.MEASUREMENT_ID),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    CategoryPipe,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorInterceptor,
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: NZ_I18N, useValue: pl_PL },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, { oneTapEnabled: false }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
