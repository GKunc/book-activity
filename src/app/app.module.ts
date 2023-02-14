import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageModule } from './login-page/login-page.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment.prod';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { PricesComponent } from './prices/prices.component';
import { FindActivitiesModule } from './find-activities/find-activities.module';
import { ActivityDataFormComponent } from './add-activity/activity-data-form/activity-data-form.component';
import { ClientDataFormComponent } from './add-activity/client-data-form/client-data-form.component';
import { LocationDataFormComponent } from './add-activity/location-data-form/location-data-form.component';
import { IconModule } from '@ant-design/icons-angular';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { MediaDataFormComponent } from './add-activity/media-data-form/media-data-form.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    AddActivityComponent,
    PricesComponent,
    ActivityDataFormComponent,
    ClientDataFormComponent,
    LocationDataFormComponent,
    ActivityDetailsComponent,
    MediaDataFormComponent,
    ActivityDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    HttpClientModule,
    LoginPageModule,
    FindActivitiesModule,
    FormsModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    IconModule,
  ],
  providers: [
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
