import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressTicketsComponent } from './in-progress-tickets.component';

describe('InProgressTicketsComponent', () => {
  let component: InProgressTicketsComponent;
  let fixture: ComponentFixture<InProgressTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InProgressTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
