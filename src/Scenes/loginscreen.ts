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

      this.add.text(10, 300, 'Enter your name:', { font: '48px Courier', backgroundColor : '#303030' });

      let bar = this.add.graphics();
      bar.fillStyle(0x303030, 1.0);
      bar.fillRect(10, 350, 600, 50);


      let textEntry = this.add.text(10, 350, '', { font: '48px Courier', backgroundColor: '#303030' });
    
  
      this.input.keyboard.on('keydown', function (event) {
  
          if (event.keyCode === 8 && textEntry.text.length > 0)
          {
              textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
          }
          else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
          {
              textEntry.text += event.key;
          }
      });
  
    }
}

export default LoginScreen;
