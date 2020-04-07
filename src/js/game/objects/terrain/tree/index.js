const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const { getRandomInt } = require('lib/helpers');

// const TREE_IMAGE = require('./tree.png');
const TREE_TRUNK_IMAGE = require('./treetrunk.png');
const TREE_TOP_IMAGE = require('./treetop.png');

class Tree extends GOB {
	constructor (opts = {}) {
        console.log('SPAWN TREE');
        super(opts);

        this.type = "tree";
        this.collidable = true;

		this.width = opts.width;
        this.height = opts.height;

        this.img_trunk_info = null;
        this.img_trunk = new Image();
        this.img_trunk.onload = () => {
            this.img_trunk_info = {
                width: this.img_trunk.naturalWidth,
                height: this.img_trunk.naturalHeight,
            }
            this.configureTile();
        };
        this.img_trunk.src = TREE_TRUNK_IMAGE;

        this.img_top_info = null;
        this.img_top = new Image();
        this.img_top.onload = () => {
            this.img_top_info = {
                width: this.img_top.naturalWidth,
                height: this.img_top.naturalHeight,
            }
            this.configureTile();
        };
        this.img_top.src = TREE_TOP_IMAGE;

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

        this.configured = false;

		return this;
    }

    configureTile () {
        console.log(this.img_trunk_info);
        console.log(this.img_top_info);

        if (!this.img_trunk_info || !this.img_top_info) return;

        this.img_trunk_info.half_width = this.img_trunk_info.width / 2;
        this.img_trunk_info.half_height = this.img_trunk_info.height / 2;

        this.img_top_info.half_width = this.img_top_info.width / 2;
        this.img_top_info.half_height = this.img_top_info.height / 2;

        const random_area_size = this.width - this.img_trunk_info.width;
        // random are size is 30
        const x_mod = getRandomInt(1, random_area_size);
        const y_mod = getRandomInt(1, random_area_size);

        // I want the pos between 10 and 40
        const x_pos = this.img_trunk_info.half_width + x_mod;
        const y_pos = this.img_trunk_info.half_height + y_mod;

        this.img_trunk_info.x = x_pos;
        this.img_trunk_info.y = y_pos;

        this.img_top_info.x = x_pos;
        this.img_top_info.y = y_pos;

        this.configured = true;
    }

    checkCollision (obj) {
        if (!obj) return null;
        if (obj.type === 'player') {
            return this.checkPlayerCollision(obj);
        }
    }

    checkPlayerCollision (obj) {
        if (!this.in_viewport) return;
        if (obj.velY === 0 && obj.velX === 0) return;

        if (Math.abs(obj.x - this.x) > 100 || Math.abs(obj.y - this.y) > 100) return;

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
            left: this.x + this.img_trunk_info.x - this.img_trunk_info.half_width,
            right: this.x + this.img_trunk_info.x + this.img_trunk_info.half_width,
            top: this.y + this.img_trunk_info.y - this.img_trunk_info.half_height,
            bottom: this.y + this.img_trunk_info.y + this.img_trunk_info.half_height,
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
            if (next_obj_bounds.left === bounds.left && next_obj_bounds.right === bounds.right) {
                return true;
            }
            if (next_obj_bounds.left > bounds.left && next_obj_bounds.left < bounds.right ||
                next_obj_bounds.right > bounds.left && next_obj_bounds.right < bounds.right) {
                return true;
            }
            return false;
        }

        function verticalCollision () {
            if (next_obj_bounds.top === bounds.top && next_obj_bounds.bottom === bounds.bottom) {
                return true;
            }
            if (next_obj_bounds.top > bounds.top && next_obj_bounds.top < bounds.bottom ||
                next_obj_bounds.bottom > bounds.top && next_obj_bounds.bottom < bounds.bottom) {
                return true;
            }
            return false;
        }

        if (!modified_vel.x && !modified_vel.y) return null;
        return modified_vel;
    }

	update () {

    }

	draw () {
        if (!this.in_viewport || !this.configured) return;
		this.context.save();
            // this.context.drawImage(
            //     this.img_trunk,
            //     this.x - GOM.camera_offset.x,
            //     this.y - GOM.camera_offset.y
            // );

            this.context.drawImage(
                this.img_trunk,
                this.x + (this.img_trunk_info.x - this.img_trunk_info.half_width) - GOM.camera_offset.x,
                this.y + (this.img_trunk_info.y - this.img_trunk_info.half_height) - GOM.camera_offset.y
            );


            this.context.globalAlpha = 0.5;
            this.context.drawImage(
                this.img_top,
                this.x + (this.img_top_info.x - this.img_top_info.half_width) - GOM.camera_offset.x,
                this.y + (this.img_top_info.y - this.img_top_info.half_height) - GOM.camera_offset.y
            );


        this.context.restore();
	}
}

module.exports = Tree;
