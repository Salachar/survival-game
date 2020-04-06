const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const { getIntersection, degreesToRadians } = require('lib/math');

const WALL_IMAGES = {
    none: require('./wall_open_none.png'),
    one: require('./wall_open_one.png'),
    two: require('./wall_open_two.png'),
    two_straight: require('./wall_open_two_straight.png'),
    three: require('./wall_open_three.png'),
    four: require('./wall_open_four.png'),
}

class Wall extends GOB {
	constructor (opts = {}) {
        super(opts);

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
