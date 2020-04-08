const GOM = require('core/game-object-manager');
const GIM = require('core/game-input-manager');
const GOB = require('core/game-object-base');

const Projectile = require('./projectile');

class Player extends GOB {
	constructor (opts = {}) {
		super(opts);

        this.type = "player";

        this.velX = 0;
        this.velY = 0;

        this.speed = 6;
        this.speed_diagonal = Math.ceil(this.speed * 0.715);

		this.width = 20;
        this.height = 20;

        this.shooting_timer = null;

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
        if (this.velX === 0 && this.velY == 0) return;
        let velocity_mods = {
            x: 0,
            y: 0
        };
        let hold_object = null;
		GOM.checkCollisions({
			obj: this,
			onCollision: (collision_info, collision_obj) => {
                // console.log(collision_info, collision_obj);
                if (collision_info.x && collision_info.y) {
                    hold_object = collision_info;
                    return;
                }
                if (collision_info.x && Math.abs(collision_info.x) > Math.abs(velocity_mods.x)) {
                    velocity_mods.x = collision_info.x;
                }
                if (collision_info.y && Math.abs(collision_info.y) > Math.abs(velocity_mods.y)) {
                    velocity_mods.y = collision_info.y;
                }
			}
        });

        if (hold_object && !velocity_mods.x && !velocity_mods.y) {
            velocity_mods.x = hold_object.x;
            velocity_mods.y = hold_object.y;
        }

        this.x = Math.round(this.x + this.velX + velocity_mods.x);
		this.y = Math.round(this.y + this.velY + velocity_mods.y);
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

    mDown (mouse) {
        this.fireWeapon();
        this.shooting_timer = setInterval(() => {
            this.fireWeapon();
        }, 100);
    }

    mUp (mouse) {
        clearInterval(this.shooting_timer);
        this.shooting_timer = null;
    }

    fireWeapon (mouse) {
        new Projectile({
            layer: GOM.front,
            x: this.x,
            y: this.y,
            aim_x: GIM.mouse.x + GOM.camera_offset.x,
            aim_y: GIM.mouse.y + GOM.camera_offset.y,
        });
    }

	draw (opts = {}) {
		this.context.save();
            this.context.beginPath();
			this.context.rect(
                this.x - GOM.camera_offset.x - this.half_width,
                this.y - GOM.camera_offset.y - this.half_height,
                this.width,
                this.height
            );
			this.context.fillStyle = '#0000FF';
			this.context.fill();
		this.context.restore();
	}
}

module.exports = Player;
