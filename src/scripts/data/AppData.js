import StringUtils from '../utils/StringUtils';

export default class AppData {
	constructor() {
		this.load('data/Markers.csv', this.onLoadMarkers.bind(this));
	}

	load(url, callback) {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		// request.responseType = 'arraybuffer';
		// request.onprogress = this.onRequestProgress.bind(this);
		// request.onload = this.onRequestLoad.bind(this);
		request.onload = (e) => {
			callback(request);
		}
		request.send();
	}

	onLoadMarkers(request) {
		// parse csv
		this.markers = Papa.parse(request.response, { header: true }).data;

		// clean up / remove empty fields
		for (let i = 0; i < this.markers.length; i++) {
			const marker = this.markers[i];
			if (!marker || !marker.Name || !marker.Start) {
				this.markers.splice(i, 1);
				i--;
			}
		}

		// add time properties as numbers
		for (let i = 0; i < this.markers.length; i++) {
			const marker = this.markers[i];
			if (!marker.Start) continue;
			marker.mStart = StringUtils.timeToMillis(marker.Start);
			marker.mDuration = StringUtils.timeToMillis(marker.Duration);
		}

		// sort by start time
		this.markers.sort((a, b) => {
			return parseFloat(a.mStart) - parseFloat(b.mStart);
		});
	}
}