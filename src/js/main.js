const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');

const Menu = require('game/menus/menu');

const GI = require('game/game-input');
const CONFIG = require('game/game-config');

const Player = require('game/objects/player');
const Wall = require('game/objects/terrain/wall');

const REAL_MAP = require('game/worlds/real');
const DEBUG_MAP = require('game/worlds/debug');
const SIMPLE_MAP = require('game/worlds/simple');

const World = require('game/world');

const APP = {};
window.APP = APP;

class Game {
	constructor () {
		this.world = null;

		this.initialize();
		this.start();
	}

	initialize () {
		GOM.shutdownAll();
		GOM.clearAllContexts();
		GIM.register(GI);
	}

	start () {
		// this.world = new World(REAL_MAP);
		this.world = new World(DEBUG_MAP);
		// this.world = new World(SIMPLE_MAP);
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
