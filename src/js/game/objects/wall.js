const GOM = require('../../core/game-object-manager');
const GIM = require('../../core/game-input-manager');
const GOB = require('../../core/game-object-base');

const { getIntersection } = require('../../lib/math');

class Wall extends GOB {
	constructor (opts = {}) {
		super(opts);

        this.type = "wall";
        this.collidable = true;

		this.width = opts.width;
        this.height = opts.height;

        this.collision_points = [];

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

        this.segments = this.generateSegments();

		return this;
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
        if (obj.type === 'projectile') {
            return this.checkProjectileCollision(obj);
        }
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
        return this.collision_points;
    }

	update () {

    }

	draw () {
		this.context.save();
			this.context.beginPath();
			this.context.rect(this.x, this.y, this.width, this.height);
			this.context.fillStyle = '#FFFFFF';
			this.context.fill();
            for (var i = 0; i < this.collision_points.length; ++i) {
                const p = this.collision_points[i];
                this.context.beginPath();
                this.context.rect(p.x - 5, p.y - 5, 10, 10);
                this.context.fillStyle = '#FF0000';
                this.context.fill();
            }
        this.context.restore();
	}
}

module.exports = Wall;
