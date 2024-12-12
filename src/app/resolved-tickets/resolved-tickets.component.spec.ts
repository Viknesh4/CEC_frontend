import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvedTicketsComponent } from './resolved-tickets.component';

describe('ResolvedTicketsComponent', () => {
  let component: ResolvedTicketsComponent;
  let fixture: ComponentFixture<ResolvedTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolvedTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolvedTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
