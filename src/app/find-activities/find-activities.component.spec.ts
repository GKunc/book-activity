import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindActivitiesComponent } from './find-activities.component';

describe('FindActivitiesComponent', () => {
  let component: FindActivitiesComponent;
  let fixture: ComponentFixture<FindActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
