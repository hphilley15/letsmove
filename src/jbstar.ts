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

