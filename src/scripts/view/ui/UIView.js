import DebugAudioView from './DebugAudioView'; 

export default class UIView {

	constructor() {
		this.view = app.view;
		this.audio = app.audio;

		this.volume = 0.0;
		this.audioSmoothing = this.audio.analyserNode.smoothingTimeConstant;
		this.audioPeakDecay = this.audio.peakDecay;
		this.audioPeakInterval = this.audio.peakInterval;
		this.audioPeakCutOff = this.audio.peakCutOff;
		this.audioPeakDetectIndex = this.audio.peakDetectIndex;
		this.audioDebugVisible = true;
		
		this.range = [0, 1];
		this.rangeDecay = [0.9, 1.0];
		this.rangeInterval = [0, 60];
		this.rangeDetect = [-1, this.audio.levelsCount - 1];

		// this.barsVisible = this.view.two.bars.visible;
		// this.trailVisible = this.view.two.trail.visible;

		this.freeCamera = true;
		// this.threeVisible = this.view.three.visible;

		this.cloudZa = 50;
		this.cloudZb = this.cloudZa;
		this.showVideoCanvas = false;

		// this.visible = true;

		this.initControlKit();
		this.initDebugAudio();
	}

	initControlKit() {
		const that = this;

		this.controlKit = new ControlKit();
		/*
		this.controlKit.addPanel({ label: 'MeshPhysicalMaterial', width: 300 })
		// .addStringInput(this, 'str', { label: 'String' })
		// .addNumberInput(this, 'number', { label: 'Number' })
		// .addSlider(this, 'value', 'valueRange', { label: 'Value' })
		// .addRange(this, 'valueRange', { label: 'Value Range' })
		// .addCheckbox(this, 'bool', { label: 'Bool' })
		// .addSelect(this, 'select', { label: 'Option', onChange: (index) => {
			// console.log(index);
		// } }	);
		*/

		this.controlKit.addPanel({ width: 300 })

		.addGroup({label: 'Audio', enable: true })
		.addSlider(this, 'volume', 'range', { onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioSmoothing', 'range', { label: 'smoothing', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakDecay', 'rangeDecay', { label: 'peak decay', dp: 3, onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakInterval', 'rangeInterval', { label: 'peak interval', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakCutOff', 'range', { label: 'peak cutoff', onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'audioPeakDetectIndex', 'rangeDetect', { label: 'peak index', step: 1, dp: 0, onChange: () => { that.onAudioChange(); } })
		// .addCheckbox(this, 'audioDebugVisible', { label: 'debug' })

		/*
		.addGroup({label: 'Two', enable: false })
		// .addCheckbox(this, 'barsVisible', { onChange: () => { that.onTwoChange(); } })
		// .addCheckbox(this, 'trailVisible', { onChange: () => { that.onTwoChange(); } })

		.addGroup({label: 'Three', enable: false })
		.addCheckbox(this, 'threeVisible', { onChange: () => { that.onThreeChange(); } })
		.addCheckbox(this, 'freeCamera', { onChange: () => { that.onThreeChange(); } })

		.addGroup({label: 'VideoCloud'})
		.addSlider(this, 'cloudZa', 'rangeZ', { onChange: () => { that.onCloudChange(); } })
		.addSlider(this, 'cloudZb', 'rangeZ', { onChange: () => { that.onCloudChange(); } })
		.addCheckbox(this, 'showVideoCanvas', { onChange: () => { that.onCloudChange(); } })
		*/
	}

	initDebugAudio() {
		const el = document.getElementById('debug');

		this.debugAudio = new DebugAudioView(el);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	draw() {
		if (this.audioDebugVisible) this.debugAudio.draw();
		else this.debugAudio.clear();
	}

	toggle() {
		this.visible = !this.visible;

		if (this.visible) {
			this.controlKit.enable();
			this.debugAudio.el.style.display = '';
		} else {
			this.controlKit.disable();
			this.debugAudio.el.style.display = 'none';
		}
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onAudioChange(index) {
		// console.log('onChange', index, this.view);
		this.audio.gainNode.gain.value = this.volume;
		this.audio.analyserNode.smoothingTimeConstant = this.audioSmoothing;
		this.audio.peakDecay = this.audioPeakDecay;
		this.audio.peakCutOff = this.audioPeakCutOff;
		this.audio.peakInterval = this.audioPeakInterval;
		this.audio.peakDetectIndex = floor(this.audioPeakDetectIndex);
	}

	onTwoChange() {
		this.view.two.bars.visible = this.barsVisible;
		this.view.two.trail.visible = this.trailVisible;
	}

	onThreeChange() {
		this.view.three.visible = this.threeVisible;
	}

	onCloudChange() {
		this.view.three.videoCloud.cloudZa = this.cloudZa;
		this.view.three.videoCloud.cloudZb = this.cloudZb;

		const display = (this.showVideoCanvas) ? '' : 'none';
		document.querySelector('#videoCanvas').style.display = display;
	}
}
