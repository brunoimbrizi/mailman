import MathUtils from '../../utils/MathUtils';

export default class BlocksA {

	constructor() {
		this.cols = 6;
		this.rows = 4;

		this.width = 360;
		this.height = 80;
		
		this.container = new THREE.Object3D();

		this.initBlocks();
	}

	initBlocks() {
		const w = this.width / (this.cols - 1);
		const h = this.height / (this.rows - 1);

		// const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
		const geometry = new THREE.PlaneBufferGeometry(2, 2);
		// const material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
			item.scale.x = values[v] * values[v] * 20;
			item.scale.y = values[v] * values[v];
			// item.scale.z = values[v] * 20;
			item.position.z = values[v] * 50 + 100;
			// item.rotation.y = values[v];
		}

	}

}
