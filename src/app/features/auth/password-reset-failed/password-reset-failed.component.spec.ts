import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetFailedComponent } from './password-reset-failed.component';

describe('PasswordResetFailedComponent', () => {
  let component: PasswordResetFailedComponent;
  let fixture: ComponentFixture<PasswordResetFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetFailedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordResetFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
