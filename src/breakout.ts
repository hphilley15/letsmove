import 'phaser'
import Ball from './ball'
import Bricks from './bricks'
import Paddle from './paddle'

class Breakout extends Phaser.Scene
{
    bricks: Bricks;
    paddle: Paddle;
    ball: Ball;
    
    constructor(config: Phaser.Types.Core.GameConfig)
    {
        super(config);
    }

    preload()
    {
        this.load.atlas('assets', 'images/breakout.png', 'images/breakout.json');
    }

    create()
    {
        //  Enable world bounds, but disable the floor
        this.physics.world.setBoundsCollision(true, true, true, false);

        this.bricks = new Bricks(this);
        this.paddle = new Paddle(this);
        this.ball = new Ball(this);

        //  Our colliders
        this.physics.add.collider(this.ball.image, this.bricks.group, this.bricks.hitBrick.bind(this.bricks), null, this);
        this.physics.add.collider(this.ball.image, this.paddle.image, this.ball.hitPaddle.bind(this.paddle), null, this);

        // Events
        this.bricks.on("bricksDestroyed", this.resetLevel.bind(this));
        this.paddle.on("paddleMoved", this.ball.paddleMoved.bind(this.ball));
        this.ball.on("outOfBounds", this.outOfBounds.bind(this));
    }

    resetLevel()
    {
        this.ball.reset(this.paddle.image);
        this.bricks.reset();
    }

    outOfBounds()
    {
        this.ball.reset(this.paddle.image);
    }

    update()
    {
        this.ball.update();
    }

};

var config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Breakout ],
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);