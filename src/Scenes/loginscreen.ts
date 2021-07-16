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

    create() {
      const logo = this.add.image(700, 150, "logo");   
      this.tweens.add({
        targets: logo,
        y: 500,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
      });

      this.add.text(10, 200, 'Enter your name:', { font: '48px Courier', backgroundColor : '#303030' } );

      let bar = this.add.graphics();
      bar.fillStyle(0x303030, 1.0);
      bar.fillRect(10, 250, 600, 50);

      let textEntry = this.add.text(10, 250, '', { font: '48px Courier', backgroundColor: '#303030' } );
  
      this.input.keyboard.on('keydown', (event) => {
          console.log( `event.keyCode ${event.keyCode}`);

          if (event.keyCode === 8 && textEntry.text.length > 0)
          {
              textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
          }
          else if (event.keyCode == 13 ) {
            this.scene.start( 'main_screen' );
          } 
          else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) 
          {
              textEntry.text += event.key;
          }
      });
  
      this.button = this.add.text( 500, 320, "Done", { font: '48px Courier', backgroundColor: '#D9E23D' } )
        .setInteractive()
        .on('pointerdown', () => this.scene.start( 'main_screen' ) );
    }
}

export { LoginScreen };
