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
