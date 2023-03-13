import { NgModule, isDevMode, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HubLayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageModule } from './login-page/login-page.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
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
import { ActivityMapComponent } from './activity-map/activity-map.component';
import { CategoryPipe } from './common/pipes/category.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GlobalErrorHandler } from './common/error/global-error-handler.service';

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
    ActivityGroupsFormComponent,
    YourActivitiesComponent,
    DeleteModalComponent,
    NotAuthorizedComponent,
    ActivityBoxComponent,
    FindActivitiesComponent,
    ActivityMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    HubLayoutModule,
    HttpClientModule,
    LoginPageModule,
    FormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    IconModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    CategoryPipe,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID,
            )
          },
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    // AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
