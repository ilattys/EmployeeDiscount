import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDiscountsComponent } from './browse-discounts.component';

describe('BrowseDiscountsComponent', () => {
  let component: BrowseDiscountsComponent;
  let fixture: ComponentFixture<BrowseDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseDiscountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
