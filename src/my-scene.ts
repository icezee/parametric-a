import * as BABYLON from 'babylonjs';
import Danse from './Danse'

export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.Light;

    private _danse: Danse

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene() : void {
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Random())

        this._camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), this._scene);
        this._camera.setPosition(new BABYLON.Vector3(0, 0, -8));
        this._camera.attachControl(this._canvas, true);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this._scene);

        this._danse = new Danse(this._scene)
    }

    doRender() : void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
            let dt = this._engine.getDeltaTime()
            this._danse.update(dt)
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}