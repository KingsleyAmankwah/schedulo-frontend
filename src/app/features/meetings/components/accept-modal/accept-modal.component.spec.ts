import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptModalComponent } from './accept-modal.component';

describe('AcceptModalComponent', () => {
  let component: AcceptModalComponent;
  let fixture: ComponentFixture<AcceptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
