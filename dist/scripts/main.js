(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppData = require('./data/AppData');

var _AppData2 = _interopRequireDefault(_AppData);

var _AppAudio = require('./audio/AppAudio');

var _AppAudio2 = _interopRequireDefault(_AppAudio);

var _AppView = require('./view/AppView');

var _AppView2 = _interopRequireDefault(_AppView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App(el) {
		_classCallCheck(this, App);

		this.el = el;
		this.listeners = {};

		this.initData();
		this.initAudio();
		this.initView();
	}

	_createClass(App, [{
		key: 'initData',
		value: function initData() {
			this.data = new _AppData2.default();
		}
	}, {
		key: 'initAudio',
		value: function initAudio() {
			this.audio = new _AppAudio2.default(this);
		}
	}, {
		key: 'initView',
		value: function initView() {
			this.view = new _AppView2.default(this);
		}
	}, {
		key: 'on',
		value: function on(type, cb) {
			this.listeners[type] = this.listeners[type] || [];
			if (this.listeners[type].indexOf(cb) === -1) {
				this.listeners[type].push(cb);
			}
		}
	}, {
		key: 'off',
		value: function off(type, cb) {
			if (this.listeners[type]) {
				if (cb) {
					var index = this.listeners[type].indexOf(cb);
					if (index !== -1) {
						this.listeners[type].splice(index, 1);
					}
				} else this.listeners[type] = [];
			}
		}
	}, {
		key: 'trigger',
		value: function trigger(type, args) {
			if (this.listeners[type]) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this.listeners[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var cb = _step.value;

						cb(args);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}
		}
	}]);

	return App;
}();

exports.default = App;

},{"./audio/AppAudio":2,"./data/AppData":3,"./view/AppView":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppAudio = function () {
	_createClass(AppAudio, [{
		key: 'FFT_SIZE',
		get: function get() {
			return 512;
		}
	}, {
		key: 'BINS',
		get: function get() {
			return 128;
		}
	}], [{
		key: 'AUDIO_LOAD',
		get: function get() {
			return 'audio-load';
		}
	}, {
		key: 'AUDIO_DECODE',
		get: function get() {
			return 'audio-decode';
		}
	}, {
		key: 'AUDIO_PLAY',
		get: function get() {
			return 'audio-play';
		}
	}, {
		key: 'AUDIO_PAUSE',
		get: function get() {
			return 'audio-pause';
		}
	}, {
		key: 'AUDIO_END',
		get: function get() {
			return 'audio-end';
		}
	}, {
		key: 'AUDIO_RESTART',
		get: function get() {
			return 'audio-restart';
		}
	}]);

	function AppAudio(app) {
		_classCallCheck(this, AppAudio);

		this.app = app;
		this.pausedAt = 0;

		this.initContext();
		this.initGain();
		this.initAnalyser();

		this.load('audio/04 - Soundgarden - Mailman.mp3');
	}

	_createClass(AppAudio, [{
		key: 'initContext',
		value: function initContext() {
			if (window.AudioContext === void 0) window.AudioContext = window.webkitAudioContext;
			this.ctx = new AudioContext();
		}
	}, {
		key: 'initGain',
		value: function initGain() {
			this.gainNode = this.ctx.createGain();
			this.gainNode.gain.value = 0.0;
			this.gainNode.connect(this.ctx.destination);
		}
	}, {
		key: 'initAnalyser',
		value: function initAnalyser() {
			this.values = [];
			// this.selectedIndices = [42, 38, 28, 48, 32, 34, 40, 30, 24, 44, 26, 36];
			this.selectedIndices = [20, 30, 40, 50, 60, 70, 75, 80, 85, 90];
			this.selectedValues = [];
			this.oldValues = [];

			this.threshold = 1.0;
			this.kickThreshold = 0.1;

			this.analyserNode = this.ctx.createAnalyser();
			this.analyserNode.smoothingTimeConstant = 0.9;
			this.analyserNode.fftSize = this.FFT_SIZE;
			this.analyserNode.connect(this.gainNode);
			// this.analyserNode.connect(this.ctx.destination); // comment out to start mute
		}

		// ---------------------------------------------------------------------------------------------
		// PUBLIC
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'load',
		value: function load(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onprogress = this.onRequestProgress.bind(this);
			request.onload = this.onRequestLoad.bind(this);
			request.send();
		}
	}, {
		key: 'play',
		value: function play() {
			// if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));

			this.sourceNode = this.ctx.createBufferSource();
			this.sourceNode.onended = this.onSourceEnded;
			this.sourceNode.connect(this.analyserNode);
			// this.sourceNode.playbackRate.value = this.playbackRate;
			this.sourceNode.buffer = this.buffer;
			this.ended = false;
			this.paused = false;

			this.startedAt = Date.now() - this.pausedAt;
			this.sourceNode.start(0, this.pausedAt / 1000);

			this.app.trigger(AppAudio.AUDIO_PLAY, { currentTime: this.pausedAt });
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.sourceNode.stop(0);
			this.pausedAt = Date.now() - this.startedAt;
			this.paused = true;

			this.app.trigger(AppAudio.AUDIO_PAUSE, { currentTime: this.pausedAt });
		}
	}, {
		key: 'seek',
		value: function seek(time) {
			if (time == undefined) return;
			if (time > this.buffer.duration) return;

			this.ended = false;

			if (!this.paused) {
				this.sourceNode.onended = null;
				this.sourceNode.stop(0);
			}
			this.pausedAt = time * 1000;
			if (!this.paused) this.play();
		}
	}, {
		key: 'update',
		value: function update() {
			var freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
			this.analyserNode.getByteFrequencyData(freqData);
			var length = freqData.length;

			this.oldValues = this.values.concat();

			var bin = Math.ceil(length / this.BINS);
			for (var i = 0; i < this.BINS; i++) {
				var sum = 0;
				for (var j = 0; j < bin; j++) {
					sum += freqData[i * bin + j];
				}

				// Calculate the average frequency of the samples in the bin
				var average = sum / bin;

				// Divide by number of bins to normalize
				// this.values[i] = (average / this.BINS) / this.playbackRate;
				this.values[i] = average / this.BINS;
			}

			for (var _i = 0; _i < this.selectedIndices.length; _i++) {
				var index = this.selectedIndices[_i];
				this.selectedValues[_i] = this.values[index];
			}

			// set current time
			if (this.loaded && !this.ended) {
				this.currentTime = this.paused ? this.pausedAt : Date.now() - this.startedAt;
				// this.currentTime *= this.playbackRate;
			}
		}

		// ---------------------------------------------------------------------------------------------
		// EVENT HANDLERS
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'onRequestProgress',
		value: function onRequestProgress(e) {
			// console.log('AppAudio.onRequestProgress', e, app.view.ui)
			// if (app.view.ui) app.view.ui.loader.onLoadProgress(e);
		}
	}, {
		key: 'onRequestLoad',
		value: function onRequestLoad(e) {
			// console.log('AppAudio.onRequestLoad', e);
			// if (app.view.ui) app.view.ui.loader.onLoadComplete(e);

			this.ctx.decodeAudioData(e.target.response, this.onBufferLoaded.bind(this), this.onBufferError.bind(this));

			this.app.trigger(AppAudio.AUDIO_LOAD);
		}
	}, {
		key: 'onBufferLoaded',
		value: function onBufferLoaded(buffer) {
			this.buffer = buffer;

			// app.view.ui.loader.onDecodeComplete()
			// app.view.ui.player.show()

			this.loaded = true;
			this.duration = this.buffer.duration * 1000;
			// this.duration = this.buffer.duration * 1000 * this.playbackRate;
			// this.play();

			this.app.trigger(AppAudio.AUDIO_DECODE);
		}
	}, {
		key: 'onBufferError',
		value: function onBufferError(e) {
			// console.log('AppAudio.onBufferError', e)
			// app.view.ui.loader.onError(e);
		}
	}, {
		key: 'onSourceEnded',
		value: function onSourceEnded(e) {
			// console.log('AppAudio.onSourceEnded', this.paused)
			if (this.paused) return;
			this.currentTime = this.duration;
			this.ended = true;
			this.paused = true;
			this.pausedAt = 0;

			// window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
		}
	}]);

	return AppAudio;
}();

exports.default = AppAudio;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _StringUtils = require('../utils/StringUtils');

var _StringUtils2 = _interopRequireDefault(_StringUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppData = function () {
	function AppData() {
		_classCallCheck(this, AppData);

		this.load('data/Markers.csv', this.onLoadMarkers.bind(this));
	}

	_createClass(AppData, [{
		key: 'load',
		value: function load(url, callback) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.onload = function (e) {
				callback(request);
			};
			request.send();
		}
	}, {
		key: 'onLoadMarkers',
		value: function onLoadMarkers(request) {
			// parse csv
			this.markers = Papa.parse(request.response, { header: true }).data;

			// clean up / remove empty fields
			for (var i = 0; i < this.markers.length; i++) {
				var marker = this.markers[i];
				if (!marker || !marker.Name || !marker.Start) {
					this.markers.splice(i, 1);
					i--;
				}
			}

			// add time properties as numbers
			for (var _i = 0; _i < this.markers.length; _i++) {
				var _marker = this.markers[_i];
				if (!_marker.Start) continue;
				_marker.mStart = _StringUtils2.default.timeToMillis(_marker.Start);
				_marker.mDuration = _StringUtils2.default.timeToMillis(_marker.Duration);
				_marker.mEnd = _marker.mStart + _marker.mDuration;
			}

			// if no duration, set it until the start of next word
			for (var _i2 = 0; _i2 < this.markers.length - 1; _i2++) {
				var curr = this.markers[_i2];
				var next = this.markers[_i2 + 1];
				if (!curr.mDuration) {
					curr.mDuration = next.mStart - curr.mStart;
					curr.mEnd = curr.mStart + curr.mDuration;
				}
			}

			// sort by start time
			this.markers.sort(function (a, b) {
				return parseFloat(a.mStart) - parseFloat(b.mStart);
			});
		}
	}]);

	return AppData;
}();

exports.default = AppData;

},{"../utils/StringUtils":6}],4:[function(require,module,exports){
'use strict';

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

ready(function () {
	var app = new _App2.default();
	window.app = app;
});

},{"./App":1}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathUtils = function () {
	function MathUtils() {
		_classCallCheck(this, MathUtils);
	}

	_createClass(MathUtils, null, [{
		key: "map",
		value: function map(num, min1, max1, min2, max2) {
			var round = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
			var constrainMin = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];
			var constrainMax = arguments.length <= 7 || arguments[7] === undefined ? true : arguments[7];

			if (constrainMin && num < min1) return min2;
			if (constrainMax && num > max1) return max2;

			var num1 = (num - min1) / (max1 - min1);
			var num2 = num1 * (max2 - min2) + min2;
			if (round) return Math.round(num2);
			return num2;
		}
	}]);

	return MathUtils;
}();

exports.default = MathUtils;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringUtils = function () {
	function StringUtils() {
		_classCallCheck(this, StringUtils);
	}

	_createClass(StringUtils, null, [{
		key: "timeToMillis",
		value: function timeToMillis(str) {
			// m:ss:ddd
			var m = str.substr(0, 1) * 60 * 1000;
			var s = str.substr(2, 2) * 1000;
			var d = str.substr(5, 3) * 1.0;

			return m + s + d;
		}
	}, {
		key: "timeToSeconds",
		value: function timeToSeconds(str) {
			return StringUtils.timeToMillis(str) * 0.001;
		}
	}]);

	return StringUtils;
}();

exports.default = StringUtils;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Grid = require('./grid/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _BlocksA = require('./blocks/BlocksA');

var _BlocksA2 = _interopRequireDefault(_BlocksA);

var _VideoCloud = require('./video/VideoCloud');

var _VideoCloud2 = _interopRequireDefault(_VideoCloud);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppThree = function () {
	function AppThree(view, audio) {
		_classCallCheck(this, AppThree);

		this.view = view;
		this.audio = audio;
		this.renderer = this.view.renderer;

		this.visible = true;

		this.initThree();
		this.initControls();
		this.initLights();
		// this.initObject();
		this.initGrid();
		this.initBlocks();
		this.initVideoCloud();
	}

	_createClass(AppThree, [{
		key: 'initThree',
		value: function initThree() {
			// scene
			this.scene = new THREE.Scene();

			// camera
			this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.z = 480;
		}
	}, {
		key: 'initControls',
		value: function initControls() {
			this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
			this.controls.target.set(0, 0, 0);
			this.controls.rotateSpeed = 2.0;
			this.controls.zoomSpeed = 0.8;
			this.controls.panSpeed = 0.8;
			this.controls.noZoom = false;
			this.controls.noPan = false;
			this.controls.staticMoving = false;
			this.controls.dynamicDampingFactor = 0.15;
			this.controls.maxDistance = 3000;
			this.controls.enabled = true;
		}
	}, {
		key: 'initLights',
		value: function initLights() {
			this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
			this.directionalLight.position.set(1, 1, 1);
			// this.scene.add(this.directionalLight);

			this.pointLight = new THREE.PointLight(0xFFFFFF, 1);
			this.pointLight.position.set(0, 50, 100);
			// this.scene.add(this.pointLight);
		}
	}, {
		key: 'initObject',
		value: function initObject() {
			var geometry = new THREE.BoxGeometry(200, 200, 200);
			// const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);
			var material = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
			var mesh = new THREE.Mesh(geometry, material);
			this.scene.add(mesh);
		}
	}, {
		key: 'initGrid',
		value: function initGrid() {
			this.grid = new _Grid2.default();
			// this.scene.add(this.grid.container);
		}
	}, {
		key: 'initBlocks',
		value: function initBlocks() {
			this.blocksA = new _BlocksA2.default();
			this.scene.add(this.blocksA.container);
		}
	}, {
		key: 'initVideoCloud',
		value: function initVideoCloud() {
			this.videoCloud = new _VideoCloud2.default(this.view.video);
			this.scene.add(this.videoCloud.container);
		}

		// ---------------------------------------------------------------------------------------------
		// PUBLIC
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'update',
		value: function update() {
			if (!this.visible) return;

			this.controls.update();
			// this.grid.update(this.audio.values);
			this.blocksA.update(this.audio.values);
			this.videoCloud.update();
		}
	}, {
		key: 'draw',
		value: function draw() {
			if (!this.visible) {
				this.renderer.clear();
				return;
			}

			this.renderer.render(this.scene, this.camera);
		}

		// ---------------------------------------------------------------------------------------------
		// EVENT HANDLERS
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'resize',
		value: function resize() {
			if (!this.renderer) return;
			this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
			this.camera.updateProjectionMatrix();;

			this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);

			this.hw = this.view.sketch.width * .5;
			this.hh = this.view.sketch.height * .5;
		}
	}]);

	return AppThree;
}();

exports.default = AppThree;

},{"./blocks/BlocksA":12,"./grid/Grid":13,"./video/VideoCloud":17}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AudioBars = require('./bars/AudioBars');

var _AudioBars2 = _interopRequireDefault(_AudioBars);

var _AudioTrail = require('./trail/AudioTrail');

var _AudioTrail2 = _interopRequireDefault(_AudioTrail);

var _SimpleLyrics = require('./lyrics/SimpleLyrics');

var _SimpleLyrics2 = _interopRequireDefault(_SimpleLyrics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppTwo = function () {
	function AppTwo(view, audio, data) {
		_classCallCheck(this, AppTwo);

		this.view = view;
		this.audio = audio;
		this.data = data;

		this.initSketch();
		this.initAudioBars();
		this.initAudioTrail();
		this.initSimpleLyrics();
	}

	_createClass(AppTwo, [{
		key: 'initSketch',
		value: function initSketch() {
			this.sketch = Sketch.create({
				type: Sketch.CANVAS,
				container: document.querySelector('#container2D'),
				autopause: false,
				autoclear: false,
				retina: window.devicePixelRatio >= 2,
				fullscreen: true
			});
		}
	}, {
		key: 'update',
		value: function update() {
			// this.bars.update(this.audio.values);
			this.lyrics.update();
		}
	}, {
		key: 'draw',
		value: function draw() {
			this.sketch.clear();
			this.bars.draw();
			this.trail.draw();
			this.lyrics.draw();
		}
	}, {
		key: 'initAudioBars',
		value: function initAudioBars() {
			this.bars = new _AudioBars2.default(this.sketch, this.audio);
		}
	}, {
		key: 'initAudioTrail',
		value: function initAudioTrail() {
			this.trail = new _AudioTrail2.default(this.sketch, this.audio);
		}
	}, {
		key: 'initSimpleLyrics',
		value: function initSimpleLyrics() {
			this.lyrics = new _SimpleLyrics2.default(this.sketch, this.audio, this.data);
		}
	}]);

	return AppTwo;
}();

exports.default = AppTwo;

},{"./bars/AudioBars":11,"./lyrics/SimpleLyrics":14,"./trail/AudioTrail":15}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppUI = function () {
	function AppUI(view, audio) {
		_classCallCheck(this, AppUI);

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

		this.freeCamera = true;
		this.threeVisible = this.view.three.visible;

		this.cloudZa = 50;
		this.cloudZb = this.cloudZa;
		this.showVideoCanvas = false;

		this.initControlKit();
	}

	_createClass(AppUI, [{
		key: 'initControlKit',
		value: function initControlKit() {
			var that = this;

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

			this.controlKit.addPanel({ width: 300 }).addGroup({ label: 'Audio', enable: false }).addSlider(this, 'smoothing', 'range', { onChange: function onChange() {
					that.onAudioChange();
				} }).addSlider(this, 'threshold', 'rangeThreshold', { onChange: function onChange() {
					that.onAudioChange();
				} }).addSlider(this, 'kickThreshold', 'range', { onChange: function onChange() {
					that.onAudioChange();
				} }).addSlider(this, 'volume', 'range', { onChange: function onChange() {
					that.onAudioChange();
				} }).addGroup({ label: 'Two', enable: false }).addCheckbox(this, 'barsVisible', { onChange: function onChange() {
					that.onTwoChange();
				} }).addCheckbox(this, 'trailVisible', { onChange: function onChange() {
					that.onTwoChange();
				} }).addGroup({ label: 'Three', enable: false }).addCheckbox(this, 'threeVisible', { onChange: function onChange() {
					that.onThreeChange();
				} }).addCheckbox(this, 'freeCamera', { onChange: function onChange() {
					that.onThreeChange();
				} }).addGroup({ label: 'VideoCloud' }).addSlider(this, 'cloudZa', 'rangeZ', { onChange: function onChange() {
					that.onCloudChange();
				} }).addSlider(this, 'cloudZb', 'rangeZ', { onChange: function onChange() {
					that.onCloudChange();
				} }).addCheckbox(this, 'showVideoCanvas', { onChange: function onChange() {
					that.onCloudChange();
				} });
		}
	}, {
		key: 'onAudioChange',
		value: function onAudioChange(index) {
			// console.log('onChange', index, this.view);
			this.audio.gainNode.gain.value = this.volume;
			this.audio.analyserNode.smoothingTimeConstant = this.smoothing;
			this.audio.threshold = this.threshold;
			this.audio.kickThreshold = this.kickThreshold;
		}
	}, {
		key: 'onTwoChange',
		value: function onTwoChange() {
			this.view.two.bars.visible = this.barsVisible;
			this.view.two.trail.visible = this.trailVisible;
		}
	}, {
		key: 'onThreeChange',
		value: function onThreeChange() {
			this.view.three.visible = this.threeVisible;
		}
	}, {
		key: 'onCloudChange',
		value: function onCloudChange() {
			this.view.three.videoCloud.cloudZa = this.cloudZa;
			this.view.three.videoCloud.cloudZb = this.cloudZb;

			var display = this.showVideoCanvas ? '' : 'none';
			document.querySelector('#videoCanvas').style.display = display;
		}
	}]);

	return AppUI;
}();

exports.default = AppUI;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppTwo = require('./AppTwo');

var _AppTwo2 = _interopRequireDefault(_AppTwo);

var _AppThree = require('./AppThree');

var _AppThree2 = _interopRequireDefault(_AppThree);

var _AppUI = require('./AppUI');

var _AppUI2 = _interopRequireDefault(_AppUI);

var _AppAudio = require('../audio/AppAudio');

var _AppAudio2 = _interopRequireDefault(_AppAudio);

var _VideoPlayer = require('./video/VideoPlayer');

var _VideoPlayer2 = _interopRequireDefault(_VideoPlayer);

var _VideoCanvas = require('./video/VideoCanvas');

var _VideoCanvas2 = _interopRequireDefault(_VideoCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppView = function () {
	function AppView(app) {
		_classCallCheck(this, AppView);

		this.audio = app.audio;
		this.data = app.data;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		app.on(_AppAudio2.default.AUDIO_LOAD, this.onAudioLoad.bind(this));
		app.on(_AppAudio2.default.AUDIO_DECODE, this.onAudioDecode.bind(this));
		app.on(_AppAudio2.default.AUDIO_PLAY, this.onAudioPlay.bind(this));
		app.on(_AppAudio2.default.AUDIO_PAUSE, this.onAudioPause.bind(this));

		app.on(_VideoPlayer2.default.VIDEO_CANPLAY, this.onVideoCanPlay.bind(this));

		// TEMP
		document.querySelector('#status').innerText = 'loading audio';

		this.initSketch();
	}

	_createClass(AppView, [{
		key: 'initSketch',
		value: function initSketch() {
			var _this = this;

			this.sketch = Sketch.create({
				type: Sketch.WEBGL,
				element: this.renderer.domElement,
				context: this.renderer.context,
				autopause: false,
				retina: window.devicePixelRatio >= 2,
				fullscreen: true
			});

			this.sketch.setup = function () {
				_this.initVideo();
				_this.initTwo();
				_this.initThree();
				_this.initUI();
			};

			this.sketch.update = function () {
				_this.audio.update();
				_this.two.update();
				_this.three.update();
				_this.video.update();
			};

			this.sketch.draw = function () {
				_this.two.draw();
				_this.three.draw();
			};

			this.sketch.resize = function () {
				_this.hw = _this.sketch.width * 0.5;
				_this.hh = _this.sketch.height * 0.5;

				_this.three.resize();
				_this.video.resize();
			};

			this.sketch.touchstart = function (e) {
				var touch = _this.sketch.touches[0];
			};

			this.sketch.touchmove = function () {};

			this.sketch.touchend = function () {};

			this.sketch.keyup = function (e) {
				if (e.keyCode === 32) {
					if (_this.audio.paused) _this.audio.play();else _this.audio.pause();
				}
			};
		}
	}, {
		key: 'initTwo',
		value: function initTwo() {
			this.two = new _AppTwo2.default(this, this.audio, this.data);
		}
	}, {
		key: 'initThree',
		value: function initThree() {
			// transfer canvas to container3D
			document.querySelector('#container3D').appendChild(this.renderer.domElement);

			this.three = new _AppThree2.default(this, this.audio);
		}
	}, {
		key: 'initVideo',
		value: function initVideo() {
			// this.video = new VideoPlayer();
			this.video = new _VideoCanvas2.default();
		}
	}, {
		key: 'initUI',
		value: function initUI() {
			this.ui = new _AppUI2.default(this, this.audio);
		}

		// ---------------------------------------------------------------------------------------------
		// PUBLIC
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'show',
		value: function show() {
			// console.log('AppView.show', this.audioReady, this.videoReady);
			if (!this.audioReady) return;
			if (!this.videoReady) return;

			// start audio (which starts video)
			this.audio.play();

			// TEMP
			document.querySelector('#status').innerText = '';
		}

		// ---------------------------------------------------------------------------------------------
		// EVENT HANDLERS
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'onAudioLoad',
		value: function onAudioLoad(e) {
			// console.log('AppView.onAudioLoad', e);

			// TEMP
			document.querySelector('#status').innerText = 'decoding audio';
		}
	}, {
		key: 'onAudioDecode',
		value: function onAudioDecode(e) {
			// console.log('AppView.onAudioDecode', e);
			// this.video.play(e.currentTime);
			this.audioReady = true;
			this.show();
		}
	}, {
		key: 'onAudioPlay',
		value: function onAudioPlay(e) {
			// console.log('AppView.onAudioPlay', e);
			this.video.play(e.currentTime);
		}
	}, {
		key: 'onAudioPause',
		value: function onAudioPause(e) {
			// console.log('AppView.onAudioPause', e);
			this.video.pause();
		}
	}, {
		key: 'onVideoCanPlay',
		value: function onVideoCanPlay(e) {
			console.log('AppView.onVideoCanPlay', e);
			this.videoReady = true;
			this.show();
		}
	}]);

	return AppView;
}();

exports.default = AppView;

},{"../audio/AppAudio":2,"./AppThree":7,"./AppTwo":8,"./AppUI":9,"./video/VideoCanvas":16,"./video/VideoPlayer":18}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioBars = function () {
	function AudioBars(ctx, audio) {
		_classCallCheck(this, AudioBars);

		this.ctx = ctx;
		this.audio = audio;

		this.visible = false;
	}

	_createClass(AudioBars, [{
		key: 'update',
		value: function update() {}
	}, {
		key: 'draw',
		value: function draw() {
			if (!this.visible) return;

			var values = this.audio.values;
			var oldValues = this.audio.oldValues;
			var selectedIndices = this.audio.selectedIndices;

			var offset = 1;
			var height = this.ctx.height * 0.2;
			var w = (this.ctx.width - values.length * offset) / values.length;

			for (var i = 0; i < values.length; i++) {
				var h = values[i] * height + 4;
				var x = i * (w + offset);
				var y = this.ctx.height - h;

				var color = '#444';
				for (var j = 0; j < selectedIndices.length; j++) {
					if (i !== selectedIndices[j]) continue;
					color = '#666';
				}

				if (values[i] > oldValues[i] + this.audio.kickThreshold) color = '#00ffff';

				// if (values[i] > this.audio.threshold) color = '#00FF00';

				this.ctx.fillStyle = color;
				this.ctx.fillRect(x, y, w, h);
			}
		}
	}]);

	return AudioBars;
}();

exports.default = AudioBars;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MathUtils = require('../../utils/MathUtils');

var _MathUtils2 = _interopRequireDefault(_MathUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlocksA = function () {
	function BlocksA() {
		_classCallCheck(this, BlocksA);

		this.cols = 6;
		this.rows = 4;

		this.width = 360;
		this.height = 80;

		this.container = new THREE.Object3D();

		this.initBlocks();
	}

	_createClass(BlocksA, [{
		key: 'initBlocks',
		value: function initBlocks() {
			var w = this.width / (this.cols - 1);
			var h = this.height / (this.rows - 1);

			// const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
			var geometry = new THREE.PlaneBufferGeometry(2, 2);
			// const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });
			var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

			for (var i = 0; i < this.rows * this.cols; i++) {
				var col = i % this.cols;
				var row = floor(i / this.cols);

				var x = w * col - this.width * 0.5;
				var y = h * row * -1 + this.height * 0.5;

				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.x = x;
				mesh.position.y = y;
				// mesh.rotation.x = HALF_PI;
				// mesh.rotation.z = i * PI * 0.01;
				this.container.add(mesh);

				mesh.index = floor(random(24, 48));
			}
		}
	}, {
		key: 'update',
		value: function update(values) {
			// return;
			var length = this.container.children.length;
			// const slice = values.slice(30, 30 + this.cols);

			for (var i = 0; i < length; i++) {
				// const v = MathUtils.map(i, 0, length, 0, slice.length - 1, true);
				// const v = MathUtils.map(i, 0, length, 0, values.length - 1, true);
				var item = this.container.children[i];
				var v = item.index;
				if (!values[v]) continue;
				item.scale.x = values[v] * values[v] * 20;
				item.scale.y = values[v] * values[v];
				// item.scale.z = values[v] * 20;
				item.position.z = values[v] * 50 + 100;
				// item.rotation.y = values[v];
			}
		}
	}]);

	return BlocksA;
}();

exports.default = BlocksA;

},{"../../utils/MathUtils":5}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MathUtils = require('../../utils/MathUtils');

var _MathUtils2 = _interopRequireDefault(_MathUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
	function Grid() {
		_classCallCheck(this, Grid);

		this.cols = 16;
		this.rows = 9;
		this.width = 480;
		this.height = 270;

		this.container = new THREE.Object3D();

		this.initGrid();
	}

	_createClass(Grid, [{
		key: 'initGrid',
		value: function initGrid() {
			var w = this.width / (this.cols - 1);
			var h = this.height / (this.rows - 1);

			// const geometry = new THREE.CylinderBufferGeometry(5, 5, 10, 6);
			var geometry = new THREE.BoxBufferGeometry(2, 2, 2);
			var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });

			for (var i = 0; i < this.rows * this.cols; i++) {
				var col = i % this.cols;
				var row = floor(i / this.cols);

				var x = w * col - this.width * 0.5;
				var y = h * row * -1 + this.height * 0.5;

				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.x = x;
				mesh.position.y = y;
				// mesh.rotation.x = HALF_PI;
				// mesh.rotation.z = i * PI * 0.01;
				this.container.add(mesh);

				mesh.index = floor(random(24, 48));
			}
		}
	}, {
		key: 'update',
		value: function update(values) {
			// return;
			var length = this.container.children.length;
			// const slice = values.slice(30, 30 + this.cols);

			for (var i = 0; i < length; i++) {
				// const v = MathUtils.map(i, 0, length, 0, slice.length - 1, true);
				// const v = MathUtils.map(i, 0, length, 0, values.length - 1, true);
				var item = this.container.children[i];
				var v = item.index;
				if (!values[v]) continue;
				item.scale.x = values[v] * values[v] * 2;
				item.scale.y = values[v] * 2;
				item.scale.z = values[v] * 20;
				item.position.z = item.scale.z * 2.5;
				// item.rotation.y = values[v];
			}
		}
	}]);

	return Grid;
}();

exports.default = Grid;

},{"../../utils/MathUtils":5}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleLyrics = function () {
	function SimpleLyrics(ctx, audio, data) {
		_classCallCheck(this, SimpleLyrics);

		this.ctx = ctx;
		this.audio = audio;
		this.data = data;
	}

	_createClass(SimpleLyrics, [{
		key: 'initMarkers',
		value: function initMarkers() {
			// clone markers array

		}
	}, {
		key: 'update',
		value: function update() {
			this.curr = '';

			if (!this.markers && this.data.markers) this.markers = this.data.markers.concat();
			if (!this.markers) return;
			if (!this.markers.length) return;

			for (var i = 0; i < this.markers.length; i++) {
				var marker = this.markers[i];

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
	}, {
		key: 'draw',
		value: function draw() {
			var fontSize = 60;

			var w = this.ctx.measureText(this.curr.toUpperCase()).width;
			// const x = (this.ctx.width - w) * 0.5;
			// const y = (this.ctx.height + fontSize) * 0.5;
			var x = 300;
			var y = 100;

			this.ctx.font = fontSize + 'px sans-serif';
			this.ctx.fillStyle = '#fff';
			this.ctx.fillText(this.curr.toUpperCase(), x, y);
		}
	}]);

	return SimpleLyrics;
}();

exports.default = SimpleLyrics;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioTrail = function () {
	function AudioTrail(ctx, audio) {
		_classCallCheck(this, AudioTrail);

		this.ctx = ctx;
		this.audio = audio;

		this.pos = new THREE.Vector2();
		this.vel = new THREE.Vector2(-2, 0);
		this.rects = [];

		this.visible = false;
	}

	_createClass(AudioTrail, [{
		key: 'draw',
		value: function draw() {
			if (!this.visible) return;

			// this.pos.x += this.vel.x;
			this.pos.x = this.audio.currentTime * -0.5;

			this.ctx.save();
			this.ctx.translate(this.pos.x, this.pos.y);

			// this.ctx.fillStyle = '#fff';
			// this.ctx.fillRect(100, 100, 200, 300);

			var values = this.audio.values;
			var oldValues = this.audio.oldValues;

			this.ctx.fillStyle = '#FFF';

			for (var i = 0; i < values.length; i++) {
				var selected = false;
				for (var j = 0; j < this.audio.selectedIndices.length; j++) {
					if (i === this.audio.selectedIndices[j]) selected = true;
				}
				if (!selected) continue;
				// if (i !==) continue;

				if (values[i] > oldValues[i] + this.audio.kickThreshold) {
					var diff = values[i] - oldValues[i] - this.audio.kickThreshold;
					var width = 50;
					var height = max(diff * 50, 2);
					var rect = { x: -this.pos.x + this.ctx.width * 0.5, y: i * 10, w: width, h: height };
					// rect.tw = (values[i] - oldValues[i]) * 200;
					// TweenMax.to(rect, 1.5, { w: width * 2 });
					this.rects.push(rect);
				}
			}

			for (var _i = 0; _i < this.rects.length; _i++) {
				var _rect = this.rects[_i];
				this.ctx.fillRect(_rect.x, _rect.y, _rect.w, _rect.h);
			}

			this.ctx.restore();
		}
	}]);

	return AudioTrail;
}();

exports.default = AudioTrail;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _VideoPlayer = require('./VideoPlayer');

var _VideoPlayer2 = _interopRequireDefault(_VideoPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoCanvas = function () {
	function VideoCanvas() {
		_classCallCheck(this, VideoCanvas);

		this.initVideo();
		this.initCanvas();
	}

	_createClass(VideoCanvas, [{
		key: 'initVideo',
		value: function initVideo() {
			this.videoPlayer = new _VideoPlayer2.default();
		}
	}, {
		key: 'initCanvas',
		value: function initCanvas() {
			this.canvas = document.createElement('canvas');
			this.canvas.id = 'videoCanvas';
			this.canvas.width = this.videoPlayer.videoWidth;
			this.canvas.height = this.videoPlayer.videoHeight;

			this.ctx = this.canvas.getContext('2d');

			// TEMP: append
			document.querySelector('body').appendChild(this.canvas);
			this.canvas.style.display = 'none';
		}
	}, {
		key: 'update',
		value: function update() {
			if (this.videoPlayer.video.paused || this.videoPlayer.video.ended) return;

			this.ctx.drawImage(this.videoPlayer.video, 0, 0, this.canvas.width, this.canvas.height);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
			// console.log(frame.data.length);
		}
	}, {
		key: 'play',
		value: function play(time) {
			this.videoPlayer.play(time);
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.videoPlayer.pause();
		}
	}, {
		key: 'resize',
		value: function resize() {}
	}]);

	return VideoCanvas;
}();

exports.default = VideoCanvas;

},{"./VideoPlayer":18}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoCloud = function () {
	function VideoCloud(videoCanvas) {
		_classCallCheck(this, VideoCloud);

		this.videoCanvas = videoCanvas;
		this.container = new THREE.Object3D();

		this.cloudZa = 50;
		this.cloudZb = this.cloudZa;
		this.cloudThickness = 2;

		this.initCloud();
	}

	_createClass(VideoCloud, [{
		key: 'initCloud',
		value: function initCloud() {
			/*
   const geometry = new THREE.Geometry();
   	for (let i = 0; i < 20000; i++) {
   	const vertex = new THREE.Vector3();
   	vertex.x = Math.random() * 2000 - 1000;
   	vertex.y = Math.random() * 2000 - 1000;
   	vertex.z = Math.random() * 2000 - 1000;
   		geometry.vertices.push(vertex);
   }
   	const material = new THREE.PointsMaterial({ size: 2 });
   	const points = new THREE.Points(geometry, material);
   this.container.add(points);
   */

			var cols = 128;
			var rows = 84;
			var maxParticleCount = cols * rows;

			var width = window.innerWidth / 2;
			var height = width / (cols / rows);

			var w = width / cols;
			var h = height / rows;

			// const positions = new Float32Array( segments * 3 );
			// const colors = new Float32Array( segments * 3 );

			var material = new THREE.MeshBasicMaterial({
				// const material = new THREE.PointsMaterial({
				vertexColors: THREE.VertexColors,
				// color: 0x666666,
				// size: 3,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide
			});

			// transparent: true,
			// sizeAttenuation: false,
			// wireframe: true
			var geometry = new THREE.BufferGeometry();
			var positions = new Float32Array(maxParticleCount * 3 * 2); // twice as many rows
			var anchors = new Float32Array(maxParticleCount * 3);
			var colors = new Float32Array(maxParticleCount * 3 * 2);
			var indices = new Uint32Array(maxParticleCount * 3 * 2);
			var data = [];

			for (var i = 0; i < maxParticleCount; i++) {
				var col = i % cols;
				var row = floor(i / cols);

				var x = col * w - width / 2;
				var y = row * -h + height / 2;
				var z = 0;

				positions[i * 3 + 0] = x;
				positions[i * 3 + 1] = y;
				positions[i * 3 + 2] = z;

				// duplicate all positions at the end of the array
				positions[(i + maxParticleCount) * 3 + 0] = x;
				positions[(i + maxParticleCount) * 3 + 1] = y;
				positions[(i + maxParticleCount) * 3 + 2] = z;

				// save original positions
				anchors[i * 3 + 0] = x;
				anchors[i * 3 + 1] = y;
				anchors[i * 3 + 2] = z;
			}

			// set indices
			var offset = 0;

			for (var ix = 0; ix < cols - 1; ix++) {
				for (var iy = 0; iy < rows; iy++) {

					var a = ix + cols * iy;
					var b = ix + cols * iy + 1;
					var c = ix + cols * iy + maxParticleCount + 1;
					var d = ix + cols * iy + maxParticleCount;

					indices[offset + 0] = a;
					indices[offset + 1] = b;
					indices[offset + 2] = d;

					indices[offset + 3] = d;
					indices[offset + 4] = b;
					indices[offset + 5] = c;

					offset += 6;
				}
			}

			geometry.setDrawRange(0, indices.length);
			geometry.setIndex(new THREE.BufferAttribute(indices, 1));
			geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
			geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

			geometry.computeBoundingSphere();

			// this.points = new THREE.Points(geometry, material);
			// this.points = new THREE.Line(geometry, material);
			this.points = new THREE.Mesh(geometry, material);
			this.container.add(this.points);

			this.maxParticleCount = maxParticleCount;
			this.positions = positions;
			this.colors = colors;
			this.anchors = anchors;
			this.data = data;
		}
	}, {
		key: 'update',
		value: function update() {
			// return;
			if (!this.videoCanvas.data) return;

			var cols = 128;
			var rows = 84;

			for (var i = 0; i < this.maxParticleCount; i++) {

				// get the particle
				var grey = this.videoCanvas.data[i * 4] / 255;
				var particleData = this.data[i];

				// const row = floor(i / cols);

				// const j = row * cols * 3;

				// this.positions[ i * 3     ] += particleData.velocity.x;
				// this.positions[ i * 3 + 1 ] += particleData.velocity.y;
				// this.positions[ i * 3 + 2 ] += particleData.velocity.z;

				// this.positions[ i * 3 + 2 ] += (grey * 100 - this.positions[ i * 3 + 2 ]) * 0.01;

				// top
				var a = i * 3;
				// bottom
				var b = (i + this.maxParticleCount) * 3;

				this.positions[a + 1] = this.anchors[a + 1] + grey * this.cloudThickness * -1;
				this.positions[b + 1] = this.anchors[a + 1] + grey * this.cloudThickness;

				this.positions[a + 2] = this.anchors[a + 2] + grey * this.cloudZa;
				this.positions[b + 2] = this.anchors[a + 2] + grey * this.cloudZb;

				// either #666 or #222
				var color = grey > 0.2 ? 0.4 : 0.1333;

				this.colors[a + 0] = color;
				this.colors[a + 1] = color;
				this.colors[a + 2] = color;

				this.colors[b + 0] = color;
				this.colors[b + 1] = color;
				this.colors[b + 2] = color;
			}

			this.points.geometry.attributes.position.needsUpdate = true;
			this.points.geometry.attributes.color.needsUpdate = true;
		}
	}]);

	return VideoCloud;
}();

exports.default = VideoCloud;

},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoPlayer = function () {
	_createClass(VideoPlayer, null, [{
		key: 'VIDEO_CANPLAY',
		get: function get() {
			return 'video-canplay';
		}
	}]);

	function VideoPlayer() {
		_classCallCheck(this, VideoPlayer);

		this.app = app;

		// get video from DOM
		this.video = document.querySelector('video');

		// remove video from DOM
		document.querySelector('body').removeChild(this.video);

		// create video element
		// this.video = document.createElement('video');
		// this.video.src = 'video/Sequence 256x256.mp4';
		// this.video.width = this.video.height = 256;

		// store original video size
		this.videoWidth = this.video.width;
		this.videoHeight = this.video.height;

		// clear width and height attributes from video tag
		this.video.removeAttribute('width');
		this.video.removeAttribute('height');

		this.handlerCanPlay = this.onCanPlay.bind(this);
		this.video.addEventListener('canplay', this.handlerCanPlay);

		this.resize();
	}

	_createClass(VideoPlayer, [{
		key: 'play',
		value: function play(time) {
			// console.log('VideoPlayer.play', time);
			this.video.currentTime = time * 0.001;
			this.video.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			// console.log('VideoPlayer.pause');
			this.video.pause();
		}
	}, {
		key: 'resize',
		value: function resize() {
			return;

			// window size
			var ww = window.innerWidth;
			var wh = window.innerHeight;

			// video size
			var vw = this.videoWidth;
			var vh = this.videoHeight;

			// scale favouring width or height, whatever is smaller
			var scale = ww / vw;
			if (vh * scale < wh) scale = wh / vh;

			// new size
			var nw = Math.ceil(vw * scale);
			var nh = Math.ceil(vh * scale);

			// scale to screen
			this.video.style.width = nw + 'px';
			// this.$container.style.width = `${nw}px`;
			// this.$container.style.height = `${nh}px`;

			var marginh = Math.ceil((wh - nh) / 2);
			var marginw = Math.ceil((ww - nw) / 2);

			// center
			this.video.style.marginLeft = marginw + 'px';
			this.video.style.marginTop = marginh + 'px';
		}
	}, {
		key: 'onCanPlay',
		value: function onCanPlay(e) {
			this.app.trigger(VideoPlayer.VIDEO_CANPLAY, e);

			// just once
			this.video.removeEventListener('canplay', this.handlerCanPlay);
		}
	}]);

	return VideoPlayer;
}();

exports.default = VideoPlayer;

},{}]},{},[4]);
