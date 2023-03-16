import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFiltersComponent } from './activity-filters.component';

describe('ActivityFiltersComponent', () => {
  let component: ActivityFiltersComponent;
  let fixture: ComponentFixture<ActivityFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
