const GOM = require('core/game-object-manager');

const {
    checkBoxCollision,
    checkProjectileBoxCollision
} = require('lib/collision');

const ImageCache = require('lib/image-cache');
const Helpers = require('lib/helpers');
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
		this.projectile_collision = true;

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
			if (obj.type === 'projectile' && this.projectile_collision) {
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
