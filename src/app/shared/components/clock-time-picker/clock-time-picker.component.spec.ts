import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockTimePickerComponent } from './clock-time-picker.component';

describe('ClockTimePickerComponent', () => {
  let component: ClockTimePickerComponent;
  let fixture: ComponentFixture<ClockTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockTimePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
