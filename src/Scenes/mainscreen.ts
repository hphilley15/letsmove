import { PoseDetector } from '@tensorflow-models/pose-detection';
import * as Phaser from 'phaser';
import {JBCamera, JBCameraParam } from "../jbcamera";
import { JBPoseDetection } from "../jbposedetection";
import JBTarget from '../jbtarget';

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
        this.load.image( "target", 'assets/images/target.png' )
    }

    loadingText : Phaser.GameObjects.Text = null;

    target : JBTarget;

    create() {
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        console.log( `create: ${width} ${height}`);

        this.canvas = this.textures.createCanvas( 'webcam', 360, 240 );
        const ctx = this.canvas.context;

        // ctx.translate(0, this.canvas.width);
        //ctx.scale(-1,1);

        this.add.image( width/2, height/2, 'webcam').setFlipX( true ).setScale( 800/this.canvas.width, 600/this.canvas.height );

        this.loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Main Screen',
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

        this.target = new JBTarget( this, 200, 200 );
        this.add.existing( this.target );
        console.log(`this.target ${this.target}`);

        
        const tween = this.tweens.add( { 
            targets: this.target,
            scaleX: 0.3,
            scaleY: 0.3,
            yoyo: false,
            repeat: 1,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onComplete: function (tween, targets, ref ) {
                console.log(`tween completed ${ref} ${ref.target}`);
                // for ( var t in targets ) {
                //     console.log(`reset ${t}`);
                //     t.setActive = false;
                // }
                ref.target.setActive( false );
                ref.target.setVisible( false );
            },
            onCompleteParams: [this]
        } );

        const timer = this.time.addEvent( {
            delay: 1000, 
            callback: (tween, target) => {
                target.setPosition( Math.random() * width, Math.random() * height );
                tween.restart();
            }, 
            args: [tween, this.target ], 
            callbackScope: this,
            repeat: -1,
        } );
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

        //console.log(`draw context ${cam} ${this.canvas.width}x${this.canvas.height} ${this}, ${this.canvas}, ${this.canvas.context}`);

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
        //this.add.existing( this.target );
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