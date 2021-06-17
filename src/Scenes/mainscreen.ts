import * as Phaser from 'phaser';
import {JBCamera, JBCameraParam } from "../jbcamera";
import { JBPoseDetection } from "../jbposedetection";

export default class MainScreen extends Phaser.Scene
{
    camera : JBCamera = null;
    canvas : Phaser.Textures.CanvasTexture = null;
    
    constructor ()
    {
        super('MainScreen');
        const videoConfig : MediaStreamConstraints = {
            'audio' : false,
            'video' : {
                facingMode : 'user',
                width: 360,
                height: 270,
                frameRate: {
                    ideal: 30
                }
            }
        };

        // const stream = navigator.mediaDevices.getUserMedia( videoConfig ).then( (stream) => {
        //     this.stream = stream;
        // });
    }

    loadingText : Phaser.GameObjects.Text = null;

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        console.log( `create: ${width} ${height}`);

        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Main Screen',
            style: {
                font: '32px monospace',
            }
        });

        this.loadingText.setOrigin(0.5, 0.5);
        // this.video = new Phaser.GameObjects.Video( this, 0, 0, null );
        // // this.video.loadMediaStream( this.stream, null, true );

        // this.add.video( 0, 0, 'webcam' );
        // this.video.play();

        //this.bitmap = this.add.BitmapData( width, height, 'cam');

        // this.canvas = document.createElement( 'canvas' );
        // //this.canvas.style.visibility = "hidden";
        // document.body.appendChild( this.canvas );
        // this.context = this.canvas.getContext( "2d" );

        this.canvas = this.textures.createCanvas( 'webcam', width, height );
        this.add.image( 0, 0, 'webcam');

        const params = { 'targetFPS': 60, 'sizeOption': "" };
        const jbpose = JBPoseDetection.factory("video").then((jbpose) => {
            const camera = JBCamera.factory("video", params ).then((camera) => {
                this.camera = camera;
                    const poses = jbpose.getPoses().then((poses) => {
                        //console.log(poses[0].keypoints);
                        //camera.clearContext();
                        //camera.drawContext();
                        //jbpose.drawResults(poses, camera.context);
                    });
            });
        });
    }

    randomRGBA() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }


    update( time : number, delta : number ) {
        //console.log(`mainScreen.update ${time} ${delta}`);

        let ctx = this.canvas.context;
        let cam = this.camera;
        ctx.fillStyle = this.randomRGBA();
        ctx.fillRect(0,0,this.canvas.width, this.canvas.height );

        console.log(`draw context ${cam} ${this.canvas.width}x${this.canvas.height} ${this}, ${this.canvas}, ${this.canvas.context}`);

        if ( cam != null ) {
            this.camera.clearContext( ctx );
            this.canvas.refresh();
        }
    }
}

// setInterval(() => {
//     console.log(`draw context ${width}x${height} ${this}, ${this.canvas}, ${this.canvas.context}`);
//     let ctx = this.canvas.context;
//     camera.clearContext( ctx );
//     //camera.drawContext( ctx );
//     // ctx.fillStyle = '#00ff00';
//     // ctx.fillRect(0, 0, width, height);

//     ctx.strokeStyle = '#00ff00';
//     ctx.lineWidth = 12;
//     ctx.beginPath();
//     ctx.moveTo(20, 20);
//     ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
//     ctx.stroke();
//     this.canvas.refresh();
    
