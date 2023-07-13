import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavColItemComponent } from './nav-col-item.component';

describe('NavColItemComponent', () => {
  let component: NavColItemComponent;
  let fixture: ComponentFixture<NavColItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavColItemComponent]
    });
    fixture = TestBed.createComponent(NavColItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
