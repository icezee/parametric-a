import * as BABYLON from 'babylonjs'

export default class Danse {
    private _scene: BABYLON.Scene

    // _t: timer for the accumulated time
    private _t: number

    private _cat: BABYLON.LinesMesh
    private _sphere: BABYLON.Mesh

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
        this._t = 0

        // create a curve in space
        let pts = this.curve_points(this._t)
        let cat = BABYLON.Curve3.CreateCatmullRomSpline(pts,60,true)

        this._cat = BABYLON.MeshBuilder.CreateLines(
                        "cat_curve", 
                        {points:cat.getPoints(), updatable: true}, 
                        this._scene
                    )

        // attach a sphere to the curve, to make it slightly interesting
        this._sphere = BABYLON.MeshBuilder.CreateSphere('sphere1',
                    {segments: 16, diameter: 0.2}, this._scene);
        this._sphere.position = pts[2]

    }

    curve_points(t: number): BABYLON.Vector3[] {
        // create 5 points for Catmull Rom curve
        // each point rotate at different speed
        // the shape of the curve is determined by t
        const r1 = 1.0
        const r2 = 0.5
        const r3 = 1.2
        const r4 = 0.5
        const r5 = 0.8

        let a1 = t * 0.5
        let a2 = t * 2.0
        let a3 = t * 1.5
        let a4 = t * 2.5
        let a5 = t * 0.5

        let p1 = new BABYLON.Vector3(r1*Math.cos(a1),-0.5,r1*Math.sin(a1))
        let p2 = new BABYLON.Vector3(r2*Math.cos(a2),1.0,r2*Math.sin(a2))
        let p3 = new BABYLON.Vector3(r3*Math.cos(a3),1.8,r3*Math.sin(a3))
        let p4 = new BABYLON.Vector3(r4*Math.cos(a4),2.5,r4*Math.sin(a4))
        let p5 = new BABYLON.Vector3(r5*Math.cos(a5),2.8,r5*Math.sin(a5))

        let pts: BABYLON.Vector3[] = [p1,p2,p3,p4,p5]
        return pts
    }

    update(dt: number) {
        // update according to dt: time delta, i.e., the time has passed
        this._t += dt * 0.001

        let pts = this.curve_points(this._t)
        let cat = BABYLON.Curve3.CreateCatmullRomSpline(pts,60,true)

        this._cat = BABYLON.MeshBuilder.CreateLines(
            "cat_curve", 
            {points:cat.getPoints(), instance: this._cat}
        )
        this._sphere.position = pts[2]
    }

}