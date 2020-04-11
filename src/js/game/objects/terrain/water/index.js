const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

// const { getSpritePosition } = require('lib/sprite');
const { getSpritePosition } = require('lib/simple_sprite');

const SPRITE_DATA = require('./image/info')
// const SPRITE = require('./image/water_tiles.png');
const SPRITE = require('./image/new_water_sprite.png');

class Water extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'water';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';
        this.projectile_collision = false;

        this.determineImage(opts.neighbors);

        this.loadImages({
            main: SPRITE,
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        this.width = 64;
        this.height = 64;
        this.configured = true;
    }

    determineImage (neighbors = {}) {
        let wall_neighbors = {};
        let openings = 0;
        Object.keys(neighbors).forEach((nd) => { // nd -> neighbor direction
            let wall = neighbors[nd] === 'WATER' || false;
            wall_neighbors[nd] = wall;
            // only count cardinal openings
            if (!nd.match(/_/) && wall) openings += 1;
        });

        this.sprite_index = getSpritePosition(wall_neighbors, openings);
    }

	draw () {
        if (!this.in_viewport || !this.configured || !this.sprite_index || !this.images.main) return;

        const cell_size = 64;
		this.context.save();
			this.context.drawImage(
                this.images.main,
                this.sprite_index.x * SPRITE_DATA.width + SPRITE_DATA.buffer,
                this.sprite_index.y * SPRITE_DATA.height + SPRITE_DATA.buffer,
                SPRITE_DATA.width - (SPRITE_DATA.buffer * 2),
                SPRITE_DATA.height - (SPRITE_DATA.buffer * 2),
				this.cornerPosition.x,
                this.cornerPosition.y,
                cell_size,
                cell_size
			);
		this.context.restore();
        this.drawCollisionPoints();
	}
}

module.exports = Water;
