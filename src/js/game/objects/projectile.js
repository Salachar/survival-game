const GOM = require('../../core/game-object-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const { getDistance, getRandomInt, rgba, sqr } = require('../../lib/helpers');

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
