import AppData from './data/AppData';
import AppAudio from './audio/AppAudio';
import AppView from './view/AppView';

export default class App {

	constructor(el) {
		this.el = el;

		this.initLoader();
	}

	initLoader() {
		this.preloader = new createjs.LoadQueue();
		this.preloader.installPlugin(createjs.Sound);

		this.preloader.addEventListener('progress', (e) => {
			console.log('preloader', e);
			const progress = Math.round(e.progress * 100);
			document.querySelector('.info .content h2').innerHTML = `LOADING ${progress}`;
		});

		this.preloader.addEventListener('complete', (e) => {
			console.log('preloader', e);
			requestAnimationFrame(() => {
				document.querySelector('.info').classList.add('hide');
				
				// this.initData();
				this.initAudio();
				this.initView();
			});
		});

		this.preloader.loadManifest('data/manifest.json');
	}

	initData() {
		this.data = new AppData();
	}

	initAudio() {
		this.audio = new AppAudio();
	}

	initView() {
		this.view = new AppView();
	}
}
