(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

		this.initAudio();
		this.initView();
	}

	_createClass(App, [{
		key: 'initAudio',
		value: function initAudio() {
			this.audio = new _AppAudio2.default();
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

},{"./audio/AppAudio":2,"./view/AppView":7}],2:[function(require,module,exports){
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
			return 1024;
		}
	}, {
		key: 'BINS',
		get: function get() {
			return 256;
		}
	}, {
		key: 'EVENT_AUDIO_ENDED',
		get: function get() {
			return 'audioEnded';
		}
	}, {
		key: 'EVENT_AUDIO_RESTARTED',
		get: function get() {
			return 'audioRestarted';
		}
	}]);

	function AppAudio() {
		_classCallCheck(this, AppAudio);

		this.initContext();
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
		key: 'initAnalyser',
		value: function initAnalyser() {
			this.values = [];

			this.analyserNode = this.ctx.createAnalyser();
			this.analyserNode.smoothingTimeConstant = 0.9;
			this.analyserNode.fftSize = this.FFT_SIZE;
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
			if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));

			this.sourceNode = this.ctx.createBufferSource();
			this.sourceNode.onended = this.onSourceEnded;
			this.sourceNode.connect(this.analyserNode);
			// this.sourceNode.playbackRate.value = this.playbackRate;
			this.sourceNode.buffer = this.buffer;
			this.ended = false;
			this.paused = false;

			if (this.pausedAt) {
				this.startedAt = Date.now() - this.pausedAt;
				this.sourceNode.start(0, this.pausedAt / 1000);
			} else {
				this.startedAt = Date.now();
				this.sourceNode.start(0);
			}
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.sourceNode.stop(0);
			this.pausedAt = Date.now() - this.startedAt;
			this.paused = true;
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

			var bin = Math.ceil(length / this.BINS);
			for (var i = 0; i < this.BINS; i++) {
				var sum = 0;
				for (var j = 0; j < bin; j++) {
					sum += freqData[i * bin + j];
				}

				// Calculate the average frequency of the samples in the bin
				var average = sum / bin;

				// Divide by 256 to normalize
				// this.values[i] = (average / this.BINS) / this.playbackRate;
				this.values[i] = average / this.BINS;
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
			this.play();
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

			window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
		}
	}]);

	return AppAudio;
}();

exports.default = AppAudio;

},{}],3:[function(require,module,exports){
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

},{"./App":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppThree = function () {
	function AppThree(view) {
		_classCallCheck(this, AppThree);

		this.view = view;
		this.renderer = this.view.renderer;

		this.initThree();
		this.initControls();
		this.initObject();
	}

	_createClass(AppThree, [{
		key: "initThree",
		value: function initThree() {
			// scene
			this.scene = new THREE.Scene();

			// camera
			this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
			this.camera.position.z = 300;
		}
	}, {
		key: "initControls",
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
		key: "initObject",
		value: function initObject() {
			var geometry = new THREE.BoxGeometry(200, 200, 200);
			// const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);
			var material = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
			var mesh = new THREE.Mesh(geometry, material);
			this.scene.add(mesh);
		}

		// ---------------------------------------------------------------------------------------------
		// PUBLIC
		// ---------------------------------------------------------------------------------------------

	}, {
		key: "update",
		value: function update() {
			this.controls.update();
		}
	}, {
		key: "draw",
		value: function draw() {
			this.renderer.render(this.scene, this.camera);
		}

		// ---------------------------------------------------------------------------------------------
		// EVENT HANDLERS
		// ---------------------------------------------------------------------------------------------

	}, {
		key: "resize",
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AudioBars = require('./bars/AudioBars');

var _AudioBars2 = _interopRequireDefault(_AudioBars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppTwo = function () {
	function AppTwo(view, audio) {
		_classCallCheck(this, AppTwo);

		this.view = view;
		this.audio = audio;

		this.initSketch();
		this.initAudioBars();
	}

	_createClass(AppTwo, [{
		key: 'initSketch',
		value: function initSketch() {
			this.sketch = Sketch.create({
				type: Sketch.CANVAS,
				container: document.querySelector('#container2D'),
				autopause: false,
				retina: window.devicePixelRatio >= 2,
				fullscreen: true
			});
		}
	}, {
		key: 'update',
		value: function update() {
			this.bars.update();
		}
	}, {
		key: 'draw',
		value: function draw() {
			this.bars.draw();
		}
	}, {
		key: 'initAudioBars',
		value: function initAudioBars() {
			this.bars = new _AudioBars2.default(this.sketch);
		}
	}]);

	return AppTwo;
}();

exports.default = AppTwo;

},{"./bars/AudioBars":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppUI = function () {
	function AppUI(view) {
		_classCallCheck(this, AppUI);

		this.view = view;

		this.roughness = 1.0;
		this.range = [0, 1];

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

			this.controlKit.addPanel({ width: 300 }).addSubGroup({ label: 'Material' }).addSlider(this, 'roughness', 'range', { onChange: function onChange() {
					that.onMaterialChange();
				} });
		}
	}, {
		key: 'onMaterialChange',
		value: function onMaterialChange(index) {
			// console.log('onChange', index, this.view);
			// this.view.three.updateMaterial();
		}
	}]);

	return AppUI;
}();

exports.default = AppUI;

},{}],7:[function(require,module,exports){
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppView = function () {
	function AppView(app) {
		_classCallCheck(this, AppView);

		this.audio = app.audio;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

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
				_this.initTwo();
				_this.initThree();
				_this.initUI();
			};

			this.sketch.update = function () {
				_this.audio.update();
				_this.two.update();
				_this.three.update();
			};

			this.sketch.draw = function () {
				_this.two.draw();
				_this.three.draw();
			};

			this.sketch.resize = function () {
				_this.hw = _this.sketch.width * 0.5;
				_this.hh = _this.sketch.height * 0.5;

				_this.three.resize();
			};

			this.sketch.touchstart = function (e) {
				var touch = _this.sketch.touches[0];
			};

			this.sketch.touchmove = function () {};

			this.sketch.touchend = function () {};
		}
	}, {
		key: 'initTwo',
		value: function initTwo() {
			this.two = new _AppTwo2.default(this, this.audio);
		}
	}, {
		key: 'initThree',
		value: function initThree() {
			// transfer canvas to container3D
			document.querySelector('#container3D').appendChild(this.renderer.domElement);

			this.three = new _AppThree2.default(this);
		}
	}, {
		key: 'initUI',
		value: function initUI() {
			this.ui = new _AppUI2.default(this);
		}
	}]);

	return AppView;
}();

exports.default = AppView;

},{"./AppThree":4,"./AppTwo":5,"./AppUI":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioBars = function () {
	function AudioBars(ctx) {
		_classCallCheck(this, AudioBars);

		this.ctx = ctx;
	}

	_createClass(AudioBars, [{
		key: "update",
		value: function update() {}
	}, {
		key: "draw",
		value: function draw() {}
	}]);

	return AudioBars;
}();

exports.default = AudioBars;

},{}]},{},[3]);
