const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const { getRandomInt } = require('lib/helpers');

const TREE_TRUNK_IMAGE = require('./tree_trunk.png');
const TREE_TOP_IMAGES = [
    require('./tree_1.png'),
    require('./tree_2.png'),
    require('./tree_3.png'),
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
