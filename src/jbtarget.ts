import * as Phaser from 'phaser';

export default class JBTarget extends Phaser.GameObjects.Sprite {
    constructor( scene : Phaser.Scene, x : number, y : number ) {
        super( scene, x, y, 'target' );
    }
}

console.log("registering gameobjectfactory");

Phaser.GameObjects.GameObjectFactory.register(
	'jbtarget',
	function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number) {
        console.log("gameobjectfactory called");
		const jbtarget = new JBTarget(this.scene, x, y);

        this.displayList.add( jbtarget );
        this.updateList.add( jbtarget );

        return jbtarget;
	}
)

