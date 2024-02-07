import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/common/consts/category.consts';
import { Activity } from 'src/app/common/services/activities/activities.model';
import { DictionaryService } from 'src/app/common/services/dictionary/dictionary.service';

@Component({
  selector: 'activity-box-simple',
  templateUrl: './activity-box-simple.component.html',
  styleUrls: ['./activity-box-simple.component.less'],
})
export class ActivityBoxSimpleComponent implements OnInit {
  @Input()
  activity: Activity;

  @Input()
  hideEditButton: boolean = false;

  @Input()
  hidePrice: boolean = false;

  @Output()
  editActivity: EventEmitter<Activity> = new EventEmitter();

  @Output()
  deleteActivity: EventEmitter<Activity> = new EventEmitter();

  acitivyCategories: { value: Category; label: string }[];

  constructor(private dictionaryService: DictionaryService) {}

  ngOnInit(): void {
    this.dictionaryService.getDictionary('categories').subscribe((categories) => {
      this.acitivyCategories = categories;
    });
  }

  getActivityCategory(category: Category): string {
    return this.acitivyCategories.find((item) => item.value === category).label;
  }
}
