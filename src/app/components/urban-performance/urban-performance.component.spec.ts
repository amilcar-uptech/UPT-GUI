import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanPerformanceComponent } from './urban-performance.component';

describe('UrbanPerformanceComponent', () => {
  let component: UrbanPerformanceComponent;
  let fixture: ComponentFixture<UrbanPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrbanPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrbanPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
