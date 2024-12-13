import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingMeetingsComponent } from './pending-meetings.component';

describe('PendingMeetingsComponent', () => {
  let component: PendingMeetingsComponent;
  let fixture: ComponentFixture<PendingMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingMeetingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
