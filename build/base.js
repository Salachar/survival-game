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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class GOM {
	constructor () {
		// 120 = 8
		// 60 = 16
		// 30 = 32
		this.MILLISECONDS_BETWEEN_FRAMES = 100; // (1 / 60) * 1000
		this.GAME_LOOP = 0;
		this.last_frame = new Date().getTime();

		this.__props = {};

		this.__props.game_objects = [];
		this.__props.collidable_objects = [];
		this.__props.added_game_objects = [];

		this.camera_offset = {
			x: 0,
			y: 0,
		};

		this.world_size = {
			width: 0,
			height: 0,
		};

		// There can only be one camera object
		// This is used for scrolling and the GOM will
		// keep the camera object centered and offset everything else
		// as it moves
		this.camera_object = null;

		this.fps_counter = document.getElementById('fps_counter');
		this.canvas_container = document.getElementById('canvas_container');

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
		this.fps_counter.innerHTML = Math.ceil(1 / dt);

		if (this.camera_object) {
			if (this.camera_object.x > this.half_canvas_container_width) {
				this.camera_offset.x = Math.floor(this.camera_object.x - this.half_canvas_container_width);
			}
			if (this.camera_object.x > this.world_size.width - this.half_canvas_container_width) {
				this.camera_offset.x = this.world_size.width - this.canvas_container_width;
			}
			if (this.camera_object.y > this.half_canvas_container_height) {
				this.camera_offset.y = Math.floor(this.camera_object.y - this.half_canvas_container_height);
			}
			if (this.camera_object.y > this.world_size.height - this.half_canvas_container_height) {
				this.camera_offset.y = this.world_size.height - this.canvas_container_height;
			}
		}

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
		this.canvas_container_width = this.canvas_container.clientWidth;
		this.canvas_container_height = this.canvas_container.clientHeight;
		this.half_canvas_container_width = this.canvas_container_width / 2;
		this.half_canvas_container_height = this.canvas_container_height / 2;
		// Loop through the canvases and set the width and height
		['control', 'effects', 'front', 'middle', 'back'].forEach((canvas_key) => {
			this[canvas_key].canvas.setAttribute('width', this.canvas_container_width + 'px');
			this[canvas_key].canvas.setAttribute('height', this.canvas_container_height + 'px');
			this[canvas_key].canvas.style.width  = this.canvas_container_width + 'px';
			this[canvas_key].canvas.style.height = this.canvas_container_height + 'px';
			this[canvas_key].backBuffer.setAttribute('width', this.canvas_container_width + 'px');
			this[canvas_key].backBuffer.setAttribute('height', this.canvas_container_height + 'px');
			this[canvas_key].backBuffer.style.width  = this.canvas_container_width + 'px';
			this[canvas_key].backBuffer.style.height = this.canvas_container_height + 'px';
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
		this.gameLoop();
	}

	gameLoop () {
		window.requestAnimationFrame(() => {
			this.gameLoop();
		});
		this.draw();
	}

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
		if (game_object.camera_follow) {
			this.camera_object = game_object;
		}
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

	checkCollisions (opts = {}) {
		const { obj } = opts;
		const collidables = this.collidable_objects;

		for (let i = 0; i < collidables.length; ++i) {
			const col_obj = collidables[i];
			if (obj.id === col_obj.id) continue;
			const info = col_obj.checkCollision(obj);
			if (info) opts.onCollision(info, col_obj);
		}
	}
}

module.exports = new GOM();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(3);
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

		this.wasd_arrows_match = true;

		this.keysDown = {};
		this.input_managers = [];

		this.setupKeyEvents();
		this.setupControlCanvasEvents();
	}

	isKeyDown (keys) {
		const keys_split = keys.split(' ');
		for (let i = 0; i < keys_split.length; ++i) {
			if (this.keysDown[keys_split[i]]) {
				return true;
			}
		}
		return false;
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

const Helpers = __webpack_require__(3);
const uuid = Helpers.uuid;

class GOB {
	constructor (opts = {}) {
		this.id = uuid();

		this.camera_follow = opts.camera_follow || false;

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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GOB = __webpack_require__(2);

class Projectile extends GOB {
	constructor (opts = {}) {
		super(opts);

		this.type = "projectile";

		this.aim_point = {
			x: opts.aim_x,
			y: opts.aim_y,
		};

		this.z = 1000000;

		this.__props.velX = (opts.velX !== null) ? opts.velX : (-1 + (Math.random() * 2));
		this.__props.velY = (opts.velY !== null) ? opts.velY : (-1 + (Math.random() * 2));

		this.width = 2;
		this.height = 2;

		this.resolved = false;

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
		if (this.x > x_bound || this.x < 0 || this.y > y_bound || this.y < 0) {
			this.shutdown();
		}
	}

	update () {
		if (this.resolved) return;

		let closest = null;
		GOM.checkCollisions({
			obj: this,
			onCollision: (collision_info, collision_obj) => {
				if (Array.isArray(collision_info)) {
					for (let i = 0; i < collision_info.length; ++i) {
						if (!closest || closest.t1 > collision_info[i].t1) {
							closest = collision_info[i];
						}
					}
				}
			}
		});

		if (closest) {
			this.closest_collision = closest;
		}

		this.resolved = true;
		setTimeout(() => {
			this.shutdown();
		}, 10);
	}

	draw (opts = {}) {
		if (this.closest_collision) {
			this.context.save();
				this.context.beginPath();
				this.context.lineWidth = 1;
				this.context.moveTo(
					this.x - GOM.camera_offset.x,
					this.y - GOM.camera_offset.y,
				);
				this.context.lineTo(
					this.closest_collision.x - GOM.camera_offset.x,
					this.closest_collision.y - GOM.camera_offset.y,
				);
				this.context.strokeStyle = "#FFFFFF";
				this.context.stroke();
			this.context.restore();
		}
	}
}

module.exports = Projectile;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const Projectile = __webpack_require__(4);

class Player extends GOB {
	constructor (opts = {}) {
		super(opts);

        this.type = "player";

        this.velX = 0;
        this.velY = 0;

        this.speed = 6;
        this.speed_diagonal = Math.ceil(this.speed * 0.715);

		this.width = 20;
        this.height = 20;

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

        this.shooting_timer = null;

		return this;
    }

    checkPlayerMovement () {
        if (GIM.isKeyDown('W')) {
            this.velY = -this.speed;
            if (GIM.isKeyDown('A')) {
                this.velX = -this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('D')) {
                this.velX = this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('S')) {
            this.velY = this.speed;
            if (GIM.isKeyDown('A')) {
                this.velX = -this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
            if (GIM.isKeyDown('D')) {
                this.velX = this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('A')) {
            this.velX = -this.speed;
            if (GIM.isKeyDown('W')) {
                this.velX = -this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('S')) {
                this.velX = -this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('D')) {
            this.velX = this.speed;
            if (GIM.isKeyDown('W')) {
                this.velX = this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('S')) {
                this.velX = this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (!GIM.isKeyDown('W S')) {
            this.velY = 0;
        }
        if (!GIM.isKeyDown('A D')) {
            this.velX = 0;
        }
    }

	update () {
        if (this.velX === 0 && this.velY == 0) return;
        let velocity_mods = {
            x: 0,
            y: 0
        };
        let hold_object = null;
		GOM.checkCollisions({
			obj: this,
			onCollision: (collision_info, collision_obj) => {
                if (collision_info.x && collision_info.y) {
                    hold_object = collision_info;
                    return;
                }
                if (collision_info.x) {
                    velocity_mods.x = collision_info.x;
                }
                if (collision_info.y) {
                    velocity_mods.y = collision_info.y;
                }
			}
        });

        if (hold_object && !velocity_mods.x && !velocity_mods.y) {
            velocity_mods.x = hold_object.x;
            velocity_mods.y = hold_object.y;
        }

        this.x = Math.round(this.x + this.velX + velocity_mods.x);
		this.y = Math.round(this.y + this.velY + velocity_mods.y);
    }

    keyDown (key) {
        this.checkPlayerMovement();
    }

    keyUp (key) {
        // if (key === 'UP' ||  key === 'W') {
        //     this.velY = 0;
        // }
        // if (key === 'DOWN' ||  key === 'S') {
        //     this.velY = 0;
        // }
        // if (key === 'LEFT' ||  key === 'A') {
        //     this.velX = 0;
        // }
        // if (key === 'RIGHT' ||  key === 'D') {
        //     this.velX = 0;
        // }
        this.checkPlayerMovement();
    }

    keyPress () {
        // console.log('press');
    }

    mDown (mouse) {
        this.fireWeapon();
        this.shooting_timer = setInterval(() => {
            this.fireWeapon();
        }, 100);
    }

    mUp (mouse) {
        clearInterval(this.shooting_timer);
        this.shooting_timer = null;
    }

    fireWeapon (mouse) {
        new Projectile({
            layer: GOM.front,
            x: this.x,
            y: this.y,
            aim_x: GIM.mouse.x + GOM.camera_offset.x,
            aim_y: GIM.mouse.y + GOM.camera_offset.y,
        });
    }

	draw (opts = {}) {
		this.context.save();
            this.context.beginPath();
			this.context.rect(
                this.x - GOM.camera_offset.x - this.half_width,
                this.y - GOM.camera_offset.y - this.half_height,
                this.width,
                this.height
            );
			this.context.fillStyle = '#0000FF';
			this.context.fill();
		this.context.restore();
	}
}

module.exports = Player;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const { getIntersection, degreesToRadians } = __webpack_require__(11);

const WALL_IMAGES = {
    none: __webpack_require__(12),
    one: __webpack_require__(13),
    two: __webpack_require__(14),
    two_straight: __webpack_require__(15),
    three: __webpack_require__(16),
    four: __webpack_require__(17),
}

class Wall extends GOB {
	constructor (opts = {}) {
        super(opts);

        console.log(opts);

        this.type = "wall";
        this.collidable = true;

		this.width = opts.width;
        this.height = opts.height;

        this.collision_points = [];

        this.img = new Image();
        this.image_data = this.determineImage(opts.neighbors);
        this.image_data.rotation = degreesToRadians(this.image_data.rotation);
        this.img.src = WALL_IMAGES[this.image_data.openings];

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

        this.segments = this.generateSegments();

		return this;
    }

    determineImage (neighbors = {}) {
        // const { north, south, east, west } = neighbors;
        const north = neighbors.north === 'WALL';
        const south = neighbors.south === 'WALL';
        const east = neighbors.east === 'WALL';
        const west = neighbors.west === 'WALL';

        let openings = 0;

        if (north) openings += 1;
        if (south) openings += 1;
        if (east) openings += 1;
        if (west) openings += 1;

        // 0 and 4 can be returned right away, they are the same
        // not matter the rotation
        if (openings === 0) return {
            openings: 'none',
            rotation: 0
        };

        if (openings === 4) return {
            openings: 'four',
            rotation: 0
        };

        // For the other possibilities, we need to know how to rotate
        // the image to line up the openings
        // 1 Opening: default faces east
        // 2 Openings: default faces north west, tube is west/east
        // 3 Openings: default is north west east
        if (openings === 1) {
            let image_data = {
                openings: 'one',
                rotation: 0
            };
            if (north) image_data.rotation = 270;
            if (west) image_data.rotation = 180;
            if (south) image_data.rotation = 90;
            return image_data;
        }

        if (openings === 2) {
            let image_data = {
                openings: 'two',
                rotation: 0
            };
            if (north && east) image_data.rotation = 90;
            if (east && south) image_data.rotation = 180;
            if (south && west) image_data.rotation = 270;
            if (north && south) {
                image_data.openings = 'two_straight';
                image_data.rotation = 90;
            }
            if (east && west) image_data.openings = 'two_straight';
            return image_data;
        }

        if (openings === 3) { // default is north west east
            let image_data = {
                openings: 'three',
                rotation: 0
            };
            if (!west) image_data.rotation = 90;
            if (!north) image_data.rotation = 180;
            if (!east) image_data.rotation = 270;
            return image_data;
        }
    }

    generateSegments () {
        return [
            { // TOP
                p1: {
                    x: this.x,
                    y: this.y,
                },
                p2: {
                    x: this.x + this.width,
                    y: this.y,
                },
            },
            { // RIGHT
                p1: {
                    x: this.x + this.width,
                    y: this.y,
                },
                p2: {
                    x: this.x + this.width,
                    y: this.y + this.height,
                },
            },
            { // BOTTOM
                p1: {
                    x: this.x,
                    y: this.y + this.height,
                },
                p2: {
                    x: this.x + this.width,
                    y: this.y + this.height,
                },
            },
            { // LEFT
                p1: {
                    x: this.x,
                    y: this.y,
                },
                p2: {
                    x: this.x,
                    y: this.y + this.height,
                },
            },
        ]
    }

    checkCollision (obj) {
        if (!obj) return null;
        if (obj.type === 'player') {
            return this.checkPlayerCollision(obj);
        }
        if (obj.type === 'projectile') {
            return this.checkProjectileCollision(obj);
        }
    }

    checkPlayerCollision (obj) {
        if (obj.velY === 0 && obj.velX === 0) return;

        let next_obj_x = obj.x + obj.velX;
        let next_obj_y = obj.y + obj.velY;

        let current_obj_bounds = {
            left: obj.x - obj.half_width,
            right: obj.x + obj.half_width,
            top: obj.y - obj.half_height,
            bottom: obj.y + obj.half_height,
        }
        let next_obj_bounds = {
            left: next_obj_x - obj.half_width,
            right: next_obj_x + obj.half_width,
            top: next_obj_y - obj.half_height,
            bottom: next_obj_y + obj.half_height,
        };
        let bounds = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };

        let modified_vel = {
            x: 0,
            y: 0,
        };

        // We're moving right, and the step of the obj shows a collision
        if (obj.velX > 0 && (current_obj_bounds.right <= bounds.left && next_obj_bounds.right > bounds.left)) {
            if (verticalCollision()) {
                modified_vel.x = -Math.abs(next_obj_bounds.right - bounds.left);
            }
        }
        if (obj.velX < 0 && (current_obj_bounds.left >= bounds.right && next_obj_bounds.left < bounds.right)) {
            if (verticalCollision()) {
                modified_vel.x = Math.abs(next_obj_bounds.left - bounds.right);
            }
        }
        if (obj.velY > 0 && (current_obj_bounds.bottom <= bounds.top && next_obj_bounds.bottom > bounds.top)) {
            if (horizontalCollision()) {
                modified_vel.y = -Math.abs(next_obj_bounds.bottom - bounds.top);
            }
        }
        if (obj.velY < 0 && (current_obj_bounds.top >= bounds.bottom && next_obj_bounds.top < bounds.bottom)) {
            if (horizontalCollision()) {
                modified_vel.y = Math.abs(next_obj_bounds.top - bounds.bottom);
            }
        }

        function horizontalCollision () {
            if (next_obj_bounds.left > bounds.left && next_obj_bounds.left < bounds.right ||
                next_obj_bounds.right > bounds.left && next_obj_bounds.right < bounds.right) {
                return true;
            }
            return false;
        }

        function verticalCollision () {
            if (next_obj_bounds.top > bounds.top && next_obj_bounds.top < bounds.bottom ||
                next_obj_bounds.bottom > bounds.top && next_obj_bounds.bottom < bounds.bottom) {
                return true;
            }
            return false;
        }

        if (!modified_vel.x && !modified_vel.y) return null;
        return modified_vel;
    }

    checkProjectileCollision (projectile) {
        this.collision_points = [];
        for (let i = 0; i < this.segments.length; ++i) {
            const seg = this.segments[i];
            const projectile_vector = {
                px : projectile.x,
                py : projectile.y,
                dx : projectile.aim_point.x - projectile.x,
                dy : projectile.aim_point.y - projectile.y,
            };
            const wall_segment = {
                px : seg.p1.x,
                py : seg.p1.y,
                dx : seg.p2.x - seg.p1.x,
                dy : seg.p2.y - seg.p1.y,
            };
            const info = getIntersection(projectile_vector, wall_segment);
            if (info && info.t1 >= 0 && info.t2 >= 0 && info.t2 <= 1) {
                this.collision_points.push(info);
            }
        }
        this.layer.update = true;
        return (this.collision_points.length) ? this.collision_points : null;
    }

	update () {

    }

	draw (opts = {}) {
		this.context.save();
			// this.context.beginPath();
			// this.context.rect(
            //     this.x - GOM.camera_offset.x,
            //     this.y - GOM.camera_offset.y,
            //     this.width,
            //     this.height
            // );
			// this.context.fillStyle = '#FFFFFF';
            // this.context.fill();

            const center = {
                x: this.x - GOM.camera_offset.x + (this.width / 2),
                y: this.y - GOM.camera_offset.y + (this.height / 2),
            };
            this.context.translate(center.x, center.y);
            this.context.rotate(this.image_data.rotation);
            this.context.translate(-center.x, -center.y);

            this.context.drawImage(
                this.img,
                this.x - GOM.camera_offset.x,
                this.y - GOM.camera_offset.y
            );



            // for (var i = 0; i < this.collision_points.length; ++i) {
            //     const p = this.collision_points[i];
            //     this.context.beginPath();
            //     this.context.rect(
            //         p.x - GOM.camera_offset.x - 5,
            //         p.y - GOM.camera_offset.y - 5,
            //         10,
            //         10
            //     );
            //     this.context.fillStyle = '#FF0000';
            //     this.context.fill();
            // }
        this.context.restore();
        for (var i = 0; i < this.collision_points.length; ++i) {
            const p = this.collision_points[i];
            this.context.beginPath();
            this.context.rect(
                p.x - GOM.camera_offset.x - 5,
                p.y - GOM.camera_offset.y - 5,
                10,
                10
            );
            this.context.fillStyle = '#FF0000';
            this.context.fill();
        }
	}
}

module.exports = Wall;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);

const Menu = __webpack_require__(8);

const GI = __webpack_require__(9);
const CONFIG = __webpack_require__(10);

const Player = __webpack_require__(5);
const Wall = __webpack_require__(6);

const World = __webpack_require__(18);

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
		this.world = new World();

		// this.spawnPlayer();
		// this.createDebugWalls();
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

/*
TODO:
    Fix up collision function chain
    make it so walls dont have to be on the outside
     and the shoots just go some distance
        Ill want to be able to kill offscreen enemies




If the player is more than half screen away


Get how far away they are from the center
and offset everything else that much
*/


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);

class Menu {
    constructor () {
        this.setEvents();
    }

    setEvents () {

    }
}

module.exports = new Menu();


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);

const Projectile = __webpack_require__(4);

const { getRandomInt } = __webpack_require__(3);

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
/* 10 */
/***/ (function(module, exports) {

class CONFIG {
    constructor () {
        this.__props = {

        };
    }
}

module.exports = new CONFIG();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

const Helpers = {
    copy: function (object) {
        if (!object) return null;
        return JSON.parse(JSON.stringify(object));
    },

    degreesToRadians (degrees) {
        return degrees * (Math.PI / 180);
    },

    pointMatch: function (p1, p2, tolerance) {
        tolerance = tolerance || 0;
        return (Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance);
    },

    rgb: function (r,g,b) {
        return "rgb(" + r + "," + g + "," + b + ")";
    },

    rgba: function (r,g,b,a) {
        a = (a || a === 0) ? a : 1;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    },

    randomRGBA: function (alpha) {
        alpha = (typeof alpha === 'number') ? alpha : 1;
        const r = Math.floor(Math.random() * 255 + 1);
        const g = Math.floor(Math.random() * 255 + 1);
        const b = Math.floor(Math.random() * 255 + 1);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    },

    sqr: function (value) {
        return value * value;
    },

    distanceBetween: function (obj1, obj2) {
        if (!obj1 || !obj2) return null;
        return Math.sqrt(
            Helpers.sqr(obj2.x - obj1.x) + Helpers.sqr(obj2.y - obj1.y)
        );
    },

    closestDistanceToLine: function (obj1, obj2) {

    },

    pDistance: function (point, item, opts = {}) {
        if (!point || !item) return;
        if (item.segment) item = item.segment;

        // The "item" can be anything, segment, light, point
        // If it's a simple point, get the distance and return
        if (item.x && item.y && !item.p1) {
            return {
                distance: Math.sqrt(Helpers.sqr(item.x - point.x) + Helpers.sqr(item.y - point.y)),
                x: item.x,
                y: item.y
            }
        }

        if (item.position) {
            return {
                distance: Math.sqrt(Helpers.sqr(item.position.x - point.x) + Helpers.sqr(item.position.y - point.y)),
                x: item.position.x,
                y: item.position.y
            }
        }

        // Now we're looking at a segment with p1 and p2, check the endpoints first
        let p1_match = Helpers.pointMatch(point, item.p1, 1);
        let p2_match = Helpers.pointMatch(point, item.p2, 1);
        if (opts.line_only && (p1_match || p2_match)) {
            return {
                distance: null,
                x: null,
                y: null
            };
        }

        return Helpers.distanceToLine(point, item);
    },

    distanceToLine: function (point, line) {
        const A = point.x - line.p1.x;
        const B = point.y - line.p1.y;
        const C = line.p2.x - line.p1.x;
        const D = line.p2.y - line.p1.y;

        const dot = (A * C) + (B * D);
        const len_sq = (C * C) + (D * D);
        const param = (len_sq !== 0) ? (dot / len_sq) : -1;

        let xx = 0;
        let yy = 0;
        if (param < 0) {
            xx = line.p1.x;
            yy = line.p1.y;
        } else if (param > 1) {
            xx = line.p2.x;
            yy = line.p2.y;
        } else {
            xx = line.p1.x + param * C;
            yy = line.p1.y + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;
        return {
            distance: Math.sqrt(Helpers.sqr(dx) + Helpers.sqr(dy)),
            x: xx,
            y: yy
        }
    },

    getIntersection (r, s) {
        if ((r.dx / r.dy) == (s.dx / s.dy)) return null;

        const t2 = (r.dx * (s.py - r.py) + r.dy * (r.px - s.px)) / (s.dx * r.dy - s.dy * r.dx);
        const t1 = (r.dx != 0) ? (s.px + s.dx * t2 - r.px) / r.dx : (s.py + s.dy * t2 - r.py) / r.dy;

        return {
            x: r.px + (t1 * r.dx),
            y: r.py + (t1 * r.dy),
            t2: t2,
            t1: t1
        };
    },

    getDotProduct: function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    },

    getMagnitude: function (v) {
        return Math.sqrt(Helpers.sqr(v.x) + Helpers.sqr(v.y));
    },

    getAngleBetweenVectors: function (v1, v2) {
        const dot = Helpers.getDotProduct(v1, v2);
        const v1_mag = Helpers.getMagnitude(v1);
        const v2_mag = Helpers.getMagnitude(v2);
        const cos_angle = dot / (v1_mag * v2_mag);
        const angle = Math.acos(cos_angle);
        return angle;
    },

    getNormal: function (segment, reference_point) {
        reference_point = reference_point || Mouse;
        // the "open" normal will be on the side
        // of the reference point, the mouse in most cases
        if (!segment) return;
        if (segment.segment) segment = segment.segment;

        // Get a unit vector of that perpendicular
        let unit_vector = Helpers.getUnitVector(segment);

        let perp_unit_vector = {
            x: unit_vector.y,
            y: unit_vector.x * -1
        };

        // Get the middle of the origin segment
        let middle_point = Helpers.getSegmentMiddle(segment);

        // Add some distance to the unit normal (for show)
        let dist_mod = 20;
        let mod_vector = {
            x: perp_unit_vector.x * dist_mod,
            y: perp_unit_vector.y * dist_mod
        };

        let point_one = {
            x: Math.round(middle_point.x + mod_vector.x),
            y: Math.round(middle_point.y + mod_vector.y)
        };

        let point_two = {
            x: Math.round(middle_point.x - mod_vector.x),
            y: Math.round(middle_point.y - mod_vector.y)
        };

        let dist_one = Helpers.pDistance(reference_point, point_one);
        let dist_two = Helpers.pDistance(reference_point, point_two);

        if (dist_one.distance <= dist_two.distance) {
            return {
                open: point_one,
                closed: point_two
            };
        }
        return {
            open: point_two,
            closed: point_one
        };
    },

    getSlope: function (p1, p2) {
        return (p2.y - p1.y) / (p2.x - p1.x);
    },

    getUnitVector: function (segment) {
        let vector = {
            x: segment.p2.x - segment.p1.x,
            y: segment.p2.y - segment.p1.y
        };
        let mag = Math.sqrt(Helpers.sqr(vector.x) + Helpers.sqr(vector.y));
        return {
            x: vector.x / mag,
            y: vector.y / mag
        };
    },

    getPerpendicularUnitVector: function (segment) {
        let unit_vector = Helpers.getUnitVector(segment);
        let perp = {
            x: unit_vector.y,
            y: unit_vector.x * -1
        }
        return perp;
    }
};


module.exports = Helpers;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_none.png";

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_one.png";

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_two.png";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_two_straight.png";

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_three.png";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/wall_open_four.png";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const Player = __webpack_require__(5);
const Wall = __webpack_require__(6);

/*
What kind of environment do I want.

    - No tiers, just one flat plane
    - Rivers
    - Lakes
    - Trees (like one per tile)
    - Forest (dense trees, 3-4 per tile or something)
    - Rocks/Boulders (they can be kinda random size)
    - Iron deposit
    - Wall (like permanent unmovable/undamageable)
*/

const WORLD_MAP_LEGEND = {
    ' ': 'EMPTY',
    'R': 'ROCK',
    '@': 'PLAYER_SPAWN',
    'W': 'WALL', // permanent wall is permanent rock
};

const WORLD_MAP = [
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W  @                   W                         WWWWWWW                WWWWWWWW',
'W                     WW                                   WWWWWW       WWWWWWWW',
'W                   WWWWWWW                       WWWWWWWWWWWWWWWWWW   WWWWWWWWWW',
'W                      WW                        WWWWWWWWWWWWWWWWW        WWWWWW',
'W                    W                           WWWWWWWWWWWWWWWWWWWWW     WWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W     WWWW                     WW                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'W                                                                              W',
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
];
// const WORLD_MAP = [
// '                                        ',
// '         W                              ',
// '   @        W                WWWW       ',
// '         WW W                W  W       ',
// '                             W  W       ',
// '    W    W          W        WWWW       ',
// '   WWW  WW   WWW    WW                  ',
// '         W    W     W                   ',
// '                                        ',
// '                                        ',
// '     W        WW                        ',
// '    WWW      WWWW                       ',
// '     W        WW                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// ];
// const WORLD_MAP = [
// '                                        ',
// '                                        ',
// '   @                                    ',
// '        WW                              ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// '                                        ',
// ];


class World {
    constructor () {
        this.cell_size = 50;
        this.half_cell_size = this.cell_size / 2;

        GOM.world_size = {
            width: WORLD_MAP[0].length * this.cell_size,
            height: WORLD_MAP.length * this.cell_size,
        };

        this.world = this.parseWorld(WORLD_MAP);
        this.generateWorld(this.world);
    }

    parseWorld (map) {
        return map.map((map_row) => {
            return map_row.split('');
        });
    }

    generateWorld (world) {
        world.forEach((row, y) => {
            row.forEach((tile, x) => {
                const type = WORLD_MAP_LEGEND[tile];
                const objectParams = {
                    x,
                    y,
                    neighbors: {
                        north: WORLD_MAP_LEGEND[(world[y - 1] || [])[x] || null],
                        south: WORLD_MAP_LEGEND[(world[y + 1] || [])[x] || null],
                        east: WORLD_MAP_LEGEND[(world[y] || [])[x + 1] || null],
                        west: WORLD_MAP_LEGEND[(world[y] || [])[x - 1] || null]
                    }
                };
                switch (type) {
                    case 'PLAYER_SPAWN':
                        this.spawnPlayer(objectParams);
                        break;
                    case 'ROCK':
                        this.createWall(objectParams);
                        break;
                    case 'WALL':
                        objectParams.permanent = true;
                        this.createWall(objectParams);
                        break;
                    default: // EMPTY?
                        break;
                }
            });
        });
    }

    spawnPlayer (params = {}) {
        // We want the player to spawn in the middle of the cell
        new Player({
            ...params,
            camera_follow: true,
            layer: GOM.front,
            x: (params.x * this.cell_size) + this.half_cell_size,
            y: (params.y * this.cell_size) + this.half_cell_size,
        });
    }

    createWall (params = {}) {
        new Wall({
            ...params,
            layer: GOM.front,
            x: params.x * this.cell_size,
            y: params.y * this.cell_size,
            width: this.cell_size,
            height: this.cell_size,
        });
    }
}

module.exports = World;

/***/ })
/******/ ]);