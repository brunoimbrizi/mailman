import AppTwo from './AppTwo';
import AppThree from './AppThree';
import AppUI from './AppUI';
import AppAudio from '../audio/AppAudio';
import VideoPlayer from './video/VideoPlayer';
import VideoCanvas from './video/VideoCanvas';

export default class AppView {

	constructor(app) {
		this.audio = app.audio;
		this.data = app.data;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		app.on(AppAudio.AUDIO_PLAY, this.onAudioPlay.bind(this));
		app.on(AppAudio.AUDIO_PAUSE, this.onAudioPause.bind(this));

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
			this.initVideo();
			this.initTwo();
			this.initThree();
			this.initUI();
		};

		this.sketch.update = () => {
			this.audio.update();
			this.two.update();
			this.three.update();
			this.video.update();
		};

		this.sketch.draw = () => {
			this.two.draw();
			this.three.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width * 0.5;
			this.hh = this.sketch.height * 0.5;

			this.three.resize();
			this.video.resize();
		};

		this.sketch.touchstart = (e) => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};

		this.sketch.keyup = (e) => {
			if (e.keyCode === 32) {
				if (this.audio.paused) this.audio.play();
				else this.audio.pause();
			}
		};
	}

	initTwo() {
		this.two = new AppTwo(this, this.audio, this.data);
	}

	initThree() {
		// transfer canvas to container3D
		document.querySelector('#container3D').appendChild(this.renderer.domElement);

		this.three = new AppThree(this, this.audio);
	}

	initVideo() {
		// this.video = new VideoPlayer();
		this.video = new VideoCanvas();
	}

	initUI() {
		this.ui = new AppUI(this, this.audio);
	}

	onAudioPlay(e) {
		// console.log('AppView.onAudioPlay', e);
		this.video.play(e.currentTime);
	}

	onAudioPause(e) {
		// console.log('AppView.onAudioPause', e);
		this.video.pause();
	}
}
