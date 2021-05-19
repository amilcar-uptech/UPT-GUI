import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrbanHotspotsComponent } from './urban-hotspots.component';

describe('UrbanHotspotsComponent', () => {
  let component: UrbanHotspotsComponent;
  let fixture: ComponentFixture<UrbanHotspotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrbanHotspotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrbanHotspotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
