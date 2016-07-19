import VideoPlayer from './VideoPlayer';

export default class VideoCanvas {

	constructor() {
		this.initVideo();
		this.initCanvas();
	}

	initVideo() {
		this.videoPlayer = new VideoPlayer();
	}

	initCanvas() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.videoPlayer.videoWidth;
		this.canvas.height = this.videoPlayer.videoHeight;

		this.ctx = this.canvas.getContext('2d');

		// TEMP: append
		document.querySelector('body').appendChild(this.canvas);
	}

	update() {
		if (this.videoPlayer.video.paused || this.videoPlayer.video.ended) return;
		
		this.ctx.drawImage(this.videoPlayer.video, 0, 0, this.canvas.width, this.canvas.width);
		let frame = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		// console.log(frame.data.length);
	}

	play(time) {
		this.videoPlayer.play(time);
	}

	pause() {
		this.videoPlayer.pause();
	}

	resize() {

	}

}
