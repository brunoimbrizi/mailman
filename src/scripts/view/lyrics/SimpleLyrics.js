export default class SimpleLyrics {

	constructor(ctx, audio, data) {
		this.ctx = ctx;
		this.audio = audio;
		this.data = data;

		this.initMarkers();
	}

	initMarkers() {
		// clone markers array
		this.markers = this.data.markers.concat();
	}

	draw() {
		
	}
}