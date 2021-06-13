//import * as poseDetection from '@tensorflow-models/pose-detection';

export type CameraParam = {
    'targetFPS' : number;
    'sizeOption' : string;
}

export class Camera {
    videoId : string;
    outputId : string;
    context : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    video : HTMLVideoElement;

    private constructor( id: string, outId : string ) {
        this.videoId = id;
        this.outputId = outId;
        this.video = document.getElementById( id ) as HTMLVideoElement;
        this.canvas = document.getElementById( outId ) as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    static async factory( videoId : string, outputId : string , cameraParam : CameraParam ) {
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
        const camera = new Camera( videoId, outputId );
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

        camera.canvas.width = videoWidth;
        camera.canvas.height = videoHeight;
        const canvasContainer = document.querySelector(".canvas-wrapper") as HTMLDivElement;
        canvasContainer!.setAttribute( 'style', `width: ${videoWidth}px; height: ${videoHeight}px` );
        camera.context.translate( camera.video.videoWidth, 0 );
        camera.context.scale(-1,1);

        return camera;
    }

    drawContext( ) {
        this.context.drawImage( this.video, 0, 0, this.video.videoWidth, this.video.videoHeight );
    }

    clearContext( ) {
        this.context.clearRect( 0, 0, this.video.videoWidth, this.video.videoHeight );
    }    
}
