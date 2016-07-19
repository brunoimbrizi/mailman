export default class SimpleLyrics {

	constructor(ctx, audio, data) {
		this.ctx = ctx;
		this.audio = audio;
		this.data = data;
	}

	initMarkers() {
		// clone markers array
		
	}

	update() {
		this.curr = '';

		if (!this.markers && this.data.markers) this.markers = this.data.markers.concat();
		if (!this.markers) return;
		if (!this.markers.length) return;

		for (let i = 0; i < this.markers.length; i++) {
			const marker = this.markers[i];

			// audio already passed this marker, not coming back...
			if (this.audio.currentTime > marker.mEnd) {
				this.markers.splice(i, 1);
				i--;
				continue;
			}

			if (this.audio.currentTime > marker.mStart && this.audio.currentTime < marker.mEnd) {
				this.curr = marker.Name;
			}
		}
	}

	draw() {
		const fontSize = 60;

		const w = this.ctx.measureText(this.curr.toUpperCase()).width;
		// const x = (this.ctx.width - w) * 0.5;
		// const y = (this.ctx.height + fontSize) * 0.5;
		const x = 300;
		const y = 100;

		this.ctx.font = fontSize + 'px sans-serif';
		this.ctx.fillStyle = '#fff';
		this.ctx.fillText(this.curr.toUpperCase(), x, y);
	}
}