import { PoseDetector } from '@tensorflow-models/pose-detection';
import * as Phaser from 'phaser';
import {JBCamera, JBCameraParam } from "../jbcamera";
import { JBPoseDetection } from "../jbposedetection";

export default class MainScreen extends Phaser.Scene
{
    camera : JBCamera = null;
    jbPoseDetection : JBPoseDetection = null;

    canvas : Phaser.Textures.CanvasTexture = null;
    
    constructor ()
    {
        super('main_screen');
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

    preload() {
        this.load.image("logo", 'assets/images/ntnuerc-logo-1.png'); 
    }

    loadingText : Phaser.GameObjects.Text = null;

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        console.log( `create: ${width} ${height}`);

        this.canvas = this.textures.createCanvas( 'webcam', width, height );
        this.add.image( 400, 300, 'webcam');

        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Main Screen Message',
            style: {
                color: '#a0b030',
                font: '32px monospace',
            }
        });

        this.loadingText.setOrigin(0.5, 0.5);

        const params = { 'targetFPS': 60, 'sizeOption': "" };
        const camera = JBCamera.factory("video", params );
        const jbpose = JBPoseDetection.factory("video");
        
        Promise.all( [camera, jbpose ] ).then( values => {
            this.camera = values[0];
            this.jbPoseDetection = values[1];
        });
    }

    randomRGBA() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }


    update( time : number, delta : number ) {
        //console.log(`mainScreen.update ${time} ${delta}`);

        let ctx : CanvasRenderingContext2D = this.canvas.context;
        let cam = this.camera;
        
        //ctx.fillStyle = this.randomRGBA();
        //ctx.fillRect(0,0,this.canvas.width, this.canvas.height );

        console.log(`draw context ${cam} ${this.canvas.width}x${this.canvas.height} ${this}, ${this.canvas}, ${this.canvas.context}`);

        if ( cam != null ) {
            //cam.clearContext( ctx, 0, 0, this.canvas.width, this.canvas.height, randomRGBA() );

            // ctx.fillStyle = this.randomRGBA();
            // ctx.fillRect(0,0,this.canvas.width, this.canvas.height );
            cam.drawContext( ctx, 0, 0, this.canvas.width, this.canvas.height );

            if ( this.jbPoseDetection != null ) {
                const jb = this.jbPoseDetection;
                jb.getPoses().then( poses => {
                    this.jbPoseDetection.drawResults( poses, ctx )
                    this.canvas.refresh();
                });
            } else {
                this.canvas.refresh();
            }
            
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
    

// const poses = jbpose.getPoses().then((poses) => {
//     //console.log(poses[0].keypoints);
//     //camera.clearContext();
//     //camera.drawContext();
//     //jbpose.drawResults(poses, camera.context);
// });