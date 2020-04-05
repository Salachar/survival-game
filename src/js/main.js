const GOM = require('./core/game-object-manager');
const GIM = require('./core/game-input-manager');

const Menu = require('./game/menus/menu');

const GI = require('./game/game-input');
const CONFIG = require('./game/game-config');

const Player = require('./game/objects/player');
const Wall = require('./game/objects/wall');

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
		this.createDebugWalls();
	}

	spawnPlayer () {
		new Player({
			layer: GOM.front,
			x: 100,
			y: 100,
		});
	}

	createDebugWalls () {
		let walls = [
			[0, 0, window.innerWidth, 20],
			[window.innerWidth - 20, 0, 20, window.innerHeight],
			[0, window.innerHeight - 20, window.innerWidth, 20],
			[0, 0, 20, window.innerHeight],
			[50, 600, 400, 30],
			[200, 100, 500, 50],
			[800, 100, 20, 600],
		];
		walls.forEach((wall) => {
			new Wall({
				layer: GOM.middle,
				x: wall[0],
				y: wall[1],
				width: wall[2],
				height: wall[3],
			});
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
