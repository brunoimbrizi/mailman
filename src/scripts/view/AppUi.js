export default class AppUI {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;

		this.volume = 0.0;
		this.smoothing = this.audio.analyserNode.smoothingTimeConstant;
		this.kickThreshold = this.audio.kickThreshold;
		this.threshold = this.audio.threshold;
		
		this.range = [0, 1];
		this.rangeThreshold = [0, 2];
		this.rangeZ = [-100, 100];

		this.barsVisible = this.view.two.bars.visible;
		this.trailVisible = this.view.two.trail.visible;

		this.threeVisible = this.view.three.visible;

		this.cloudZa = 50;
		this.cloudZb = this.cloudZa;
		this.cloudHills = false;

		this.initControlKit();
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

		.addGroup({label: 'Audio'})
		.addSlider(this, 'smoothing', 'range', { onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'threshold', 'rangeThreshold', { onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'kickThreshold', 'range', { onChange: () => { that.onAudioChange(); } })
		.addSlider(this, 'volume', 'range', { onChange: () => { that.onAudioChange(); } })

		.addGroup({label: 'Two'})
		.addCheckbox(this, 'barsVisible', { onChange: () => { that.onTwoChange(); } })
		.addCheckbox(this, 'trailVisible', { onChange: () => { that.onTwoChange(); } })

		.addGroup({label: 'Three'})
		.addCheckbox(this, 'threeVisible', { onChange: () => { that.onThreeChange(); } })

		.addGroup({label: 'VideoCloud'})
		.addSlider(this, 'cloudZa', 'rangeZ', { onChange: () => { that.onCloudChange(); } })
		.addSlider(this, 'cloudZb', 'rangeZ', { onChange: () => { that.onCloudChange(); } })
	}

	onAudioChange(index) {
		// console.log('onChange', index, this.view);
		this.audio.gainNode.gain.value = this.volume;
		this.audio.analyserNode.smoothingTimeConstant = this.smoothing;
		this.audio.threshold = this.threshold;
		this.audio.kickThreshold = this.kickThreshold;
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
	}
}
