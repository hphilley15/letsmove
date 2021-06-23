import * as Phaser from 'phaser';
import * as poseDetection from '@tensorflow-models/pose-detection';

import {JBCamera, JBCameraParam } from "../jbcamera";
import { JBPoseDetection } from "../jbposedetection";
import JBTarget from '../jbtarget';
// import { isMobile } from '../utils';

export default class MainScreen extends Phaser.Scene
{
    camera : JBCamera = null;
    jbPoseDetection : JBPoseDetection = null;

    canvas : Phaser.Textures.CanvasTexture = null;
    
    constructor ()
    {
        super('main_screen');

        // const videoConfig : MediaStreamConstraints = {
        //     'audio' : false,
        //     'video' : {
        //         facingMode : 'user',
        //         width: isMobile( ) ? 0 : 360,
        //         height: isMobile( ) ? 0 : 270,
        //         frameRate: {
        //             ideal: 30
        //         }
        //     }
        // }; 

        // const stream = navigator.mediaDevices.getUserMedia( videoConfig ).then( (stream) => {
        //     this.stream = stream;
        // });
    }

    preload() {
        this.load.image("logo", 'assets/images/ntnuerc-logo-1.png');
        this.load.audio("beep", 'assets/audio/beep_ping.wav');
  
  //      this.load.image("logo", 'assets/images/ntnuerc-logo-1.png'); 
        this.load.image( "target", 'assets/images/target.png' )  
    }

    scorePoints: number;
    scoreText : Phaser.GameObjects.Text = null;

    target : JBTarget;
    targetTimer : Phaser.Time.TimerEvent;
    targetTween : Phaser.Tweens.Tween;

    scaleX : number;
    scaleY : number;

    create() {
        this.sound.add( "beep" );

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        //console.log( `create: ${width} ${height}`);

        const params = { 'targetFPS': 60, 'sizeOption': "" };
        const camera = JBCamera.factory("video", params );
        const jbpose = JBPoseDetection.factory("video");
        
        Promise.all( [camera, jbpose ] ).then( values => {
            this.camera = values[0];
            this.jbPoseDetection = values[1];

            this.canvas = this.textures.createCanvas( 'webcam', this.camera.video.width, this.camera.video.height );
            const ctx = this.canvas.context;
    
            // ctx.translate(0, this.canvas.width);
            //ctx.scale(-1,1);
    
            this.scaleX = 800.0/this.canvas.width;
            this.scaleY = 600.0/this.canvas.height;
    
            //console.log(`scaleX ${this.scaleX} scaleY ${this.scaleY}`);
    
            this.add.image( width/2, height/2, 'webcam').setFlipX( true ).setScale( this.scaleX, this.scaleY );
    
            this.scorePoints = 0;
            this.scoreText = this.make.text({
                x: 10,
                y: 10,
                text: `Score: ${this.scorePoints.toFixed(0)}`,
                style: {
                    color: '#e0e030',
                    font: '32px monospace',
                }
            });
    
            this.scoreText.setOrigin(0, 0);

            this.target = new JBTarget( this, 200, 200 );
            this.add.existing( this.target );
            //console.log(`this.target ${this.target}`);
    
            const duration = 1000;

            this.targetTween = this.tweens.add( { 
                targets: this.target,
                scaleX: 0.3,
                scaleY: 0.3,
                yoyo: false,
                repeat: 1,
                duration: duration,
                ease: 'Sine.easeInOut',
                onComplete: function (tween, targets, ref ) {
                    //console.log(`tween completed ${ref} ${ref.target}`);
                    // for ( var t in targets ) {
                    //     console.log(`reset ${t}`);
                    //     t.setActive = false;
                    // }
                    ref.target.setActive( false );
                    ref.target.setVisible( false );
                },
                onCompleteParams: [this]
            } );
    
            this.targetTimer = this.time.addEvent( {
                delay: duration, 
                callback: this.updateTarget, 
                args: [this.targetTween, this.target ], 
                callbackScope: this,
                repeat: -1,
            } );    
        });

    }

    updateTarget( tween : Phaser.Tweens.Tween, target : JBTarget ) {
        //console.log("Update target");
        let xt : number;
        let yt : number;

        let tx : number;
        let ty : number;
        
        for( var i = 0; i < 50; i++ ) {
            xt = Math.random() * this.cameras.main.width;
            yt =  Math.random() * this.cameras.main.height;

            tx = ( this.cameras.main.width - xt ) / this.scaleX;
            ty = yt / this.scaleY

            const { min, minIndex } = this.jbPoseDetection.calcMinDist( this.currentPoses[0], tx, ty );
            let thresh = 1.5 * Math.max( this.target.width, this.target.height );
            //console.log(`trying target ${i} with thresh ${thresh} distance ${min}`);
                        
            if ( min >= thresh ) {
                console.log(`created target ${i} with thresh ${thresh} distance ${min}`);
                break;
            }
        }
        target.setPosition( xt, yt );
        //target.setPosition( 600, 400 ); 
        
        this.target.setActive( true );
        this.target.setVisible( true );
        this.target.tint = Phaser.Display.Color.GetColor(255, 255, 0);
        tween.restart();
    }
    
    randomRGBA() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

    currentPoses : poseDetection.Pose = null;

    update( time : number, delta : number ) {
        if ( ( this.camera != null ) && ( this.canvas != null ) ) {

            //console.log(`mainScreen.update ${time} ${delta}`);

            let ctx : CanvasRenderingContext2D = this.canvas.context;
            let cam = this.camera;
            
            //ctx.fillStyle = this.randomRGBA();
            //ctx.fillRect(0,0,this.canvas.width, this.canvas.height );

            //console.log(`draw context ${cam} ${this.canvas.width}x${this.canvas.height} ${this}, ${this.canvas}, ${this.canvas.context}`);

            //cam.clearContext( ctx, 0, 0, this.canvas.width, this.canvas.height, randomRGBA() );

            // ctx.fillStyle = this.randomRGBA();
            // ctx.fillRect(0,0,this.canvas.width, this.canvas.height );
            cam.drawContext( ctx, 0, 0, this.canvas.width, this.canvas.height );

            if ( this.jbPoseDetection != null ) {
                const jb = this.jbPoseDetection;
                jb.getPoses().then( poses => {
                    this.currentPoses = poses;

                    this.jbPoseDetection.drawResults( poses, ctx )
                    if ( this.target.visible ) {
                        
                        let width = this.cameras.main.width;
                        let height = this.cameras.main.height;

                        let radius = Math.min(width, height) / 10;

                        // X Coordinate must be flipped since we draw it flipped. Argh
                        let tx = ( this.cameras.main.width - this.target.x ) / this.scaleX;
                        let ty = this.target.y / this.scaleY

                        const { min, minIndex } = this.jbPoseDetection.calcMinDist( this.currentPoses[0], tx, ty );
                        //console.log( `min ${min} ${minIndex}`);

                        let thresh = 1.5 * this.target.scale / Math.max( this.scaleX, this.scaleY) * Math.min( this.target.width, this.target.height );
                        if ( ( min >= 0 ) && ( min <  thresh ) ) {
                            this.sound.play("beep");
                            //console.log(`Hit min ${min} minIndex ${minIndex} thresh ${thresh} target.scale ${this.target.scale} target.width ${this.target.width}`);
                            this.target.tint = Phaser.Display.Color.GetColor(255, 140, 160);
                            this.scorePoints = this.scorePoints + 10 * this.target.scale;
                            //console.log(`scorePoints: ${this.scorePoints}`);
                            this.scoreText.text = `Score: ${this.scorePoints.toFixed()}`;
                            
                            this.target.setActive( false );
                            this.target.setVisible( false );

                        }
                    }
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