import * as Phaser from 'phaser';

class LoginScreen extends Phaser.Scene{
    constructor() {
        super({
            key: 'LoginScreen'
        })
    };
    
    init() {
       console.log("LoginScreen.init");
       
    };

    preload() {
      this.load.image("logo", 'assets/images/ntnuerc-logo-1.png');
    }

    button : Phaser.GameObjects.Text;

    textEntry : Phaser.GameObjects.Text;

    create() {
      let tWidth = window.innerWidth;
      let tHeight = window.innerHeight;

      const logo = this.add.image(0, 0, "logo");   
      logo.setOrigin(0.5,0);

      this.tweens.add({
        targets: logo,
        x: 1.0 * tWidth,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
      });

      this.add.text(0.01*tWidth, 0.5*tHeight, 'Enter your name:', { font: '48px Courier', backgroundColor : '#303030' } );

      let bar = this.add.graphics();
      bar.fillStyle(0x303030, 1.0);
      bar.fillRect(0.01*tWidth, 0.5*tHeight+50, tWidth, 50);

      this.textEntry = this.add.text(0.01*tWidth, 0.5*tHeight+50, this.createRandomName(), { font: '48px Courier', backgroundColor: '#303030' } );
  
      this.input.keyboard.on('keydown', (event) => {
          console.log( `event.keyCode ${event.keyCode}`);

          if ( ( event.keyCode === 8 ) && ( this.textEntry.text.length > 0) ) {
            this.textEntry.text = this.textEntry.text.substr(0, this.textEntry.text.length - 1);
          } else if (event.keyCode == 13 ) {
            this.nextScreen( );
          } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
            this.textEntry.text += event.key;
          }
      });
  
      this.button = this.add.text( 0.01*tWidth, 0.9*tHeight, "Done", { font: '48px Courier', backgroundColor: '#D9E23D' } )
        .setInteractive()
        .on('pointerdown', () => this.nextScreen( ) );
    }

    nextScreen( ) {
      this.registry.set( 'userName', this.textEntry.text );
      this.scene.start( 'main_screen' );
    }

    createRandomName( ) {
      return "John Doe"
    }
}

export { LoginScreen };
