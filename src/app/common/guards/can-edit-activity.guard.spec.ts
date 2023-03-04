import { TestBed } from '@angular/core/testing';

import { CanEditActivityGuard } from '../../common/guards/can-edit-activity.guard';

describe('CanEditActivityGuard', () => {
  let guard: CanEditActivityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanEditActivityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
