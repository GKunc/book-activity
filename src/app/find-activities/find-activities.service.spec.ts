import { TestBed } from '@angular/core/testing';

import { FindActivitiesService } from './find-activities.service';

describe('FindActivitiesService', () => {
  let service: FindActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
