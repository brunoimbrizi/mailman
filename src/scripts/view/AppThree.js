import Grid from './grid/Grid';
import VideoCloud from './video/VideoCloud';

export default class AppThree {

	constructor(view, audio) {
		this.view = view;
		this.audio = audio;
		this.renderer = this.view.renderer;

		this.visible = false;

		this.initThree();
		this.initControls();
		this.initLights();
		// this.initObject();
		this.initGrid();
		this.initVideoCloud();
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;
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
		this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
		this.directionalLight.position.set(1, 1, 1);
		this.scene.add(this.directionalLight);

		this.pointLight = new THREE.PointLight(0xFFFFFF, 1);
		this.pointLight.position.set(0, 50, 100);
		// this.scene.add(this.pointLight);
	}

	initObject() {
		const geometry = new THREE.BoxGeometry(200, 200, 200);
		// const geometry = new THREE.PlaneGeometry(400, 400, 20, 20);
		const material = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
	}

	initGrid() {
		this.grid = new Grid();
		// this.scene.add(this.grid.container);
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
		this.videoCloud.update();
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

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = this.view.sketch.width / this.view.sketch.height;
		this.camera.updateProjectionMatrix();;

		this.renderer.setSize(this.view.sketch.width, this.view.sketch.height);

		this.hw = this.view.sketch.width * .5;
		this.hh = this.view.sketch.height * .5;
	}
}
