import { GroupDetails } from "src/app/add-activity/activity-groups-form/activity-groups-form.component";
import { Category } from "src/app/common/consts/category.consts";
import { City } from "../../consts/city.consts";

export interface Activity {
  guid: string;
  createdBy: string;
  coverPhoto: string;
  images: string[];
  name: string;
  category: Category;
  description: string;
  groups: GroupDetails[];
  street: string;
  city: City;
  coordinates: { lng: number, lat: number };
  email: string;
  phone: string;
  facebook?: string;
  instagram?: string;
  www?: string;
  photos?: string[];
  favourite?: boolean;
}