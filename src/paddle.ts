export default class Paddle extends Phaser.GameObjects.GameObject
{
    image: Phaser.Physics.Arcade.Image;
    
    constructor(scene: Phaser.Scene)
    {
        super(scene, "paddle");

        this.create();
    }

    create()
    {
        this.image = this.scene.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        //  Input events
        this.scene.input.on('pointermove', function (pointer) {

            //  Keep the paddle within the game
            this.image.x = Phaser.Math.Clamp(pointer.x, 52, 748);

            this.emit("paddleMoved", this.image);

        }, this);
    }

};