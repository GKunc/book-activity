import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGroupsFormComponent } from './activity-groups-form.component';

describe('ActivityGroupsFormComponent', () => {
  let component: ActivityGroupsFormComponent;
  let fixture: ComponentFixture<ActivityGroupsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityGroupsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityGroupsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
