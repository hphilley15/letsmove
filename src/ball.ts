export default class Ball extends Phaser.GameObjects.GameObject
{
    image: Phaser.Physics.Arcade.Image;
    onPaddle: Boolean;
    
    constructor(scene: Phaser.Scene)
    {
        super(scene, "ball");

        this.create();
    }

    create()
    {
        this.image = this.scene.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
        this.onPaddle = true;

        this.scene.input.on('pointerup', function () {

            if (this.onPaddle)
            {
                this.image.setVelocity(-75, -300);
                this.onPaddle = false;
            }

        }, this);
    }

    reset(paddleImage: Phaser.Physics.Arcade.Image)
    {
        this.image.setVelocity(0);
        this.image.setPosition(paddleImage.x, 500);
        this.onPaddle = true;
    }

    hitPaddle(ballImage: Phaser.Physics.Arcade.Image, paddleImage: Phaser.Physics.Arcade.Image)
    {
        var diff = 0;

        if (ballImage.x < paddleImage.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = paddleImage.x - ballImage.x;
            ballImage.setVelocityX(-10 * diff);
        }
        else if (ballImage.x > paddleImage.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = ballImage.x -paddleImage.x;
            ballImage.setVelocityX(10 * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ballImage.setVelocityX(2 + Math.random() * 8);
        }
    }

    paddleMoved(paddleImage: Phaser.Physics.Arcade.Image)
    {
        if (this.onPaddle)
        {
            this.image.x = paddleImage.x;
        }
    }

    update()
    {
        if (this.image.y > 600)
        {
            this.emit("outOfBounds");
        }
    }

};