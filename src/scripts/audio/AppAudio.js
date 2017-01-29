import EventEmitter from 'events';
require('visibly.js');

export default class AppAudio extends EventEmitter {

	get FFT_SIZE() { return 1024; }

	static get AUDIO_LOAD() { return 'audio-load'; }
	static get AUDIO_DECODE() { return 'audio-decode'; }
	static get AUDIO_PLAY() { return 'audio-play'; }
	static get AUDIO_PAUSE() { return 'audio-pause'; }
	static get AUDIO_END() { return 'audio-end'; }
	static get AUDIO_RESTART() { return 'audio-restart'; }

	constructor() {
		super();

		// check initial state of the AudioContext
		createjs.Sound.initializeDefaultPlugins();
		createjs.Sound.alternateExtensions = ['mp3'];

		this.initGain();
		this.initAnalyser();

		this.play('track');

		if (createjs.Sound.activePlugin.context.state === 'suspended') {
			this.muted = true;
		}

		createjs.Sound.activePlugin.context.onstatechange = () => {
			if (createjs.Sound.activePlugin.context.state === 'running') {
				this.unmute();
			}
		};

		// pause/resume with page visibility
		visibly.onHidden(() => {
			this.wasMuted = this.muted;
			this.mute();
		});

		visibly.onVisible(() => {
			if (!this.wasMuted) this.unmute();
		});
	}

	initGain() {
		const context = createjs.Sound.activePlugin.context;

		this.gainNode = context.createGain();
		this.gainNode.gain.value = 0.0;
		this.gainNode.connect(context.destination);
	}

	initAnalyser() {
		const context = createjs.Sound.activePlugin.context;

		// create an analyser node
		this.analyserNode = context.createAnalyser();
		this.analyserNode.fftSize = this.FFT_SIZE;
		this.analyserNode.smoothingTimeConstant = 0.85;
		this.analyserNode.connect(this.gainNode);

		this.levelsCount = 32;
		this.levelsData = [];

		this.binCount = this.analyserNode.frequencyBinCount; // FFT_SIZE / 2 
		this.binsPerLevel = Math.floor(this.binCount / this.levelsCount);

		this.freqByteData = new Uint8Array(this.binCount);

		this.peakCutOff = 0.35;
		this.peakLast = 0;
		this.peakDecay = 0.99;
		this.peakInterval = 30; // frames
		this.peakElapsed = 0;
		this.peakDetectIndex = 10; // average = -1

		// attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
		const dynamicsNode = createjs.Sound.activePlugin.dynamicsCompressorNode;
		dynamicsNode.disconnect();  // disconnect from destination
		dynamicsNode.connect(this.analyserNode);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	play(name) {
		// if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));

		if (!this.player) {
			this.player = createjs.Sound.play(name);
			this.player.pausedAt = 0;
		}

		this.player.ended = false;
		this.player.paused = false;

		this.player.startedAt = Date.now() - this.player.pausedAt;
		// this.sourceNode.start(0, this.pausedAt / 1000);

		this.emit(AppAudio.AUDIO_PLAY, { currentTime: this.player.pausedAt });
	}

	pause() {
		this.player.pausedAt = Date.now() - this.player.startedAt;
		this.player.paused = true;

		this.emit(AppAudio.AUDIO_PAUSE, { currentTime: this.player.pausedAt });
	}

	seek(time) {
		/*
		if (time == undefined) return;
		if (time > this.buffer.duration) return;

		this.ended = false;

		if (!this.paused) {
			this.sourceNode.onended = null;
			this.sourceNode.stop(0);
		}
		this.pausedAt = time * 1000;
		if (!this.paused) this.play();
		*/
	}

	mute() {
		this.pause();
		this.muted = true;
	}

	unmute() {
		if (this.player.paused) this.play();
		this.muted = false;
	}

	update() {
		if (this.player.paused) return;

		this.updateFrequencyData();
		this.detectPeak(this.peakDetectIndex);

		// set current time
		if (this.player && !this.player.ended) {
			this.player.currentTime = (this.player.paused) ? this.player.pausedAt : Date.now() - this.player.startedAt;
			// this.currentTime *= this.playbackRate;
		}
	}

	updateFrequencyData() {
		this.analyserNode.getByteFrequencyData(this.freqByteData);

		// normalize
		for (let i = 0; i < this.levelsCount; i++) {
			let sum = 0;
			for (let j = 0; j < this.binsPerLevel; j++) {
				sum += this.freqByteData[(i * this.binsPerLevel) + j];
			}

			// freqByteData values go from 0 to 256
			this.levelsData[i] = sum / this.binsPerLevel / 256;
		}

		// average level
		let sum = 0;
		for(let i = 0; i < this.levelsCount; i++) {
			sum += this.levelsData[i];
		}

		this.avgLevel = sum / this.levelsCount;
	}

	detectPeak(index) {
		// default is average
		let value = this.avgLevel;
		// but it can be any level
		if (index > 0 && index < this.levelsCount) {
			value = this.levelsData[index];
		}

		// ignore if last peak happened before the min interval
		if (this.peakElapsed < this.peakInterval) {
			this.peakElapsed++;
			return;
		}

		// new peak
		if (value > this.peakLast && value > this.peakCutOff) {
			this.onPeak();
			this.peakLast = value * 1.2;
			this.peakElapsed = 0;
		} else {
			this.peakLast *= this.peakDecay;
		}
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onPeak() {
		this.emit(AppAudio.AUDIO_PEAK);
	}

	/*
	onRequestProgress(e) {
		// console.log('AppAudio.onRequestProgress', e, app.view.ui)
		// if (app.view.ui) app.view.ui.loader.onLoadProgress(e);
	}

	onRequestLoad(e) {
		// console.log('AppAudio.onRequestLoad', e);
		// if (app.view.ui) app.view.ui.loader.onLoadComplete(e);

		this.ctx.decodeAudioData(e.target.response, this.onBufferLoaded.bind(this), this.onBufferError.bind(this));

		this.emit(AppAudio.AUDIO_LOAD);
	}

	onBufferLoaded(buffer) {
		this.buffer = buffer;

		// app.view.ui.loader.onDecodeComplete()
		// app.view.ui.player.show()

		this.loaded = true;
		this.duration = this.buffer.duration * 1000;
		// this.duration = this.buffer.duration * 1000 * this.playbackRate;
		// this.play();

		this.emit(AppAudio.AUDIO_DECODE);
	}

	onBufferError(e) {
		// console.log('AppAudio.onBufferError', e)
		// app.view.ui.loader.onError(e);
	}

	onSourceEnded(e) {
		// console.log('AppAudio.onSourceEnded', this.paused)
		if (this.paused) return;
		this.currentTime = this.duration;
		this.ended = true;
		this.paused = true;
		this.pausedAt = 0;

		// window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
	}
	*/

}
