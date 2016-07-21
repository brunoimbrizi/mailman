export default class VideoCloud {

	constructor(videoCanvas) {
		this.videoCanvas = videoCanvas;
		this.container = new THREE.Object3D();

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
			// transparent: true,
			// sizeAttenuation: false
			wireframe: true
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

			// set indices
			// indices[ i * 6 + 0 ] = ;

			// add it to the geometry
			// data.push( {
				// velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 )
				velocity: new THREE.Vector3()
			// });
		}

		geometry.setDrawRange(0, maxParticleCount * 2);
		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));
		// geometry.addAttribute('anchor', new THREE.BufferAttribute(anchors, 3).setDynamic(false));

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

			const row = floor(i / cols);

			// const j = row * cols * 3;

			// this.positions[ i * 3     ] += particleData.velocity.x;
			// this.positions[ i * 3 + 1 ] += particleData.velocity.y;
			// this.positions[ i * 3 + 2 ] += particleData.velocity.z;

			// this.positions[ i * 3 + 2 ] += (grey * 100 - this.positions[ i * 3 + 2 ]) * 0.01;

			// y
			this.positions[ i * 3 + 1 ] = this.anchors[ i * 3 + 1 ] + grey * 10;
			this.positions[ (i + this.maxParticleCount) * 3 + 1 ] = this.anchors[ (i + this.maxParticleCount) * 3 + 1 ] + grey * -10;

			// z
			// this.positions[ i * 3 + 2 ] = grey * 20;
			// this.positions[ (i + this.maxParticleCount) * 3 + 2 ] = grey * -20;

			this.colors[i * 3 + 0] = grey;
			this.colors[i * 3 + 1] = grey;
			this.colors[i * 3 + 2] = grey;


			// if ( this.positions[ i * 3 + 1 ] < -rHalf || this.positions[ i * 3 + 1 ] > rHalf )
				// particleData.velocity.y = -particleData.velocity.y;

			// if ( this.positions[ i * 3 ] < -rHalf || this.positions[ i * 3 ] > rHalf )
				// particleData.velocity.x = -particleData.velocity.x;

			// if ( this.positions[ i * 3 + 2 ] < -rHalf || this.positions[ i * 3 + 2 ] > rHalf )
				// particleData.velocity.z = -particleData.velocity.z;

			// if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
				// continue;

			/*
			// Check collision
			for (let j = i + 1; j < this.maxParticleCount; j++) {

				const particleDataB = this.data[ j ];
				// if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
					// continue;

				const dx = this.positions[ i * 3     ] - this.positions[ j * 3     ];
				const dy = this.positions[ i * 3 + 1 ] - this.positions[ j * 3 + 1 ];
				const dz = this.positions[ i * 3 + 2 ] - this.positions[ j * 3 + 2 ];
				const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

				if ( dist < effectController.minDistance ) {

					particleData.numConnections++;
					particleDataB.numConnections++;

					const alpha = 1.0 - dist / effectController.minDistance;

					positions[ vertexpos++ ] = this.positions[ i * 3     ];
					positions[ vertexpos++ ] = this.positions[ i * 3 + 1 ];
					positions[ vertexpos++ ] = this.positions[ i * 3 + 2 ];

					positions[ vertexpos++ ] = this.positions[ j * 3     ];
					positions[ vertexpos++ ] = this.positions[ j * 3 + 1 ];
					positions[ vertexpos++ ] = this.positions[ j * 3 + 2 ];

					colors[ colorpos++ ] = alpha;
					colors[ colorpos++ ] = alpha;
					colors[ colorpos++ ] = alpha;

					colors[ colorpos++ ] = alpha;
					colors[ colorpos++ ] = alpha;
					colors[ colorpos++ ] = alpha;

					numConnected++;
				}
			}
			*/


		}

		this.points.geometry.attributes.position.needsUpdate = true;
		this.points.geometry.attributes.color.needsUpdate = true;
	}

}
