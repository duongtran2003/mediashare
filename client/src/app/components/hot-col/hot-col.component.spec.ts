import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotColComponent } from './hot-col.component';

describe('HotColComponent', () => {
  let component: HotColComponent;
  let fixture: ComponentFixture<HotColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotColComponent]
    });
    fixture = TestBed.createComponent(HotColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
