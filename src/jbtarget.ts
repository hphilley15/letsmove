import * as Phaser from 'phaser';
import { JBPoseDetection } from './jbposedetection';
import { JBTargetHit } from './jbtargethit';
import { MainScreen } from './Scenes/mainscreen';

class JBTarget extends Phaser.GameObjects.Sprite {
    timer : Phaser.Time.TimerEvent;
    tween : Phaser.Tweens.Tween;
    
    jbPoseDetection : JBPoseDetection;

    mainScreen : MainScreen;

    duration : number;

    oScale : number;

    constructor( scene : Phaser.Scene, public points: number, jbPoseDetection : JBPoseDetection, img: string  = 'target' ) {
        super( scene, -1000, -1000, img );
        
        this.mainScreen = scene as MainScreen;
        
        this.jbPoseDetection = jbPoseDetection;

        this.active = false;
        this.visible = false;

        this.oScale = (window.innerWidth * 0.1) / this.width;

        this.scale = this.oScale; 
        //console.log(`this.target ${this.target}`);
    }

    start( duration : number ) {
        this.duration = duration;

        this.tween = this.mainScreen.tweens.add( { 
            start : 0,
            targets: this,
            scale: 0.3 * this.oScale,
            yoyo: false,
            repeat: 0,
            duration: this.duration,
            ease: 'Sine.easeInOut',
            onComplete: function () {
                console.log( `onComplete: ${this}` );
                this.disableTarget( 0 );
                console.log( "Target tween completed" );
            },
            onCompleteScope: this,
        } );

        console.log( `jbtarget: duration x=${this.x},y=${this.y}, duration=${this.duration}` );

        // this.timer = this.scene.time.addEvent( {
        //     delay: this.duration, 
        //     callback: this.stop, 
        //     args: [ ], 
        //     callbackScope: this,
        //     repeat: -1,
        // } );   

        this.setActive( true );
        this.setVisible( true );

        this.scene.add.existing( this );
    }

    hit : JBTargetHit;

    disableTarget( score? : number ) {
        if ( score === undefined ) {
            score = this.getPoints();
        }

        this.setActive( false );
        this.setVisible( false );

        console.log( `Disable target ${this.scene}` );
        if ( score !== 0 ) {
            this.hit = new JBTargetHit( this.scene );
            this.hit.start( this.x, this.y, score );
        }
    }

    update( time: number, delta: number ) {
        if ( ( this.hit !== null ) && ( this.hit !== undefined ) && ( this.hit.visible ) ) {
            this.hit.update( time, delta );
        } 
    }

    getPoints( ) {
        return this.points * this.scale / this.oScale;
    }

    // updateTarget( ) {
    //     console.log("Update target");
    //     let xt : number;
    //     let yt : number;
        
    //     for( var i = 0; i < 50; i++ ) {
    //         xt = Math.random() * this.scene.cameras.main.width;
    //         yt =  Math.random() * this.scene.cameras.main.height;

    //         let { tx, ty } = this.mainScreen.gameToPoseCoords( xt, yt );

    //         let ms = (this.scene as MainScreen);
            
    //         if ( ms.currentPoses != null ) {
    //             const { min, minIndex } = this.jbPoseDetection.calcMinDist( ms.currentPoses[0], tx, ty );
    //             let thresh = 1.0* Math.max( this.width, this.height );
    //             //console.log(`trying target ${i} with thresh ${thresh} distance ${min}`);
                            
    //             if ( min >= thresh ) {
    //                 console.log(`created target ${i} with thresh ${thresh} distance ${min} tx ${tx} ty ${ty}`);
    //                 break;
    //             }
    //         }
    //     }
        
    //     this.setPosition( xt, yt );
    //     //target.setPosition( 600, 400 ); 
        
    //     this.setActive( true );
    //     this.setVisible( true );
    //     this.tint = Phaser.Display.Color.GetColor(255, 255, 0);
    //     this.tween.restart();
    // }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbtarget',
	function (this: Phaser.GameObjects.GameObjectFactory, points: number, jbPoseDetection : JBPoseDetection ) {
        console.log("gameobjectfactory called");
		const jbtarget = new JBTarget( this.scene, points, jbPoseDetection );

        this.displayList.add( jbtarget );
        this.updateList.add( jbtarget );

        return jbtarget;
	}
)

export { JBTarget };

