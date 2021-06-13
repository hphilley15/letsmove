export default class Bricks extends Phaser.GameObjects.GameObject
{
    group: Phaser.Physics.Arcade.StaticGroup;
    
    constructor(scene: Phaser.Scene)
    {
        super(scene, "bricks");

        this.create();
    }

    create()
    {
        //  Create the bricks in a 10x6 grid
        this.group = this.scene.physics.add.staticGroup({
            key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
        });
    }

    reset()
    {
        this.group.children.each(function (brick: Phaser.Physics.Arcade.Image) {

            brick.enableBody(false, 0, 0, true, true);

        });
    }

    hitBrick(ball: Phaser.Physics.Arcade.Image, brick: Phaser.Physics.Arcade.Image)
    {
        brick.disableBody(true, true);

        if (this.group.countActive() === 0)
        {
            this.emit("bricksDestroyed");
        }
    }

};