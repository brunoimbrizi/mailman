import AudioBars from './bars/AudioBars';
import AudioTrail from './trail/AudioTrail';
import SimpleLyrics from './lyrics/SimpleLyrics';

export default class AppTwo {

	constructor(view, audio, data) {
		this.view = view;
		this.audio = audio;
		this.data = data;

		this.initSketch();
		this.initAudioBars();
		this.initAudioTrail();
		this.initSimpleLyrics();
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
		this.lyrics.update();
	}

	draw() {
		this.sketch.clear();
		this.bars.draw();
		this.trail.draw();
		this.lyrics.draw();
	}

	initAudioBars() {
		this.bars = new AudioBars(this.sketch, this.audio);
	}

	initAudioTrail() {
		this.trail = new AudioTrail(this.sketch, this.audio);
	}

	initSimpleLyrics() {
		this.lyrics = new SimpleLyrics(this.sketch, this.audio, this.data);
	}
}