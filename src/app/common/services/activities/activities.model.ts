import { WeekDay } from '@angular/common';
import { Category } from 'src/app/common/consts/category.consts';
import { City } from '../../consts/city.consts';
import { PaymentPeriod } from '../../consts/pay-options.consts';

export interface Activity {
  guid: string;
  active: boolean;
  createdBy: string;
  coverPhoto: string;
  images: string[];
  name: string;
  category: Category;
  description: string;
  groups: GroupDetails[];
  street: string;
  city: City;
  coordinates: { lng: number; lat: number };
  email: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  www?: string;
  photos?: string[];
  isFavourite?: boolean;
  comments?: string[];
}

export interface GroupDetails {
  name: string;
  duration: number;
  price: number;
  time: Date;
  weekDay: WeekDay;
  paymentPeriod: PaymentPeriod;
}
