import MathUtils from '../../utils/MathUtils';

export default class Grid {

	constructor() {
		this.cols = 20;
		this.rows = 10;
		this.width = 800;
		this.height = 400;
		
		this.container = new THREE.Object3D();

		this.initGrid();
	}

	initGrid() {
		const w = this.width / (this.cols - 1);
		const h = this.height / (this.rows - 1);

		const geometry = new THREE.CylinderBufferGeometry(5, 5, 20, 16);
		const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

		for (let i = 0; i < this.rows * this.cols; i++) {
			const col = i % this.cols;
			const row = floor(i / this.cols);

			const x = w * col - this.width * 0.5;
			const y = h * row - this.height * 0.5;

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = x;
			mesh.position.y = y;
			mesh.rotation.x = HALF_PI;
			this.container.add(mesh);
		}
	}

	update(values) {
		const length = this.container.children.length;
		const slice = values.slice(30, 30 + this.cols)

		for (let i = 0; i < length; i++) {
			const v = MathUtils.map(i, 0, length, 0, slice.length, true);
			const item = this.container.children[i];
			item.scale.x = slice[v] * 3;
			item.scale.z = slice[v] * 5;
			item.scale.y = slice[v] * 5;
		}

	}

}
