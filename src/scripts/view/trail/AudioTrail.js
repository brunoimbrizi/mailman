export default class AudioTrail {

	constructor(ctx, audio) {
		this.ctx = ctx;
		this.audio = audio;

		this.pos = new THREE.Vector2();
		this.vel = new THREE.Vector2(-2, 0);
		this.rects = [];
	}

	draw() {
		// this.pos.x += this.vel.x;
		this.pos.x = this.audio.currentTime * -0.5;

		this.ctx.save();
		this.ctx.translate(this.pos.x, this.pos.y);

		// this.ctx.fillStyle = '#fff';
		// this.ctx.fillRect(100, 100, 200, 300);

		const values = this.audio.values;
		const oldValues = this.audio.oldValues;

		this.ctx.fillStyle = '#FFF';

		for (let i = 0; i < values.length; i++) {
			let selected = false;
			for (let j = 0; j < this.audio.selectedIndices.length; j++) {
				if (i === this.audio.selectedIndices[j]) selected = true;
			}
			if (!selected) continue;
			// if (i !==) continue;

			if (values[i] > oldValues[i] + this.audio.kickThreshold) {
				const diff = values[i] - oldValues[i] - this.audio.kickThreshold;
				const width = 50;
				const height = max(diff * 50, 2);
				const rect = { x: -this.pos.x + this.ctx.width * 0.5, y: i * 10, w: width, h: height };
				// rect.tw = (values[i] - oldValues[i]) * 200;
				// TweenMax.to(rect, 1.5, { w: width * 2 });
				this.rects.push(rect);
			} 
		}

		for (let i = 0; i < this.rects.length; i++) {
			const rect = this.rects[i];
			this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
		}

		this.ctx.restore();
	}
}
