import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
import { JBCamera, JBCameraParam } from "./jbcamera";
import { LoginScreen } from './Scenes/loginscreen';
import * as Phaser from "phaser";
import { PreLoader } from './Scenes/preloader';
import { Boot } from './Scenes/boot';
import { MainScreen } from './Scenes/mainscreen';
//import axios from "axios";

const config = {
  type: Phaser.AUTO,
  parent: "NTNU ERC Let's Move",
  width: 800,
  height: 600,
  backgroundColor : 'rgba(71, 15, 15, 1.0)',
  scene: [Boot, PreLoader, LoginScreen, MainScreen ],
  scale : {
    mode: Phaser.Scale.FIT,
    autocenter: Phaser.Scale.CENTER_BOTH,
  },
};


// async function sendMessage( user: string, message : string ) {
//   let json = {
//     "content" : `User ${user} joined the game`,
//     'username' : user,
//   }

//   axios.post( 'https://discordapp.com/api/webhooks/865547231335022602/V4GCCeTOWZYeUbuiTrZXse9kx7jLhUlWVK2VuImkZPgwPRaIiAmQraaIp-s_bcJ7J9Rx/?wait=true',
//   { headers: { 'User-Agent': 'Not a browser'},
//     payload_json : JSON.stringify( json ) }
//    ).then( (response) => {
//      console.log('response', response);
//    }).catch( (error) => {
//     console.log('err', error);
//    });
// }

function main() {
  // let options = {
  //   method: 'GET',
  //   url: 'https://discord.com/api/webhooks/865547231335022602/V4GCCeTOWZYeUbuiTrZXse9kx7jLhUlWVK2VuImkZPgwPRaIiAmQraaIp-s_bcJ7J9Rx'
  // };

  // axios.get( 'https://discord.com/api/webhooks/865547231335022602/V4GCCeTOWZYeUbuiTrZXse9kx7jLhUlWVK2VuImkZPgwPRaIiAmQraaIp-s_bcJ7J9Rx' )
  //   .then( (response ) => {
  //     console.log( 'axiso response', response );
  //     let webhook = response.data;
  //     console.log('webhook' );
  //     console.dir( webhook );

  //     sendMessage( "LM Test", "Hello World").then( () => {
  //       alert("Message send");
  //     } );

      
  //   } )
  //   .catch( (error) => {
  //     console.log( 'axios error', error );
  //   });

  const game = new Phaser.Game(config);
}

main();
