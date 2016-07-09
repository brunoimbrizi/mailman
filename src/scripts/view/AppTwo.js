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
			autoclear: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});
	}

	update() {
		// this.bars.update(this.audio.values);
	}

	draw() {
		this.sketch.clear();
		this.bars.draw(this.audio.values);
	}

	initAudioBars() {
		this.bars = new AudioBars(this.sketch);
	}
}