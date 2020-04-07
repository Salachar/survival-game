const GOM = require('./game-object-manager');

const Helpers = require('../lib/helpers');
const uuid = Helpers.uuid;

class GOB {
	constructor (opts = {}) {
		this.id = uuid();

		this.camera_follow = opts.camera_follow || false;

		this.x = opts.x || 0;
		this.y = opts.y || 0;

		this.collidable = false;

		this.in_viewport = true;

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
