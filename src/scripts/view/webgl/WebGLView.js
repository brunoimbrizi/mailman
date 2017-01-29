import AppAudio from '../../audio/AppAudio';

import Grid from './grid/Grid';
// import BlocksA from './blocks/BlocksA';
// import VideoCloud from './video/VideoCloud';

export default class WebGLView {

	constructor() {
		this.view = app.view;
		this.audio = app.audio;
		this.renderer = this.view.renderer;

		this.visible = true;

		this.initThree();
		this.initControls();
		this.initLights();
		this.initObject();
		// this.initGrid();
		// this.initBlocks();
		// this.initVideoCloud();

		this.audio.on(AppAudio.AUDIO_PEAK, this.onAudioPeak.bind(this));
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 480;
	}

	initControls() {
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

	initLights() {
		this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
		this.directionalLight.position.set(1, 1, 1);
		this.scene.add(this.directionalLight);

		this.pointLight = new THREE.PointLight(0xFFFFFF, 1);
		this.pointLight.position.set(0, 50, 300);
		// this.scene.add(this.pointLight);
		this.camera.add(this.pointLight);

		this.scene.add(this.camera);
	}

	initObject() {
		const geometry = new THREE.BoxGeometry(200, 200, 200);
		// const material = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
		const material = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);

		this.object = mesh;
		this.object.rotation.y = random(HALF_PI / 2);
		this.object.rotation.x = random(HALF_PI / 2);
	}

	initGrid() {
		this.grid = new Grid();
		// this.scene.add(this.grid.container);
	}

	initBlocks() {
		this.blocksA = new BlocksA();
		this.scene.add(this.blocksA.container);
	}

	initVideoCloud() {
		this.videoCloud = new VideoCloud(this.view.video);
		this.scene.add(this.videoCloud.container);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (!this.visible) return;

		this.controls.update();
		// this.grid.update(this.audio.values);
		// this.blocksA.update(this.audio.values);
		// this.videoCloud.update();

		// this.object.rotation.y *= 0.98;
		// this.object.rotation.z *= 0.98;

		this.pointLight.intensity *= 0.9;
	}

	draw() {
		if (!this.visible) {
			this.renderer.clear();
			return;
		}

		this.renderer.render(this.scene, this.camera);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onAudioPeak(e) {
		if (this.object) {
			// this.object.rotation.y = random(HALF_PI / 2);
			// this.object.rotation.z = random(HALF_PI / 2);
		}

		this.pointLight.intensity = 1;
	}

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
		this.camera.updateProjectionMatrix();;

		this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);
	}
}
