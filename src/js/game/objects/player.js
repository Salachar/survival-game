const GOM = require('../../core/game-object-manager');
const GIM = require('../../core/game-input-manager');
const GOB = require('../../core/game-object-base');
const CONFIG = require('../game-config');

const Projectile = require('./projectile');

class Player extends GOB {
	constructor (opts = {}) {
		super(opts);

        this.type = "player";

        this.velX = 0;
        this.velY = 0;

        this.speed = 3;
        this.speed_diagonal = this.speed * 0.715;

		this.width = 20;
        this.height = 20;

        // We'll want the center of the player and don't want to
        // calculate this all the time
        this.half_width = this.width / 2;
        this.half_height = this.height / 2;

		return this;
    }

    checkPlayerMovement () {
        if (GIM.isKeyDown('W')) {
            this.velY = -this.speed;
            if (GIM.isKeyDown('A')) {
                this.velX = -this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('D')) {
                this.velX = this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('S')) {
            this.velY = this.speed;
            if (GIM.isKeyDown('A')) {
                this.velX = -this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
            if (GIM.isKeyDown('D')) {
                this.velX = this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('A')) {
            this.velX = -this.speed;
            if (GIM.isKeyDown('W')) {
                this.velX = -this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('S')) {
                this.velX = -this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (GIM.isKeyDown('D')) {
            this.velX = this.speed;
            if (GIM.isKeyDown('W')) {
                this.velX = this.speed_diagonal;
                this.velY = -this.speed_diagonal;
            }
            if (GIM.isKeyDown('S')) {
                this.velX = this.speed_diagonal;
                this.velY = this.speed_diagonal;
            }
        }

        if (!GIM.isKeyDown('W S')) {
            this.velY = 0;
        }
        if (!GIM.isKeyDown('A D')) {
            this.velX = 0;
        }
    }

	update () {
        this.x += this.velX;
		this.y += this.velY;
    }

    keyDown (key) {
        this.checkPlayerMovement();
    }

    keyUp (key) {
        // if (key === 'UP' ||  key === 'W') {
        //     this.velY = 0;
        // }
        // if (key === 'DOWN' ||  key === 'S') {
        //     this.velY = 0;
        // }
        // if (key === 'LEFT' ||  key === 'A') {
        //     this.velX = 0;
        // }
        // if (key === 'RIGHT' ||  key === 'D') {
        //     this.velX = 0;
        // }
        this.checkPlayerMovement();
    }

    keyPress () {
        // console.log('press');
    }

    mClick (mouse) {
        new Projectile({
            layer: GOM.front,
            x: this.x,
            y: this.y,
            aim_x: mouse.x,
            aim_y: mouse.y,
        });
    }

	draw () {
		this.context.save();
			this.context.beginPath();
			this.context.rect(this.x - this.half_width, this.y - this.half_height, this.width, this.height);
			this.context.fillStyle = '#FFFFFF';
			this.context.fill();
		this.context.restore();
	}
}

module.exports = Player;
