import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeColComponent } from './home-col.component';

describe('HomeColComponent', () => {
  let component: HomeColComponent;
  let fixture: ComponentFixture<HomeColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeColComponent]
    });
    fixture = TestBed.createComponent(HomeColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
