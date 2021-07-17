import * as Phaser from 'phaser';
import { MainScreen } from './Scenes/mainscreen';

class JBPoint extends Phaser.GameObjects.Sprite {
    timer : Phaser.Time.TimerEvent;
    tween : Phaser.Tweens.Tween;
    
    mainScreen : MainScreen;

    duration : number;

    constructor( scene : Phaser.Scene, duration : number ) {
        super( scene, -1000, -1000, 'points' );

        this.mainScreen = scene as MainScreen;
        
        this.duration = duration;

        this.tween = scene.tweens.add( { 
            targets: this,
            scaleX: 0.3,
            scaleY: 0.3,
            yoyo: false,
            repeat: 1,
            duration: this.duration,
            ease: 'Sine.easeInOut',
            onComplete: function () {
                console.log( `onComplete: ${this}` );
                this.setActive( false );
                this.setVisible( false );
                console.log("Target tween completed");
            },
            onCompleteScope: this,
        } );

        console.log( `jbpoint: duration ${this.duration} ${this.duration}` );

        this.timer = this.scene.time.addEvent( {
            delay: 1.0 * this.duration, 
            callback: () => {
                console.log( `jpoint finished` );
            },
            args: [ ], 
            callbackScope: this,
            repeat: -1,
        } );   
         
    }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbpoint',
	function (this: Phaser.GameObjects.GameObjectFactory ) {
        console.log("gameobjectfactory points called");
		const jbpoint = new JBPoint( this.scene, 1000 );

        this.displayList.add( jbpoint );
        this.updateList.add( jbpoint );

        return jbpoint;
	}
)

export { JBPoint };
