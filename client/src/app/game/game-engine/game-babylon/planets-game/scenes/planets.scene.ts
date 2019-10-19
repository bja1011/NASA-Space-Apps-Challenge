import { MyScene } from '../../classes/MyScene.class';
import * as B from 'babylonjs';
import cannon from 'cannon';
import { GameService } from '../../../../services/game.service';
import { GameEvent } from '../../../interfaces/game.interfaces';
import { GAME_EVENTS } from '../../../../constants/game.constants';
import { select } from '@ngrx/store';
import { selectPickedPlanet, selectPlanets } from '../../../../store/selectors/game.selectors';
import { Planet } from '../../../../store/interfaces/game.interfaces';
import { debounceTime, delay, filter, skipUntil, take, takeLast, tap } from 'rxjs/operators';
import * as GameActions from '../../../../store/actions/game.actions';
import { of } from 'rxjs';
import * as R from 'ramda';
import { LinesMesh } from 'babylonjs/Meshes/linesMesh';

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
    this.baseMaterial.diffuseColor = new B.Color3(0, 1, 1);
    this.baseMaterial.specularColor = this.baseMaterial.diffuseColor;

    this.selectedMaterial = new B.StandardMaterial('base-red', this);
    this.baseMaterial.diffuseColor = new B.Color3(0, 1, 1);
    this.baseMaterial.specularColor = this.baseMaterial.diffuseColor;
    this.selectedMaterial.emissiveColor = this.baseMaterial.diffuseColor;

    this.selectedMaterial.diffuseColor = new B.Color3(1, 0, 0);
    this.selectedMaterial.emissiveColor = new B.Color3(1, 0, 0);

    this.createStar();
    const guiFolder = this.gameService.gui.addFolder('Scene');
    guiFolder.add(this, 'glowSwitch');

    this.glowSwitch();

    this.gameService.gameEmitter.subscribe(event => this.handleGameEvent);


    this.onPointerDown = (evt, pickResult) => {
      if (pickResult.hit) {
        this.pickPlanet(pickResult);
      }
    };

    this.gameService
      .store
      .pipe(
        select(selectPlanets),
        filter(state => !!state),
      )
      .subscribe((state: Planet[]) => {
        state
          .forEach(planetState => {
            this.createPlanet(planetState);
          });
      });

    this.gameService.store
      .pipe(
        select(selectPickedPlanet),
        filter(state => !!state),
      )
      .subscribe(this.createPlanet.bind(this));

    this.startSimulation();
  }

  setCamera() {
    this.camera = new B.ArcRotateCamera('camera1', 0, 0, 10, B.Vector3.Zero(), this);
    this.camera.setPosition(new B.Vector3(0, 0, -550));
    this.camera.attachControl(this.gameService.game.canvas, true);
    this.camera.panningSensibility = 5;
    this.camera.wheelPrecision = 0.5;
    this.ambientColor = new B.Color3(1, 1, 1);
    this.clearColor = new B.Color4(0.1, 0, 0.2, 1);

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
    const emissiveMaterial = new B.StandardMaterial('emissive', this);
    emissiveMaterial.diffuseColor = new B.Color3(1, 1, 0);
    emissiveMaterial.emissiveColor = new B.Color3(0.9, 0.9, 0);
    star.material = emissiveMaterial;
    this.stars.push(star);
  }

  glowSwitch() {
    if (!this.glowLayer) {
      this.glowLayer = new B.GlowLayer('glow', this, {
        mainTextureFixedSize: 64,
        blurKernelSize: 64
      });
    } else {
      this.glowLayer.dispose();
      this.glowLayer = null;
    }
  }

  createPlanet(params: Planet) {
    const existingPlanetMesh = this.planets.find((planetMesh: any) => planetMesh.objectState.id === params.id);
    if (existingPlanetMesh) {
      this.updatePlanet(existingPlanetMesh as SpaceObjectMesh, params);
      return;
    }

    const planet = B.MeshBuilder.CreateSphere(params.name, {
      diameter: 1
    }) as SpaceObjectMesh;
    planet.position.set(params.position.x, params.position.y, params.position.z);
    planet.scaling.setAll(params.radius);
    planet.objectState = R.clone(params);

    planet.isPickable = true;

    planet.material = this.baseMaterial;
    this.planets.push(planet);
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
    this.removeOrbitLines();
    this.planets.forEach(planetMesh => {
      planetMesh.material = this.baseMaterial;
    })

    if (!pickResult.pickedMesh.name.includes('star')) {
      pickResult.pickedMesh.material = this.selectedMaterial;
      this.gameService.store.dispatch(new GameActions.PickPlanet((pickResult.pickedMesh as any).objectState));
      this.createOrbitLines(pickResult.pickedMesh as SpaceObjectMesh);
    } else {
      this.gameService.store.dispatch(new GameActions.PickPlanet(null));
    }

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

  removeOrbitLines() {
    this.planets.forEach((planetMesh: SpaceObjectMesh) => {
      if (planetMesh.orbitLines) {
        planetMesh.orbitLines.dispose();
        planetMesh.orbitLines = null;
      }
    });
  }

  private updatePlanet(existingPlanetMesh: SpaceObjectMesh, newState: Planet) {
    existingPlanetMesh.objectState = R.clone(newState);
    this.animateScale(existingPlanetMesh, newState.radius);
    this.animatePosition(existingPlanetMesh, newState.position.x);

    this.removeOrbitLines();
    this.createOrbitLines(existingPlanetMesh);
    // existingPlanetMesh.scaling.setAll(newState.radius);
    // existingPlanetMesh.position.set(newState.location.x, newState.location.y, newState.location.z);
  }

  createOrbitLines(planet: SpaceObjectMesh) {
    if (planet.orbitLines) {
      planet.orbitLines.dispose();
    }
    const myPoints = [];
    for (let i = -0.1; i <= 2 * Math.PI; i += 0.1) {
      myPoints.push(new B.Vector3(planet.objectState.position.x * Math.sin(i), planet.objectState.position.y, planet.objectState.position.x * 0.6 * Math.cos(i)));
    }
    planet.orbitLines = B.MeshBuilder.CreateDashedLines(`lines-${planet.id}`, {points: myPoints}, this);
  }

  animateScale(target: B.Mesh, scale: number) {
    const animation = new B.Animation('scaling', 'scaling', 60, B.Animation.ANIMATIONTYPE_VECTOR3);

    const easingFunction = new B.CircleEase();
    easingFunction.setEasingMode(B.EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    animation.setKeys([
      {
        frame: 0,
        value: target.scaling.clone()
      },
      {
        frame: 100,
        value: new B.Vector3(scale, scale, scale)
      }
    ]);
    target.animations.push(animation);
    this.beginAnimation(target, 0, 100, false, 3);
  }

  animatePosition(target: B.Mesh, position: number) {
    const animation = new B.Animation('position', 'position', 60, B.Animation.ANIMATIONTYPE_VECTOR3);
    const easingFunction = new B.CircleEase();
    easingFunction.setEasingMode(B.EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);
    const currentPosition = target.position.clone();
    animation.setKeys([
      {
        frame: 0,
        value: currentPosition
      },
      {
        frame: 100,
        value: new B.Vector3(position, currentPosition.y, currentPosition.y)
      }
    ]);
    target.animations.push(animation);
    this.beginAnimation(target, 0, 100, false, 3);
  }

  private startSimulation() {
    this.beforeRender = () => {
      this.planets.forEach((planet: SpaceObjectMesh) => {
        const alpha = planet.objectState.tempAlpha;
        if (!planet.objectState.tempAlpha) {
          planet.objectState.tempAlpha = 0;
        }

        planet.position = new B.Vector3(planet.objectState.position.x * Math.sin(alpha), planet.objectState.position.y, planet.objectState.position.x * 0.6 * Math.cos(alpha));
        // moon.position = new B.Vector3(5 * Math.sin(alpha), moon.parent.position.y, 5 * Math.cos(alpha));

        planet.objectState.tempAlpha += 0.005 * planet.objectState.speed;

        // spin
        // planet.rotate(B.Axis.Y, 0.05, B.Space.WORLD);
        // planet.rotate(B.Axis.Y, 0.05, B.Space.LOCAL);
      });
    };
  }
}

export interface SpaceObjectMesh extends B.Mesh {
  objectState: any;
  tempAlpha: number;
  orbitLines: LinesMesh;
}
