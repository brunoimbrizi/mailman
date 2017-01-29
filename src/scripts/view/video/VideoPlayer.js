import EventEmitter from 'events';

export default class VideoPlayer extends EventEmitter {

	static get VIDEO_CANPLAY() { return 'video-canplay'; }

	constructor() {
		super();

		// get video from DOM
		this.video = document.querySelector('video');
		
		// remove video from DOM
		document.querySelector('body').removeChild(this.video);

		// create video element
		// this.video = document.createElement('video');
		// this.video.src = 'video/Sequence 256x256.mp4';
		// this.video.width = this.video.height = 256;

		// store original video size
		this.videoWidth = this.video.width;
		this.videoHeight = this.video.height;

		// clear width and height attributes from video tag
		this.video.removeAttribute('width');
		this.video.removeAttribute('height');

		this.handlerCanPlay = this.onCanPlay.bind(this);
		this.video.addEventListener('canplay', this.handlerCanPlay);

		this.resize();
	}

	play(time) {
		// console.log('VideoPlayer.play', time);
		this.video.currentTime = time * 0.001;
		this.video.play();
	}

	pause() {
		// console.log('VideoPlayer.pause');
		this.video.pause();
	}

	resize() {
		return;

		// window size
		const ww = window.innerWidth;
		const wh = window.innerHeight;

		// video size
		const vw = this.videoWidth;
		const vh = this.videoHeight;

		// scale favouring width or height, whatever is smaller
		let scale = ww / vw;
		if (vh * scale < wh) scale = wh / vh;

		// new size
		const nw = Math.ceil(vw * scale);
		const nh = Math.ceil(vh * scale);

		// scale to screen
		this.video.style.width = `${nw}px`;
		// this.$container.style.width = `${nw}px`;
		// this.$container.style.height = `${nh}px`;

		const marginh = Math.ceil((wh - nh) / 2);
		const marginw = Math.ceil((ww - nw) / 2);

		// center
		this.video.style.marginLeft = `${marginw}px`;
		this.video.style.marginTop = `${marginh}px`;
	}

	onCanPlay(e) {
		this.emit(VideoPlayer.VIDEO_CANPLAY, e);

		// just once
		this.video.removeEventListener('canplay', this.handlerCanPlay);
	}

}
