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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
		this.FPS_INTERVAL = 1000 / 60;

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

		this.viewport = null;
		this.viewport_buffer = 100; // cell size * 2

		this.world_size = {
			width: 0,
			height: 0,
		};

		this.then = Date.now();

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

		this.viewport = null;
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
			this.viewport = {
				top: this.camera_offset.y - this.viewport_buffer,
				bottom: this.camera_offset.y + this.canvas_container_height + this.viewport_buffer,
				left: this.camera_offset.x - this.viewport_buffer,
				right: this.camera_offset.x + this.canvas_container_width + this.viewport_buffer,
			};
		}

		this.addNewGameObjects();

		this.front.backBufferContext.clearRect(0, 0, this.front.canvas.width, this.front.canvas.height);

		let new_objects_list = [];
		let new_collidable_objects_list = [];
		for (let i = 0; i < this.game_objects.length; ++i) {
			let gameObj = this.game_objects[i];

			gameObj.in_viewport = this.isInViewport(gameObj);

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
	}

	isInViewport (obj) {
		if (!obj || !this.viewport) return true;
		if (obj.x > this.viewport.right ||
			obj.x < this.viewport.left ||
			obj.y < this.viewport.top ||
			obj.y > this.viewport.bottom) {
			return false;
		}
		return true;
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

		const now = Date.now();
		const elapsed = now - this.then;
		// if enough time has elapsed, draw the next frame
		if (elapsed > this.FPS_INTERVAL) {
			// Get ready for next frame by setting then=now, but also adjust for your
			// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
			this.then = now - (elapsed % this.FPS_INTERVAL);
			this.draw();
		}
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

const {
    checkBoxCollision,
    checkProjectileBoxCollision
} = __webpack_require__(11);

const ImageCache = __webpack_require__(13);
const Helpers = __webpack_require__(3);
const uuid = Helpers.uuid;

class GOB {
	constructor (opts = {}) {
		this.id = uuid();

		this.camera_follow = opts.camera_follow || false;

		const spawn = opts.spawn || {};
		this.x = opts.x || spawn.x || 0;
		this.y = opts.y || spawn.y || 0;

		this.collidable = false;
		this.collision_type = null; // box or circle
		this.collision_points = [];

		this.in_viewport = true;
		this.configured = true;

		this.__props = {};

		this.mouse_lock = {
			mClick: false,
			mDown: false,
			mUp: false,
			mLeave: false
		};

		this.__props.dimensions = {
			width: opts.width || 0,
			half_width: 0,
			height: opts.height || 0,
			half_height: 0
		};

		this.zOrder = opts.z || 0;

		this.remove = false;
		this.layer = opts.layer || null;
		this.context = (this.layer) ? this.layer.backBufferContext : null;

		this.images = {};

		GOM.addGameObject(this);
	}

	set width (new_width) {
		this.__props.dimensions.width = new_width;
		this.__props.dimensions.half_width = new_width / 2;
	}

	get width () {
		return this.__props.dimensions.width;
	}

	get half_width () {
		return this.__props.dimensions.half_width;
	}

	set height (new_height) {
		this.__props.dimensions.height = new_height;
		this.__props.dimensions.half_height = new_height / 2;
	}

	get height () {
		return this.__props.dimensions.height;
	}

	get half_height () {
		return this.__props.dimensions.half_height;
	}

	get position () {
		return {
			x: this.x - GOM.camera_offset.x,
			y: this.y - GOM.camera_offset.y,
		};
	}

	get cornerPosition () {
		return {
			x: this.x - this.half_width - GOM.camera_offset.x,
			y: this.y - this.half_height - GOM.camera_offset.y,
		};
	}

	loadImages (images_obj) {
		return new Promise((resolve) => {
			Promise.all(Object.keys(images_obj).map((image_key) => {
				return ImageCache.load(image_key, images_obj[image_key]);
			})).then((image_results) => {
				image_results.forEach((image_result) => {
					if (!image_result) return;
					this.images[image_result.key] = image_result.image;
				});
				resolve(this.images);
			});
		});

	}

	configureGameObject () {

	}

	getBounds () {
        return {
            left: this.x - this.half_width,
            right: this.x + this.half_width,
            top: this.y - this.half_height,
            bottom: this.y + this.half_height,
        };
	}

	getBoxCollisionSegments () {
        const { top, right, bottom, left } = this.getBounds();
        const segments = [
            { // TOP
                p1: { x: left, y: top },
                p2: { x: right, y: top },
            },
            { // RIGHT
                p1: { x: right, y: top },
                p2: { x: right, y: bottom },
            },
            { // BOTTOM
                p1: { x: left, y: bottom },
                p2: { x: right, y: bottom },
            },
            { // LEFT
                p1: { x: left, y: top },
                p2: { x: left, y: bottom },
            },
        ];
        return segments;
	}

	checkCollision (obj) {
		if (!obj || !this.collidable || !this.configured) return false;
		if (this.collision_type === 'box') {
			if (obj.type === 'player') {
				return checkBoxCollision(obj, this);
			}
			if (obj.type === 'projectile') {
				return checkProjectileBoxCollision(obj, this);
			}
		}
		return false;
	}

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

	update () {}

	drawCollisionPoints () {
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

	drawImage () {
		const rotation = (this.image_data || {}).rotation || 0;
		this.context.save();
			if (rotation) {
				this.context.translate(this.position.x, this.position.y);
				this.context.rotate(this.image_data.rotation);
				this.context.translate(-this.position.x, -this.position.y);
			}
			this.context.drawImage(
				this.images.main,
				this.cornerPosition.x,
				this.cornerPosition.y
			);
		this.context.restore();
	}

	draw () {}
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
                // console.log(collision_info, collision_obj);
                if (collision_info.x && collision_info.y) {
                    hold_object = collision_info;
                    return;
                }
                if (collision_info.x && Math.abs(collision_info.x) > Math.abs(velocity_mods.x)) {
                    velocity_mods.x = collision_info.x;
                }
                if (collision_info.y && Math.abs(collision_info.y) > Math.abs(velocity_mods.y)) {
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

const { getSpritePosition } = __webpack_require__(7);

const SPRITE_DATA = __webpack_require__(16)
const SPRITE = __webpack_require__(17);

class Wall extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'wall';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';

        this.determineImage(opts.neighbors);

        this.loadImages({
            main: SPRITE,
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        this.width = 48;
        this.height = 48;
        this.configured = true;
    }

    determineImage (neighbors = {}) {
        let wall_neighbors = {};
        let openings = 0;
        Object.keys(neighbors).forEach((nd) => { // nd -> neighbor direction
            let wall = neighbors[nd] === 'WALL' || neighbors[nd] === null || false;
            wall_neighbors[nd] = wall;
            // only count cardinal openings
            if (!nd.match(/_/) && wall) openings += 1;
        });

        this.sprite_index = getSpritePosition(wall_neighbors, openings);
    }

	draw () {
        if (!this.in_viewport || !this.configured || !this.sprite_index || !this.images.main) return;

        const cell_size = 48;
		this.context.save();
			this.context.drawImage(
                this.images.main,
                this.sprite_index.x * SPRITE_DATA.width + SPRITE_DATA.buffer,
                this.sprite_index.y * SPRITE_DATA.height + SPRITE_DATA.buffer,
                SPRITE_DATA.width - (SPRITE_DATA.buffer * 2),
                SPRITE_DATA.height - (SPRITE_DATA.buffer * 2),
				this.cornerPosition.x,
                this.cornerPosition.y,
                cell_size,
                cell_size
			);
		this.context.restore();
        this.drawCollisionPoints();
	}
}

module.exports = Wall;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const sprite_mapping = __webpack_require__(15);

function getSpritePosition (neighbors, openings) {
    switch (openings) {
        case 0:
            return determineNoneSideImage(neighbors);
        case 1:
            return determineOneSideImage(neighbors);
        case 2:
            return determineTwoSideImage(neighbors);
        case 3:
            return determineThreeSideImage(neighbors);
        case 4:
            return determineFourSideImage(neighbors);
    }
}

function determineNoneSideImage () {
    // clip the none side sprite
    return sprite_mapping.none.f;
}

function determineOneSideImage (neighbors) {
    // one side doesnt give a shit about diagonals
    const { north, south, east, west } = neighbors;
    if (north) return sprite_mapping.one.n;
    if (south) return sprite_mapping.one.s;
    if (east) return sprite_mapping.one.e;
    if (west) return sprite_mapping.one.w;
}

function determineTwoSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = sprite_mapping.two;

    if (north && south) {
        return map.v; // clip vertical tube
    }
    if (east && west) {
        return map.h; // clip horizontal tube
    }

    if (north && east) {
        if (north_east) {
            return map.ne_f; // clip north east full
        } else {
            return map.ne_i; // clip north east corner
        }
    }
    if (north && west) {
        if (north_west) {
            return map.nw_f; // clip north west full
        } else {
            return map.nw_i; // clip north west corner
        }
    }
    if (south && east) {
        if (south_east) {
            return map.se_f; // clip south east full
        } else {
            return map.se_i; // clip south east corner
        }
    }
    if (south && west) {
        if (south_west) {
            return map.sw_f; // clip south west full
        } else {
            return map.sw_i; // clip south west corner
        }
    }
}

function determineThreeSideImage (neighbors) {
    // two sided cares about the diagonal between two adjacent openings
    const { north, south, east, west } = neighbors;
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = sprite_mapping.three;

    // Faces north
    if (west && north && east) {
        if (north_west && north_east) {
            return map.north.f; // clip facing north northwest full northeast full
        }
        if (north_west && !north_east) {
            return map.north.ne_i; // clip facing north northwest full northeast corner
        }
        if (!north_west && north_east) {
            return map.north.nw_i; // clip facing north northwest corner northeast full
        }
        if (!north_west && !north_east) {
            return map.north.i; // clip facing north northwest corner northeast corner
        }
    }

    // Faces east
    if (north && east && south) {
        if (north_east && south_east) {
            return map.east.f; // clip facing east north_east full south_east full
        }
        if (north_east && !south_east) {
            return map.east.se_i; // clip facing east north_east full south_east corner
        }
        if (!north_east && south_east) {
            return map.east.ne_i; // clip facing east north_east corner south_east full
        }
        if (!north_east && !south_east) {
            return map.east.i; // clip facing east north_east corner south_east corner
        }
    }

    // Faces south
    if (west && south && east) {
        if (south_west && south_east) {
            return map.south.f; // clip facing east south_west full south_east full
        }
        if (south_west && !south_east) {
            return map.south.se_i; // clip facing east south_west full south_east corner
        }
        if (!south_west && south_east) {
            return map.south.sw_i; // clip facing east south_west corner south_east full
        }
        if (!south_west && !south_east) {
            return map.south.i; // clip facing east south_west corner south_east corner
        }
    }

    // Faces west
    if (north && west && south) {
        if (north_west && south_west) {
            return map.west.f; // clip facing east north_west full south_west full
        }
        if (north_west && !south_west) {
            return map.west.sw_i; // clip facing east north_west full south_west corner
        }
        if (!north_west && south_west) {
            return map.west.nw_i; // clip facing east north_west corner south_west full
        }
        if (!north_west && !south_west) {
            return map.west.i; // clip facing east north_west corner south_west corner
        }
    }
}

function determineFourSideImage (neighbors) {
    const { north_east, north_west, south_east, south_west } = neighbors;
    const map = sprite_mapping.four;

    // all four
    if (north_east && north_west && south_east && south_west) {
        return map.f; // all full
    }

    if (!north_east && !north_west && !south_east && !south_west) {
        return map.i; // all inside corners
    }

    // ONE INSIDE CORNER
    // northeast corner only
    if (!north_east && north_west && south_east && south_west) {
        return map.ne_i;
    }
    // northwest corner only
    if (north_east && !north_west && south_east && south_west) {
        return map.nw_i;
    }
    // southeast corner only
    if (north_east && north_west && !south_east && south_west) {
        return map.se_i;
    }
    // southwest corner only
    if (north_east && north_west && south_east && !south_west) {
        return map.sw_i;
    }

    // TWO INSIDE CORNERS
    // northeast and northwest
    if (!north_east && !north_west && south_east && south_west) {
        return map.nw_i_ne_i;
    }
    // northeast and southeast
    if (!north_east && north_west && !south_east && south_west) {
        return map.ne_i_se_i;
    }
    // southwest and southeast
    if (north_east && north_west && !south_east && !south_west) {
        return map.sw_i_se_i;
    }
    // northwest and southwest
    if (north_east && !north_west && south_east && !south_west) {
        return map.nw_i_sw_i;
    }
    // northwest and southeast
    if (north_east && !north_west && !south_east && south_west) {
        return map.nw_i_se_i;
    }
    // northeast and southwest
    if (!north_east && north_west && south_east && !south_west) {
        return map.ne_i_sw_i;
    }

    // THREE INSIDE CORNERS
    // not northwest
    if (!north_east && north_west && !south_east && !south_west) {
        return map.nw_f;
    }
    // not northeast
    if (north_east && !north_west && !south_east && !south_west) {
        return map.ne_f;
    }
    // not southeast
    if (!north_east && !north_west && south_east && !south_west) {
        return map.se_f;
    }
    // not southwest
    if (!north_east && !north_west && !south_east && south_west) {
        return map.sw_f;
    }
}

module.exports = {
    getSpritePosition,
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);

const Menu = __webpack_require__(9);

const GI = __webpack_require__(10);
const CONFIG = __webpack_require__(14);

const Player = __webpack_require__(5);
const Wall = __webpack_require__(6);

const REAL_MAP = __webpack_require__(18);
const DEBUG_MAP = __webpack_require__(19);
const SIMPLE_MAP = __webpack_require__(20);

const World = __webpack_require__(21);

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


/***/ }),
/* 9 */
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
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const { getIntersection } = __webpack_require__(12);

function checkBoxCollision (obj1, obj2) {
    // TODO: change to flag concerning checks outside
    // of viewport. Maybe I want to shoot an off screen enemy
    if (!obj1.in_viewport || !obj2.in_viewport) return;

    // obj1 is the moving object, if its velocity is 0
    // we don't need to check anything
    if (obj1.velY === 0 && obj1.velX === 0) return;

    // TODO: 100px is a gross apromixation of distance where things are guaranteed
    // to not collide at the moment, but it should be less magic
    if (Math.abs(obj1.x - obj2.x) > 100 || Math.abs(obj1.y - obj2.y) > 100) return;

    let obj1_current_bounds = {
        left: obj1.x - obj1.half_width,
        right: obj1.x + obj1.half_width,
        top: obj1.y - obj1.half_height,
        bottom: obj1.y + obj1.half_height,
    }

    let obj1_next_bounds = {
        left: obj1.x + obj1.velX - obj1.half_width,
        right: obj1.x + obj1.velX + obj1.half_width,
        top: obj1.y + obj1.velY - obj1.half_height,
        bottom: obj1.y + obj1.velY + obj1.half_height,
    };

    let obj2_current_bounds = obj2.getBounds();

    // This will tell us how much to offset the moving objects step
    // so that's it not put into the object, but put right next to it
    let modified_vel = {
        x: 0,
        y: 0,
    };

    // Moving Right
    if (obj1.velX > 0 && (obj1_current_bounds.right <= obj2_current_bounds.left && obj1_next_bounds.right > obj2_current_bounds.left)) {
        if (verticalCollision()) {
            modified_vel.x = -Math.abs(obj1_next_bounds.right - obj2_current_bounds.left);
        }
    }

    // Moving Left
    if (obj1.velX < 0 && (obj1_current_bounds.left >= obj2_current_bounds.right && obj1_next_bounds.left < obj2_current_bounds.right)) {
        if (verticalCollision()) {
            modified_vel.x = Math.abs(obj1_next_bounds.left - obj2_current_bounds.right);
        }
    }

    // Moving  Down
    if (obj1.velY > 0 && (obj1_current_bounds.bottom <= obj2_current_bounds.top && obj1_next_bounds.bottom > obj2_current_bounds.top)) {
        if (horizontalCollision()) {
            modified_vel.y = -Math.abs(obj1_next_bounds.bottom - obj2_current_bounds.top);
        }
    }

    // Moving Up
    if (obj1.velY < 0 && (obj1_current_bounds.top >= obj2_current_bounds.bottom && obj1_next_bounds.top < obj2_current_bounds.bottom)) {
        if (horizontalCollision()) {
            modified_vel.y = Math.abs(obj1_next_bounds.top - obj2_current_bounds.bottom);
        }
    }

    function horizontalCollision () {
        if (obj1_next_bounds.left > obj2_current_bounds.left && obj1_next_bounds.left < obj2_current_bounds.right ||
            obj1_next_bounds.right > obj2_current_bounds.left && obj1_next_bounds.right < obj2_current_bounds.right) {
            return true;
        }
        return false;
    }

    function verticalCollision () {
        if (obj1_next_bounds.top > obj2_current_bounds.top && obj1_next_bounds.top < obj2_current_bounds.bottom ||
            obj1_next_bounds.bottom > obj2_current_bounds.top && obj1_next_bounds.bottom < obj2_current_bounds.bottom) {
            return true;
        }
        return false;
    }

    if (!modified_vel.x && !modified_vel.y) return null;
    return modified_vel;
}

function checkProjectileBoxCollision (projectile, obj) {
    obj.collision_points = [];
    const segments = obj.getBoxCollisionSegments();
    for (let i = 0; i < segments.length; ++i) {
        const seg = segments[i];
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
            obj.collision_points.push(info);
        }
    }
    // everything is currently on front
    // obj.layer.update = true;
    return (obj.collision_points.length) ? obj.collision_points : null;
}

module.exports = {
    checkBoxCollision,
    checkProjectileBoxCollision,
};

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

class ImageCache {
    constructor () {
        this.cached_images = {};
        this.image_promises = {};
    }

    load (image_key, image_source) {
        const cached_image = this.cached_images[image_source];

        const image_promise = new Promise((resolve) => {
            if (cached_image) {
                if (cached_image.complete) {
                    resolve({
                        key: image_key,
                        image: cached_image
                    });
                } else {
                    this.image_promises[image_source].push({
                        resolve: resolve,
                        payload: {
                            key: image_key,
                            image: cached_image
                        }
                    });
                }
                return;
            }

            console.log('Image load called for: ' + image_source);

            const img = new Image();
            img.onload = () => {
                this.image_promises[image_source].forEach((image_promise) => {
                    image_promise.resolve(image_promise.payload);
                });
                this.image_promises[image_source] = [];
            };
            img.onerror = () => {
                resolve(null);
            };
            this.cached_images[image_source] = img;
            this.image_promises[image_source] = [{
                resolve: resolve,
                payload: {
                    key: image_key,
                    image: img
                }
            }];

            img.src = image_source;
        });

        return image_promise;
    }
}

module.exports = new ImageCache();

/***/ }),
/* 14 */
/***/ (function(module, exports) {

class CONFIG {
    constructor () {
        this.__props = {

        };
    }
}

module.exports = new CONFIG();


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = {
    one: {
       e: {x: 0, y: 0},
       n: {x: 1, y: 0},
       s: {x: 2, y: 0},
       w: {x: 3, y: 0},
    },
    two: {
        ne_i: {x: 0, y: 1},
        se_i: {x: 1, y: 1},
        sw_i: {x: 2, y: 1},
        nw_i: {x: 3, y: 1},

        ne_f: {x: 0, y: 4},
        se_f: {x: 1, y: 4},
        sw_f: {x: 2, y: 4},
        nw_f: {x: 3, y: 4},

        v: {x: 1, y: 3},
        h: {x: 2, y: 3},
    },
    three: {
        north: {
            i: {x: 0, y: 2},
            nw_i: {x: 0, y: 5},
            ne_i: {x: 0, y: 6},
            f: {x: 0, y: 7},
        },
        east: {
            i: {x: 1, y: 2},
            se_i: {x: 1, y: 5},
            ne_i: {x: 1, y: 6},
            f: {x: 1, y: 7},
        },
        south: {
            i: {x: 2, y: 2},
            se_i: {x: 2, y: 5},
            sw_i: {x: 2, y: 6},
            f: {x: 2, y: 7},
        },
        west: {
            i: {x: 3, y: 2},
            sw_i: {x: 3, y: 5},
            nw_i: {x: 3, y: 6},
            f: {x: 3, y: 7},
        }
    },
    four: {
        f: {x: 2, y: 11},
        i: {x: 3, y: 3},
        ne_i_sw_i: {x: 0, y: 1},
        nw_i_se_i: {x: 1, y: 1},

        sw_i: {x: 0, y: 8},
        nw_i: {x: 1, y: 8},
        ne_i: {x: 2, y: 8},
        se_i: {x: 3, y: 8},

        sw_i_se_i: {x: 0, y: 9},
        nw_i_sw_i: {x: 1, y: 9},
        nw_i_ne_i: {x: 2, y: 9},
        ne_i_se_i: {x: 3, y: 9},

        ne_f: {x: 0, y: 10},
        nw_f: {x: 1, y: 10},
        sw_f: {x: 2, y: 10},
        se_f: {x: 3, y: 10},
    },
    none: {
        f: {x: 0, y: 3},
    }
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {
    width: 50,  // The width of a single cell
    height: 50, // The height of a single cell
    buffer: 1,  // The amount of whitespace around a cell
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/wall/image/wall.png";

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = [
'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W                WW                              WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
'W  @        W          W        WW               WWWWWWW                WWWWWWWW',
'W          WWW        WW        WW                         WWWWWW       WWWWWWWW',
'W  W  W     W      WWWWWWW      WW               WWWWWWWWWWWWWWWWWW   WWWWWWWWWW',
'W                      WW       WW               WWWWWWWWWWWWWWWWW        WWWWWW',
'W     WWWW           W          WW               WWWWWWWWWWWWWWWWWWWWW     WWWWW',
'W                                                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W     WWWWW      W  WWW        WW                WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W         W      W  W W                          WWWWWWWWWWWWWWWWWWWWWWWWW WWWWW',
'W         WWWW   W  WWW                                                        W',
'W         WW     W                                                             W',
'W          W     W                                                             W',
'W          WWWWWWW                                                             W',
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

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = [
'################################################################################',
'#      TTT                                       ###############################',
'#  @    TT  #       TTT        ##                #######                ########',
'#      T T ###    WWWWWWWWW ##                             ######       ########',
'#  #  # T TT#WWWWWW#######W     ##               ##################   ##########',
'#          TT          ##WWWWW  ##               #################        ######',
'#  #  ####           #     WWWWW##               #####################     #####',
'#  #                        WW                   ######################### #####',
'#  #  #####      # T###        ##                ######################### #####',
'#         #      #TT#W#                          ######################### #####',
'#         #### WW# T###                                                        #',
'#         ##WWWWW#        TTTTTTTTTTTTTTTTTTTTT                                #',
'#          #WWWWW#        TTTTTTTTTTTTTTTTTTTTT                                #',
'#          #######        TTTTTTTTTTTTTTTTTTTTT                                #',
'#                         TTTTTTTTTTTTTTTTTTTTT                                #',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
'################################################################################',
];

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = [
    '                                       ',
    '   @   W                               ',
    '      WWW                              ',
    '       W                               ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    '                                       ',
    ];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const Player = __webpack_require__(5);
const Wall = __webpack_require__(6);
const Water = __webpack_require__(22);
const Tree = __webpack_require__(25);
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
    '#': 'WALL',
    'R': 'ROCK',
    '@': 'PLAYER_SPAWN',
    'T': 'TREE',
    'W': 'WATER', // permanent wall is permanent rock
};

class World {
    constructor (world_map) {
        this.cell_size = 48;
        this.half_cell_size = this.cell_size / 2;

        GOM.world_size = {
            width: world_map[0].length * this.cell_size,
            height: world_map.length * this.cell_size,
        };

        this.world = this.parseWorld(world_map);
        this.generateWorld(this.world);
    }

    parseWorld (map) {
        return map.map((map_row) => {
            return map_row.split('');
        });
    }

    generateWorld (world) {
        let wall_count = 0;

        console.log('World Width: ' + world[0].length);
        console.log('World Height: ' + world.length);

        world.forEach((row, y) => {
            row.forEach((tile, x) => {
                const type = WORLD_MAP_LEGEND[tile];
                const objectParams = {
                    spawn: {
                        x: (x * this.cell_size) + this.half_cell_size,
                        y: (y * this.cell_size) + this.half_cell_size,
                    },
                    neighbors: {
                        north: WORLD_MAP_LEGEND[(world[y - 1] || [])[x] || null] || null,
                        south: WORLD_MAP_LEGEND[(world[y + 1] || [])[x] || null] || null,
                        east: WORLD_MAP_LEGEND[(world[y] || [])[x + 1] || null] || null,
                        west: WORLD_MAP_LEGEND[(world[y] || [])[x - 1] || null] || null,
                        north_east: WORLD_MAP_LEGEND[(world[y - 1] || [])[x + 1] || null] || null,
                        north_west: WORLD_MAP_LEGEND[(world[y - 1] || [])[x - 1] || null] || null,
                        south_east: WORLD_MAP_LEGEND[(world[y + 1] || [])[x + 1] || null] || null,
                        south_west: WORLD_MAP_LEGEND[(world[y + 1] || [])[x - 1] || null] || null,
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
                    case 'WATER':
                        objectParams.permanent = true;
                        this.createWater(objectParams);
                        break;
                    case 'TREE':
                        this.createTree(objectParams);
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
        });
    }

    createWall (params = {}) {
        new Wall({
            ...params,
            layer: GOM.front,
            z: 1,
        });
    }

    createWater (params = {}) {
        new Water({
            ...params,
            layer: GOM.front,
            z: 1,
        });
    }

    createTree (params = {}) {
        new Tree({
            ...params,
            layer: GOM.front,
            z: 2,
        });
    }
}

module.exports = World;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const { getSpritePosition } = __webpack_require__(7);

const SPRITE_DATA = __webpack_require__(23)
const SPRITE = __webpack_require__(24);

class Water extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'water';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';

        this.determineImage(opts.neighbors);

        this.loadImages({
            main: SPRITE,
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        this.width = 48;
        this.height = 48;
        this.configured = true;
    }

    determineImage (neighbors = {}) {
        let wall_neighbors = {};
        let openings = 0;
        Object.keys(neighbors).forEach((nd) => { // nd -> neighbor direction
            let wall = neighbors[nd] === 'WATER' || false;
            wall_neighbors[nd] = wall;
            // only count cardinal openings
            if (!nd.match(/_/) && wall) openings += 1;
        });

        this.sprite_index = getSpritePosition(wall_neighbors, openings);
    }

	draw () {
        if (!this.in_viewport || !this.configured || !this.sprite_index || !this.images.main) return;

        const cell_size = 48;
		this.context.save();
			this.context.drawImage(
                this.images.main,
                this.sprite_index.x * SPRITE_DATA.width + SPRITE_DATA.buffer,
                this.sprite_index.y * SPRITE_DATA.height + SPRITE_DATA.buffer,
                SPRITE_DATA.width - (SPRITE_DATA.buffer * 2),
                SPRITE_DATA.height - (SPRITE_DATA.buffer * 2),
				this.cornerPosition.x,
                this.cornerPosition.y,
                cell_size,
                cell_size
			);
		this.context.restore();
        this.drawCollisionPoints();
	}
}

module.exports = Water;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {
    width: 50,  // The width of a single cell
    height: 50, // The height of a single cell
    buffer: 1,  // The amount of whitespace around a cell
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/Water/image/water.png";

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const GOM = __webpack_require__(0);
const GIM = __webpack_require__(1);
const GOB = __webpack_require__(2);

const { getRandomInt } = __webpack_require__(3);

const TREE_TRUNK_IMAGE = __webpack_require__(26);
const TREE_TOP_IMAGES = [
    __webpack_require__(27),
    __webpack_require__(28),
    __webpack_require__(29),
];

class Tree extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'tree';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';

        this.loadImages({
            main: TREE_TRUNK_IMAGE,
            top: TREE_TOP_IMAGES[getRandomInt(0,2)],
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        this.width = this.images.main.naturalWidth;
        this.height = this.images.main.naturalHeight;

        this.top_half_width = this.images.top.naturalWidth / 2;
        this.top_half_height = this.images.top.naturalHeight / 2;

        // Should be spawn size
        const cell_size = 48;

        let left = (this.x - (cell_size / 2)) + this.half_width;
        left += getRandomInt(0, cell_size - this.width);
        this.x = left;

        let top = (this.y - (cell_size / 2)) + this.half_height;
        top += getRandomInt(0, cell_size - this.height);
        this.y = top;

        this.configured = true;
    }

	draw () {
        if (!this.in_viewport || !this.configured || !this.images.main) return;
        this.drawImage();
		this.context.save();
            this.context.globalAlpha = 0.5;
            this.context.drawImage(
                this.images.top,
                this.x - this.top_half_width - GOM.camera_offset.x,
                this.y - this.top_half_height - GOM.camera_offset.y
            );
        this.context.restore();
        this.drawCollisionPoints();
	}
}

module.exports = Tree;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/tree/tree_trunk.png";

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/tree/tree_1.png";

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/tree/tree_2.png";

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/js/game/objects/terrain/tree/tree_3.png";

/***/ })
/******/ ]);