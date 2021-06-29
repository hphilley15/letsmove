import * as Phaser from 'phaser';

class PreLoader extends Phaser.Scene{
    constructor() {
        super({
            key: 'PreLoader'
        })
    };
    
    init() {
       console.log("PreLoader.init");
       
       this.load.on('progress', (value) => {
        console.log(`progress ${value}`);
        this.percentText.setText( (value * 100).toString() + '%');
        
        this.progressBar = this.add.graphics();
        
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(250, 280, 300 * value, 30);
       });

       this.load.on('fileprogress', (file) => {
        console.log(`fileprogress ${file.src}`);
        this.assetText.setText('Loading asset: ' + file.src);
       });

       this.load.on('complete', () => {
        console.log(`complete`);
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();
        this.assetText.destroy();

        this.scene.start( 'LoginScreen' );
       });
    };

    private progressBar : Phaser.GameObjects.Graphics = null;
    private progressBox : Phaser.GameObjects.Graphics = null;
    private loadingText : Phaser.GameObjects.Text = null;
    private percentText : Phaser.GameObjects.Text = null;
    private assetText : Phaser.GameObjects.Text = null;

    preload() {
      this.load.image("logo", 'assets/images/ntnuerc-logo-1.png');
      this.load.audio("beep", 'assets/audio/beep_ping.wav');

//      this.load.image("logo", 'assets/images/ntnuerc-logo-1.png'); 
      this.load.image( "target", 'assets/images/target.png' );

      var width = this.cameras.main.width;
      var height = this.cameras.main.height;
      this.loadingText = this.make.text({
          x: width / 2,
          y: height / 2 - 50,
          text: 'Loading...',
          style: {
              font: '20px monospace',
          }
      });
      this.loadingText.setOrigin(0.5, 0.5);

      this.percentText = this.make.text({
          x: width / 2,
          y: height / 2 - 5,
          text: '0%',
          style: {
              font: '18px monospace',
          }
      });
      this.percentText.setOrigin(0.5, 0.5);

      this.assetText = this.make.text({
          x: width / 2,
          y: height / 2 + 50,
          text: '',
          style: {
              font: '18px monospace',
          }
      });
      this.assetText.setOrigin(0.5, 0.5);

      this.progressBox = this.add.graphics();
      this.progressBox.fillStyle(0x222222, 0.8);
      this.progressBox.fillRect(340, 370, 320, 50);
    }

    create() {
      const logo = this.add.image(400, 150, "logo");   
      const text = this.add.text(20, 450, "Let's Move");
      this.tweens.add({
        targets: logo,
        y: 300,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
      });
    }
}

export default PreLoader;
