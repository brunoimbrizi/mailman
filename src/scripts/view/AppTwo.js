import AudioBars from './bars/AudioBars';
import AudioTrail from './trail/AudioTrail';

export default class AppTwo {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.initSketch();
		this.initAudioBars();
		this.initAudioTrail();
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
		this.bars.draw();
		this.trail.draw();
	}

	initAudioBars() {
		this.bars = new AudioBars(this.sketch, this.audio);
	}

	initAudioTrail() {
		this.trail = new AudioTrail(this.sketch, this.audio);
	}
}