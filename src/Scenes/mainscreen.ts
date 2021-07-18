import * as Phaser from 'phaser';
import * as poseDetection from '@tensorflow-models/pose-detection';

import { JBCamera, JBCameraParam } from "../jbcamera";
import { JBPoseDetection } from "../jbposedetection";
import { JBTarget } from '../jbtarget';
// import { isMobile } from '../utils';

class MainScreen extends Phaser.Scene
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
        //         }}
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
        this.load.image( "target", 'assets/images/target.png' );
        
        this.jbPoseDetectionPromise = JBPoseDetection.factory("video");
        
        const params = { 'targetFPS': 60, 'sizeOption': "" };
        this.cameraPromise = JBCamera.factory("video", params );
    }


    scorePoints: number;
    scoreText : Phaser.GameObjects.Text = null;

    targets : Array<JBTarget> = new Array<JBTarget>();

    gameToPoseMatrix : Phaser.Math.Matrix3 = new Phaser.Math.Matrix3();

    bgSound : Phaser.Sound.BaseSound;

    startTime = 0;
    timeText : Phaser.GameObjects.Text = null;

    scaleX : number;
    scaleY : number;

    jbPoseDetectionPromise : Promise<JBPoseDetection>;
    cameraPromise: Promise<JBCamera>;

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

        
        Promise.all( [this.cameraPromise, this.jbPoseDetectionPromise ] ).then( values => {
            this.camera = values[0];
            this.jbPoseDetection = values[1];

            this.canvas = this.textures.createCanvas( 'webcam', this.camera.video.width, this.camera.video.height );
            const ctx = this.canvas.context;
    
            // ctx.translate(0, this.canvas.width);
            //ctx.scale(-1,1);
    
            this.scaleX = this.game.canvas.width / this.camera.video.videoWidth;;
            this.scaleY = this.game.canvas.height / this.camera.video.videoHeight;;
    
            this.gameToPoseMatrix.translate( new Phaser.Math.Vector2( this.camera.video.videoWidth, 0  ) ).scale( new Phaser.Math.Vector2( - 1/this.scaleX, 1/this.scaleY ) );
            console.log( "gameToPoseMatrix" );
            console.dir( this.gameToPoseMatrix );
            
            //target.updateTarget();
            
            //console.log(`scaleX ${this.scaleX} scaleY ${this.scaleY}`);
    
            this.add.image( width/2, height/2, 'webcam').setFlipX( true ).setScale( this.scaleX, this.scaleY );
    
            this.scorePoints = 0;
            this.scoreText = this.make.text({
                x: 10,
                y: 10,
                text: `User: ${this.registry.get('userName')}, Score: ${this.scorePoints.toFixed(0)}`,
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

            this.sound.play( snd, sndConfig );

            //this.createTargets(3);
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

                    this.jbPoseDetection.drawResults( poses, ctx );

                    let width = this.cameras.main.width;
                    let height = this.cameras.main.height;

                    let radius = Math.min(width, height) / 10;

                    for (let target of this.targets ) {
                        if ( target.active ) {
                            let {tx, ty } = this.gameToPoseCoords( target.x, target.y );
    
                            const { min, minIndex } = this.jbPoseDetection.calcMinDist( this.currentPoses[0], tx, ty );
                            //console.log( `tx ${tx} ty ${ty} min ${min} ${minIndex}`);
    
                            let thresh = target.scale / Math.max( this.scaleX, this.scaleY) * Math.min( target.width, target.height );
                            if ( ( min >= 0 ) && ( min <  thresh ) ) {
                                this.sound.play("beep");
                                console.log(`Hit min ${min} minIndex ${minIndex} thresh ${thresh} target.scale ${this.targets[0].scale} target.width ${this.targets[0].width}`);
                                target.tint = Phaser.Display.Color.GetColor(255, 140, 160);
                                this.scorePoints = this.scorePoints + 10 * target.scale;
                                console.log( `scorePoints: ${this.scorePoints} scale ${target.scale}` );
                                this.scoreText.text = `Score: ${this.scorePoints.toFixed()}`;
                                target.disableTarget( 10 * target.scale );
                            }
                        }
                    }
                    console.log("pose detection closure");
                    console.dir(this);

                    this.canvas.refresh();
                    this.targets = this.targets.filter( (target : JBTarget, index : number, array: JBTarget[] ) => { return target.active } );
                    if ( this.targets.length === 0 ) {
                        this.createTargets(3);
                        this.startTargets();
                    }
                });
            }
            // this.canvas.refresh();
            // this.targets = this.targets.filter( (target : JBTarget, index : number, array: JBTarget[] ) => { return target.active } );
            // if ( this.targets.length === 0 ) {
            //     this.createTargets(3);
            //     this.startTargets();
            // }
        }
    }

    createTargets( numTargets : number ) {
        this.targets = new Array<JBTarget>();

        for( let i = 0; i < numTargets; i++ ) {
            let t = new JBTarget( this, this.jbPoseDetection );
            t.setRandomPosition();
            this.targets.push( t );
            this.add.existing( t );
        }
        this.startTargets();
    }

    stopTargets( ) {
        for( let t of this.targets ) {
            t.stop( );
        }
    } 

    startTargets( ) {
        for( let t of this.targets ) {
            t.start( 1000 );
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
    

// const poses = jbPoseDetectionPromise.getPoses().then((poses) => {
//     //console.log(poses[0].keypoints);
//     //camera.clearContext();
//     //camera.drawContext();
//     //jbPoseDetectionPromise.drawResults(poses, camera.context);
// });

export { MainScreen };