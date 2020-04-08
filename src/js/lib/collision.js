const { getIntersection } = require('lib/math');

function checkBoxCollision (obj1, obj2) {
    // TODO: change to flag concerning checks outside
    // of viewport. Maybe I want to shoot an off screen enemy
    if (!obj1.in_viewport || !obj2.in_viewport) return;

    // obj1 is the moving object, if its velocity is 0
    // we don't need to check anything
    if (obj1.velY === 0 && obj1.velX === 0) return;

    // TODO: 100px is a gross apromixation of distance where things are guaranteed
    // to not collide at the moment, but it should be less magic
    if (Math.abs(obj1.x - obj2.x) > 100 || Math.abs(obj1.y - obj2.y) > 100) return;

    let obj1_current_bounds = {
        left: obj1.x - obj1.half_width,
        right: obj1.x + obj1.half_width,
        top: obj1.y - obj1.half_height,
        bottom: obj1.y + obj1.half_height,
    }

    let obj1_next_bounds = {
        left: obj1.x + obj1.velX - obj1.half_width,
        right: obj1.x + obj1.velX + obj1.half_width,
        top: obj1.y + obj1.velY - obj1.half_height,
        bottom: obj1.y + obj1.velY + obj1.half_height,
    };

    let obj2_current_bounds = obj2.getBounds();

    // This will tell us how much to offset the moving objects step
    // so that's it not put into the object, but put right next to it
    let modified_vel = {
        x: 0,
        y: 0,
    };

    // Moving Right
    if (obj1.velX > 0 && (obj1_current_bounds.right <= obj2_current_bounds.left && obj1_next_bounds.right > obj2_current_bounds.left)) {
        if (verticalCollision()) {
            modified_vel.x = -Math.abs(obj1_next_bounds.right - obj2_current_bounds.left);
        }
    }

    // Moving Left
    if (obj1.velX < 0 && (obj1_current_bounds.left >= obj2_current_bounds.right && obj1_next_bounds.left < obj2_current_bounds.right)) {
        if (verticalCollision()) {
            modified_vel.x = Math.abs(obj1_next_bounds.left - obj2_current_bounds.right);
        }
    }

    // Moving  Down
    if (obj1.velY > 0 && (obj1_current_bounds.bottom <= obj2_current_bounds.top && obj1_next_bounds.bottom > obj2_current_bounds.top)) {
        if (horizontalCollision()) {
            modified_vel.y = -Math.abs(obj1_next_bounds.bottom - obj2_current_bounds.top);
        }
    }

    // Moving Up
    if (obj1.velY < 0 && (obj1_current_bounds.top >= obj2_current_bounds.bottom && obj1_next_bounds.top < obj2_current_bounds.bottom)) {
        if (horizontalCollision()) {
            modified_vel.y = Math.abs(obj1_next_bounds.top - obj2_current_bounds.bottom);
        }
    }

    function horizontalCollision () {
        if (obj1_next_bounds.left > obj2_current_bounds.left && obj1_next_bounds.left < obj2_current_bounds.right ||
            obj1_next_bounds.right > obj2_current_bounds.left && obj1_next_bounds.right < obj2_current_bounds.right) {
            return true;
        }
        return false;
    }

    function verticalCollision () {
        if (obj1_next_bounds.top > obj2_current_bounds.top && obj1_next_bounds.top < obj2_current_bounds.bottom ||
            obj1_next_bounds.bottom > obj2_current_bounds.top && obj1_next_bounds.bottom < obj2_current_bounds.bottom) {
            return true;
        }
        return false;
    }

    if (!modified_vel.x && !modified_vel.y) return null;
    return modified_vel;
}

function checkProjectileBoxCollision (projectile, obj) {
    obj.collision_points = [];
    const segments = obj.getBoxCollisionSegments();
    for (let i = 0; i < segments.length; ++i) {
        const seg = segments[i];
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
            obj.collision_points.push(info);
        }
    }
    // everything is currently on front
    // obj.layer.update = true;
    return (obj.collision_points.length) ? obj.collision_points : null;
}

module.exports = {
    checkBoxCollision,
    checkProjectileBoxCollision,
};