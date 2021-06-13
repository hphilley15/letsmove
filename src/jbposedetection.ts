import * as poseDetection from '@tensorflow-models/pose-detection';
import { findBackendFactory } from '@tensorflow/tfjs-core';

export class JBPoseDetection {
    videoElement : HTMLVideoElement;
    detector : any;

    private constructor( video : string ) {
        const vel = document.getElementById(video);
        this.videoElement = vel as HTMLVideoElement;
    }

    static async factory( video : string ) {
        const poser = new JBPoseDetection( video );
        poser.detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING } );
        return poser;
    }

    async getPoses() {
        const poses = await this.detector.estimatePoses( this.videoElement );
        return poses;
    }
}
