import { NgModule, ErrorHandler, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HubLayoutModule } from './layout/layout.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { pl_PL } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { YourActivitiesComponent } from './settings/your-activities/your-activities.component';
import { DeleteModalComponent } from './settings/your-activities/delete-modal/delete-modal.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { ActivityBoxComponent } from './find-activities/activity-card/activity-box.component';
import { FindActivitiesComponent } from './find-activities/find-activities.component';
import { ActivityMapComponent } from './find-activities/activity-map/activity-map.component';
import { CategoryPipe } from './common/pipes/category.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorInterceptor } from './common/interceptors/error/global-error-interceptor.service';

import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { RegisterPageComponent } from './sign/register-page/register-page.component';
import { LoginPageComponent } from './sign/login-page/login-page.component';
import { HttpRequestInterceptor } from './common/interceptors/auth/auth.interceptor';
import { ActivityListComponent } from './find-activities/activity-list/activity-list.component';
import { ScrolledToBottomDirective } from './common/directives/drag-and-drop/scroll.directive';
import { FavouritesListComponent } from './settings/favourites-list/favourites-list.component';
import { CommentsComponent } from './activity-details/comments/comments.component';
import { RateSummaryComponent } from './activity-details/rate-summary/rate-summary.component';
import { OpinionsComponent } from './activity-details/opinions/opinions.component';
import { SettingsComponent } from './settings/settings.component';
import { PackagesComponent } from './packages/packages.component';

import { InstallPwaComponent } from './install-pwa/install-pwa.component';
import { AppInitializer, appInitializerFactory } from './app-initializer';
import { AuthenticationService } from './common/services/authentication/authentication.service';
import { ProfileComponent } from './settings/profile/profile.component';
import { StatuteComponent } from './settings/statute/statute.component';
import { PaidActivitiesComponent } from './settings/paid-activities/paid-activities.component';
import { EnvironmentService } from './common/services/environment/environment.service';
import { LocalStorageService } from './common/services/local-storage/local-storage.service';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
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
    ActivityListComponent,
    FavouritesListComponent,
    CommentsComponent,
    RateSummaryComponent,
    OpinionsComponent,
    SettingsComponent,
    ProfileComponent,
    StatuteComponent,
    PaidActivitiesComponent,
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
    IconModule,
    NgxGoogleAnalyticsModule.forRoot(environment.MEASUREMENT_ID),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: Boolean(environment.production),
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
    { provide: LOCALE_ID, useValue: 'en-US' }, //replace "en-US" with your locale
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [AppInitializer, AuthenticationService, HttpClient, EnvironmentService, LocalStorageService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
