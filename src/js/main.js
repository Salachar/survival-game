const GOM = require('./core/game-object-manager');
const GIM = require('./core/game-input-manager');

const Menu = require('./game/menus/menu');

const GI = require('./game/game-input');
const CONFIG = require('./game/game-config');

const Player = require('./game/objects/player');

const APP = {};
window.APP = APP;

class Game {
	constructor () {
		this.initialize();
		this.start();
	}

	initialize () {
		GOM.shutdownAll();
		GOM.clearAllContexts();
		GIM.register(GI);
	}

	start () {
		this.spawnPlayer();
	}

	spawnPlayer () {
		new Player({
			layer: GOM.front,
			x: 100,
			y: 100,
		});
	}
}

window.onload = () => {
    // APP is only used for debugging purposes for easy inspector access
    APP.Game = new Game();
	APP.GOM = GOM;
	APP.GIM = GIM;
}

window.onresize = () => {
	GOM.resize();
}
