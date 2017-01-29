import MathUtils from '../../../utils/MathUtils';

export default class Grid {

	constructor() {
		this.cols = 16;
		this.rows = 9;
		this.width = 480;
		this.height = 270;
		
		this.container = new THREE.Object3D();

		this.initGrid();
	}

	initGrid() {
		const w = this.width / (this.cols - 1);
		const h = this.height / (this.rows - 1);

		// const geometry = new THREE.CylinderBufferGeometry(5, 5, 10, 6);
		const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
		const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });

		for (let i = 0; i < this.rows * this.cols; i++) {
			const col = i % this.cols;
			const row = floor(i / this.cols);

			const x = w * col - this.width * 0.5;
			const y = h * row * -1 + this.height * 0.5;

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = x;
			mesh.position.y = y;
			// mesh.rotation.x = HALF_PI;
			// mesh.rotation.z = i * PI * 0.01;
			this.container.add(mesh);

			mesh.index = floor(random(24, 48));
		}
	}

	update(values) {
		// return;
		const length = this.container.children.length;
		// const slice = values.slice(30, 30 + this.cols);

		for (let i = 0; i < length; i++) {
			// const v = MathUtils.map(i, 0, length, 0, slice.length - 1, true);
			// const v = MathUtils.map(i, 0, length, 0, values.length - 1, true);
			const item = this.container.children[i];
			const v = item.index;
			if (!values[v]) continue;
			item.scale.x = values[v] * values[v] * 2;
			item.scale.y = values[v] * 2;
			item.scale.z = values[v] * 20;
			item.position.z = item.scale.z * 2.5;
			// item.rotation.y = values[v];
		}

	}

}
