import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetActivationTokenComponent } from './reset-activation-token.component';

describe('ResetActivationTokenComponent', () => {
  let component: ResetActivationTokenComponent;
  let fixture: ComponentFixture<ResetActivationTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetActivationTokenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetActivationTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
