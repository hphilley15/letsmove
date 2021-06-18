import {Hello} from "./hello";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
import { JBCamera, JBCameraParam } from "./jbcamera";
import { JBPoseDetection } from "./jbposedetection";

import * as Phaser from "phaser";
import PreLoader from './Scenes/preloader';
import Boot from './Scenes/boot';
import MainScreen from './Scenes/mainscreen';

const config = {
  type: Phaser.AUTO,
  parent: "NTNU ERC Let's Move",
  width: 800,
  height: 600,
  backgroundColor : 'rgba(71, 15, 15, 1.0)',
  scene: [Boot, PreLoader, MainScreen ],
  scale : {
    mode: Phaser.Scale.FIT,
    autocenter: Phaser.Scale.CENTER_BOTH,
  }
};

const game = new Phaser.Game(config);
