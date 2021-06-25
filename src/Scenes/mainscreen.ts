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
    
    constructor ( )
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

    backgrounds = Array<string>();

    preload() {
        this.load.image("logo", 'assets/images/ntnuerc-logo-1.png');
        this.load.audio("beep", 'assets/audio/beep_ping.wav');
        
        this.load.audio("bg1", 'assets/audio/background1.wav');
        this.backgrounds.push("bg1");
        
        this.load.audio("bg2", 'assets/audio/background2.wav');
        this.backgrounds.push("bg2");
        
        this.load.audio("bg3", 'assets/audio/background3.wav');
        this.backgrounds.push("bg3");
        
  //      this.load.image("logo", 'assets/images/ntnuerc-logo-1.png'); 
        this.load.image( "target", 'assets/images/target.png' )  
    }


    scorePoints: number;
    scoreText : Phaser.GameObjects.Text = null;

    targets : Array<JBTarget> = new Array<JBTarget>();

    gameToPoseMatrix : Phaser.Math.Matrix3 = new Phaser.Math.Matrix3();

    bgSound : Phaser.Sound.BaseSound;

    startTime = 0;
    timeText : Phaser.GameObjects.Text = null;

    create() {
        this.sound.add( "beep" );
        let rnd = ( Math.random() * this.backgrounds.length ).toFixed();
        let snd = this.backgrounds[rnd]

        const sndConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };

        this.bgSound = this.sound.add( snd, sndConfig );

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
    
            let target = new JBTarget( this, this.jbPoseDetection, 1000 );

            let scaleX = this.game.canvas.width / this.camera.video.videoWidth;;
            let scaleY = this.game.canvas.height / this.camera.video.videoHeight;;
    
            this.gameToPoseMatrix.translate( new Phaser.Math.Vector2( this.camera.video.videoWidth, 0  ) ).scale( new Phaser.Math.Vector2( - 1/scaleX, 1/scaleY ) );
            console.log( "gameToPoseMatrix" );
            console.dir( this.gameToPoseMatrix );
            this.targets.push( target );
            target.updateTarget();
            
            //console.log(`scaleX ${this.scaleX} scaleY ${this.scaleY}`);
    
            this.add.image( width/2, height/2, 'webcam').setFlipX( true ).setScale( scaleX, scaleY );
    
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
    
            this.timeText = this.make.text({
                x: this.game.canvas.width,
                y: 10, 
                text: `Score: ${(this.time.now/1000).toFixed()}`,
                style: {
                    color: '#e0e030',
                    font: '32px monospace',
                }
            });
            this.timeText.setOrigin(1, 0);
    
            this.add.existing( target );
            this.sound.play( snd, sndConfig );

            this.startTime = this.time.now;
        });
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

            let dt = this.time.now - this.startTime;
            this.timeText.text = `Time: ${(dt/1000).toFixed() }`;

            if ( this.jbPoseDetection != null ) {
                const jb = this.jbPoseDetection;
                jb.getPoses().then( poses => {
                    this.currentPoses = poses;

                    this.jbPoseDetection.drawResults( poses, ctx )
                    if ( this.targets[0].visible ) {
                        
                       let width = this.cameras.main.width;
                       let height = this.cameras.main.height;

                       let radius = Math.min(width, height) / 10;


                       let {tx, ty } = this.gameToPoseCoords( this.targets[0].x, this.targets[0].y );

                       const { min, minIndex } = this.jbPoseDetection.calcMinDist( this.currentPoses[0], tx, ty );
                       //console.log( `tx ${tx} ty ${ty} min ${min} ${minIndex}`);

                       let thresh = 64; // 1.5 * this.targets[0].scale / Math.max( this.scaleX, this.scaleY) * Math.min( this.target.width, this.target.height );
                       if ( ( min >= 0 ) && ( min <  thresh ) ) {
                           this.sound.play("beep");
                           console.log(`Hit min ${min} minIndex ${minIndex} thresh ${thresh} target.scale ${this.targets[0].scale} target.width ${this.targets[0].width}`);
                           this.targets[0].tint = Phaser.Display.Color.GetColor(255, 140, 160);
                           this.scorePoints = this.scorePoints + 10 * this.targets[0].scale;
                           console.log( `scorePoints: ${this.scorePoints} scale ${this.targets[0].scale}` );
                           this.scoreText.text = `Score: ${this.scorePoints.toFixed()}`;
                            
                           this.targets[0].setActive( false );
                           this.targets[0].setVisible( false );

                        }
                    }
                    this.canvas.refresh();
                });
            } else {
                this.canvas.refresh();
            }
        }
    }

    gameToPoseCoords( x: number, y : number ) {
        let vec = new Phaser.Math.Vector3( x, y, 1 ).transformMat3( this.gameToPoseMatrix );
        let tx = vec.x;
        let ty = vec.y;

        return { tx, ty };
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