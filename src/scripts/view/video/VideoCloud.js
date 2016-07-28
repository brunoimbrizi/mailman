export default class VideoCloud {

	constructor(videoCanvas) {
		this.videoCanvas = videoCanvas;
		this.container = new THREE.Object3D();

		this.cloudZa = 50;
		this.cloudZb = this.cloudZa;
		this.cloudThickness = 2;

		this.initCloud();
	}

	initCloud() {
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

		const cols = 128;
		const rows = 84;
		const maxParticleCount = cols * rows;
		
		const width = window.innerWidth / 2;
		const height = width / (cols / rows);
		
		const w = width / cols;
		const h = height / rows;

		// const positions = new Float32Array( segments * 3 );
		// const colors = new Float32Array( segments * 3 );

		const material = new THREE.MeshBasicMaterial({
			vertexColors: THREE.VertexColors,
			// color: 0xFFFFFF,
			size: 3,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide
			// transparent: true,
			// sizeAttenuation: false
			// wireframe: true
		});

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(maxParticleCount * 3 * 2); // twice as many rows
		const anchors = new Float32Array(maxParticleCount * 3);
		const colors = new Float32Array(maxParticleCount * 3 * 2);
		const indices = new Uint32Array(maxParticleCount * 3 * 2);
		const data = [];
		
		for (let i = 0; i < maxParticleCount; i++) {
			const col = i % cols;
			const row = floor(i / cols);

			const x = col * w - width / 2;
			const y = row * -h + height / 2;
			const z = 0;

			positions[ i * 3 + 0 ] = x;
			positions[ i * 3 + 1 ] = y;
			positions[ i * 3 + 2 ] = z;

			// duplicate all positions at the end of the array
			positions[ (i + maxParticleCount) * 3 + 0 ] = x;
			positions[ (i + maxParticleCount) * 3 + 1 ] = y;
			positions[ (i + maxParticleCount) * 3 + 2 ] = z;

			// save original positions
			anchors[ i * 3 + 0 ] = x;
			anchors[ i * 3 + 1 ] = y;
			anchors[ i * 3 + 2 ] = z;
		}

		// set indices
		let offset = 0;

		for (let ix = 0; ix < cols - 1; ix++) {
			for (let iy = 0; iy < rows; iy++) {

				const a = ix + cols * iy;
				const b = ix + cols * iy + 1;
				const c = ix + cols * iy + maxParticleCount + 1;
				const d = ix + cols * iy + maxParticleCount;

				indices[ offset + 0 ] = a;
				indices[ offset + 1 ] = b;
				indices[ offset + 2 ] = d;

				indices[ offset + 3 ] = d;
				indices[ offset + 4 ] = b;
				indices[ offset + 5 ] = c;

				offset += 6;
			}
		}

		geometry.setDrawRange(0, indices.length);
		geometry.setIndex(new THREE.BufferAttribute( indices, 1 ));
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

	update() {
		// return;
		if (!this.videoCanvas.data) return;

		const cols = 128;
		const rows = 84;

		for (let i = 0; i < this.maxParticleCount; i++ ) {

			// get the particle
			const grey = this.videoCanvas.data[i * 4] / 255;
			const particleData = this.data[i];

			// const row = floor(i / cols);

			// const j = row * cols * 3;

			// this.positions[ i * 3     ] += particleData.velocity.x;
			// this.positions[ i * 3 + 1 ] += particleData.velocity.y;
			// this.positions[ i * 3 + 2 ] += particleData.velocity.z;

			// this.positions[ i * 3 + 2 ] += (grey * 100 - this.positions[ i * 3 + 2 ]) * 0.01;

			// top
			const a = i * 3;
			// bottom
			const b = (i + this.maxParticleCount) * 3;

			this.positions[a + 1] = this.anchors[a + 1] + grey * this.cloudThickness * -1;
			this.positions[b + 1] = this.anchors[a + 1] + grey * this.cloudThickness;

			this.positions[a + 2] = this.anchors[a + 2] + grey * this.cloudZa;
			this.positions[b + 2] = this.anchors[a + 2] + grey * this.cloudZb;

			const color = (grey > 0.2) ? 1 : 0;

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

}
