import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineComponent } from './engine.component';
import { GameBabylonModule } from '../game-babylon/game-babylon.module';

describe('GameEngineComponent', () => {
  let component: EngineComponent;
  let fixture: ComponentFixture<EngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EngineComponent],
      imports: [GameBabylonModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
