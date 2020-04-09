const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const { getSpritePosition } = require('lib/sprite');

const SPRITE_DATA = require('./image/info')
const SPRITE = require('./image/wall.png');

class Wall extends GOB {
	constructor (opts = {}) {
        super(opts);

        this.type = 'wall';
        this.configured = false;
        this.collidable = true;
        this.collision_type = 'box';

        this.determineImage(opts.neighbors);

        this.loadImages({
            main: SPRITE,
        }).then((images) => {
            this.configureObject();
        });

		return this;
    }

    configureObject () {
        this.width = 48;
        this.height = 48;
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
        if (!this.in_viewport || !this.configured || !this.sprite_index || !this.images.main) return;

        const cell_size = 48;
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
        // this.drawCollisionPoints();
	}
}

module.exports = Wall;
