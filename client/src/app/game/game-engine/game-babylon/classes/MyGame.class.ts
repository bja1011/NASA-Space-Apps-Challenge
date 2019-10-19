import {
  Engine,
} from 'babylonjs';
import { GameService } from '../../../services/game.service';
import { MyScene } from './MyScene.class';
import { PlanetsScene } from '../planets-game/scenes/planets.scene';

export class MyGame {

  gameService: GameService;
  scene: MyScene;
  readonly canvas: HTMLCanvasElement;
  private readonly engine: Engine;

  constructor(gameService: GameService, canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
    this.gameService = gameService;
    this.gameService.game = this;
    this.scene = new PlanetsScene(this.engine, gameService);
  }

  doRender(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  destroy() {
    this.scene.dispose();
  }
}
