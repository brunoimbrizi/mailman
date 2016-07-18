export default class SimpleLyrics {

	constructor(ctx, audio, data) {
		this.ctx = ctx;
		this.audio = audio;
		this.data = data;

		this.curr = '';
	}

	initMarkers() {
		// clone markers array
		
	}

	update() {
		if (!this.markers && this.data.markers) this.markers = this.data.markers.concat();
		if (!this.markers) return;
		if (!this.markers.length) {
			this.curr = '';
			return;
		}

		const marker = this.markers[0];

		// audio reached marker
		if (this.audio.currentTime > marker.mStart) {
			// set current string
			this.curr = marker.Name;
			// remove first element
			this.markers.shift();
		}
	}

	draw() {
		const fontSize = 60;

		const w = this.ctx.measureText(this.curr.toUpperCase()).width;
		// const x = (this.ctx.width - w) * 0.5;
		// const y = (this.ctx.height + fontSize) * 0.5;
		const x = 100;
		const y = 100;

		this.ctx.font = fontSize + 'px sans-serif';
		this.ctx.fillStyle = '#fff';
		this.ctx.fillText(this.curr.toUpperCase(), x, y);
	}
}