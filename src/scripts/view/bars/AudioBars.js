export default class AudioBars {

	constructor(ctx) {
		this.ctx = ctx;
	}


	update() {

	}

	draw(values) {
		this.ctx.fillStyle = '#555';

		const height = this.ctx.height * 0.2;
		const w = (this.ctx.width - values.length) / values.length;

		for (let i = 0; i < values.length; i++) {
			const h = values[i] * height + 4;
			const x = i * (w + 1);
			const y = this.ctx.height - h;
			this.ctx.fillRect(x, y, w, h);
		}

	}
}
