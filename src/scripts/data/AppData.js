import StringUtils from '../utils/StringUtils';

export default class AppData {
	constructor() {
		this.load('data/Markers.csv', this.onLoadMarkers.bind(this));
	}

	load(url, callback) {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
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
			marker.mEnd = marker.mStart + marker.mDuration;
		}

		// if no duration, set it until the start of next word
		for (let i = 0; i < this.markers.length - 1; i++) {
			const curr = this.markers[i];
			const next = this.markers[i + 1];
			if (!curr.mDuration) {
				curr.mDuration = next.mStart - curr.mStart;
				curr.mEnd = curr.mStart + curr.mDuration;
			}
		}

		// sort by start time
		this.markers.sort((a, b) => {
			return parseFloat(a.mStart) - parseFloat(b.mStart);
		});
	}
}