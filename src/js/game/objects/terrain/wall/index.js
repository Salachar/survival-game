const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const { degreesToRadians } = require('lib/math');
const { getSpritePosition } = require('lib/full_iso_sprite');

const WALL_IMAGES = {
    none: require('./wall_open_none.png'),
    one: require('./wall_open_one.png'),
    two: require('./wall_open_two.png'),
    two_straight: require('./wall_open_two_straight.png'),
    three: require('./wall_open_three.png'),
    four: require('./wall_open_four.png'),
}

const WALL_SPRITE_SHEET = require('./wall_tile_set_2.png');

class Wall extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'wall';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';

        // this.image_data = this.determineImage(opts.neighbors);
        // this.image_data.rotation = degreesToRadians(this.image_data.rotation);

        this.determineImage(opts.neighbors);

        this.loadImages({
            main: WALL_SPRITE_SHEET,
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        // this.width = this.images.main.naturalWidth;
        // this.height = this.images.main.naturalHeight;
        this.width = 50;
        this.height = 50;
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
        if (!this.in_viewport || !this.configured || !this.sprite_index) return;
        // this.drawImage();
        const cell_size = 50;

		this.context.save();

			this.context.drawImage(
                this.images.main,
                this.sprite_index.x * cell_size,
                this.sprite_index.y * cell_size,
                cell_size,
                cell_size,
				this.cornerPosition.x,
                this.cornerPosition.y,
                cell_size,
                cell_size
			);
		this.context.restore();
        // this.drawCollisionPoints();
	}
}

module.exports = Wall;
