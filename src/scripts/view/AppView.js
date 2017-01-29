import AppAudio from '../audio/AppAudio';

import UIView from './ui/UIView';
import WebGLView from './webgl/WebGLView';
import VideoPlayer from './video/VideoPlayer';
// import VideoCanvas from './video/VideoCanvas';

export default class AppView {

	constructor() {
		this.audio = app.audio;
		this.data = app.data;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.initSketch();
	}

	initSketch() {
		this.sketch = Sketch.create({
			type: Sketch.WEBGL,
			element: this.renderer.domElement,
			context: this.renderer.context,
			autopause: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});

		this.sketch.setup = () => {
			// this.initVideo();
			this.initWebGL();
			this.initUI();

			// this.addListeners();
		};

		this.sketch.update = () => {
			this.audio.update();
			this.webgl.update();
			// this.video.update();
		};

		this.sketch.draw = () => {
			this.ui.draw();
			this.webgl.draw();
		};

		this.sketch.resize = () => {
			this.webgl.resize();
			// this.video.resize();
		};

		this.sketch.touchstart = (e) => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};

		this.sketch.keyup = (e) => {
			// console.log(e.keyCode);

			if (e.keyCode == 68) { //d
				this.ui.toggle();
			}

			if (e.keyCode === 32) { // space
				if (this.audio.player.paused) this.audio.play();
				else this.audio.pause();
			}
		};
	}

	initTwo() {
		this.two = new AppTwo(this, this.audio, this.data);
	}

	initWebGL() {
		// transfer canvas to container3D
		document.querySelector('#container').appendChild(this.renderer.domElement);

		this.webgl = new WebGLView();
	}

	initVideo() {
		this.video = new VideoPlayer();
		// this.video = new VideoCanvas();
	}

	initUI() {
		this.ui = new UIView();
	}

	addListeners() {
		this.audio.on(AppAudio.AUDIO_LOAD, this.onAudioLoad.bind(this));
		this.audio.on(AppAudio.AUDIO_DECODE, this.onAudioDecode.bind(this));
		this.audio.on(AppAudio.AUDIO_PLAY, this.onAudioPlay.bind(this));
		this.audio.on(AppAudio.AUDIO_PAUSE, this.onAudioPause.bind(this));

		this.video.on(VideoPlayer.VIDEO_CANPLAY, this.onVideoCanPlay.bind(this));
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	show() {
		// console.log('AppView.show', this.audioReady, this.videoReady);
		if (!this.audioReady) return;
		if (!this.videoReady) return;

		// start audio (which starts video)
		this.audio.play();

		// TEMP
		document.querySelector('#status').innerText = '';
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onAudioLoad(e) {
		// console.log('AppView.onAudioLoad', e);

		// TEMP
		document.querySelector('#status').innerText = 'decoding audio';
	}

	onAudioDecode(e) {
		// console.log('AppView.onAudioDecode', e);
		// this.video.play(e.currentTime);
		this.audioReady = true;
		this.show();
	}

	onAudioPlay(e) {
		// console.log('AppView.onAudioPlay', e);
		this.video.play(e.currentTime);
	}

	onAudioPause(e) {
		// console.log('AppView.onAudioPause', e);
		this.video.pause();
	}

	onVideoCanPlay(e) {
		console.log('AppView.onVideoCanPlay', e);
		this.videoReady = true;
		this.show();
	}
}
