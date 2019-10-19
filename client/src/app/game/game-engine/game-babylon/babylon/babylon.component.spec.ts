import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BabylonComponent } from './babylon.component';

describe('BabylonComponent', () => {
  let component: BabylonComponent;
  let fixture: ComponentFixture<BabylonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabylonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabylonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render canvas element', () => {
    fixture = TestBed.createComponent(BabylonComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('canvas')).toBeTruthy();
  });
});
