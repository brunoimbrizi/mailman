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
		const w = this.width / this.cols;
		const h = this.height / this.rows;

		const geometry = new THREE.CylinderBufferGeometry(5, 5, 20, 16);
		const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

		for (let i = 0; i < this.rows * this.cols; i++) {
			const col = i % this.cols;
			const row = floor(i / this.cols);

			const x = w * col;
			const y = h * row;

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.x = x;
			mesh.position.y = y;
			this.container.add(mesh);
		}
	}

}
