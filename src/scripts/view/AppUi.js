export default class AppUI {

	constructor(view) {
		this.view = view;

		this.roughness = 1.0;
		this.range = [0, 1];

		this.initControlKit();
	}

	initControlKit() {
		const that = this;

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

		this.controlKit.addPanel({ width: 300 })

		.addSubGroup({label: 'Material'})
		.addSlider(this, 'roughness', 'range', { onChange: () => { that.onMaterialChange(); } })
	}

	onMaterialChange(index) {
		// console.log('onChange', index, this.view);
		// this.view.three.updateMaterial();
	}
}
