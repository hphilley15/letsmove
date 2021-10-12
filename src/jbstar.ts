import * as Phaser from 'phaser';
import { JBPoseDetection } from './jbposedetection';
import { JBTargetHit } from './jbtargethit';
import { MainScreen } from './Scenes/mainscreen';
import { JBTarget } from './jbtarget';

class JBStar extends JBTarget {
    constructor( scene : Phaser.Scene, jbPoseDetection : JBPoseDetection ) {
        super( scene, +10, jbPoseDetection, 'star' );

        let fNames = this.anims.generateFrameNames( 'atlas', {
            start: 1, end: 4,
            prefix: 'star-'
        });
        console.log( `frameNames ${fNames}`);

        this.anims.create( { key: 'star', frames: fNames, frameRate: 10, repeat: -1 } );
    }

    start( duration : number ) {
        this.duration = duration;
        this.anims.play( 'star' );

        // this.tween = this.mainScreen.tweens.add( { 
        //     start : 0,
        //     targets: this,
        //     scale: 0.3 * this.oScale,
        //     yoyo: false,
        //     repeat: 0,
        //     duration: this.duration,
        //     ease: 'Sine.easeInOut',
        //     onComplete: function () {
        //         console.log( `onComplete: ${this}` );
        //         this.disableTarget( 0 );
        //         console.log( "Target tween completed" );
        //     },
        //     onCompleteScope: this,
        // } );

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
        this.setScale( this.oScale );
        this.scene.add.existing( this );
    }
}

class JBFIRA extends JBTarget {
    constructor( scene : Phaser.Scene, jbPoseDetection : JBPoseDetection ) {
        super( scene, +30, jbPoseDetection, 'fira' );
    }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbstar',
	function (this: Phaser.GameObjects.GameObjectFactory, points: number, jbPoseDetection : JBPoseDetection ) {
        console.log("gameobjectfactory called");
		const jbt = new JBStar( this.scene, jbPoseDetection );

        this.displayList.add( jbt );
        this.updateList.add( jbt );

        return jbt;
	}
)

Phaser.GameObjects.GameObjectFactory.register(
	'jbfira',
	function (this: Phaser.GameObjects.GameObjectFactory, points: number, jbPoseDetection : JBPoseDetection ) {
        console.log("gameobjectfactory called");
		const jbt = new JBFIRA( this.scene, jbPoseDetection );

        this.displayList.add( jbt );
        this.updateList.add( jbt );

        return jbt;
	}
)

export { JBStar, JBFIRA };

