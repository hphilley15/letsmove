//import * as poseDetection from '@tensorflow-models/pose-detection';
import { isMobile } from "./utils";

type JBCameraParam = {
    'targetFPS' : number;
    'sizeOption' : { width: number, height: number };
}

class JBCamera {
    videoId : string;
    canvas : HTMLCanvasElement;
    video : HTMLVideoElement;

    private constructor( id: string ) {
        this.videoId = id;
        this.video = document.getElementById( id ) as HTMLVideoElement;
    }

    drawContext( ctx : CanvasRenderingContext2D, x : number, y : number, width : number, height : number  ) {
        //console.log(`JBCamera.drawImage ${width}, ${height}`);
        ctx.drawImage( this.video, x, y, width, height );
    }

    clearContext( ctx : CanvasRenderingContext2D, x : number, y : number, width : number, height : number, color : string ) {
        ctx.fillStyle = color;
        //console.log(`JBCamera.clearContext ${ctx} ${width}, ${height}`);
        ctx.fillRect( x, y,width, height );
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
                width: { max: sizeOption.width }, 
                height: { max: sizeOption.height },
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
        
        console.log(`camera ${camera.video.width}x${camera.video.height}`);

        // camera.canvas.width = videoWidth;
        // camera.canvas.height = videoHeight;
        // const canvasContainer = document.querySelector(".canvas-wrapper") as HTMLDivElement;
        // canvasContainer!.setAttribute( 'style', `width: ${videoWidth}px; height: ${videoHeight}px` );
        // camera.context.translate( camera.video.videoWidth, 0 );
        // camera.context.scale(-1,1);

        return camera;
    }
}

export {JBCamera, JBCameraParam };