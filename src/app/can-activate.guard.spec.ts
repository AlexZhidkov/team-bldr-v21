import { TestBed } from '@angular/core/testing';
import { CanActivateGuard } from './can-activate.guard';


describe('CanActivateGuardGuard', () => {
  let guard: CanActivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
