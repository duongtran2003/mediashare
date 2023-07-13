import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewColComponent } from './new-col.component';

describe('NewColComponent', () => {
  let component: NewColComponent;
  let fixture: ComponentFixture<NewColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewColComponent]
    });
    fixture = TestBed.createComponent(NewColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
