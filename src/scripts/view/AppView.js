import AppTwo from './AppTwo';
import AppThree from './AppThree';
import AppUI from './AppUI';

export default class AppView {

	constructor(app) {
		this.audio = app.audio;
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
			this.initTwo();
			this.initThree();
			this.initUI();
		};

		this.sketch.update = () => {
			this.audio.update();
			this.two.update();
			this.three.update();
		};

		this.sketch.draw = () => {
			this.two.draw();
			this.three.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width * 0.5;
			this.hh = this.sketch.height * 0.5;

			this.three.resize();
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
		this.two = new AppTwo(this, this.audio);
	}

	initThree() {
		// transfer canvas to container3D
		document.querySelector('#container3D').appendChild(this.renderer.domElement);

		this.three = new AppThree(this);
	}

	initUI() {
		this.ui = new AppUI(this, this.audio);
	}
}
