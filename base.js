/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class GOM {
	constructor () {
		this.MILLISECONDS_BETWEEN_FRAMES = 16; // (1 / 60) * 1000
		this.GAME_LOOP = 0;
		this.last_frame = new Date().getTime();

		this.__props = {};

		this.__props.game_objects = [];
		this.__props.collidable_objects = [];
		this.__props.added_game_objects = [];

		this.startup();
	}

	set game_objects (new_game_objects) {
		this.__props.game_objects = new_game_objects;
	}

	get game_objects () {
		return this.__props.game_objects;
	}

	set collidable_objects (new_collidable_objects) {
		this.__props.collidable_objects = new_collidable_objects;
	}

	get collidable_objects () {
		return this.__props.collidable_objects;
	}

	set added_game_objects (new_added_game_objects) {
		this.__props.added_game_objects = new_added_game_objects;
	}

	get added_game_objects () {
		return this.__props.added_game_objects;
	}

	clearLayerObjects (layerObjects) {
		for (let i = 0; i < layerObjects.list.length; ++i) {
			if (layerObjects.list[x].shutdown) {
				layerObjects.list[x].shutdown();
			}
		}
		layerObjects.list = [];
	}

	clearLayer (layer) {
		layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		layer.backBufferContext.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
	}

	drawLayer (layer) {
		layer.backBufferContext.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

		let newObjList = [];
		for (let i = 0; i < layer.objects.list.length; ++i) {
			let obj = layer.objects.list[i];
			if (obj.remove) continue;
			newObjList.push(obj);
			obj.draw();
		}

		layer.objects.list = newObjList;
		layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		layer.context.drawImage(layer.backBuffer, 0, 0);
	}

	draw () {
		// The main game loop cares only about drawing the foreground every frame.
		// The middleground and background are for more persistent/heavy objects and is redrawn
		// through manual calls.

		// calculate the time since the last frame
		const this_frame = new Date().getTime();
		const dt = (this_frame - this.last_frame) / 1000;
		this.last_frame = this_frame;
		// this.el_fps_counter.innerHTML = Math.ceil(1 / dt);

		this.addNewGameObjects();

		this.front.backBufferContext.clearRect(0, 0, this.front.canvas.width, this.front.canvas.height);

		let new_objects_list = [];
		let new_collidable_objects_list = [];
		for (let i = 0; i < this.game_objects.length; ++i) {
			let gameObj = this.game_objects[i];

			if (gameObj.update) {
				gameObj.update();
			}

			if (gameObj.remove) {
				gameObj = null;
				continue;
			}

			new_objects_list.push(gameObj);
			if (gameObj.collidable) {
				new_collidable_objects_list.push(gameObj);
			}

			if (gameObj.layer && gameObj.layer.zIndex === 3) {
				gameObj.draw();
			}
		}

		this.game_objects = new_objects_list;
		this.collidable_objects = new_collidable_objects_list;

		this.front.context.clearRect(0, 0, this.front.canvas.width, this.front.canvas.height);
		this.front.context.drawImage(this.front.backBuffer, 0, 0);

		if (this.middle.update) {
			this.middle.draw();
			this.middle.update = false;
		}
		if (this.back.update) {
			this.back.draw();
			this.back.update = false;
		}

		// this.el_num_objects_counter.innerHTML = this.game_objects.length;
	}

	addNewGameObjects () {
		if (this.added_game_objects.length !== 0) {
			for (let i = 0; i < this.added_game_objects.length; ++i) {
				this.game_objects.push(this.added_game_objects[i]);
				if (this.added_game_objects[i].collidable) {
					this.collidable_objects.push(this.added_game_objects[i]);
				}
			}
			this.added_game_objects = [];
			this.game_objects.sort((a,b) => {
				return a.zOrder - b.zOrder;
			});
		}
	}

	eventOnObjects (event, data, object_exclude) {
		let locked_object = null;
		for (let i = 0; i < this.game_objects.length; ++i) {
			if (object_exclude && object_exclude.id === this.game_objects[i].id) continue;
			locked_object = this.eventOnObject(event, data, this.game_objects[i]);
			if (locked_object) return locked_object;
		}
	}

	eventOnObject (event, data, object) {
		if (!object) return null;
		const lock = object[event](data);
		if (event.match(/mClick|mDown|mUp/) && lock) return object;
		return null;
	}

	setCanvasSize () {
		// Get the width and height for you canvas, taking into account any constant menus.
		const container = document.getElementById('canvas_container');
		let canvasWidth = container.clientWidth;
		let canvasHeight = container.clientHeight;

		// Loop through the canvases and set the width and height
		['control', 'effects', 'front', 'middle', 'back'].forEach((canvas_key) => {
			this[canvas_key].canvas.setAttribute('width', canvasWidth + 'px');
			this[canvas_key].canvas.setAttribute('height', canvasHeight + 'px');
			this[canvas_key].canvas.style.width  = canvasWidth + 'px';
			this[canvas_key].canvas.style.height = canvasHeight + 'px';
			this[canvas_key].backBuffer.setAttribute('width', canvasWidth + 'px');
			this[canvas_key].backBuffer.setAttribute('height', canvasHeight + 'px');
			this[canvas_key].backBuffer.style.width  = canvasWidth + 'px';
			this[canvas_key].backBuffer.style.height = canvasHeight + 'px';
		});
	}

	startup () {
		['control', 'effects', 'front', 'middle', 'back'].forEach((canvas_key) => {
			this[canvas_key] = {
				canvas : document.getElementById(`${canvas_key}_canvas`),
				context : null,
				backBuffer : document.createElement('canvas'),
				backBufferContext : null,
				zIndex : 3,
				update: false,
				objects : {
					list : [],
					clear: () => {
						this.clearLayerObjects(this[canvas_key]);
					}
				},
				draw: () => {
					this.drawLayer(this[canvas_key]);
				},
				clear: () => {
					this.clearLayer(this[canvas_key]);
				}
			};
			this[canvas_key].context =  this[canvas_key].canvas.getContext('2d');
			this[canvas_key].backBufferContext =  this[canvas_key].backBuffer.getContext('2d');
		});

		this.setCanvasSize();
		// this.startLoop();
		this.gameLoop();
	}

	onCollidables (func, params) {
		const collidables = this.collidable_objects;
		for (let i = 0; i < collidables.length; ++i) {
			const obj = collidables[i];
			if (obj && obj[func]) {
				obj[func](params);
			}
		}
	}

	gameLoop () {
		window.requestAnimationFrame(() => {
			this.gameLoop();
		});
		this.draw();
	}

	// startLoop () {
	// 	// setInterval will call the function for our game loop
	// 	this.GAME_LOOP = setInterval(() => {
	// 		this.draw();
	// 	}, this.MILLISECONDS_BETWEEN_FRAMES);
	// }

	pauseLoop () {
		clearInterval(this.GAME_LOOP);
		this.GAME_LOOP = null;
	}

	resize () {
		this.setCanvasSize();
	}

	shutdownAll () {
		this.eventOnObjects('shutdown');
		this.game_objects = [];
		this.collidable_objects = [];
		this.added_game_objects = [];
		this.clearAllContexts();
	}

	addGameObject (game_object) {
		this.added_game_objects.push(game_object);
		if (game_object.layer) {
			game_object.layer.objects.list.push(game_object);
			game_object.layer.update = true;
		}
	}

	clearAllContexts () {
		this.front.clear();
		this.middle.clear();
		this.back.clear();
	}
}

module.exports = new GOM();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class CONFIG {
    constructor () {
        this.__props = {

        };
    }
}

module.exports = new CONFIG();


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const Helpers = {
	uuid: function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	rgba: function (r,g,b,a) {
		var a = (a) ? a : 1;
		return "rgba(" + r + "," + g + "," + b + "," + a + ")"
	},

	sqr: function (value) {
		return value * value;
	},

	getDistance: function (p1, p2, no_sqrt) {
		let dist = Helpers.sqr(p1.x - p2.x) + Helpers.sqr(p1.y - p2.y);
		if (no_sqrt) return dist;
		return Math.sqrt(dist);
	},

	getRandomArbitrary: function (min, max){
		return Math.random() * (max - min) + min;
	},

	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	returnRandom: function (numbers) {
		var length = numbers.length;
		var index = getRandomInt(0, length-1);
		return numbers[index];
	},

	percentage: function (percent) {
		return (getRandomInt(1,100) >= percent);
	},

	getMouseCoords: function (event, canvas) {
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = canvas;

		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;

		while(currentElement = currentElement.offsetParent){
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		}

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return {
			x : canvasX,
			y : canvasY
		};
	},

    createElement: function (type, classes, opts) {
        opts = opts || {};
        let node = document.createElement(type);
        let classes_split = classes.split(' ');
        for (let i = 0; i < classes_split.length; ++i) {
            node.classList.add(classes_split[i]);
        }
        if (opts.attributes) {
            for (let attr in opts.attributes) {
                if (opts.attributes[attr]) {
                    node.setAttribute(attr, opts.attributes[attr]);
                }
            }
        }
        if (opts.dataset) {
            for (let data in opts.dataset) {
                if (opts.dataset[data]) {
                    node.dataset[data] = opts.dataset[data];
                }
            }
        }
        if (opts.events) {
            for (let event in opts.events) {
                node.addEventListener(event, opts.events[event]);
            }
        }
        if (opts.html) {
            node.innerHTML = opts.html;
        }
        if (opts.addTo) {
            opts.addTo.appendChild(node);
        }
        return node;
    }
};
module.exports = Helpers;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(2);
const getMouseCoords = Helpers.getMouseCoords;

// var SPACE_BAR = 32;
// var LEFT_ARROW = 37;
// var UP_ARROW = 38;
// var RIGHT_ARROW = 39;
// var DOWN_ARROW = 40;

// var SPACE_BAR_DOWN = false;
// var LEFT_ARROW_DOWN = false;
// var UP_ARROW_DOWN = false;
// var RIGHT_ARROW_DOWN = false;
// var DOWN_ARROW_DOWN = false;

const KEY_CODES = {
	32: 'SPACE',
	37: 'LEFT',
	38: 'UP',
	39: 'RIGHT',
	40: 'DOWN',
	87: 'W',
	65: 'A',
	83: 'S',
	68: 'D'
};

class GIM {
	constructor () {
		this.mouse = {
			x: 0,
			y: 0,
			prev: {
				x: 0,
				y: 0
			}
		};

		this.keysDown = {};
		this.input_managers = [];

		this.setupKeyEvents();
		this.setupControlCanvasEvents();
	}

	register (input_manager) {
		this.input_managers.push(input_manager);
	}

	setupKeyEvents () {
		document.addEventListener('keypress', (event) => {
			if (!KEY_CODES[event.keyCode]) return;
			const key = KEY_CODES[event.keyCode];
			this.fireEvent('keyPress', key);
		});

		document.addEventListener('keydown', (event) => {
			if (!KEY_CODES[event.keyCode]) return;
			const key = KEY_CODES[event.keyCode];
			this.keysDown[key] = true;
			GOM.eventOnObjects('keyDown', key);
		});

		document.addEventListener('keyup', (event) => {
			const key = KEY_CODES[event.keyCode];
			delete this.keysDown[key];
			GOM.eventOnObjects('keyUp', key);
		});
	}

	fireEvent (event, data) {
		let prev_locked_object = this.locked_object;
		// Check to see if there is a locked object, if there is, only fire the event on it
		if (this.locked_object) {
			this.locked_object = GOM.eventOnObject(event, data, this.locked_object);
			// Check to see if the object and event are still locked, if so, return
			if (this.locked_object) return;
		}
		// prev_locked_object will be passed over when the events are fired, this is
		// because if prev_locked_event was an object, the event would have been fired
		// on it above to see if it was still locked. We don't want double events.
		this.locked_object = GOM.eventOnObjects(event, data, prev_locked_object);
		// Don't fire the event on the input manager if an object is locked
		if (this.locked_object) return;

		this.input_managers.forEach((input_manager) => {
			input_manager[event](data);
		});
	}

	setupControlCanvasEvents () {
		GOM.control.canvas.addEventListener('click', (event) => {
			this.fireEvent('mClick', this.mouse);
		});

		GOM.control.canvas.addEventListener('mousedown', (event) => {
			if (event.which !== 1) return;
			this.fireEvent('mDown', this.mouse);
		});

		GOM.control.canvas.addEventListener('mouseup', (event) => {
			this.fireEvent('mUp', this.mouse);
		});

		GOM.control.canvas.addEventListener('mouseleave', (event) => {
			this.fireEvent('mLeave', this.mouse);
		});

		GOM.control.canvas.addEventListener('mousemove', (event) => {
			const pos = getMouseCoords(event, GOM.control.canvas);
			if (this.mouse.prev.x !== this.mouse.x) {
				this.mouse.prev.x = this.mouse.x;
			}
			if (this.mouse.prev.y !== this.mouse.y) {
				this.mouse.prev.y = this.mouse.y;
			}
			this.mouse.x = pos.x;
			this.mouse.y = pos.y;
		});
	}
}

module.exports = new GIM();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(5);
const CONFIG = __webpack_require__(1);

const { getDistance, getRandomInt, rgba, sqr } = __webpack_require__(2);

class Projectile extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = "projectile";

		this.z = 1000000;

		this.__props.velX = (opts.velX !== null) ? opts.velX : (-1 + (Math.random() * 2));
		this.__props.velY = (opts.velY !== null) ? opts.velY : (-1 + (Math.random() * 2));

		this.width = 2;
		this.height = 2;

		return this;
	}

	get velX () {
		return this.__props.velX;
	}

	set velX (new_velX) {
		this.__props.velX = new_velX;
	}

	get velY () {
		return this.__props.velY;
	}

	set velY (new_velY) {
		this.__props.velY = new_velY;
	}

	checkBounds () {
		const x_bound = this.layer.canvas.width;
		const y_bound = this.layer.canvas.height;

		if (CONFIG.confine_projectiles) {
			if (this.x < 0 || this.x > x_bound) {
				this.velX *= -1;
			}
			if (this.y < 0 || this.y > y_bound) {
				this.velY *= -1;
			}
		} else {
			if (this.x > x_bound || this.x < 0 || this.y > y_bound || this.y < 0) {
				this.shutdown();
			}
		}
	}

	checkCollisions () {
		GOM.onCollidables('checkCollision', {
			caller: this
		});
	}

	update () {
		this.x += this.velX;
		this.y += this.velY;
		// if (this.)
		this.checkBounds();
		if (this.remove) return;
		this.checkCollisions();
	}

	draw () {
		this.context.save();
			// this.context.shadowBlur = 10;
			// this.context.shadowColor = '#FFFFFF';

			this.context.beginPath();
			this.context.rect(this.x - 1, this.y - 1, 2, 2);
			this.context.fillStyle = '#FFFFFF';
			this.context.fill();

			// // Draw the tail on the asteroid
			// this.context.save();
			// 	this.context.globalAlpha = 0.3;
			// 	this.context.beginPath();
			// 	this.context.lineWidth = 2;
			// 	this.context.moveTo(this.x -1, this.y -1);
			// 	this.context.lineTo(
			// 		(this.x -1) + (-1 * this.velX * 5),
			// 		(this.y -1) + (-1 * this.velY * 5)
			// 	);

			// 	this.context.strokeStyle = "#FFFFFF";
			// 	this.context.stroke();
			// this.context.restore();
		this.context.restore();
	}
}

module.exports = Projectile;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(2);
const uuid = Helpers.uuid;

class GOB {
	constructor (opts = {}) {
		this.id = uuid();

		this.x = opts.x || 0;
		this.y = opts.y || 0;

		this.collidable = false;

		this.__props = {};

		this.mouse_lock = {
			mClick: false,
			mDown: false,
			mUp: false,
			mLeave: false
		};

		this.__props.dimensions = {
			width: 0,
			half_width: 0,
			height: 0,
			half_height: 0
		};

		// x and y coords of the center of the object
		this.__props.center = {
			x: 0,
			y: 0
		}

		this.zOrder = opts.z || 0;

		this.remove = false;
		this.layer = opts.layer || null;
		this.context = (this.layer) ? this.layer.backBufferContext : null;

		GOM.addGameObject(this);
	}

	set width (new_width) {
		this.__props.dimensions.width = new_width;
		this.__props.dimensions.half_width = new_width / 2;
	}

	get width () {
		return this.__props.dimensions.width;
	}

	set height (new_height) {
		this.__props.dimensions.height = new_height;
		this.__props.dimensions.half_height = new_height / 2;
	}

	get height () {
		return this.__props.dimensions.height;
	}

	set center (new_center) {
		this.__props.center = new_center;
	}

	get center () {
		return {
			x: this.x + this.__props.dimensions.half_width,
			y: this.y + this.__props.dimensions.half_height
		};
	}

	checkCollision (opts = {}) {
		return false;
	}

	update () {}

	draw () {}

	keyPress () {}

	keyDown () {}

	keyUp () {}

	mClick () {
		return this.mouse_lock.mClick;
	}

	mDown () {
		return this.mouse_lock.mDown;
	}

	mUp () {
		return this.mouse_lock.mUp;
	}

	mLeave () {}

	mouseOver () {
		return false;
	}

	onContext () {
		return false;
	}

	shutdown () {
		this.remove = true;
	}
}

module.exports = GOB;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(3);

const Menu = __webpack_require__(7);

const GI = __webpack_require__(8);
const CONFIG = __webpack_require__(1);

const Player = __webpack_require__(9);

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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const CONFIG = __webpack_require__(1);

class Menu {
    constructor () {
        this.setEvents();
    }

    setEvents () {

    }
}

module.exports = new Menu();


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(3);
const CONFIG = __webpack_require__(1);

const Projectile = __webpack_require__(4);

const { getRandomInt } = __webpack_require__(2);

class GI {
    constructor () {

    }

    mClick (mouse) {

    }

    mUp (mouse) {

    }

    mDown (mouse) {

    }

    mLeave (mouse) {

    }
}

module.exports = new GI();


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(5);
const CONFIG = __webpack_require__(1);

const Projectile = __webpack_require__(4);

class Player extends GOB {
	constructor (opts = {}) {
		super(opts);

        this.type = "player";

        this.velX = 0;
        this.velY = 0;

        this.speed = 3;

		this.width = 20;
        this.height = 20;

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

		return this;
	}

	update () {
        this.x += this.velX;
		this.y += this.velY;
    }

    keyDown (key) {
        if (key === 'UP' ||  key === 'W') {
            this.velY = -this.speed;
        }
        if (key === 'DOWN' ||  key === 'S') {
            this.velY = this.speed;
        }
        if (key === 'LEFT' ||  key === 'A') {
            this.velX = -this.speed;
        }
        if (key === 'RIGHT' ||  key === 'D') {
            this.velX = this.speed;
        }
    }

    keyUp (key) {
        if (key === 'UP' ||  key === 'W') {
            this.velY = 0;
        }
        if (key === 'DOWN' ||  key === 'S') {
            this.velY = 0;
        }
        if (key === 'LEFT' ||  key === 'A') {
            this.velX = 0;
        }
        if (key === 'RIGHT' ||  key === 'D') {
            this.velX = 0;
        }
    }

    keyPress () {
        console.log('press');
    }

    mClick (mouse) {
        console.log('click');
        console.log(this);
        new Projectile({
            layer: GOM.front,
            x: this.x,
            y: this.y,
            velX: (mouse.x - this.x) * 0.01,
            velY: (mouse.y - this.y) * 0.01
        });
    }

	draw () {
		this.context.save();
			this.context.beginPath();
			this.context.rect(this.x - this.half_width, this.y - this.half_height, this.width, this.height);
			this.context.fillStyle = '#FFFFFF';
			this.context.fill();
		this.context.restore();
	}
}

module.exports = Player;


/***/ })
/******/ ]);