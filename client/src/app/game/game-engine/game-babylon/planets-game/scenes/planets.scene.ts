import { MyScene } from '../../classes/MyScene.class';
import * as B from 'babylonjs';
import cannon from 'cannon';
import { GameService } from '../../../../services/game.service';
import { GameEvent } from '../../../interfaces/game.interfaces';
import { GAME_EVENTS } from '../../../../constants/game.constants';
import { select } from '@ngrx/store';
import { selectPlanets } from '../../../../store/selectors/game.selectors';
import { Planet } from '../../../../store/interfaces/game.interfaces';
import { filter } from 'rxjs/operators';

export class PlanetsScene extends MyScene {
  private camera: B.ArcRotateCamera;
  private light: B.Light;

  private testPlanet: B.Mesh;

  private stars: B.Mesh[] = [];
  private planets: B.Mesh[] = [];

  constructor(props, gameService: GameService) {
    super(props, gameService);

    this.setCamera();
    this.setLightning();
    this.createObjects();

    this.setPhysics();

    // this.createStar();
    this.gameService.gameEmitter.subscribe(event => this.handleGameEvent);

    this.gameService
      .store
      .pipe(
        filter(state => !!state),
        select(selectPlanets)
      )
      .subscribe((state: Planet[]) => {
        state.forEach(planetState => {
          this.createPlanet(planetState);
        });
      });
  }

  setCamera() {
    this.camera = new B.ArcRotateCamera('camera1', 0, 0, 10, B.Vector3.Zero(), this);
    this.camera.setPosition(new B.Vector3(0, 0, -50));
    this.camera.setTarget(B.Vector3.Zero());
    this.camera.attachControl(this.gameService.game.canvas, true);

    this.camera.mode = B.ArcRotateCamera.ORTHOGRAPHIC_CAMERA;
    // this.camera.orthoTop = 35;
    // this.camera.orthoBottom = -35;
    // this.camera.orthoLeft = -35;
    // this.camera.orthoRight = 35;

    // this._scene.fogMode = Scene.FOGMODE_LINEAR;
    // BABYLON.Scene.FOGMODE_NONE;
    // BABYLON.Scene.FOGMODE_EXP;
    // BABYLON.Scene.FOGMODE_EXP2;
    // BABYLON.Scene.FOGMODE_LINEAR;
    //
    // this.fogColor = new B.Color3(0.9, 0.9, 1);
    // this.fogDensity = 0.01;
    // this.fogStart = 20.0;
    // this.fogEnd = 560.0;
  }

  createStar() {
    const star = B.MeshBuilder.CreateIcoSphere(`star1`, {
      radius: 10,
    });
    this.stars.push(star);
  }

  createPlanet(params: Planet) {
    const planet = B.MeshBuilder.CreateIcoSphere(params.name, {
      radius: params.radius,
    });
    planet.position.set(params.location.x, params.location.y, params.location.z);

    const BaseMaterial = new B.StandardMaterial('base', this);
    BaseMaterial.diffuseColor = new B.Color3(1, 1, 1);

    planet.material = BaseMaterial;

    const BaseMaterialRed = new B.StandardMaterial('base', this);
    BaseMaterialRed.diffuseColor = new B.Color3(1, 0, 0);

    planet.actionManager = new B.ActionManager(this);
    planet.actionManager.registerAction(
      new B.ExecuteCodeAction(B.ActionManager.OnPickTrigger,
        function (event) {
          const pickedMesh = event.meshUnderPointer;
          pickedMesh.material = BaseMaterialRed;
          console.log(pickedMesh);
          // pickedMesh.dispose();
        })
    );

    this.planets.push(planet);
  }

  setLightning() {
    this.light = new B.PointLight('light1', new B.Vector3(0, 0, 0), this);
  }

  setPhysics() {
    const gravityVector = new B.Vector3(0, -9.81, 0);
    const physicsPlugin = new B.CannonJSPlugin(true, 10, cannon);
    this.enablePhysics(gravityVector, physicsPlugin);
  }

  private createObjects() {
    this.camera.lockedTarget = this.testPlanet;
  }

  private handleGameEvent(event: GameEvent) {
    switch (event.name) {
      case GAME_EVENTS.CREATE_EMPTY_STAR:
        this.createStar();
        break;

      default:
        return;
    }
  }
}
