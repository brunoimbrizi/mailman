export default class StringUtils {

	static timeToMillis(str) {
		// m:ss:ddd
		const m = str.substr(0, 1) * 60 * 1000;
		const s = str.substr(2, 2) * 1000;
		const d = str.substr(5, 3) * 1.0;

		return m + s + d;
	}

	static timeToSeconds(str) {
		return StringUtils.timeToMillis(str) * 0.001;
	}
}
