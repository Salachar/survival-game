const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');

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
		this.collisions = GOM.checkCollisions(this);
		this.resolved = true;
		setTimeout(() => {
			this.shutdown();
		}, 100);
	}

	draw () {
		this.context.save();
			this.context.beginPath();
			this.context.lineWidth = 1;
			this.context.moveTo(this.x, this.y);
			this.context.lineTo(this.aim_point.x, this.aim_point.y);
			this.context.strokeStyle = "#FFFFFF";
			this.context.stroke();
		this.context.restore();
	}
}

module.exports = Projectile;
