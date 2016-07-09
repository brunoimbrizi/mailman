export default class AppAudio {

	get FFT_SIZE() { return 1024; }
	get BINS() { return 128; }

	get EVENT_AUDIO_ENDED() { return 'audioEnded'; }
	get EVENT_AUDIO_RESTARTED() { return 'audioRestarted'; }

	constructor() {
		this.initContext();
		this.initGain();
		this.initAnalyser();

		this.load('audio/04 - Soundgarden - Mailman.mp3');
	}

	initContext() {
		if (window.AudioContext === void 0) window.AudioContext = window.webkitAudioContext;
		this.ctx = new AudioContext();
	}

	initGain() {
		this.gainNode = this.ctx.createGain();
		this.gainNode.gain.value = 0.0;
		this.gainNode.connect(this.ctx.destination);
	}

	initAnalyser() {
		this.values = [];

		this.analyserNode = this.ctx.createAnalyser();
		this.analyserNode.smoothingTimeConstant = 0.9;
		this.analyserNode.fftSize = this.FFT_SIZE;
		this.analyserNode.connect(this.gainNode);
		// this.analyserNode.connect(this.ctx.destination); // comment out to start mute
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	load(url) {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onprogress = this.onRequestProgress.bind(this);
		request.onload = this.onRequestLoad.bind(this);
		request.send();
	}

	play() {
		if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));

		this.sourceNode = this.ctx.createBufferSource();
		this.sourceNode.onended = this.onSourceEnded;
		this.sourceNode.connect(this.analyserNode);
		// this.sourceNode.playbackRate.value = this.playbackRate;
		this.sourceNode.buffer = this.buffer;
		this.ended = false;
		this.paused = false;

		if (this.pausedAt) {
			this.startedAt = Date.now() - this.pausedAt;
			this.sourceNode.start(0, this.pausedAt / 1000);
		} else {
			this.startedAt = Date.now();
			this.sourceNode.start(0);
		}
	}

	stop() {
		this.sourceNode.stop(0);
		this.pausedAt = Date.now() - this.startedAt;
		this.paused = true;
	}

	seek(time) {
		if (time == undefined) return;
		if (time > this.buffer.duration) return;

		this.ended = false;

		if (!this.paused) {
			this.sourceNode.onended = null;
			this.sourceNode.stop(0);
		}
		this.pausedAt = time * 1000;
		if (!this.paused) this.play();
	}

	update() {
		const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
		this.analyserNode.getByteFrequencyData(freqData);
		const length = freqData.length;

		const bin = Math.ceil(length / this.BINS);
		for (let i = 0; i < this.BINS; i++) {
			let sum = 0;
			for (let j = 0; j < bin; j++) {
				sum += freqData[(i * bin) + j];
			}

			// Calculate the average frequency of the samples in the bin
			const average = sum / bin;

			// Divide by 256 to normalize
			// this.values[i] = (average / this.BINS) / this.playbackRate;
			this.values[i] = (average / this.BINS);
		}

		// set current time
		if (this.loaded && !this.ended) {
			this.currentTime = (this.paused) ? this.pausedAt : Date.now() - this.startedAt;
			// this.currentTime *= this.playbackRate;
		}
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onRequestProgress(e) {
		// console.log('AppAudio.onRequestProgress', e, app.view.ui)
		// if (app.view.ui) app.view.ui.loader.onLoadProgress(e);
	}

	onRequestLoad(e) {
		// console.log('AppAudio.onRequestLoad', e);
		// if (app.view.ui) app.view.ui.loader.onLoadComplete(e);

		this.ctx.decodeAudioData(e.target.response, this.onBufferLoaded.bind(this), this.onBufferError.bind(this));
	}

	onBufferLoaded(buffer) {
		this.buffer = buffer;

		// app.view.ui.loader.onDecodeComplete()
		// app.view.ui.player.show()

		this.loaded = true;
		this.duration = this.buffer.duration * 1000;
		// this.duration = this.buffer.duration * 1000 * this.playbackRate;
		this.play();
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

		window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
	}

}
