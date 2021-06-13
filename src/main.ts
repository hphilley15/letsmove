import {Hello} from "./hello";
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
import {Camera, CameraParam } from "./camera";
import { JBPoseDetection } from "./jbposedetection";

Hello();
// Create a detector.

// async function detectLoop( video ) {
//     const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
//     const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);


//     const video = document.getElementById('video') as poseDetection.PoseDetectorInput;
//     const poses = await detector.estimatePoses(video);
//     return poses;
// }

function main() {
    const params : CameraParam = { 'targetFPS' : 60, 'sizeOption' : "" };
    
    const jbpose = JBPoseDetection.factory( "video" ).then( (jbpose) => {
        const camera = Camera.factory("video", "output", params ).then( 
            (camera) => {
                setInterval( () => {
                    console.log("draw context");
                    //camera.drawContext( );
                    const poses = jbpose.getPoses().then( (poses) => {
                        console.log(poses[0].keypoints)
                    });
                }, 100 );
            }
        );    
    });
}

main();
