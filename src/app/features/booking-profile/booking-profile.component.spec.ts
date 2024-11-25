import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProfileComponent } from './booking-profile.component';

describe('BookingProfileComponent', () => {
  let component: BookingProfileComponent;
  let fixture: ComponentFixture<BookingProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
