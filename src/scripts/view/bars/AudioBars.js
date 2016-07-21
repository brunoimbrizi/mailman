export default class AudioBars {

	constructor(ctx, audio) {
		this.ctx = ctx;
		this.audio = audio;

		this.visible = false;
	}

	update() {

	}

	draw() {
		if (!this.visible) return;

		const values = this.audio.values;
		const oldValues = this.audio.oldValues;
		const selectedIndices = this.audio.selectedIndices;

		const offset = 1;
		const height = this.ctx.height * 0.2;
		const w = (this.ctx.width - values.length * offset) / values.length;

		for (let i = 0; i < values.length; i++) {
			const h = values[i] * height + 4;
			const x = i * (w + offset);
			const y = this.ctx.height - h;

			let color = '#444';
			for (let j = 0; j < selectedIndices.length; j++) {
				if (i !== selectedIndices[j]) continue;
				color = '#666';
			}

			if (values[i] > oldValues[i] + this.audio.kickThreshold) color = '#00ffff';

			// if (values[i] > this.audio.threshold) color = '#00FF00';

			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, w, h);
		}

	}
}
