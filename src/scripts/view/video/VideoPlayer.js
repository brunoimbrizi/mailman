export default class VideoPlayer {

	constructor() {
		this.video = document.querySelector('video');

		// store original video size
		// this.videoWidth = this.video.width;
		// this.videoHeight = this.video.height;
		this.videoWidth = 256;
		this.videoHeight = 169;

		// clear width and height attributes from video tag
		this.video.removeAttribute('width');
		this.video.removeAttribute('height');

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

}
