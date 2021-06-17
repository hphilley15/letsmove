//import * as poseDetection from '@tensorflow-models/pose-detection';

export type JBCameraParam = {
    'targetFPS' : number;
    'sizeOption' : string;
}

export class JBCamera {
    videoId : string;
    canvas : HTMLCanvasElement;
    video : HTMLVideoElement;

    private constructor( id: string ) {
        this.videoId = id;
        this.video = document.getElementById( id ) as HTMLVideoElement;
    }

    drawContext( ctx : CanvasRenderingContext2D ) {
        console.log(`JBCamera.drawImage ${this.video.videoWidth}, ${this.video.videoHeight}`);
        ctx.drawImage( this.video, 0, 0, this.video.videoWidth, this.video.videoHeight );
    }

    clearContext( ctx : CanvasRenderingContext2D ) {
        ctx.fillStyle = this.randomRGBA();
        console.log(`JBCamera.clearContext ${this.video.videoWidth}, ${this.video.videoHeight}`);
        ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
    }

    randomRGBA() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }

    static async factory( videoId : string, cameraParam : JBCameraParam ) {
        if ( ( ! navigator.mediaDevices ) || ( ! navigator.mediaDevices.getUserMedia ) ) {
            throw new Error("No video camera available");
        }

        const { targetFPS, sizeOption } = cameraParam;
        const videoConfig : MediaStreamConstraints = {
            'audio' : false,
            'video' : {
                facingMode : 'user',
                width: 360,
                height: 270,
                frameRate: {
                    ideal: targetFPS
                }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia( videoConfig );
        const camera = new JBCamera( videoId );
        camera.video.srcObject = stream;
        await new Promise( resolve => {
            camera.video.onloadedmetadata = () => {
                resolve(camera.video);
            };
        });
        camera.video.play();
        const videoWidth = camera.video.videoWidth;
        const videoHeight = camera.video.videoHeight;

        camera.video.width = videoWidth;
        camera.video.height = videoHeight;

        // camera.canvas.width = videoWidth;
        // camera.canvas.height = videoHeight;
        // const canvasContainer = document.querySelector(".canvas-wrapper") as HTMLDivElement;
        // canvasContainer!.setAttribute( 'style', `width: ${videoWidth}px; height: ${videoHeight}px` );
        // camera.context.translate( camera.video.videoWidth, 0 );
        // camera.context.scale(-1,1);

        return camera;
    }
}
