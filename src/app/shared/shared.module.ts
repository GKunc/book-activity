import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from './button/button.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCardModule } from 'ng-zorro-antd/card';

import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../common/pipes/safe-url.pipe';
import { LoaderComponent } from './loader/loader/loader.component';
import { NoDataComponent } from './no-data/no-data/no-data.component';
import { WeekDayPipe } from '../common/pipes/week-day.pipe';
import { PricePlnPipe } from '../common/pipes/price-pln.pipe';
import { DurationMinPipe } from '../common/pipes/duration-min.pipe';
import { CategoryPipe } from '../common/pipes/category.pipe';


@NgModule({
  declarations: [
    ButtonComponent,
    SafeUrlPipe,
    WeekDayPipe,
    PricePlnPipe,
    DurationMinPipe,
    CategoryPipe,

    LoaderComponent,
    NoDataComponent,
  ],
  imports: [
    SocialLoginModule,

    CommonModule,
    RouterModule,

    NzButtonModule,
    NzIconModule,
    NzTimePickerModule,
    NzInputModule,
    NzModalModule,
    NzNotificationModule,
    NzStepsModule,
    NzSelectModule,
    NzFormModule,
    NzUploadModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputNumberModule,
    NzSliderModule,
    NzAvatarModule,
    NzDropDownModule,
    NzDividerModule,
    NzCarouselModule,
    NzToolTipModule,
    NzImageModule,
    NzSpinModule,
    NzEmptyModule,
    NzDrawerModule,
    NzCardModule,

    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    SocialLoginModule,

    ButtonComponent,
    LoaderComponent,
    NoDataComponent,

    SafeUrlPipe,
    WeekDayPipe,
    PricePlnPipe,
    DurationMinPipe,
    CategoryPipe,

    RouterModule,

    NzButtonModule,
    NzIconModule,
    NzTimePickerModule,
    NzInputModule,
    NzModalModule,
    NzNotificationModule,
    NzStepsModule,
    NzSelectModule,
    NzFormModule,
    NzUploadModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputNumberModule,
    NzSliderModule,
    NzAvatarModule,
    NzDropDownModule,
    NzDividerModule,
    NzCarouselModule,
    NzToolTipModule,
    NzImageModule,
    NzSpinModule,
    NzEmptyModule,
    NzDrawerModule,
    NzCardModule,

    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }
