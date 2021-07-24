import * as Phaser from 'phaser';
import { JBPoseDetection } from './jbposedetection';
import { JBTargetHit } from './jbtargethit';
import { MainScreen } from './Scenes/mainscreen';
import { JBTarget } from './jbtarget';

class JBStar extends JBTarget {
    constructor( scene : Phaser.Scene, jbPoseDetection : JBPoseDetection ) {
        super( scene, +10, jbPoseDetection, 'star' );
    }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbstar',
	function (this: Phaser.GameObjects.GameObjectFactory, points: number, jbPoseDetection : JBPoseDetection ) {
        console.log("gameobjectfactory called");
		const jbstar = new JBTarget( this.scene, points, jbPoseDetection );

        this.displayList.add( jbstar );
        this.updateList.add( jbstar );

        return jbstar;
	}
)

export { JBStar };

