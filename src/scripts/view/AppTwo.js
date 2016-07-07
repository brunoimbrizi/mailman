import AudioBars from './bars/AudioBars';

export default class AppTwo {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.initSketch();
		this.initAudioBars();
	}

	initSketch() {
		this.sketch = Sketch.create({
			type: Sketch.CANVAS,
			container: document.querySelector('#container2D'),
			autopause: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});
	}

	update() {
		this.bars.update();
	}

	draw() {
		this.bars.draw();
	}

	initAudioBars() {
		this.bars = new AudioBars(this.sketch);
	}
}