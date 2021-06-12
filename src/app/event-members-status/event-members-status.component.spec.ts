import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMembersStatusComponent } from './event-members-status.component';

describe('EventMembersStatusComponent', () => {
  let component: EventMembersStatusComponent;
  let fixture: ComponentFixture<EventMembersStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMembersStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMembersStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
