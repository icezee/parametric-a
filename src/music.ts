import * as BABYLON from 'babylonjs'

export default class Music {
    private _music: BABYLON.Sound
    private _analyser: BABYLON.Analyser
    private _url: String = "//soundcloud.com/cmdigital/claude-debussy-arabesque-1"

    constructor(scene: BABYLON.Scene) {
        this._music = new BABYLON.Sound(
            "Music", 
            //this._url,
            //"//www.babylonjs.com/demos/AudioAnalyser/cosmosis.mp3",
            "../music/m_lewin_arab.mp3",
            scene, null, { streaming: true, autoplay: true })   

        this._analyser = new BABYLON.Analyser(scene)
        this._analyser.FFT_SIZE = 64
        //this._analyser.SMOOTHING = 0
        BABYLON.Engine.audioEngine.connectToAnalyser(this._analyser)

    }

    update(): number[] {
        let rs: number[] = []
        let workingArray = this._analyser.getByteFrequencyData()

        for(let i=0; i<this._analyser.FFT_SIZE / 2; i++) {
            rs[i] = workingArray[i] / this._analyser.FFT_SIZE;
        }
        return rs
    }

    stop() {
        this._music.stop()
    }

}