import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEventComponent } from './team-event.component';

describe('TeamEventComponent', () => {
  let component: TeamEventComponent;
  let fixture: ComponentFixture<TeamEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
