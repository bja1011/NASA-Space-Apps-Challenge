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
import * as GameActions from '../../../../store/actions/game.actions';

export class PlanetsScene extends MyScene {
  private camera: B.ArcRotateCamera;
  private light: B.Light;

  private testPlanet: B.Mesh;

  private stars: B.Mesh[] = [];
  private planets: B.Mesh[] = [];

  baseMaterial: B.StandardMaterial;
  selectedMaterial: B.StandardMaterial;

  glowLayer: B.GlowLayer;

  constructor(props, gameService: GameService) {
    super(props, gameService);

    this.setCamera();
    this.setLightning();

    this.setPhysics();

    this.baseMaterial = new B.StandardMaterial('base', this);
    this.baseMaterial.diffuseColor = new B.Color3(1, 1, 1);

    this.selectedMaterial = new B.StandardMaterial('base-red', this);
    this.selectedMaterial.diffuseColor = new B.Color3(1, 0, 0);

    this.createStar();
    const guiFolder = this.gameService.gui.addFolder('Scene');
    guiFolder.add(this, 'glowSwitch');

    this.gameService.gameEmitter.subscribe(event => this.handleGameEvent);


    this.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit) {
        this.pickPlanet(pickResult);
      }
    };

    this.gameService
      .store
      .pipe(
        filter(state => !!state),
        select(selectPlanets)
      )
      .subscribe((state: Planet[]) => {
        state
          .forEach(planetState => {
            this.createPlanet(planetState);
          });
      });
  }

  setCamera() {
    this.camera = new B.ArcRotateCamera('camera1', 0, 0, 10, B.Vector3.Zero(), this);
    this.camera.setPosition(new B.Vector3(0, 0, -550));
    this.camera.attachControl(this.gameService.game.canvas, true);
    this.camera.panningSensibility = 5;
    this.ambientColor = new B.Color3(1, 1, 1);

    // const ambientLight = new B.HemisphericLight('HemiLight', new B.Vector3(100, 0, 0), this);
    // ambientLight.intensity = 0.5;

    // this.camera.mode = B.ArcRotateCamera.ORTHOGRAPHIC_CAMERA;
    // this.camera.orthoTop = 35;
    // this.camera.orthoBottom = -35;
    // this.camera.orthoLeft = -35;
    // this.camera.orthoRight = 35;

    // this.fogMode = B.Scene.FOGMODE_LINEAR;
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
    const star = B.MeshBuilder.CreateSphere(`star1`, {
      diameter: 100,
    });
    star.isPickable = false;
    const emissiveMaterial = new B.StandardMaterial('emissive', this);
    emissiveMaterial.diffuseColor = new B.Color3(1, 1, 0);
    emissiveMaterial.emissiveColor = new B.Color3(1, 1, 0);
    star.material = emissiveMaterial;
    this.stars.push(star);
  }

  glowSwitch() {
    if (!this.glowLayer) {
      this.glowLayer = new B.GlowLayer('glow', this, {
        mainTextureFixedSize: 256,
        blurKernelSize: 64
      });
    } else {
      this.glowLayer.dispose();
      this.glowLayer = null;
    }
  }

  createPlanet(params: Planet) {

    const existingPlanetMesh = this.planets.find((planetMesh: any) => planetMesh.state.id === params.id);
    if (existingPlanetMesh) {
      this.updatePlanet(existingPlanetMesh, params);
      return;
    }

    const planet = B.MeshBuilder.CreateSphere(params.name, {
      diameter: 1
    });
    planet.position.set(params.location.x, params.location.y, params.location.z);
    planet.scaling.setAll(params.radius);
    (planet as any).state = params;

    planet.isPickable = true;

    planet.material = this.baseMaterial;
    this.planets.push(planet);

    const radius = planet.position.x;
    // this.setCameraSize(radius);
  }

  setLightning() {
    this.light = new B.PointLight('light1', new B.Vector3(0, 0, 0), this);
    this.light.intensity = 4;
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

  private pickPlanet(pickResult: B.PickingInfo) {
    this.planets.forEach(planetMesh => planetMesh.material = this.baseMaterial);
    pickResult.pickedMesh.material = this.selectedMaterial;
    const animation = new B.Animation('target', 'target', 60, B.Animation.ANIMATIONTYPE_VECTOR3);

    const easingFunction = new B.CircleEase();
    easingFunction.setEasingMode(B.EasingFunction.EASINGMODE_EASEINOUT);

    animation.setEasingFunction(easingFunction);

    animation.setKeys([
      {
        frame: 0,
        value: this.camera.target.clone()
      },
      {
        frame: 100,
        value: pickResult.pickedPoint.clone()
      }
    ]);
    this.camera.animations.push(animation);
    this.beginAnimation(this.camera, 0, 100, false, 3);
    this.gameService.store.dispatch(new GameActions.PickPlanet((pickResult.pickedMesh as any).state));
  }

  setCameraSize(radius: number) {
    const aspectRatio = this.gameService.game.engine.getAspectRatio(this.camera);
    let halfMinFov = this.camera.fov / 2;
    if (aspectRatio < 1) {
      halfMinFov = Math.atan(aspectRatio * Math.tan(this.camera.fov / 2));
    }
    const viewRadius = Math.abs(radius / Math.sin(halfMinFov));

    const animation = new B.Animation('radius', 'radius', 60, B.Animation.ANIMATIONTYPE_FLOAT);

    const easingFunction = new B.CircleEase();
    easingFunction.setEasingMode(B.EasingFunction.EASINGMODE_EASEINOUT);

    animation.setEasingFunction(easingFunction);
    animation.setKeys([
      {
        frame: 0,
        value: this.camera.radius
      },
      {
        frame: 100,
        value: viewRadius
      }
    ]);
    this.camera.animations.push(animation);
    this.beginAnimation(this.camera, 0, 100, false, 2);
  }

  private updatePlanet(existingPlanetMesh: B.Mesh, newState: Planet) {
    console.log(existingPlanetMesh);
    existingPlanetMesh.scaling.setAll(newState.radius);
  }
}
