import * as BABYLON from 'babylonjs'

export default class Danse2 {
    private _scene: BABYLON.Scene

    // _t: timer for the accumulated time
    private _t: number

    private _tubes: BABYLON.Mesh[]
    private _balls: BABYLON.Mesh[]
    private _partis: BABYLON.ParticleSystem[]

    private _current: number = 0
    private _n: number = 20
    private _c: BABYLON.Color3 = BABYLON.Color3.Random()

    constructor(scene: BABYLON.Scene) {
        this._scene = scene
        this._t = 0

        this._tubes = []
        for(let i=0;i<this._n;i++) {
            this.make_tube(this._t, false)
        }
        this._balls = []
        this._partis = []
    }

    curve_points(t: number): BABYLON.Vector3[] {
        // create 5 points for Catmull Rom curve
        // each point rotate at different speed
        // the shape of the curve is determined by t
        const r1 = 1.0 * Math.cos(t)
        const r2 = 0.5
        const r3 = 1.2 * Math.sin(t) - 0.6
        const r4 = 0.5
        const r5 = 0.8 * Math.cos(t) -0.4

        let a1 = t * 0.5
        let a2 = t * 2.0
        let a3 = t * 1.5
        let a4 = t * 2.5
        let a5 = t * 0.5

        let p1 = new BABYLON.Vector3(r1*Math.cos(a1),0.5+0.85*Math.cos(t*2)-0.25,r1*Math.sin(a1))
        let p2 = new BABYLON.Vector3(r2*Math.cos(a2),1.0,r2*Math.sin(a2))
        let p3 = new BABYLON.Vector3(r3*Math.cos(a3),1.8,r3*Math.sin(a3))
        let p4 = new BABYLON.Vector3(r4*Math.cos(a4),2.5,r4*Math.sin(a4))
        let p5 = new BABYLON.Vector3(r5*Math.cos(a5),2.8+0.85*Math.cos(t*1.5)-0.25,r5*Math.sin(a5))

        let pts: BABYLON.Vector3[] = [p1,p2,p3,p4,p5]
        return pts
    }

    update(dt: number, fft: number[]) {
        // update according to dt: time delta, i.e., the time has passed
        this._t += dt * 0.0012

        this.make_tube(this._t, true, fft)

    }

    make_tube(t: number, update: boolean, fft?: number[] ) {
        let cat = BABYLON.Curve3.CreateCatmullRomSpline(
            this.curve_points(t),10,true)
        if(update) {
            this._tubes[this._current] = BABYLON.MeshBuilder.CreateTube("mesh",
            {path:cat.getPoints(),radius:0.01,
            instance:this._tubes[this._current % this._n]})
        } else {
            this._tubes[this._current] = BABYLON.MeshBuilder.CreateTube("mesh",
            {path:cat.getPoints(), radius:0.01, updatable:true}, this._scene)


            let m = new BABYLON.StandardMaterial("mat", this._scene)
            m.diffuseColor = this._c
            this._tubes[this._current].material = m
        }

        if(fft) {
            if(this._balls.length==0) {
                for(let i=0; i<fft.length; i++) {
                    // create balls
                    this._balls.push(
                        BABYLON.MeshBuilder.CreateSphere("ball",{diameter:0.01,segments:4,updatable:true},this._scene)
                    )
                    let parti = new BABYLON.ParticleSystem("parti", 1000, this._scene)
                    parti.emitter = this._balls[i]
                    parti.particleTexture = new BABYLON.Texture("textures/Flare.png", this._scene)
                    parti.minSize = 0.02
                    //parti.maxSize = 0.1
                    parti.start()

                    this._partis.push(parti)
                }
            }

            let cat = BABYLON.Curve3.CreateCatmullRomSpline(
                this.curve_points(t),10,false)
            let path3d = new BABYLON.Path3D(cat.getPoints())

            for(let i=0; i<fft.length; i++) {
                let p = path3d.getPointAt( i/fft.length )
                this._balls[i].position = p

                // make higher frequencies more visuable
                this._partis[i].emitRate = fft[i] * 3 * i
                this._partis[i].maxSize = fft[i] * 0.1 

            }

        }

        this._current += 1
    }

}