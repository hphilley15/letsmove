import * as Phaser from 'phaser';
import { JBPoseDetection } from './jbposedetection';
import { JBTargetHit } from './jbtargethit';
import { MainScreen } from './Scenes/mainscreen';
import { JBTarget } from './jbtarget';

class JBBomb extends JBTarget {
    constructor( scene : Phaser.Scene, jbPoseDetection : JBPoseDetection ) {
        super( scene, -10, jbPoseDetection, 'bomb' );
    }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbbomb',
	function (this: Phaser.GameObjects.GameObjectFactory, points: number, jbPoseDetection : JBPoseDetection ) {
        console.log("gameobjectfactory called");
		const jbbomb = new JBTarget( this.scene, points, jbPoseDetection, 'bomb' );

        this.displayList.add( jbbomb );
        this.updateList.add( jbbomb );

        return jbbomb;
	}
)

export { JBBomb };

