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

		const material = new THREE.PointsMaterial({
			vertexColors: THREE.VertexColors,
			// color: 0xFFFFFF,
			size: 3,
			blending: THREE.AdditiveBlending,
			// transparent: true,
			sizeAttenuation: false
		});

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(maxParticleCount * 3);
		const colors = new Float32Array(maxParticleCount * 3);
		const data = [];
		
		for (let i = 0; i < maxParticleCount; i++) {
			const col = i % cols;
			const row = floor(i / cols);

			const x = col * w - width / 2;
			const y = row * -h + height / 2;
			const z = 0;

			positions[ i * 3     ] = x;
			positions[ i * 3 + 1 ] = y;
			positions[ i * 3 + 2 ] = z;

			// add it to the geometry
			data.push( {
				// velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 )
				velocity: new THREE.Vector3()
			});
		}

		geometry.setDrawRange(0, maxParticleCount);
		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3).setDynamic(true));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3).setDynamic(true));

		this.points = new THREE.Points(geometry, material);
		this.container.add(this.points);

		this.maxParticleCount = maxParticleCount;
		this.positions = positions;
		this.colors = colors;
		this.data = data;
	}

	update() {
		if (!this.videoCanvas.data) return;

		for (let i = 0; i < this.maxParticleCount; i++ ) {

			// const imgCol = i * 4 * scale;
			// const imgRow = ((i * 4) / (cols * scale))

			// get the particle
			const grey = this.videoCanvas.data[i * 4] / 255;
			const particleData = this.data[i];

			// this.positions[ i * 3     ] += particleData.velocity.x;
			// this.positions[ i * 3 + 1 ] += particleData.velocity.y;
			// this.positions[ i * 3 + 2 ] += particleData.velocity.z;

			// this.positions[ i * 3 + 2 ] += (grey * 100 - this.positions[ i * 3 + 2 ]) * 0.01;

			// this.positions[ i * 3 + 2 ] += grey;
			this.positions[ i * 3 + 2 ] = grey * 200;

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
