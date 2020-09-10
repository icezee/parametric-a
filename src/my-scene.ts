import * as BABYLON from 'babylonjs';
import Music from './music'
import Danse2 from './Danse2'

export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;

    private _music: Music
    private _danse: Danse2

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        this._scene = new BABYLON.Scene(this._engine);

        //let gravityVector = new BABYLON.Vector3(0,-9.81,0)
        //let physicsPlugin = new BABYLON.CannonJSPlugin()
        //this._scene.enablePhysics(gravityVector, physicsPlugin)

        //this._scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Random())
        this._scene.clearColor = new BABYLON.Color4(0.25,0.25,Math.random()*0.25+0.25,1.0)

        this._camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(-0.5, 2.25, 0.5), this._scene);
        this._camera.setPosition(new BABYLON.Vector3(0, 0, -3));
        this._camera.attachControl(this._canvas, true);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this._scene);

        this._music = new Music(this._scene)
        this._danse = new Danse2(this._scene)

        //this._scene.debugLayer.show({overlay:true})
    }

    update(): void {
        this._scene.registerBeforeRender(() => {
            let dt = this._engine.getDeltaTime()
            let fft = this._music.update()
            this._danse.update(dt, fft)
        })
    }

    doRender() : void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}